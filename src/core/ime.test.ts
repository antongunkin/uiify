import { describe, expect, it } from "vitest";
import { isComposingKeyEvent } from "./ime.js";

describe("isComposingKeyEvent", () => {
  it("is true for an own isComposing flag", () => {
    expect(isComposingKeyEvent({ isComposing: true })).toBe(true);
  });

  it("is true for keyCode 229 (Safari fires keydown after compositionend)", () => {
    expect(isComposingKeyEvent({ keyCode: 229 })).toBe(true);
  });

  it("reads isComposing and keyCode from a React synthetic event's nativeEvent", () => {
    expect(isComposingKeyEvent({ nativeEvent: { isComposing: true } })).toBe(true);
    expect(isComposingKeyEvent({ nativeEvent: { keyCode: 229 } })).toBe(true);
  });

  it("is false for an ordinary key", () => {
    expect(isComposingKeyEvent({ keyCode: 13 })).toBe(false);
    expect(isComposingKeyEvent({ isComposing: false, keyCode: 13 })).toBe(false);
    expect(isComposingKeyEvent({})).toBe(false);
  });
});
