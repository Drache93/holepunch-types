declare module "hypercore" {
  import ReadyResource from "ready-resource";
  import { Connection } from "hyperswarm";

  // TODO: swap to streamx types
  type ReadStream<T> = ReadableStream<T>;

  interface HypercoreOptions {
    /** Create a new Hypercore key pair if none was present in storage */
    createIfMissing?: boolean;
    /** Overwrite any old Hypercore that might already exist */
    overwrite?: boolean;
    /** Enable sparse mode, counting unavailable blocks towards core.length */
    sparse?: boolean;
    /** Encoding for individual blocks: 'json', 'utf-8', or 'binary' */
    valueEncoding?: "json" | "utf-8" | "binary" | any;
    /** Function to apply encoding to complete batches */
    encodeBatch?: (batch: any) => any;
    /** Public key and secret key as a key pair */
    keyPair?: KeyPair;
    /** Encryption key to enable block encryption */
    encryptionKey?: Uint8Array;
    /** Hook called if gets are waiting for download */
    onwait?: () => void;
    /** Constructor timeout */
    timeout?: number;
    /** Disable appends and truncates */
    writable?: boolean;
  }

  interface GetOptions {
    /** Wait for the block to be downloaded */
    wait?: boolean;
    /** Hook called if the get is waiting for download */
    onwait?: () => void;
    /** Enable sparse mode for this operation */
    sparse?: boolean;
  }

  interface PutOptions {
    valueEncoding?: "json" | "utf-8" | "binary" | any;
  }

  interface ReplicateOptions {
    live?: boolean;
    download?: boolean;
    upload?: boolean;
    encrypt?: boolean;
    noise?: boolean;
  }

  interface ReadStreamOptions {
    start?: number;
    end?: number;
    live?: boolean;
    snapshot?: boolean;
    valueEncoding?: "json" | "utf-8" | "binary" | any;
  }

  interface WriteStreamOptions {
    valueEncoding?: "json" | "utf-8" | "binary" | any;
  }

  interface SessionOptions {
    wait?: boolean;
    onwait?: () => void;
    sparse?: boolean;
    class?: any;
  }

  interface SnapshotOptions extends SessionOptions {}

  interface InfoOptions {
    storage?: boolean;
  }

  interface DownloadRange {
    /** Start index (inclusive) */
    start?: number;
    /** End index (non-inclusive), use -1 for continuous download */
    end?: number;
    /** Specific block indices to download */
    blocks?: number[];
    /** Download range linearly instead of randomly */
    linear?: boolean;
  }

  interface DownloadRangeResult {
    /** Wait until the range has been fully downloaded */
    done(): Promise<void>;
    /** Cancel downloading the range */
    destroy(): void;
  }

  interface HypercoreInfo {
    /** Public key identifying this core */
    key: Uint8Array;
    /** Discovery key for peer discovery */
    discoveryKey: Uint8Array;
    /** Total number of blocks in the core */
    length: number;
    /** Number of contiguous blocks available */
    contiguousLength: number;
    /** Total size in bytes */
    byteLength: number;
    /** Current fork ID */
    fork: number;
    /** Padding bytes */
    padding: number;
    /** Storage estimates in bytes (when storage option is true) */
    storage?: {
      oplog: number;
      tree: number;
      blocks: number;
      bitfield: number;
    };
  }

  declare class Hypercore extends ReadyResource {
    // Properties
    /** Can we read from this core? */
    readonly readable: boolean;
    /** Can we write to this core? */
    readonly writable: boolean;
    /** String ID (z-base-32 of the public key) that identifies this core */
    readonly id: string;
    /** Public key identifying this core */
    readonly key: Uint8Array;
    /** Discovery key for peer discovery */
    readonly discoveryKey: Uint8Array;
    /** Encryption key for block encryption */
    readonly encryptionKey: Uint8Array;
    /** Total number of blocks in the core */
    readonly length: number;
    /** Number of contiguous blocks available */
    readonly contiguousLength: number;
    /** Total size in bytes */
    readonly byteLength: number;
    /** Current fork ID */
    readonly fork: number;
    /** Padding bytes */
    readonly padding: number;
    /** Public and secret key pair */
    readonly keyPair: KeyPair;

    constructor(
      storage: string | ((filename: string) => any),
      key?: Uint8Array,
      options?: HypercoreOptions,
    );

    // Core methods
    /** Wait for the core to open and set properties */
    ready(): Promise<void>;
    /** Close this core and release resources */
    close(): Promise<void>;
    /** Update the core, optionally waiting for peers */
    update(options?: { wait?: boolean }): Promise<void>;

    // Data manipulation
    /** Append a block to the core */
    append(
      block: any,
      options?: PutOptions,
    ): Promise<{ length: number; byteLength: number }>;
    /** Get a block by index */
    get<T>(index: number, options?: GetOptions): Promise<T>;
    /** Check if blocks exist in the given range */
    has(start: number, end?: number): Promise<boolean>;
    /** Seek to a byte offset and return block index */
    seek(byteOffset: number): Promise<number>;

    // Streams
    /** Create a readable stream of blocks */
    createReadStream<T>(options?: ReadStreamOptions): ReadStream<T>;
    /** Create a readable stream of raw bytes */
    createByteStream(options?: ReadStreamOptions): ReadStream<Uint8Array>;

    // Data management
    /** Clear blocks from local cache */
    clear(
      start: number,
      end?: number,
      options?: { valueEncoding?: any },
    ): Promise<void>;
    /** Truncate the core to a smaller length, optionally with new fork ID */
    truncate(newLength: number, forkId?: number): Promise<void>;
    /** Purge the Hypercore from storage completely */
    purge(): Promise<void>;

    // Tree and hashing
    /** Get the Merkle Tree hash at given length (defaults to current length) */
    treeHash(length?: number): Promise<Uint8Array>;

    // Download
    /** Download a range of data */
    download(range?: DownloadRange): DownloadRangeResult;

    // Sessions and snapshots
    /** Create a new session that shares the same underlying core */
    session(options?: SessionOptions): Hypercore;
    /** Create a snapshot of the core at current time */
    snapshot(options?: SnapshotOptions): Hypercore;

    // Information
    /** Get information about this core */
    info(options?: InfoOptions): Promise<HypercoreInfo>;

    // Replication
    /** Create a replication stream for peer-to-peer sync */
    replicate(
      isInitiatorOrReplicationStream: boolean | Connection,
      options?: ReplicateOptions,
    ): any;
    /** Create a hook for peer discovery */
    findingPeers(): () => void;

    // Events
    /** Emitted after the core has initially opened */
    on(event: "ready", listener: () => void): this;
    /** Emitted when the core has been fully closed */
    on(event: "close", listener: () => void): this;
    /** Emitted when the core has been appended to */
    on(event: "append", listener: () => void): this;
    /** Emitted when the core has been truncated */
    on(
      event: "truncate",
      listener: (ancestors: any, forkId: number) => void,
    ): this;
    /** Emitted when a new peer connection is established */
    on(event: "peer-add", listener: (peer: any) => void): this;
    /** Emitted when a peer connection is closed */
    on(event: "peer-remove", listener: (peer: any) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    emit(event: "ready"): boolean;
    emit(event: "close"): boolean;
    emit(event: "append"): boolean;
    emit(event: "truncate", ancestors: any, forkId: number): boolean;
    emit(event: "peer-add", peer: any): boolean;
    emit(event: "peer-remove", peer: any): boolean;
    emit(event: string, ...args: any[]): boolean;
  }

  interface KeyPair {
    /** Public key for identification */
    publicKey: Uint8Array;
    /** Secret key for signing updates */
    secretKey: Uint8Array;
  }

  export = Hypercore;
}
