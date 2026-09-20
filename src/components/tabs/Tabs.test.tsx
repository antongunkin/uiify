import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tabs } from "./Tabs.js";

describe("Tabs", () => {
  it("renders one radio, one label, and one panel per item", () => {
    render(
      <Tabs
        id="settings"
        defaultValue="overview"
        items={[
          { value: "overview", label: "Overview", panel: <>Overview panel</> },
          { value: "settings", label: "Settings", panel: <>Settings panel</> },
        ]}
      />,
    );

    expect(screen.getAllByRole("radio", { hidden: true })).toHaveLength(2);
    expect(screen.getByLabelText("Overview")).toBeTruthy();
    expect(document.getElementById("settings-panel-overview")).toBeTruthy();
  });
});
