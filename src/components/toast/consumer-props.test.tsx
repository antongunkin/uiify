import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  Toast as LiveToast,
  ToastProvider as LiveToastProvider,
  ToastViewport as LiveToastViewport,
} from "./Toast.js";
import { Toast, ToastViewport } from "./ToastElements.js";
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
        <ToastViewport>
          <Toast toast={toast} />
        </ToastViewport>,
      ),
    ),
    client: outline(
      renderToStaticMarkup(
        <LiveToastProvider>
          <LiveToast toast={toast} />
          <LiveToastViewport />
        </LiveToastProvider>,
      ),
    ),
  }).toMatchSnapshot();
});

it("lets toast native props and slots override defaults", () => {
  render(
    <ToastViewport aria-label={undefined} data-part="tray" data-testid="viewport">
      <Toast
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
    </ToastViewport>,
  );
  expect(screen.getByTestId("viewport").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("toast").getAttribute("role")).toBe("log");
  expect(screen.getByText("Saved").getAttribute("data-part")).toBe("heading");
  expect(screen.getByRole("button", { name: "Dismiss" }).getAttribute("type")).toBe("reset");
  expect(screen.getByRole("button", { name: "Undo" }).getAttribute("type")).toBe("submit");
});

it("lets live regions replace announcement semantics", () => {
  render(
    <LiveToastProvider
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
    <LiveToastProvider>
      <LiveToast
        toast={toast}
        aria-label={undefined}
        data-state="custom"
        data-testid="live-card"
        slotProps={{ close: { "aria-label": "Dismiss live", type: "reset" } }}
      />
    </LiveToastProvider>,
  );
  expect(screen.getByTestId("live-card").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("live-card").getAttribute("data-state")).toBe("custom");
  expect(screen.getByRole("button", { name: "Dismiss live" }).getAttribute("type")).toBe("reset");
});
