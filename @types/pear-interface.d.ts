declare module "pear-interface" {
  import { Readable } from "streamx";
  import { Pipe } from "bare-pipe";

  export interface PearConfig {
    key: Buffer | null;
    alias: string | null;
    checkpoint: string | null;
    links: string[];
    dev: boolean;
    storage: string;
    name: string;
    main: string;
    args: string[];
    channel: string;
    applink: string;
    fragment: string | null;
    link: string;
    entrypoint: string;
    dir: string;
    pearDir: string;
    options: Record<string, any>;
    flags: Record<string, any>;
  }

  export interface PearIdentity {
    request(publicKey: Buffer): Promise<Buffer>;
    share(params: { publicKey: Buffer; attestation: Buffer }): Promise<void>;
    clear(): Promise<void>;
  }

  export interface PearWorker {
    run(link: string): Pipe;
    pipe(): Pipe | null;
  }

  export interface Pear {
    config: PearConfig;
    identity: PearIdentity;
    worker: PearWorker;
    message(message: string): Promise<void>;
    messages(
      handler: ((message: any) => void) | Record<string, any>,
      options?: (message: any) => void
    ): Readable;
    checkpoint(state: Record<string, any>): Promise<void>;
    versions(): Promise<{ app: string; platform: string }>;
    restart(options?: { platform?: boolean }): Promise<void>;
    reload(options?: { platform?: boolean }): Promise<void>;
    updates(handler: (update: any) => void): Readable;
    wakeups(handler: (wakeup: any) => void): Readable;
    teardown(fn: () => void): Promise<void>;
    exit(code?: number): never;
  }

  export interface GuiCtrl {
    send(event: string, ...args: any[]): void;
    restore(): Promise<boolean>;
    getMediaSourceId(): Promise<string>;
    dimensions(options?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      animate?: boolean;
      position?: string;
    }): Promise<void | { x: number; y: number; width: number; height: number }>;
    isVisible(): Promise<boolean>;
    isClosed(): Promise<boolean>;
  }

  export interface PearWindow extends GuiCtrl {
    open(options?: { show?: boolean; height?: number; width?: number }): void;
    close(): Promise<boolean>;
    show(): Promise<boolean>;
    hide(): Promise<boolean>;
    focus(options?: { steal?: boolean }): Promise<boolean>;
    blur(): Promise<boolean>;
    minimize(): Promise<boolean>;
    maximize(): Promise<boolean>;
    fullscreen(): Promise<boolean>;
    isMinimized(): Promise<boolean>;
    isMaximized(): Promise<boolean>;
    isFullscreen(): Promise<boolean>;
  }

  export interface PearView extends GuiCtrl {
    open(options?: { height?: number; width?: number }): void;
    close(): Promise<boolean>;
    show(): Promise<boolean>;
    hide(): Promise<boolean>;
  }

  export interface PearMediaStatus {
    microphone(): Promise<string>;
    camera(): Promise<string>;
    screen(): Promise<string>;
  }

  export interface PearMediaAccess {
    microphone(): Promise<boolean>;
    camera(): Promise<boolean>;
    screen(): Promise<boolean>;
  }

  export interface PearMedia {
    status: PearMediaStatus;
    access: PearMediaAccess;
    desktopSources(options?: Record<string, any>): Promise<any[]>;
  }

  export interface PearGUI extends Pear {
    media: PearMedia;
    PearWindow: new () => PearWindow;
    PearView: new () => PearView;
  }
}

declare global {
  var Pear: import("pear-interface").PearGUI;
}
