declare module "blind-pairing" {
  export default class BlindPairing extends ReadyResource {
    constructor(swarm: any);

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
