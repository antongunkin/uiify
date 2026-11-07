import { describe, expect, it } from "vitest";
import { choiceGroupName, choiceIds } from "./ids.js";

describe("elements/choice ids", () => {
  it("builds deterministic ids for one item", () => {
    expect(choiceIds("settings", "overview")).toEqual({
      controlId: "settings-control-overview",
      labelId: "settings-label-overview",
      panelId: "settings-panel-overview",
    });
  });

  it("keeps single and multiple group names distinct", () => {
    expect(choiceGroupName("settings", "single")).toBe("settings");
    expect(choiceGroupName("settings", "multiple")).toBe("settings-multiple");
  });
});
