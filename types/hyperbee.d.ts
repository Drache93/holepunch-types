declare module "hyperbee" {
  import ReadyResource from "ready-resource";
  import Hypercore from "hypercore";
  import { Readable } from "streamx";

  // Core types
  interface Key {
    seq: number;
    value: any;
  }

  interface Child {
    seq: number;
    offset: number;
    value: any;
  }

  interface TreeNode {
    block: any;
    offset: number;
    keys: Key[];
    children: Child[];
    changed: boolean;
  }

  interface BlockEntry {
    seq: number;
    tree: any;
    index: any;
    entry: any;
    key: any;
    value: any;
  }

  // Options interfaces
  interface HyperbeeOptions {
    keyEncoding?: any;
    valueEncoding?: any;
    extension?: any;
    metadata?: any;
    lock?: any;
    sep?: Uint8Array;
    readonly?: boolean;
    prefix?: Uint8Array | null;
    alwaysDuplicate?: boolean;
    checkout?: number;
    sessions?: boolean;
  }

  interface RangeOptions {
    gt?: any;
    gte?: any;
    lt?: any;
    lte?: any;
    limit?: number;
    reverse?: boolean;
    live?: boolean;
    keyEncoding?: any;
    valueEncoding?: any;
    extension?: boolean;
    onseq?: (seq: number) => void;
    onwait?: (seq: number) => void;
    signal?: AbortSignal;
  }

  interface GetOptions {
    keyEncoding?: any;
    valueEncoding?: any;
    wait?: boolean;
    signal?: AbortSignal;
  }

  interface PutOptions {
    keyEncoding?: any;
    valueEncoding?: any;
    cas?: (prev: any, next: any) => boolean | Promise<boolean>;
  }

  interface DelOptions {
    keyEncoding?: any;
    valueEncoding?: any;
    cas?: (prev: any, next: any) => boolean | Promise<boolean>;
  }

  interface BatchOptions {
    keyEncoding?: any;
    valueEncoding?: any;
    checkout?: number;
    update?: boolean;
    onseq?: (seq: number) => void;
    onwait?: (seq: number) => void;
  }

  interface CheckoutOptions {
    keyEncoding?: any;
    valueEncoding?: any;
    reuseSession?: boolean;
  }

  interface SubOptions {
    keyEncoding?: any;
    valueEncoding?: any;
    sep?: Uint8Array | string;
  }

  interface WatchOptions {
    keyEncoding?: any;
    valueEncoding?: any;
    map?: (snapshot: Hyperbee) => any;
    differ?: (current: Hyperbee, previous: Hyperbee, range: any) => any;
    eager?: boolean;
    onchange?: () => void | Promise<void>;
  }

  interface GetAndWatchOptions {
    keyEncoding?: any;
    valueEncoding?: any;
  }

  interface HistoryStreamOptions {
    live?: boolean;
    signal?: AbortSignal;
  }

  interface DiffStreamOptions {
    keyEncoding?: any;
    valueEncoding?: any;
    signal?: AbortSignal;
  }

  interface HeaderOptions {
    wait?: boolean;
    signal?: AbortSignal;
  }

  // Entry types
  interface Entry {
    seq: number;
    key: any;
    value: any;
  }

  interface DiffEntry {
    left: Entry | null;
    right: Entry | null;
  }

  // Iterator types
  interface RangeIterator {
    open(): Promise<void>;
    next(): Promise<{ value: Entry; done: boolean }>;
    close(): Promise<void>;
    snapshot(version: number): Hyperbee;
  }

  interface HistoryIterator {
    open(): Promise<void>;
    next(): Promise<{ value: Entry; done: boolean }>;
    close(): Promise<void>;
  }

  interface DiffIterator {
    open(): Promise<void>;
    next(): Promise<{ value: DiffEntry; done: boolean }>;
    close(): Promise<void>;
  }

  // Watcher types
  interface EntryWatcher extends ReadyResource {
    key: any;
    node: Entry | null;
    on(event: "update", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    emit(event: "update"): boolean;
    emit(event: "error", error: Error): boolean;
    emit(event: string, ...args: any[]): boolean;
  }

  interface Watcher extends ReadyResource {
    current: any;
    previous: any;
    currentMapped: any;
    previousMapped: any;
    on(event: "update", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    emit(event: "update"): boolean;
    emit(event: "error", error: Error): boolean;
    emit(event: string, ...args: any[]): boolean;
    [Symbol.asyncIterator](): AsyncIterator<[any, any]>;
  }

  // Batch interface
  interface Batch {
    tree: Hyperbee;
    core: Hypercore;
    version: number;
    length: number;
    options: BatchOptions;
    encoding: {
      key: any;
      value: any;
    };

    ready(): Promise<void>;
    lock(): Promise<void>;
    close(): Promise<void>;
    destroy(): void;
    flush(): Promise<void>;

    get(key: any, opts?: GetOptions): Promise<Entry | null>;
    getBySeq(seq: number, opts?: GetOptions): Promise<Entry | null>;
    put(key: any, value: any, opts?: PutOptions): Promise<void>;
    del(key: any, opts?: DelOptions): Promise<void>;

    peek(range: any, opts?: RangeOptions): Promise<Entry | null>;
    createRangeIterator(range: any, opts?: RangeOptions): RangeIterator;
    createReadStream(range: any, opts?: RangeOptions): Readable;
  }

  // Main Hyperbee class
  declare class Hyperbee extends ReadyResource {
    constructor(core: Hypercore, opts?: HyperbeeOptions);

    // Static methods
    static isHyperbee(core: Hypercore, opts?: any): Promise<boolean>;

    // Properties
    readonly feed: Hypercore; // deprecated, use core
    readonly core: Hypercore;
    readonly keyEncoding: any;
    readonly valueEncoding: any;
    readonly extension: any;
    readonly metadata: any;
    readonly lock: any;
    readonly sep: Uint8Array;
    readonly readonly: boolean;
    readonly prefix: Uint8Array | null;
    readonly alwaysDuplicate: boolean;
    readonly version: number;
    readonly id: string;
    readonly key: Uint8Array;
    readonly discoveryKey: Uint8Array;
    readonly writable: boolean;
    readonly readable: boolean;

    // Core methods
    ready(): Promise<void>;
    close(): Promise<void>;

    // Basic operations
    get(key: any, opts?: GetOptions): Promise<Entry | null>;
    getBySeq(seq: number, opts?: GetOptions): Promise<Entry | null>;
    put(key: any, value: any, opts?: PutOptions): Promise<void>;
    del(key: any, opts?: DelOptions): Promise<void>;

    // Batch operations
    batch(opts?: BatchOptions): Batch;

    // Range operations
    peek(range: any, opts?: RangeOptions): Promise<Entry | null>;
    createRangeIterator(range: any, opts?: RangeOptions): RangeIterator;
    createReadStream(range: any, opts?: RangeOptions): Readable;

    // History operations
    createHistoryStream(opts?: HistoryStreamOptions): Readable;

    // Diff operations
    createDiffStream(
      right: Hyperbee | number,
      range: any,
      opts?: DiffStreamOptions,
    ): Readable;

    // Versioning
    checkout(version: number, opts?: CheckoutOptions): Hyperbee;
    snapshot(opts?: CheckoutOptions): Hyperbee;

    // Sub databases
    sub(prefix: Uint8Array | string, opts?: SubOptions): Hyperbee;

    // Watching
    watch(range: any, opts?: WatchOptions): Watcher;
    getAndWatch(key: any, opts?: GetAndWatchOptions): Promise<EntryWatcher>;

    // Header operations
    getHeader(opts?: HeaderOptions): Promise<any>;

    // Replication and updates
    replicate(isInitiator: boolean, opts?: any): any;
    update(opts?: any): Promise<void>;

    // Events
    on(event: "append", listener: () => void): this;
    on(event: "truncate", listener: (length: number) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    emit(event: "append"): boolean;
    emit(event: "truncate", length: number): boolean;
    emit(event: string, ...args: any[]): boolean;
  }

  export = Hyperbee;
}
