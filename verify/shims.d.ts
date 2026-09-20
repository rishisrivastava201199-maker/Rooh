/* ══════════════════════════════════════════════════════════════
   TYPE-CHECK SHIMS — verification only, never shipped

   npm is blocked in the environment this project was written in, so
   next, react and their @types could not be installed. These are
   minimal stand-ins that let `tsc --noEmit` check OUR code: import
   paths, exported names, data shapes, function signatures, prop
   spelling.

   They are deliberately loose about React internals. They prove the
   source is self-consistent; they do not replace running
   `npm run typecheck` once the real packages are installed, which
   SETUP.md tells you to do first.
   ══════════════════════════════════════════════════════════════ */

declare namespace JSX {
  interface Element {}
  interface ElementClass {}
  interface ElementAttributesProperty {}
  interface ElementChildrenAttribute { children: {} }
  interface IntrinsicAttributes { key?: string | number | null }
  interface IntrinsicElements { [name: string]: any }
}

declare module "*.css";
declare module "*.svg";

declare module "react" {
  export type ReactNode = any;
  export interface SyntheticEvent { preventDefault(): void; stopPropagation(): void; target: any; currentTarget: any }
  export interface ChangeEvent<T = any> extends SyntheticEvent { target: T & { value: string; checked: boolean } }
  export interface FormEvent<T = any> extends SyntheticEvent {}
  export interface MouseEvent<T = any> extends SyntheticEvent {}
  export interface KeyboardEvent<T = any> extends SyntheticEvent { key: string; shiftKey: boolean }
  export type CSSProperties = Record<string, string | number | undefined>;
  export type Key = string | number;
  export interface MutableRefObject<T> { current: T }
  export type RefObject<T> = { current: T | null };
  export function createContext<T>(v: T): any;
  export function useContext<T>(c: any): T;
  export function useState<S>(init: S | (() => S)): [S, (v: S | ((p: S) => S)) => void];
  export function useEffect(fn: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(fn: () => T, deps?: unknown[]): T;
  export function useCallback<T>(fn: T, deps?: unknown[]): T;
  export function useRef<T>(v: T): MutableRefObject<T>;
  export function useRef<T>(v: null): RefObject<T>;
  export function useId(): string;
  export const Suspense: any;
  const React: any;
  export default React;
  export namespace React {}
}

declare namespace React {
  type ReactNode = any;
  type CSSProperties = Record<string, string | number | undefined>;
  interface SyntheticEvent { preventDefault(): void; stopPropagation(): void; target: any; currentTarget: any }
  interface ChangeEvent<T = any> extends SyntheticEvent { target: T & { value: string; checked: boolean } }
  interface FormEvent<T = any> extends SyntheticEvent {}
  interface KeyboardEvent<T = any> extends SyntheticEvent { key: string; shiftKey: boolean }
  interface FocusEvent<T = any> extends SyntheticEvent { target: T & { value: string } }
}

declare module "next" {
  export interface Metadata {
    title?: unknown;
    description?: string;
    metadataBase?: URL;
    alternates?: unknown;
    robots?: unknown;
    openGraph?: unknown;
    twitter?: unknown;
  }
  export interface Viewport {
    width?: string;
    initialScale?: number;
    viewportFit?: string;
    themeColor?: unknown;
  }
  export interface NextConfig { [k: string]: unknown }
  export namespace MetadataRoute {
    type Robots = {
      rules: { userAgent: string; allow?: string | string[]; disallow?: string | string[] }[];
      sitemap?: string;
      host?: string;
    };
    type Sitemap = {
      url: string;
      lastModified?: Date;
      changeFrequency?: string;
      priority?: number;
    }[];
  }
}

declare module "next/link" {
  const Link: any;
  export default Link;
}
declare module "next/navigation" {
  export function usePathname(): string | null;
  export function useRouter(): { push(href: string, o?: { scroll?: boolean }): void; refresh(): void };
  export function useSearchParams(): { get(k: string): string | null };
  export function notFound(): never;
  export function redirect(url: string): never;
}
declare module "next/headers" {
  export function cookies(): Promise<{
    get(name: string): { value: string } | undefined;
    set(name: string, value: string, opts?: Record<string, unknown>): void;
  }>;
  export function headers(): Promise<{ get(name: string): string | null }>;
}
declare module "next/server" {
  export class NextResponse {
    static json(body: unknown, init?: { status?: number; headers?: Record<string, string> }): NextResponse;
  }
  export type NextRequest = Request;
}
declare module "next/font/google" {
  interface FontResult { variable: string; className: string }
  export function Cormorant_Garamond(o: Record<string, unknown>): FontResult;
  export function Manrope(o: Record<string, unknown>): FontResult;
}
declare module "server-only" {}

declare module "zod" {
  export const z: any;
}

/* Node's globals — @types/node in the real project. */
declare const process: {
  env: Record<string, string | undefined>;
  cwd(): string;
};
declare const Buffer: {
  from(s: string | ArrayBuffer | Uint8Array, enc?: string): BufferLike;
};
type Buffer = BufferLike;
interface BufferLike {
  length: number;
  toString(enc?: string): string;
}
declare function structuredClone<T>(v: T): T;

declare module "node:crypto" {
  interface Hmac {
    update(s: string): Hmac;
    digest(enc?: string): BufferLike & string;
  }
  const crypto: {
    createHmac(alg: string, key: string): Hmac;
    randomBytes(n: number): BufferLike;
    randomInt(min: number, max: number): number;
    timingSafeEqual(a: BufferLike, b: BufferLike): boolean;
  };
  export default crypto;
}
declare module "node:fs" {
  const fs: {
    existsSync(p: string): boolean;
    readFileSync(p: string, enc: string): string;
    writeFileSync(p: string, data: string, enc?: string): void;
    mkdirSync(p: string, o?: { recursive?: boolean }): void;
  };
  export default fs;
}
declare module "node:path" {
  const path: { join(...parts: string[]): string };
  export default path;
}
