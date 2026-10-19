import { afterEach, describe, expect, it } from "vitest";
import { resolveDirection } from "./text-direction.js";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("resolveDirection", () => {
  it("reads an rtl ancestor", () => {
    document.body.innerHTML = `<div dir="rtl"><span id="a"></span></div>`;
    expect(resolveDirection(document.getElementById("a"))).toBe("rtl");
  });

  it("respects a nested ltr island", () => {
    document.body.innerHTML = `<div dir="rtl"><div dir="ltr"><span id="a"></span></div></div>`;
    expect(resolveDirection(document.getElementById("a"))).toBe("ltr");
  });

  it("resolves dir=auto from the first strong character", () => {
    document.body.innerHTML = `<div id="a" dir="auto">مرحبا</div>`;
    expect(resolveDirection(document.getElementById("a"))).toBe("rtl");
  });

  it("defaults to ltr without an element", () => {
    expect(resolveDirection(null)).toBe("ltr");
    expect(resolveDirection(undefined)).toBe("ltr");
  });

  it("lets an explicit override win", () => {
    document.body.innerHTML = `<div dir="rtl"><span id="a"></span></div>`;
    expect(resolveDirection(document.getElementById("a"), "ltr")).toBe("ltr");
  });
});
