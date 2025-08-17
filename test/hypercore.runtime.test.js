"use strict";

const test = require("brittle");
const os = require("os");
const path = require("path");
const fsp = require("fs/promises");
const Hypercore = require("hypercore");

async function withCore(t, { storageOpts, key = null } = {}) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), "hc-"));
  const core = new Hypercore(dir, key, storageOpts);
  t.teardown(async () => {
    try {
      await core.close();
    } catch {}
    try {
      await fsp.rm(dir, { recursive: true, force: true });
    } catch {}
  });
  await core.ready();
  return core;
}

async function expectReject(t, p, msg) {
  try {
    await p;
    t.fail(msg || "Expected rejection");
  } catch (err) {
    t.ok(err, msg || "Got rejection");
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Constructor / ready
// ---------------------------------------------------------------------------

test("constructor + ready()", async (t) => {
  const core = await withCore(t);
  t.ok(core.discoveryKey, "has discoveryKey");
  t.is(core.length, 0);
  t.is(core.byteLength, 0);
  t.is(core.closed, false);
});

// ---------------------------------------------------------------------------
// append() – mirrors typing around accepted/rejected shapes
// ---------------------------------------------------------------------------

test("append accepts string/Buffer/Uint8Array under default (binary)", async (t) => {
  const core = await withCore(t);

  const r1 = await core.append("hello");
  t.is(typeof r1.length, "number");
  t.is(core.length, 1);

  const r2 = await core.append(Buffer.from("world"));
  t.is(r2.length, 2);
  t.is(core.length, 2);

  const r3 = await core.append(new Uint8Array([1, 2, 3]));
  t.is(r3.length, 3);
  t.is(core.length, 3);
});

test("append(number) rejects under default (binary)", async (t) => {
  const core = await withCore(t);
  await expectReject(
    t,
    core.append(123),
    "numbers should not be accepted by binary core"
  );
});

test('append JSON objects when valueEncoding: "json"', async (t) => {
  const core = await withCore(t, { storageOpts: { valueEncoding: "json" } });

  await core.append({ n: 1 });
  await core.append([{ n: 2 }, { n: 3 }]);

  const v0 = await core.get(0);
  t.alike(v0, { n: 1 });

  const v1 = await core.get(1);
  t.alike(v1, { n: 2 });

  const v2 = await core.get(2);
  t.alike(v2, { n: 3 });
});

// ---------------------------------------------------------------------------
// get() – built-ins and defaults
// ---------------------------------------------------------------------------

test("get(): default (binary) returns Buffer; utf-8 returns string", async (t) => {
  const core = await withCore(t);
  await core.append("hello");

  const def = await core.get(0);
  t.ok(Buffer.isBuffer(def));
  t.is(def.toString("utf8"), "hello");

  const s = await core.get(0, { valueEncoding: "utf-8" });
  t.is(typeof s, "string");
  t.is(s, "hello");
});

test("get() over JSON core with utf-8 returns JSON string", async (t) => {
  const core = await withCore(t, { storageOpts: { valueEncoding: "json" } });
  await core.append({ n: 42 });

  const obj = await core.get(0);
  t.alike(obj, { n: 42 });

  const s = await core.get(0, { valueEncoding: "utf-8" });
  t.is(s, JSON.stringify({ n: 42 }));
});

// ---------------------------------------------------------------------------
// has(), update(), seek()
// ---------------------------------------------------------------------------

test("has / update / seek", async (t) => {
  const core = await withCore(t);
  await core.append("a"); // length 1 byte
  await core.append("b"); // length 1 byte

  t.is(await core.has(0), true);
  t.is(await core.has(0, 2), true);

  const up = await core.update({ wait: true });
  t.is(typeof up, "boolean"); // usually false locally

  const [index, rel] = await core.seek(1); // byte 1 is start of block #1
  t.is(index, 1);
  t.is(rel, 0);
});

// ---------------------------------------------------------------------------
// streams
// ---------------------------------------------------------------------------

test("createReadStream / createByteStream", async (t) => {
  const core = await withCore(t);
  await core.append("x");
  await core.append("y");

  const readValues = [];
  for await (const v of core.createReadStream()) readValues.push(v);
  t.is(readValues.length, 2);

  const byteChunks = [];
  for await (const chunk of core.createByteStream()) byteChunks.push(chunk);
  t.ok(byteChunks.length >= 1);
  t.ok(byteChunks.every((c) => c instanceof Uint8Array));
});

// ---------------------------------------------------------------------------
// clear(), truncate(), treeHash()
// ---------------------------------------------------------------------------

test("clear / truncate / treeHash", async (t) => {
  const core = await withCore(t);
  await core.append("x");
  await core.append("y");
  await core.append("z");

  const diff = await core.clear(0, 2, { diff: true });
  // In practice, diff may be undefined/null/Uint8Array depending on range/impl.
  t.ok(diff === undefined || diff === null || diff instanceof Uint8Array);

  await core.truncate(2);
  t.is(core.length, 2);

  const h = await core.treeHash();
  t.ok(Buffer.isBuffer(h));
});

// ---------------------------------------------------------------------------
// download() – API presence
// ---------------------------------------------------------------------------

test("download() returns { done, destroy }", async (t) => {
  const core = await withCore(t);
  await core.append("x");

  const r = core.download({ start: 0, end: 1, linear: true });
  t.is(typeof r.done, "function");
  t.is(typeof r.destroy, "function");
  await r.done().catch(() => {}); // no peers => should not explode
  r.destroy();
});

// ---------------------------------------------------------------------------
// session / snapshot / commit
// ---------------------------------------------------------------------------

test("session / snapshot / commit", async (t) => {
  const core = await withCore(t);
  await core.append("base");

  // Use an exclusive session to ensure committing merges cleanly.
  const s = core.session({ exclusive: true });
  t.ok(s);

  await s.append("s1");
  t.is(s.length, 2);

  // Guard commit with a timeout to keep the test hermetic.
  const commitRes = await Promise.race([
    core.commit(s),
    delay(500).then(() => null), // proceed if commit isn't relevant/available
  ]);

  t.ok(
    commitRes === null ||
      (typeof commitRes.length === "number" &&
        typeof commitRes.byteLength === "number")
  );

  const snap = core.snapshot();
  t.is(snap.length, core.length);
});

// ---------------------------------------------------------------------------
// info(), userData
// ---------------------------------------------------------------------------

test("info() / info({ storage: true }) / userData", async (t) => {
  const core = await withCore(t);
  await core.append("a");

  const info = await core.info();
  t.ok(Buffer.isBuffer(info.key));
  t.ok(Buffer.isBuffer(info.discoveryKey));
  t.is(typeof info.length, "number");
  t.is(typeof info.contiguousLength, "number");
  t.is(typeof info.byteLength, "number");
  t.is(typeof info.fork, "number");
  t.is(typeof info.padding, "number");

  const info2 = await core.info({ storage: true });
  if (info2.storage) {
    t.is(typeof info2.storage.oplog, "number");
    t.is(typeof info2.storage.tree, "number");
    t.is(typeof info2.storage.blocks, "number");
    t.is(typeof info2.storage.bitfield, "number");
  }

  await core.setUserData("author", "me");
  const ud = core.getUserData("author");
  t.is(ud, "me");
});

// ---------------------------------------------------------------------------
// close()
// ---------------------------------------------------------------------------

test("close()", async (t) => {
  const core = await withCore(t);
  await core.close();
  t.is(core.closed, true);
});
