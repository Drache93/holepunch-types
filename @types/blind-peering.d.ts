declare module "blind-peering" {
  export interface BlindPeeringOptions {
    mirrors?: string[];
    wakeup?: any; // TODO
  }

  class BlindPeering {
    constructor(
      store: Corestore,
      swarm: Hyperswarm,
      options?: BlindPeeringOptions,
    );
    start(): Promise<void>;
    stop(): Promise<void>;
  }

  export = BlindPeering;
}
