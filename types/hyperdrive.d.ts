declare module "hyperdrive" {
  import { EventEmitter } from "events";
  import ReadyResource from "ready-resource";
  import Corestore from "corestore";
  import Hypercore from "hypercore";
  import Hyperbee from "hyperbee";
  import Hyperblobs from "hyperblobs";
  import { Readable, Writable } from "streamx";

  // Types for internal use
  interface BlobInfo {
    blockOffset: number;
    blockLength: number;
  }

  interface FileEntry {
    executable: boolean;
    linkname: string | null;
    blob: BlobInfo | null;
    metadata: any | null;
  }

  interface DiffEntry {
    left: { key: string; value: FileEntry } | null;
    right: { key: string; value: FileEntry } | null;
  }

  interface DownloadOptions {
    start?: number;
    end?: number;
    wait?: boolean;
  }

  interface ListOptions {
    recursive?: boolean;
    ignore?: string[] | ((key: string) => boolean);
  }

  interface ReadStreamOptions {
    start?: number;
    end?: number;
    wait?: boolean;
  }

  interface WriteStreamOptions {
    executable?: boolean;
    metadata?: any;
  }

  interface PutOptions {
    executable?: boolean;
    metadata?: any;
  }

  interface TruncateOptions {
    blobs?: number;
  }

  interface MonitorOptions {
    name: string;
    [key: string]: any;
  }

  interface WatchOptions {
    [key: string]: any;
  }

  interface DiffOptions {
    [key: string]: any;
  }

  interface EntryOptions {
    follow?: boolean;
    wait?: boolean;
  }

  interface ClearOptions {
    diff?: boolean;
  }

  interface MirrorOptions {
    [key: string]: any;
  }

  interface HyperdriveOptions {
    active?: boolean;
    onwait?: (cb: () => void) => void;
    encryptionKey?: Uint8Array;
    compat?: boolean;
    extension?: any;
    _db?: Hyperbee;
    _checkout?: Hyperdrive;
  }

  interface DownloadRange {
    start: number;
    end: number;
  }

  declare class Download extends EventEmitter {
    constructor(drives: Hyperdrive[], folder?: string, options?: any);
    constructor(downloads: Promise<void>[]);

    ready(): Promise<void>;
    close(): Promise<void>;
  }

  declare class Monitor extends EventEmitter {
    constructor(drive: Hyperdrive, options: MonitorOptions);

    ready(): Promise<void>;
    close(): Promise<void>;
  }

  declare class Hyperdrive extends ReadyResource {
    constructor(
      corestore: Corestore,
      key?: Uint8Array | HyperdriveOptions,
      opts?: HyperdriveOptions
    );

    // Static methods
    static getDriveKey(corestore: Corestore): Promise<Uint8Array>;
    static getContentKey(m: any, key: Uint8Array): Uint8Array | null;
    static getContentManifest(m: any, key: Uint8Array): any;
    static normalizePath(name: string): string;

    // Async iterator support
    [Symbol.asyncIterator](): AsyncIterator<{ key: string; value: FileEntry }>;

    // Properties
    readonly corestore: Corestore;
    readonly db: Hyperbee;
    readonly core: Hypercore;
    readonly blobs: Hyperblobs | null;
    readonly supportsMetadata: boolean;
    readonly encryptionKey: Uint8Array | null;
    readonly id: string;
    readonly key: Uint8Array;
    readonly discoveryKey: Uint8Array;
    readonly contentKey: Uint8Array | null;
    readonly version: number;
    readonly writable: boolean;
    readonly readable: boolean;

    // Core methods
    ready(): Promise<void>;
    close(): Promise<void>;
    flush(): Promise<void>;

    // File operations
    get(name: string, opts?: ReadStreamOptions): Promise<Buffer | null>;
    put(name: string, buf: Buffer, opts?: PutOptions): Promise<void>;
    del(name: string): Promise<void>;
    symlink(
      name: string,
      dst: string,
      opts?: { metadata?: any }
    ): Promise<void>;
    entry(
      name: string,
      opts?: EntryOptions
    ): Promise<{ key: string; value: FileEntry } | null>;
    exists(name: string): Promise<boolean>;
    has(path: string): Promise<boolean>;

    // Directory operations
    list(folder?: string, opts?: ListOptions): Readable;
    readdir(folder?: string, opts?: any): Readable;
    entries(range?: any, opts?: any): Readable;

    // Stream operations
    createReadStream(name: string, opts?: ReadStreamOptions): Readable;
    createWriteStream(name: string, opts?: WriteStreamOptions): Writable;

    // Versioning and checkouts
    checkout(version: number): Hyperdrive;
    batch(): Hyperdrive;
    truncate(version: number, opts?: TruncateOptions): Promise<void>;

    // Blob operations
    getBlobs(): Promise<Hyperblobs>;
    getBlobsLength(checkout?: number): Promise<number>;
    clear(name: string, opts?: ClearOptions): Promise<any>;
    clearAll(opts?: ClearOptions): Promise<any>;
    purge(): Promise<void>;

    // Monitoring and watching
    monitor(name: string, opts?: MonitorOptions): Monitor;
    watch(folder?: string): Readable;

    // Diff and download operations
    diff(length: number, folder?: string, opts?: DiffOptions): Readable;
    downloadDiff(
      length: number,
      folder?: string,
      opts?: any
    ): Promise<Download>;
    downloadRange(
      dbRanges: DownloadRange[],
      blobRanges: DownloadRange[]
    ): Promise<Download>;
    download(folder?: string, opts?: any): Download;

    // Replication and updates
    replicate(isInitiator: boolean, opts?: any): any;
    update(opts?: any): Promise<void>;

    // Activity control
    setActive(bool: boolean): void;
    findingPeers(): boolean;

    // Utility methods
    compare(a: any, b: any): number;

    // Events
    on(event: "blobs", listener: (blobs: Hyperblobs) => void): this;
    on(event: "content-key", listener: (key: Uint8Array) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    emit(event: "blobs", blobs: Hyperblobs): boolean;
    emit(event: "content-key", key: Uint8Array): boolean;
    emit(event: string, ...args: any[]): boolean;
  }

  export = Hyperdrive;
}
