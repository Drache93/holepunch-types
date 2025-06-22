declare module "b4a" {
  export function from(input: string | Uint8Array | ArrayBuffer): Uint8Array;
  export function alloc(size: number): Uint8Array;
  export function allocUnsafe(size: number): Uint8Array;
  export function allocUnsafeSlow(size: number): Uint8Array;
  export function isBuffer(value: any): boolean;
  export function toString(
    buffer: Uint8Array,
    encoding?: string,
    start?: number,
    end?: number
  ): string;
  export function toArrayBuffer(buffer: Uint8Array): ArrayBuffer;
  export function equals(a: Uint8Array, b: Uint8Array): boolean;
  export function compare(a: Uint8Array, b: Uint8Array): number;
  export function concat(
    buffers: Uint8Array[],
    totalLength?: number
  ): Uint8Array;
  export function copy(
    source: Uint8Array,
    target: Uint8Array,
    targetStart?: number,
    sourceStart?: number,
    sourceEnd?: number
  ): number;
  export function fill(
    buffer: Uint8Array,
    value: number | string | Uint8Array,
    start?: number,
    end?: number
  ): Uint8Array;
  export function indexOf(
    buffer: Uint8Array,
    value: number | string | Uint8Array,
    byteOffset?: number,
    encoding?: string
  ): number;
  export function lastIndexOf(
    buffer: Uint8Array,
    value: number | string | Uint8Array,
    byteOffset?: number,
    encoding?: string
  ): number;
  export function swap16(buffer: Uint8Array): Uint8Array;
  export function swap32(buffer: Uint8Array): Uint8Array;
  export function swap64(buffer: Uint8Array): Uint8Array;
  export function slice(
    buffer: Uint8Array,
    start?: number,
    end?: number
  ): Uint8Array;
  export function subarray(
    buffer: Uint8Array,
    start?: number,
    end?: number
  ): Uint8Array;
}
