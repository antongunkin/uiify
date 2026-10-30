import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Toast as LiveToast } from "./Toast.js";
import { Toast } from "./ToastElements.js";
function outline(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return [...host.querySelectorAll("*")].map((element) =>
    `${element.localName} ${[...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort()
      .join(" ")}`.trim(),
  );
}

const toast = {
  id: "saved",
  duration: 0,
  priority: "polite",
  title: "Saved",
  description: "Profile saved",
  action: { label: "Undo", onClick: () => {} },
} as const;
it("preserves default toast DOM", () => {
  expect({
    shell: outline(
      renderToStaticMarkup(
        <Toast.Viewport>
          <Toast.Root toast={toast} />
        </Toast.Viewport>,
      ),
    ),
    client: outline(
      renderToStaticMarkup(
        <LiveToast.Provider>
          <LiveToast.Root toast={toast} />
          <LiveToast.Viewport />
        </LiveToast.Provider>,
      ),
    ),
  }).toMatchSnapshot();
});

it("lets toast native props and slots override defaults", () => {
  render(
    <Toast.Viewport aria-label={undefined} data-part="tray" data-testid="viewport">
      <Toast.Root
        toast={toast}
        role="log"
        data-part="notice"
        aria-label={undefined}
        data-testid="toast"
        slotProps={{
          title: { "data-part": "heading" },
          action: { type: "submit" },
          close: { "aria-label": "Dismiss", type: "reset" },
        }}
      />
    </Toast.Viewport>,
  );
  expect(screen.getByTestId("viewport").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("toast").getAttribute("role")).toBe("log");
  expect(screen.getByText("Saved").getAttribute("data-part")).toBe("heading");
  expect(screen.getByRole("button", { name: "Dismiss" }).getAttribute("type")).toBe("reset");
  expect(screen.getByRole("button", { name: "Undo" }).getAttribute("type")).toBe("submit");
});

it("lets live regions replace announcement semantics", () => {
  render(
    <LiveToast.Provider
      slotProps={{
        politeLiveRegion: { "aria-live": undefined, "aria-atomic": false, "data-testid": "polite" },
      }}
    />,
  );
  expect(screen.getByTestId("polite").hasAttribute("aria-live")).toBe(false);
  expect(screen.getByTestId("polite").getAttribute("aria-atomic")).toBe("false");
});

it("lets live toast native props override card semantics", () => {
  render(
    <LiveToast.Provider>
      <LiveToast.Root
        toast={toast}
        aria-label={undefined}
        data-state="custom"
        data-testid="live-card"
        slotProps={{ close: { "aria-label": "Dismiss live", type: "reset" } }}
      />
    </LiveToast.Provider>,
  );
  expect(screen.getByTestId("live-card").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("live-card").getAttribute("data-state")).toBe("custom");
  expect(screen.getByRole("button", { name: "Dismiss live" }).getAttribute("type")).toBe("reset");
});
