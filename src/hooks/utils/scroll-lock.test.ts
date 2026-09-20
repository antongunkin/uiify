import { describe, expect, it } from "vitest";
import { lockScroll, unlockScroll } from "./scroll-lock.js";

const root = document.documentElement;

describe("scroll-lock", () => {
  it("hides overflow and reserves the scrollbar gutter", () => {
    root.style.overflow = "auto";
    root.style.scrollbarGutter = "";
    lockScroll(root);
    expect(root.style.overflow).toBe("hidden");
    expect(root.style.scrollbarGutter).toBe("stable");
    unlockScroll(root);
    expect(root.style.overflow).toBe("auto");
    expect(root.style.scrollbarGutter).toBe("");
  });

  it("keeps scroll locked until the last nested lock is released", () => {
    root.style.overflow = "auto";
    lockScroll(root);
    lockScroll(root);
    unlockScroll(root);
    expect(root.style.overflow).toBe("hidden");
    unlockScroll(root);
    expect(root.style.overflow).toBe("auto");
  });
});
