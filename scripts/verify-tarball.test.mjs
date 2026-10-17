import assert from "node:assert/strict";
import test from "node:test";
import { assertNoOwnerMaterial, assertNoSecrets, assertPackFiles } from "./verify-tarball.mjs";

test("accepts the public tarball allowlist", () => {
  assert.doesNotThrow(() =>
    assertPackFiles([
      "README.md",
      "LICENSE",
      "package.json",
      "dist/index.js",
      "dist/index.d.ts",
      "agents/index.md",
      "agents/reference/components/button.md",
      "skills/uiify/SKILL.md",
      "skills/uiify/scripts/lint.mjs",
    ]),
  );
});

test("accepts only the three curated knowledge reference directories", () => {
  assert.doesNotThrow(() =>
    assertPackFiles([
      "skills/uiify/references/elements/button.md",
      "skills/uiify/references/laws/accessibility.md",
      "skills/uiify/references/compositions/hero-actions.md",
    ]),
  );
  for (const path of [
    "skills/uiify/references/other/x.md",
    "skills/uiify/references/elements/nested/button.md",
    "skills/uiify/references/nested/x.md",
    "skills/uiify/references/eval/results.json",
  ]) {
    assert.throws(() => assertPackFiles(["README.md", path, "dist/index.js"]), /unexpected/i);
  }
});

test("rejects owner calibration material inside the shipped skill", () => {
  for (const text of [
    "see /tmp/uiify-phase3/pair-01-A-desktop.png",
    "Owner reason: more space",
    "calibration_pair: pair-03",
    "why: more space",
    "decision: Selected A",
    "более просторно",
  ]) {
    assert.throws(
      () => assertNoOwnerMaterial([{ path: "skills/uiify/references/compositions/x.md", text }]),
      /owner calibration material/,
      text,
    );
  }
});

test("accepts a curated rule and ignores files outside the skill", () => {
  assert.doesNotThrow(() =>
    assertNoOwnerMaterial([
      {
        path: "skills/uiify/references/compositions/x.md",
        text: "Separate cards with a 24px gap.",
      },
      {
        path: "agents/index.md",
        text: "Owner reason is a phrase this check only guards inside skills/.",
      },
    ]),
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
