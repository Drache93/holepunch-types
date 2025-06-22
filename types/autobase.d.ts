declare module "autobase" {
  import { EventEmitter } from "events";
  import { Buffer } from "buffer";
  import ReadyResource from "ready-resource";

  // Type definitions for Autobase dependencies
  interface Store {
    replicate(isInitiator: boolean, opts?: any): any;
    ready(): Promise<void>;
    close(): Promise<void>;
    get(opts: any): any;
    globalCache?: any;
    manifestVersion?: number;
    createKeyPair(name: string): Promise<any>;
  }

  interface KeyPair {
    publicKey: Buffer;
    secretKey: Buffer;
  }

  interface WakeupProtocol {
    addStream(stream: any): void;
    session(cap: Buffer, handler: any): any;
    destroy(): void;
  }

  interface FastForwardConfig {
    key: Buffer;
    verified?: boolean;
    force?: boolean;
    minimum?: number;
  }

  interface AutobaseHandlers {
    valueEncoding?: string;
    encrypted?: boolean;
    encrypt?: boolean;
    encryptionKey?: Buffer;
    nukeTip?: boolean;
    wakeup?: WakeupProtocol;
    fastForward?: FastForwardConfig | false;
    ackInterval?: number;
    ackThreshold?: number;
    keyPair?: Promise<KeyPair> | KeyPair;
    wakeupCapability?:
      | Promise<{ key: Buffer; discoveryKey: Buffer }>
      | { key: Buffer; discoveryKey: Buffer };
    wait?: () => Promise<void>;
    open?: (store: any, base: any) => any;
    apply?: (nodes: any[], view: any, base: any) => Promise<void>;
    optimistic?: (nodes: any[], view: any, base: any) => Promise<void>;
    update?: (view: any, changes: any) => Promise<void>;
    close?: (view: any) => Promise<void>;
  }

  interface WakeupHint {
    key: Buffer;
    length: number;
  }

  interface Node {
    key: Buffer;
    length: number;
  }

  interface AppendOptions {
    optimistic?: boolean;
  }

  interface GetLocalKeyOptions {
    keyPair?: KeyPair;
    name?: string;
    active?: boolean;
  }

  interface GetLocalCoreOptions extends GetLocalKeyOptions {
    compat?: boolean;
    exclusive?: boolean;
    valueEncoding?: any;
    encryption?: any;
  }

  interface IsAutobaseOptions {
    [key: string]: any;
  }

  interface GetUserDataResult {
    referrer: any;
    view: string | null;
  }

  interface Core {
    ready(): Promise<void>;
    close(): Promise<void>;
    key: Buffer;
  }

  declare class Autobase extends ReadyResource {
    constructor(
      store: Store,
      bootstrap?: Buffer | string | null,
      handlers?: AutobaseHandlers
    );

    // Public properties
    readonly id: Buffer | null;
    readonly key: Buffer | null;
    readonly discoveryKey: Buffer | null;
    readonly keyPair: KeyPair | null;
    readonly valueEncoding: any;
    readonly store: Store;
    readonly globalCache: any | null;
    readonly migrated: boolean;
    readonly encrypted: boolean;
    readonly encrypt: boolean;
    readonly encryptionKey: Buffer | null;
    readonly encryption: any | null;
    readonly local: any | null;
    readonly localWriter: any | null;
    readonly isIndexer: boolean;
    readonly activeWriters: any;
    readonly linearizer: any | null;
    readonly updating: boolean;
    readonly nukeTip: boolean;
    readonly wakeupOwner: boolean;
    readonly wakeupCapability: { key: Buffer; discoveryKey: Buffer } | null;
    readonly wakeupProtocol: WakeupProtocol;
    readonly wakeupSession: any | null;
    readonly fastForwardEnabled: boolean;
    readonly fastForwarding: any | null;
    readonly fastForwardTo: any | null;
    readonly fastForwardFailedAt: number;
    readonly fastForwardMinimum: number;
    readonly view: any | null;
    readonly core: any | null;
    readonly version: number;
    readonly interrupted: any | null;
    readonly recoveries: number;
    readonly paused: boolean;

    // Public getters
    get bootstrap(): Buffer | null;
    get bootstraps(): Buffer[];
    get writable(): boolean;
    get ackable(): boolean;
    get signedLength(): number;
    get indexedLength(): number;
    get length(): number;
    get flushing(): boolean;
    get system(): any | null;

    // Public methods
    replicate(isInitiator: boolean, opts?: any): any;
    heads(): Node[];
    hintWakeup(hints: WakeupHint | WakeupHint[]): void;
    setLocal(key?: Buffer, options?: { keyPair?: KeyPair }): Promise<void>;
    setWakeup(cap: Buffer, discoveryKey?: Buffer): void;
    flush(): Promise<void>;
    advance(): Promise<void>;
    recouple(): void;
    update(): Promise<void>;
    isFastForwarding(): boolean;
    ack(bg?: boolean): Promise<void>;
    views(): any[];
    append(value: any | any[], opts?: AppendOptions): Promise<number>;
    setUserData(key: string, val: any): Promise<void>;
    getUserData(key: string): Promise<any>;
    pause(): void;
    resume(): void;
    waitForWritable(): Promise<boolean>;
    removeable(key: Buffer): boolean;

    // Deprecated methods (still public)
    getSystemKey(): Buffer;
    getIndexedInfo(): Promise<any>;

    // Static methods
    static decodeValue(value: any, opts?: any): any;
    static encodeValue(value: any, opts?: any): any;
    static getLocalKey(
      store: Store,
      opts?: GetLocalKeyOptions
    ): Promise<Buffer>;
    static getLocalCore(store: Store): Core;
    static getUserData(core: any): Promise<GetUserDataResult>;
    static isAutobase(core: any, opts?: IsAutobaseOptions): Promise<boolean>;
    static getBootRecord(store: Store, key: Buffer): Promise<any>;

    // Events
    on(event: "update", listener: () => void): this;
    on(event: "writable", listener: () => void): this;
    on(event: "unwritable", listener: () => void): this;
    on(event: "is-indexer", listener: () => void): this;
    on(event: "is-non-indexer", listener: () => void): this;
    on(event: "interrupt", listener: (reason: any) => void): this;
    on(
      event: "fast-forward",
      listener: (to: number, from: number) => void
    ): this;
    on(event: "reboot", listener: () => void): this;
    on(event: "warning", listener: (err: Error) => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    emit(event: "update"): boolean;
    emit(event: "writable"): boolean;
    emit(event: "unwritable"): boolean;
    emit(event: "is-indexer"): boolean;
    emit(event: "is-non-indexer"): boolean;
    emit(event: "interrupt", reason: any): boolean;
    emit(event: "fast-forward", to: number, from: number): boolean;
    emit(event: "reboot"): boolean;
    emit(event: "warning", err: Error): boolean;
    emit(event: "error", err: Error): boolean;
    emit(event: string, ...args: any[]): boolean;
  }

  export = Autobase;
}
