// test/hypercore.test-d.ts
import { expectType, expectError } from "tsd";
import Hypercore, {
  type HypercoreOptions,
  type Info,
  type InfoOptions,
  type ClearReturn,
} from "hypercore";

// ---------------------------------------------------------------------------
// Constructor
// ---------------------------------------------------------------------------

expectType<Hypercore<any>>(new Hypercore("./storage"));

const opts: HypercoreOptions<{ n: number }> = {
  valueEncoding: "json",
};
expectType<Hypercore<{ n: number }>>(new Hypercore("./storage", null, opts));

// ---------------------------------------------------------------------------
// ready()
// ---------------------------------------------------------------------------

const core: Hypercore<{ n: number }> = new Hypercore("./storage");

expectType<Promise<void>>(core.ready());

// ---------------------------------------------------------------------------
// append()
// ---------------------------------------------------------------------------

expectType<Promise<{ length: number; byteLength: number }>>(
  core.append({ n: 1 })
);
expectType<Promise<{ length: number; byteLength: number }>>(
  core.append([{ n: 1 }, { n: 2 }])
);

expectError(core.append(123));
expectError(core.append({ n: "nope" }));

// ---------------------------------------------------------------------------
// get()
// ---------------------------------------------------------------------------

expectType<Promise<{ n: number }>>(core.get(0));
expectType<Promise<string>>(core.get(0, { valueEncoding: "utf-8" }));
expectError(core.get<number>(0, { valueEncoding: "utf-8" }));
expectType<Promise<Buffer>>(core.get(0, { valueEncoding: "binary" }));
expectType<Promise<{ n: number }>>(core.get(0, { valueEncoding: "json" }));

// ---------------------------------------------------------------------------
// has()
// ---------------------------------------------------------------------------

expectType<Promise<boolean>>(core.has(0));
expectType<Promise<boolean>>(core.has(0, 10));

// ---------------------------------------------------------------------------
// update()
// ---------------------------------------------------------------------------

expectType<Promise<boolean>>(core.update());
expectType<Promise<boolean>>(core.update({ wait: true }));

// ---------------------------------------------------------------------------
// seek()
// ---------------------------------------------------------------------------

expectType<Promise<[number, number]>>(core.seek(100));

// ---------------------------------------------------------------------------
// streams
// ---------------------------------------------------------------------------

expectType<AsyncIterable<any>>(core.createReadStream());
expectType<AsyncIterable<Uint8Array>>(core.createByteStream());

// ---------------------------------------------------------------------------
// clear()
// ---------------------------------------------------------------------------

expectType<Promise<ClearReturn>>(core.clear(0, 10));
expectType<Promise<ClearReturn>>(core.clear(0, 10, { diff: true }));

// ---------------------------------------------------------------------------
// truncate()
// ---------------------------------------------------------------------------

expectType<Promise<void>>(core.truncate(5));
expectType<Promise<void>>(core.truncate(5, 123));

// ---------------------------------------------------------------------------
// treeHash()
// ---------------------------------------------------------------------------

expectType<Promise<Buffer>>(core.treeHash());
expectType<Promise<Buffer>>(core.treeHash(10));

// ---------------------------------------------------------------------------
// download()
// ---------------------------------------------------------------------------

const range = core.download({ start: 0, end: 10 });
expectType<Promise<void>>(range.done());
range.destroy();

// ---------------------------------------------------------------------------
// session / snapshot / commit
// ---------------------------------------------------------------------------

const session = core.session();
expectType<Hypercore<{ n: number }>>(session);
expectType<Hypercore<{ n: number }>>(core.snapshot());
expectType<Promise<{ length: number; byteLength: number } | null>>(
  core.commit(session)
);

// ---------------------------------------------------------------------------
// info()
// ---------------------------------------------------------------------------

expectType<Promise<Info>>(core.info());
expectType<Promise<Info>>(core.info({ storage: true } as InfoOptions));

// ---------------------------------------------------------------------------
// user data
// ---------------------------------------------------------------------------

expectType<Promise<void>>(core.setUserData("author", "me"));
expectType<string | Buffer | undefined>(core.getUserData("author"));

// ---------------------------------------------------------------------------
// close()
// ---------------------------------------------------------------------------

expectType<Promise<void>>(core.close());
