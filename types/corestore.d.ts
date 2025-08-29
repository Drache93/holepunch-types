declare module "corestore" {
  import ReadyResource from "ready-resource";
  import Hyperbee from "hyperbee";
  import { Connection } from "hyperswarm";

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
      cb: (err: Error | null, allowed: boolean) => void,
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
      cb: (err: Error | null, allowed: boolean) => void,
    ) => void;
  }

  interface GetCoreOptions {
    name?: string | null;
    key?: Uint8Array | null;
    valueEncoding?: string | null;
    encryptionKey?: Uint8Array | null;
    noise?: boolean | null;
    keyPair?: KeyPair | null;
    onauthenticate?: (
      remotePublicKey: Uint8Array,
      cb: (err: Error | null, allowed: boolean) => void,
    ) => void;
  }

  declare class Corestore extends ReadyResource {
    constructor(storage: any, options?: CorestoreOptions);

    // Core management
    get(options?: GetCoreOptions): Hypercore;
    get(key: Uint8Array | string): Hypercore;

    // Key management
    createKeyPair(name: string): Promise<KeyPair>;
    getKeyPair(name: string): Promise<KeyPair | null>;

    // Replication
    replicate(options: ReplicateOptions): any;
    replicate(stream: Connection): any;

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
