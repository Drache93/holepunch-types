/// <reference types="node" />

export type ValueEncoding<T> =
  | "binary"
  | "utf-8"
  | "json"
  | {
      preencode?(s: any, v: T): void;
      encode(s: any, v: T): void;
      decode(s: any): T;
    };

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

export interface GetOptions<T = unknown> {
  wait?: boolean;
  onwait?: () => void;
  timeout?: number;
  valueEncoding?: ValueEncoding<T>;
  decrypt?: boolean;
}

export interface UpdateOptions {
  wait?: boolean;
}
export interface SeekOptions {
  wait?: boolean;
  timeout?: number;
}
export interface ReadStreamOptions {
  start?: number;
  end?: number;
  live?: boolean;
  snapshot?: boolean;
}
export interface ByteStreamOptions {
  byteOffset?: number;
  byteLength?: number;
  prefetch?: number;
}
export interface ClearOptions {
  diff?: boolean;
}
export interface DownloadRangeSpec {
  start?: number;
  end?: number;
  blocks?: number[];
  linear?: boolean;
}

export interface DownloadRange {
  done(): Promise<void>;
  destroy(): void;
}

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

declare class Hypercore<T = unknown> {
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

  get<I = T>(index: number, options?: GetOptions<I>): Promise<I>;
  has(start: number, end?: number): Promise<boolean>;
  update(options?: UpdateOptions): Promise<boolean>;
  seek(byteOffset: number, options?: SeekOptions): Promise<[number, number]>;

  createReadStream(options?: ReadStreamOptions): AsyncIterable<any>;
  createByteStream(options?: ByteStreamOptions): AsyncIterable<Uint8Array>;

  clear(
    start: number,
    end?: number,
    options?: ClearOptions
  ): Promise<Uint8Array | null>;
  truncate(newLength: number, forkId?: number): Promise<void>;
  treeHash(length?: number): Promise<Buffer>;

  download(range?: DownloadRangeSpec): DownloadRange;

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
