import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it("forwards root, repeated part and append slot props to their concrete elements", () => {
    const rootRef = createRef<HTMLDivElement>();
    const commonInputRef = createRef<HTMLInputElement>();
    const itemInputRef = createRef<HTMLInputElement>();
    const view = render(
      <Tabs
        data-testid="tabs-root"
        id="settings"
        ref={rootRef}
        items={[
          { value: "overview", label: "Overview", panel: <>Overview panel</> },
          { value: "settings", label: "Settings", panel: <>Settings panel</> },
        ]}
        slotProps={{
          item: {
            className: "item",
            byItemValue: { settings: { "data-testid": "settings-item" } },
          },
          input: {
            ref: commonInputRef,
            byItemValue: {
              overview: { "data-testid": "overview-control", ref: itemInputRef },
            },
          },
          trigger: { className: "trigger" },
          panel: { className: "panel" },
          append: { className: "append", "data-testid": "append-slot" },
        }}
        append={<button type="button">Add tab</button>}
        style={{ color: "red" }}
      />,
    );

    expect(screen.getByTestId("tabs-root").getAttribute("style")).toContain("color: red");
    expect(screen.getByTestId("settings-item").className).toContain("item");
    expect(screen.getByTestId("overview-control").tagName).toBe("INPUT");
    expect(screen.getByText("Overview").className).toContain("trigger");
    expect(screen.getByText("Overview").getAttribute("data-part")).toBe("trigger");
    expect(screen.getByText("Overview panel").closest("[data-part='panel']")?.className).toContain(
      "panel",
    );
    expect(screen.getByTestId("append-slot").className).toContain("append");
    expect(rootRef.current).toBe(screen.getByTestId("tabs-root"));
    const controls = screen.getAllByRole("radio", { hidden: true });
    expect(commonInputRef.current).toBe(controls[1]);
    expect(itemInputRef.current).toBe(screen.getByTestId("overview-control"));
    view.unmount();
    expect(rootRef.current).toBeNull();
    expect(commonInputRef.current).toBeNull();
    expect(itemInputRef.current).toBeNull();
  });

  it("runs common and per-item slot event handlers in order", () => {
    const calls: string[] = [];
    render(
      <Tabs
        id="settings"
        items={[{ value: "overview", label: "Overview" }]}
        slotProps={{
          input: {
            onChange: () => calls.push("common"),
            byItemValue: { overview: { onChange: () => calls.push("item") } },
          },
        }}
      />,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Overview" }));
    expect(calls).toEqual(["common", "item"]);
  });

  it("keeps per-item classes, refs, and events attached by value after reordering", () => {
    const overviewRef = createRef<HTMLInputElement>();
    const settingsRef = createRef<HTMLInputElement>();
    const calls: string[] = [];
    const slotProps = {
      input: {
        byItemValue: {
          overview: {
            className: "overview-input",
            ref: overviewRef,
            onChange: () => calls.push("overview"),
            "data-testid": "overview-input",
          },
          settings: {
            className: "settings-input",
            ref: settingsRef,
            onChange: () => calls.push("settings"),
            "data-testid": "settings-input",
          },
        },
      },
    };
    const items = [
      { value: "overview", label: "Overview" },
      { value: "settings", label: "Settings" },
    ];
    const view = render(<Tabs id="account" items={items} slotProps={slotProps} />);

    expect(screen.getByTestId("overview-input").className).toContain("overview-input");
    expect(screen.getByTestId("settings-input").className).toContain("settings-input");
    expect(overviewRef.current).toBe(screen.getByTestId("overview-input"));
    expect(settingsRef.current).toBe(screen.getByTestId("settings-input"));
    fireEvent.click(screen.getByTestId("settings-input"));
    expect(calls).toEqual(["settings"]);

    view.rerender(<Tabs id="account" items={[...items].reverse()} slotProps={slotProps} />);

    expect(screen.getByTestId("overview-input").className).toContain("overview-input");
    expect(screen.getByTestId("settings-input").className).toContain("settings-input");
    expect(overviewRef.current).toBe(screen.getByTestId("overview-input"));
    expect(settingsRef.current).toBe(screen.getByTestId("settings-input"));
  });
});
