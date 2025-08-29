declare module "hyperblobs" {
  import { EventEmitter } from "events";
  import Hypercore from "hypercore";
  import { Readable, Writable } from "streamx";

  // Core types
  interface BlobId {
    blockOffset: number;
    blockLength: number;
    byteOffset?: number;
    byteLength?: number;
  }

  interface PutResult {
    blockOffset: number;
    blockLength: number;
    byteOffset: number;
    byteLength: number;
  }

  // Options interfaces
  interface HyperblobsOptions {
    blockSize?: number;
  }

  interface PutOptions {
    blockSize?: number;
  }

  interface GetOptions {
    start?: number;
    end?: number;
    length?: number;
    core?: Hypercore;
    wait?: boolean;
    timeout?: number;
  }

  interface ClearOptions {
    diff?: boolean;
  }

  interface ReadStreamOptions {
    start?: number;
    end?: number;
    length?: number;
    core?: Hypercore;
    wait?: boolean;
    timeout?: number;
  }

  interface WriteStreamOptions {
    core?: Hypercore;
  }

  // Stream types
  interface BlobReadStream extends Readable {
    id: BlobId;
    core: Hypercore;
  }

  interface BlobWriteStream extends Writable {
    id: BlobId;
    core: Hypercore;
  }

  // Monitor interface
  interface Monitor extends EventEmitter {
    id: BlobId;
    blobs: Hyperblobs;
    peers: any[];
    downloaded: number;
    downloadedBytes: number;
    uploaded: number;
    uploadedBytes: number;

    ready(): Promise<void>;
    close(): Promise<void>;

    on(event: "update", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    emit(event: "update"): boolean;
    emit(event: "error", error: Error): boolean;
    emit(event: string, ...args: any[]): boolean;
  }

  // Batch interface
  interface HyperBlobsBatch {
    blobs: Hyperblobs;
    blocks: Uint8Array[];
    bytes: number;

    ready(): Promise<void>;
    put(buffer: Uint8Array): Promise<PutResult>;
    get(id: BlobId): Promise<Uint8Array | null>;
    flush(): Promise<void>;
    close(): void;
  }

  // Main Hyperblobs class
  declare class Hyperblobs extends EventEmitter {
    constructor(core: Hypercore, opts?: HyperblobsOptions);

    // Properties
    readonly core: Hypercore;
    readonly blockSize: number;
    readonly key: Uint8Array;
    readonly discoveryKey: Uint8Array;
    readonly feed: Hypercore; // alias for core
    readonly locked: boolean;

    // Core methods
    ready(): Promise<void>;
    close(): Promise<void>;

    // Batch operations
    batch(): HyperBlobsBatch;

    // Snapshot operations
    snapshot(): Hyperblobs;

    // Blob operations
    put(blob: Buffer | Uint8Array | string, opts?: PutOptions): Promise<BlobId>;
    get(id: BlobId, opts?: GetOptions): Promise<Uint8Array | null>;
    clear(id: BlobId, opts?: ClearOptions): Promise<any>;

    // Stream operations
    createReadStream(id: BlobId, opts?: ReadStreamOptions): BlobReadStream;
    createWriteStream(opts?: WriteStreamOptions): BlobWriteStream;

    // Monitoring
    monitor(id: BlobId): Monitor;

    // Replication
    replicate(isInitiator: boolean, opts?: any): any;

    // Events
    on(event: "peer-add", listener: (peer: any) => void): this;
    on(event: "peer-remove", listener: (peer: any) => void): this;
    on(
      event: "upload",
      listener: (index: number, bytes: number, from: any) => void,
    ): this;
    on(
      event: "download",
      listener: (index: number, bytes: number, from: any) => void,
    ): this;
    on(event: string, listener: (...args: any[]) => void): this;

    emit(event: "peer-add", peer: any): boolean;
    emit(event: "peer-remove", peer: any): boolean;
    emit(event: "upload", index: number, bytes: number, from: any): boolean;
    emit(event: "download", index: number, bytes: number, from: any): boolean;
    emit(event: string, ...args: any[]): boolean;
  }

  export = Hyperblobs;
}
