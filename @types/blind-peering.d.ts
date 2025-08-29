declare module "blind-peering" {
  import Corestore from "corestore";
  import Hyperswarm from "hyperswarm";

  interface BlindPeeringOptions {
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
