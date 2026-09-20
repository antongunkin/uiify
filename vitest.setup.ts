// Node 20.12+ ships its own experimental `localStorage`/`sessionStorage` globals, backed by
// `--localstorage-file` and non-functional without it. Vitest's jsdom bridge only copies a
// jsdom window property onto the test global when that key isn't already present on the real
// Node global — so on these Node versions it skips `localStorage`/`sessionStorage` entirely,
// leaving `window.localStorage` resolving to Node's broken stub instead of jsdom's real,
// self-contained Storage. Bridge the two explicitly so `window.localStorage` is jsdom's.
const jsdomWindow = (globalThis as { jsdom?: { window: typeof globalThis } }).jsdom?.window;
if (jsdomWindow) {
  for (const key of ["localStorage", "sessionStorage"] as const) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      get: () => jsdomWindow[key],
    });
  }
}
