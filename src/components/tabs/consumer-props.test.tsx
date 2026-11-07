import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./index.js";

it("lets Tabs native props replace the orientation marker and composes className and style", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <Tabs
      ref={ref}
      data-orientation="custom"
      className="custom"
      style={{ gap: 4 }}
      data-testid="tabs"
    />,
  );
  const root = screen.getByTestId("tabs");
  expect(ref.current).toBe(root);
  expect(root.getAttribute("data-orientation")).toBe("custom");
  expect(root.className).toBe("uiify-tabs custom");
  expect(root.style.gap).toBe("4px");
});

it("composes TabsList className, style and ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<TabsList ref={ref} className="custom" style={{ gap: 2 }} aria-label="Sections" />);
  expect(ref.current?.className).toBe("uiify-tabs-list custom");
  expect(ref.current?.style.gap).toBe("2px");
  expect(ref.current?.getAttribute("aria-label")).toBe("Sections");
});

it("sends TabsTrigger native props to the label and lets them replace data-disabled", () => {
  const ref = createRef<HTMLLabelElement>();
  const calls: string[] = [];
  render(
    <TabsTrigger
      ref={ref}
      name="account"
      value="profile"
      disabled
      data-disabled="custom"
      className="custom"
      style={{ color: "red" }}
      title="Profile tab"
      onClick={() => calls.push("click")}
    >
      Profile
    </TabsTrigger>,
  );
  const label = screen.getByText("Profile");
  expect(ref.current).toBe(label);
  expect(label.className).toBe("uiify-tabs-trigger custom");
  expect(label.style.color).toBe("red");
  expect(label.getAttribute("title")).toBe("Profile tab");
  expect(label.getAttribute("data-disabled")).toBe("custom");
  fireEvent.click(label);
  expect(calls).toEqual(["click"]);
});

it("lets TabsContent native props replace data-value and composes className", () => {
  render(
    <TabsContent
      value="profile"
      data-value="custom"
      className="custom"
      id="panel"
      data-testid="content"
    >
      Panel
    </TabsContent>,
  );
  const content = screen.getByTestId("content");
  expect(content.id).toBe("panel");
  expect(content.getAttribute("data-value")).toBe("custom");
  expect(content.className).toBe("uiify-tabs-content custom");
});
