/* tslint:disable */
/* eslint-disable */
export function greet(): void;
export function grayscale(input: Uint8Array): Uint8Array;
export function invert(input: Uint8Array): Uint8Array;
export function diff_filter(current: Uint8Array, previous: Uint8Array): Uint8Array;
export function to_grayscale(rgba: Uint8Array): Uint8Array;
export function clean_noise(binary: Uint8Array, width: number, height: number): Uint8Array;
export function threshold(input: Uint8Array, thresh: number): Uint8Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly grayscale: (a: number, b: number) => [number, number];
  readonly invert: (a: number, b: number) => [number, number];
  readonly diff_filter: (a: number, b: number, c: number, d: number) => [number, number];
  readonly to_grayscale: (a: number, b: number) => [number, number];
  readonly clean_noise: (a: number, b: number, c: number, d: number) => [number, number];
  readonly threshold: (a: number, b: number, c: number) => [number, number];
  readonly greet: () => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
