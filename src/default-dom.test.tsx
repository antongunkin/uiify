import type { ReactNode } from "react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "./components/test-utils/ssr.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/accordion/Accordion.js";
import { AlertDialog } from "./components/alert-dialog/AlertDialog.js";
import { Collapsible } from "./components/collapsible/Collapsible.js";
import { Drawer } from "./components/drawer/DrawerNative.js";

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

function accordion(name: string | undefined, open: readonly string[]) {
  return (
    <Accordion>
      {["a", "b"].map((value) => (
        <AccordionItem key={value} value={value} name={name} defaultOpen={open.includes(value)}>
          <AccordionTrigger disabled={value === "b"}>{value.toUpperCase()}</AccordionTrigger>
          <AccordionContent>Panel {value}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

it("keeps the default DOM of migrated components", () => {
  expect({
    accordionSingle: outline(accordion("faq", ["a"])),
    accordionMultiple: outline(accordion(undefined, ["a", "b"])),
    collapsible: outline(<Collapsible content="Body" defaultOpen id="filters" label="Filters" />),
    collapsibleDisabled: outline(<Collapsible content="Body" disabled id="f" label="Filters" />),
    alertModal: outline(
      <AlertDialog description="Cannot be undone." id="del" title="Delete" trigger="Delete">
        Body
      </AlertDialog>,
    ),
    drawerPanel: outline(
      <Drawer footer="Actions" id="d" size="lg" title="Settings" trigger="Open">
        Body
      </Drawer>,
    ),
  }).toMatchSnapshot();
});
