declare module "test-tmp" {
  import test from "brittle";

  export interface TestTmpOptions {
    dir?: string;
    name?: string;
    order?: number=Infinity;
    force?: boolean;
  }

  async function tmp(t: typeof test, options: TestTmpOptions): Promise<void>;

  export = tmp;
}
