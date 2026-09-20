import { describe, expect, it } from "vitest";
import { sanitizeReactId } from "./sanitize-react-id.js";

describe("sanitizeReactId", () => {
  it("removes colons from React useId output", () => {
    expect(sanitizeReactId(":r1:")).toBe("r1");
    expect(sanitizeReactId(":R0:")).toBe("R0");
  });

  it("returns ids without colons unchanged", () => {
    expect(sanitizeReactId("stable-id")).toBe("stable-id");
  });
});
