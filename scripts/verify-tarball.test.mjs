import assert from "node:assert/strict";
import test from "node:test";
import { assertNoSecrets, assertPackFiles } from "./verify-tarball.mjs";

test("accepts the public tarball allowlist", () => {
  assert.doesNotThrow(() =>
    assertPackFiles(["README.md", "LICENSE", "package.json", "dist/index.js", "dist/index.d.ts"]),
  );
});

test("rejects unexpected tarball files", () => {
  for (const path of [".env", "src/index.ts", ".github/workflows/ci.yml", "coverage/index.html"]) {
    assert.throws(() => assertPackFiles(["README.md", path, "dist/index.js"]), /unexpected/i);
  }
});

test("rejects credential-like content without echoing it", () => {
  assert.throws(
    () => assertNoSecrets([{ path: "dist/index.js", text: "npm_abcd1234" }]),
    /credential-like/i,
  );
});
