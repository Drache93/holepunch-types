declare module "blind-pairing" {
  export default class BlindPairing {
    constructor(swarm: any);

    addCandidate(options: {
      invite: Uint8Array;
      userData: Uint8Array;
      onadd: (result: {
        key: Uint8Array;
        encryptionKey: Uint8Array;
      }) => void | Promise<void>;
    }): Candidate;
  }

  interface Candidate {
    close(): Promise<void>;
  }
}
