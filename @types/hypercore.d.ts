/// <reference types="node" />

declare module "hypercore" {
  // ------------------ Encodings ------------------
  export type BuiltInValueEncoding = "binary" | "utf-8" | "json";

  export type CustomValueEncoding<T> = {
    preencode?(s: any, v: T): void;
    encode(s: any, v: T): void;
    decode(s: any): T;
  };

  export type ValueEncoding<T> = BuiltInValueEncoding | CustomValueEncoding<T>;

  // ------------------ Options ------------------
  export interface HypercoreOptions<T = unknown> {
    valueEncoding?: ValueEncoding<T>;
    createIfMissing?: boolean;
    overwrite?: boolean;
    keyPair?: { publicKey: Buffer; secretKey: Buffer };
    onwait?: () => void;
    timeout?: number;
    writable?: boolean;
    inflightRange?: [number, number] | null;
    ongc?: (session: Hypercore<any>) => void;
    notDownloadingLinger?: number;
    allowFork?: boolean;
    userData?: Record<string, string | Buffer>;
    encodeBatch?: (batch: ReadonlyArray<any>) => Uint8Array;
    encryption?: { key: Buffer };
  }

  type GetBase = {
    wait?: boolean;
    onwait?: () => void;
    timeout?: number;
    decrypt?: boolean;
  };

  // If you want to keep exporting GetOptions<T>, make it the *base*
  // (no valueEncoding here)
  export type GetOptions<T = unknown> = GetBase;

  // ------------------ Info ------------------
  export interface InfoStorageBreakdown {
    oplog: number;
    tree: number;
    blocks: number;
    bitfield: number;
  }
  export interface Info {
    key: Buffer;
    discoveryKey: Buffer;
    length: number;
    contiguousLength: number;
    byteLength: number;
    fork: number;
    padding: number;
    storage?: InfoStorageBreakdown;
  }
  export interface InfoOptions {
    storage?: boolean;
  }

  // ------------------ Function Return Types ------------------
  export type ClearReturn = Uint8Array | null | undefined;

  // ------------------ Class ------------------
  class Hypercore<T = unknown> {
    readonly key: Buffer | null;
    readonly discoveryKey: Buffer;
    readonly length: number;
    readonly byteLength: number;
    readonly closed: boolean;
    readonly writable: boolean;

    constructor(
      storage: string | Record<string, any>,
      key?: Buffer | null,
      options?: HypercoreOptions<T>
    );

    ready(): Promise<void>;

    append(
      value:
        | (unknown extends T ? never : T)
        | Uint8Array
        | Buffer
        | string
        | ReadonlyArray<
            (unknown extends T ? never : T) | Uint8Array | Buffer | string
          >
    ): Promise<{ length: number; byteLength: number }>;

    // -------- get() overloads --------
    // 1) No override -> return T (uses core default)
    get(index: number, options?: GetBase): Promise<T>;

    // 2) Built-ins: precise, non-generic
    get(
      index: number,
      options: GetBase & { valueEncoding: "binary" }
    ): Promise<Buffer>;
    get(
      index: number,
      options: GetBase & { valueEncoding: "utf-8" }
    ): Promise<string>;
    get(
      index: number,
      options: GetBase & { valueEncoding: "json" }
    ): Promise<T>;

    // 3) Custom encoding object: generic
    get<I>(
      index: number,
      options: GetBase & { valueEncoding: CustomValueEncoding<I> }
    ): Promise<I>;

    has(start: number, end?: number): Promise<boolean>;
    update(options?: { wait?: boolean }): Promise<boolean>;
    seek(
      byteOffset: number,
      options?: { wait?: boolean; timeout?: number }
    ): Promise<[number, number]>;

    createReadStream(options?: {
      start?: number;
      end?: number;
      live?: boolean;
      snapshot?: boolean;
    }): AsyncIterable<any>;
    createByteStream(options?: {
      byteOffset?: number;
      byteLength?: number;
      prefetch?: number;
    }): AsyncIterable<Uint8Array>;

    clear(
      start: number,
      end?: number,
      options?: { diff?: boolean }
    ): Promise<ClearReturn>;
    truncate(newLength: number, forkId?: number): Promise<void>;
    treeHash(length?: number): Promise<Buffer>;

    download(range?: {
      start?: number;
      end?: number;
      blocks?: number[];
      linear?: boolean;
    }): {
      done(): Promise<void>;
      destroy(): void;
    };

    session(options?: {
      weak?: boolean;
      exclusive?: boolean;
      checkout?: number;
      atom?: any;
      name?: string | null;
    }): Hypercore<T>;
    commit(
      session: Hypercore<T>,
      opts?: Record<string, any>
    ): Promise<{ length: number; byteLength: number } | null>;
    snapshot(): Hypercore<T>;

    info(options?: InfoOptions): Promise<Info>;

    setUserData(key: string, value: string | Buffer): Promise<void>;
    getUserData(key: string): string | Buffer | undefined;

    close(): Promise<void>;
  }

  export default Hypercore;
}
