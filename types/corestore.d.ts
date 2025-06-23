declare module "corestore" {
  import { EventEmitter } from "events";
  import ReadyResource from "ready-resource";

  // Core types
  interface Core {
    key: Uint8Array;
    discoveryKey: Uint8Array;
    length: number;
    byteLength: number;
    downloaded: number;
    downloadedBytes: number;
    writable: boolean;
    readable: boolean;
    stats: CoreStats;

    ready(): Promise<void>;
    close(): Promise<void>;
    update(options?: { wait?: boolean }): Promise<void>;
    truncate(length: number, fork?: boolean): Promise<void>;
    seek(byteOffset: number): Promise<number>;
    get(index: number, options?: GetOptions): Promise<any>;
    put(index: number, value: any, options?: PutOptions): Promise<void>;
    append(value: any, options?: PutOptions): Promise<number>;
    getBatch(start: number, end: number, options?: GetOptions): Promise<any[]>;
    replicate(isInitiator: boolean, options?: ReplicateOptions): any;
    createReadStream(options?: ReadStreamOptions): any;
    createWriteStream(options?: WriteStreamOptions): any;

    on(event: "ready", listener: () => void): this;
    on(event: "close", listener: () => void): this;
    on(event: "update", listener: () => void): this;
    on(event: "truncate", listener: (length: number) => void): this;
    on(event: "append", listener: (index: number, value: any) => void): this;
    on(event: "put", listener: (index: number, value: any) => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    emit(event: "ready"): boolean;
    emit(event: "close"): boolean;
    emit(event: "update"): boolean;
    emit(event: "truncate", length: number): boolean;
    emit(event: "append", index: number, value: any): boolean;
    emit(event: "put", index: number, value: any): boolean;
    emit(event: "error", error: Error): boolean;
    emit(event: string, ...args: any[]): boolean;
  }

  interface CoreStats {
    totalLength: number;
    totalByteLength: number;
    downloadedLength: number;
    downloadedByteLength: number;
    peerCount: number;
    peers: PeerInfo[];
  }

  interface PeerInfo {
    remotePublicKey: Uint8Array;
    remoteAddress: string;
    type: string;
    priority: number;
    downloaded: number;
    downloadedBytes: number;
    uploaded: number;
    uploadedBytes: number;
  }

  interface GetOptions {
    wait?: boolean;
    timeout?: number;
    valueEncoding?: string;
  }

  interface PutOptions {
    valueEncoding?: string;
  }

  interface ReplicateOptions {
    live?: boolean;
    download?: boolean;
    upload?: boolean;
    encrypted?: boolean;
    noise?: boolean;
    keyPair?: KeyPair;
    onauthenticate?: (
      remotePublicKey: Uint8Array,
      cb: (err: Error | null, allowed: boolean) => void
    ) => void;
  }

  interface ReadStreamOptions {
    start?: number;
    end?: number;
    live?: boolean;
    snapshot?: boolean;
    valueEncoding?: string;
  }

  interface WriteStreamOptions {
    valueEncoding?: string;
  }

  interface KeyPair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
  }

  interface CorestoreOptions {
    primaryKey?: Uint8Array;
    name?: string;
    storage?: any;
    valueEncoding?: string;
    encryptionKey?: Uint8Array;
    noise?: boolean;
    keyPair?: KeyPair;
    onauthenticate?: (
      remotePublicKey: Uint8Array,
      cb: (err: Error | null, allowed: boolean) => void
    ) => void;
  }

  interface GetCoreOptions {
    name?: string;
    key?: Uint8Array;
    valueEncoding?: string;
    encryptionKey?: Uint8Array;
    noise?: boolean;
    keyPair?: KeyPair;
    onauthenticate?: (
      remotePublicKey: Uint8Array,
      cb: (err: Error | null, allowed: boolean) => void
    ) => void;
  }

  declare class Corestore extends ReadyResource {
    constructor(storage: any, options?: CorestoreOptions);

    // Core management
    get(options?: GetCoreOptions): Core;
    get(name: string, options?: GetCoreOptions): Core;
    get(key: Uint8Array, options?: GetCoreOptions): Core;

    // Key management
    createKeyPair(name: string): Promise<KeyPair>;
    getKeyPair(name: string): Promise<KeyPair | null>;

    // Replication
    replicate(isInitiator: boolean, options?: ReplicateOptions): any;

    // Storage management
    ready(): Promise<void>;
    close(): Promise<void>;
    flush(): Promise<void>;

    // Properties
    readonly primaryKey: Uint8Array | null;
    readonly name: string | null;
    readonly storage: any;
    readonly valueEncoding: string;
    readonly encryptionKey: Uint8Array | null;
    readonly noise: boolean;
    readonly keyPair: KeyPair | null;

    // Events
    on(event: "ready", listener: () => void): this;
    on(event: "close", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    emit(event: "ready"): boolean;
    emit(event: "close"): boolean;
    emit(event: "error", error: Error): boolean;
    emit(event: string, ...args: any[]): boolean;
  }

  export = Corestore;
}
