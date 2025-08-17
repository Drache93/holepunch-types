declare module "blind-pairing" {
  import ReadyResource from "ready-resource";

  export default class BlindPairing extends ReadyResource {
    constructor(swarm: any);

    static createInvite(
      key: Uint8Array,
      opts?: {
        discoveryKey?: Uint8Array;
        expires?: number;
        seed?: Uint8Array;
        sensitive?: boolean;
        data?: Uint8Array;
        testInvitation?: boolean;
      }
    ): {
      id: Uint8Array;
      invite: Uint8Array;
      seed: Uint8Array;
      publicKey: Uint8Array;
      additional: {
        data: Uint8Array;
        signature: Uint8Array;
      } | null;
      discoveryKey: Uint8Array;
      expires: number;
      sensitive: boolean;
      testInvitation: boolean;
    };

    addCandidate(options: {
      invite: Uint8Array;
      userData: Uint8Array;
      onadd: (result: {
        key: Uint8Array;
        encryptionKey: Uint8Array;
      }) => void | Promise<void>;
    }): Candidate;

    addMember(options: {
      announce?: boolean = true;
      discoveryKey: Uint8Array;
      onadd: (candidate: Candidate) => void | Promise<void>;
    }): Member;
  }

  interface Candidate extends ReadyResource {
    refresh(): Promise<void>;
  }

  interface Member extends ReadyResource {
    refresh(): Promise<void>;
  }
}
