import type { ReactNode } from "react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "./components/test-utils/ssr.js";
import { Accordion } from "./components/accordion/Accordion.js";
import { AlertModal } from "./components/alert-modal/AlertModal.js";
import { Collapsible } from "./components/collapsible/Collapsible.js";
import { DrawerPanel } from "./components/drawer/DrawerNative.js";

/**
 * Characterization of the default DOM (no consumer overrides) of components migrated to
 * "consumer props win". Elements and attributes in document order, attributes sorted so source
 * order cannot matter. Written before each migration batch and unchanged by it.
 */
function outline(node: ReactNode): string[] {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(node);
  return [...host.querySelectorAll("*")].map((element) => {
    const attributes = [...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort();
    return `${element.localName} ${attributes.join(" ")}`.trim();
  });
}

const accordionItems = [
  { value: "a", label: "A", panel: "Panel A" },
  { value: "b", label: "B", panel: "Panel B", disabled: true },
];

it("keeps the default DOM of migrated components", () => {
  expect({
    accordionSingle: outline(<Accordion defaultValue="a" id="faq" items={accordionItems} />),
    accordionMultiple: outline(
      <Accordion defaultValue={["a", "b"]} id="faq" items={accordionItems} type="multiple" />,
    ),
    collapsible: outline(<Collapsible content="Body" defaultOpen id="filters" label="Filters" />),
    collapsibleDisabled: outline(<Collapsible content="Body" disabled id="f" label="Filters" />),
    alertModal: outline(
      <AlertModal description="Cannot be undone." id="del" title="Delete" trigger="Delete">
        Body
      </AlertModal>,
    ),
    drawerPanel: outline(
      <DrawerPanel footer="Actions" id="d" size="lg" title="Settings" trigger="Open">
        Body
      </DrawerPanel>,
    ),
  }).toMatchSnapshot();
});
