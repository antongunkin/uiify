import { describe, expect, it } from "vitest";
import { getChoiceGroupName, getChoiceIds } from "./ids.js";

describe("choice-family ids", () => {
  it("builds deterministic ids for one item", () => {
    expect(getChoiceIds("settings", "overview")).toEqual({
      controlId: "settings-control-overview",
      labelId: "settings-label-overview",
      panelId: "settings-panel-overview",
    });
  });

  it("keeps single and multiple group names distinct", () => {
    expect(getChoiceGroupName("settings", "single")).toBe("settings");
    expect(getChoiceGroupName("settings", "multiple")).toBe("settings-multiple");
  });
});
