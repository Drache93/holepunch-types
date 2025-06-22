declare module "hyperswarm" {
  export default class Hyperswarm {
    constructor(options: { keyPair: any; bootstrap?: any });

    on(
      event: "connection",
      listener: (connection: any, peerInfo: any) => void
    ): this;
    off(
      event: "connection",
      listener: (connection: any, peerInfo: any) => void
    ): this;

    destroy(): Promise<void>;
  }
}
