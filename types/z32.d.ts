declare module "z32" {
  export function decode(input: string): Uint8Array;
  export function encode(input: Uint8Array): string;
}
