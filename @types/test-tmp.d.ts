declare module "test-tmp" {
  import test from "brittle";

  interface TestTmpOptions {
    dir?: string;
    name?: string;
    order?: number;
    force?: boolean;
  }

  function tmp(t: typeof test, options: TestTmpOptions): Promise<void>;

  export = tmp;
}
