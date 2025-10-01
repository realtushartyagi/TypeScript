/* =======================================================
   Type Utilities (Mapped, Conditional, Template Literal)
   ======================================================= */

// Extract the resolved type from a Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Make all properties readonly except a few keys
type PartiallyMutable<T, K extends keyof T> =
  { readonly [P in Exclude<keyof T, K>]: T[P] } &
  { -readonly [P in Extract<keyof T, K>]: T[P] };

// Build route strings like "/users/123/posts/456"
type ID = string | number;
type Route<Path extends string, IdName extends string = 'id'> =
  `/${Path}/${IdName}` | `/${Path}`;

// Deep readonly using recursive mapped types (simple)
type DeepReadonly<T> = T extends Function ? T : {
  readonly [K in keyof T]: DeepReadonly<T[K]>;
};

/* =======================================================
   Branded / Opaque types & Type Guards
   ======================================================= */

type Brand<K, T> = K & { __brand: T };

type UserId = Brand<string, 'UserId'>;
const UserId = (s: string): UserId => s as UserId;

function isUserId(x: unknown): x is UserId {
  return typeof x === 'string' && x.length > 0;
}

/* =======================================================
   Nominal / Discriminated Unions & Type Narrowing
   ======================================================= */

type Success<T> = { ok: true; value: T };
type Failure = { ok: false; error: string };
type Result<T> = Success<T> | Failure;

function succeed<T>(value: T): Success<T> { return { ok: true, value }; }
function fail(msg: string): Failure { return { ok: false, error: msg }; }

/* =======================================================
   Functional Utilities (typed)
   ======================================================= */

export const curry =
  <T extends any[], R>(fn: (...args: T) => R) =>
  (...args: Partial<T>) =>
    args.length >= (fn.length) ? (fn as any)(...args as T) : (...more: any[]) => (curry(fn) as any)(...args.concat(more));

export const compose =
  <A, B, C>(f: (b: B) => C, g: (a: A) => B) =>
  (a: A) => f(g(a));

export const memoize = <A extends any[], R>(fn: (...args: A) => R, keyFn: (...args: A) => string = (...a) => JSON.stringify(a)) => {
  const cache = new Map<string, R>();
  return (...args: A) => {
    const k = keyFn(...args);
    if (cache.has(k)) return cache.get(k)!;
    const v = fn(...args);
    cache.set(k, v);
    return v;
  };
};
