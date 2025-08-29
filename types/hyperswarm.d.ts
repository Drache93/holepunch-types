declare module "hyperswarm" {
  import ReadyResource from "ready-resource";

  interface KeyPair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
  }

  interface HyperswarmOptions {
    seed?: Uint8Array;
    relayThrough?: (force?: boolean) => any;
    keyPair?: KeyPair;
    maxPeers?: number;
    maxClientConnections?: number;
    maxServerConnections?: number;
    maxParallel?: number;
    firewall?: (remotePublicKey: Uint8Array, payload: any) => boolean;
    dht?: any;
    bootstrap?: any;
    nodes?: any;
    port?: number;
    backoffs?: any;
    jitter?: any;
  }

  interface JoinOptions {
    limit?: number;
  }

  interface DestroyOptions {
    force?: boolean;
  }

  interface SuspendResumeOptions {
    log?: (message: string) => void;
  }

  interface Connection {
    remotePublicKey: Uint8Array;
    publicKey: Uint8Array;
    isInitiator: boolean;
    rawBytesRead: number;
    rawBytesWritten: number;
    on(event: string, listener: (...args: any[]) => void): this;
    removeListener(event: string, listener: (...args: any[]) => void): this;
    sendKeepAlive(): void;
    destroy(error?: Error): void;
  }

  interface PeerInfo {
    publicKey: Uint8Array;
    relayAddresses: any;
    topics: Uint8Array[];
    explicit: boolean;
    banned: boolean;
    client: boolean;
    server: boolean;
    attempts: number;
    disconnectedTime: number;
    queued: boolean;
    waiting: boolean;
    prioritized: boolean;
    forceRelaying: boolean;
    _connected(): void;
    _disconnected(): void;
    _topic(topic: Uint8Array): void;
    _reset(): void;
    _updatePriority(): boolean;
    shouldGC(): boolean;
    ban(value: boolean): void;
  }

  interface DiscoverySession {
    destroy(): Promise<void>;
  }

  interface Discovery {
    session(opts?: JoinOptions): DiscoverySession;
    refresh(): Promise<void>;
    destroy(): Promise<void>;
    suspend(options?: SuspendResumeOptions): Promise<void>;
    resume(): void;
    flushed(): Promise<boolean>;
  }

  interface SwarmStats {
    updates: number;
    connects: {
      client: {
        opened: number;
        closed: number;
        attempted: number;
      };
      server: {
        opened: number;
        closed: number;
      };
    };
  }

  export default class Hyperswarm extends ReadyResource {
    keyPair: KeyPair;
    dht: any;
    server: any;
    destroyed: boolean;
    suspended: boolean;
    maxPeers: number;
    maxClientConnections: number;
    maxServerConnections: number;
    maxParallel: number;
    relayThrough: ((force?: boolean) => any) | null;
    connecting: number;
    connections: Set<Connection>;
    peers: Map<string, PeerInfo>;
    explicitPeers: Set<PeerInfo>;
    listening: any;
    stats: SwarmStats;

    constructor(opts?: HyperswarmOptions);

    // Event handling
    on(
      event: "connection",
      listener: (connection: Connection, peerInfo: PeerInfo) => void
    ): this;
    on(event: "update", listener: () => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    off(
      event: "connection",
      listener: (connection: Connection, peerInfo: PeerInfo) => void
    ): this;
    off(event: "update", listener: () => void): this;
    off(event: string, listener: (...args: any[]) => void): this;

    // Core methods
    status(key: Uint8Array): Discovery | null;
    listen(): Promise<any>;
    join(topic: Uint8Array, opts?: JoinOptions): DiscoverySession;
    leave(topic: Uint8Array): Promise<void>;
    joinPeer(publicKey: Uint8Array): void;
    leavePeer(publicKey: Uint8Array): void;
    flush(): Promise<boolean>;
    clear(): Promise<PromiseSettledResult<void>[]>;
    destroy(options?: DestroyOptions): Promise<void>;
    suspend(options?: SuspendResumeOptions): Promise<void>;
    resume(options?: SuspendResumeOptions): Promise<void>;
    topics(): IterableIterator<Discovery>;
  }
}
