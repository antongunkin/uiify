import { expect, it } from "vitest";
import { Rating } from "../../rating/Rating.js";
import { RadioGroup } from "../../radio-group/RadioGroup.js";
import { SegmentedControl } from "../../segmented-control/SegmentedControl.js";
import { Tabs } from "../../tabs/Tabs.js";
import { ToggleGroup } from "../../toggle-group/ToggleGroup.js";
import { renderToStaticMarkup } from "../../test-utils/ssr.js";

/** Elements and attributes in document order; attributes sorted so source order cannot matter. */
function outline(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return [...host.querySelectorAll("*")].map((element) => {
    const attributes = [...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort();
    return `${element.localName} ${attributes.join(" ")}`.trim();
  });
}

const items = [
  { value: "a", label: "A", panel: "Panel A" },
  { value: "b", label: "B", panel: "Panel B", disabled: true },
];

it("keeps the default DOM of every Choice-based component", () => {
  const markup = {
    tabs: renderToStaticMarkup(
      <Tabs append={<span>more</span>} defaultValue="a" id="t" items={items} />,
    ),
    radio: renderToStaticMarkup(
      <RadioGroup aria-label="Plan" defaultValue="a" id="r" items={items} />,
    ),
    segmented: renderToStaticMarkup(
      <SegmentedControl aria-label="Range" defaultValue="a" id="s" items={items} />,
    ),
    toggle: renderToStaticMarkup(
      <ToggleGroup aria-label="Align" defaultValue="a" id="g" items={items} type="single" />,
    ),
    rating: renderToStaticMarkup(<Rating defaultValue={2} id="m" max={3} />),
  };
  expect(
    Object.fromEntries(Object.entries(markup).map(([k, v]) => [k, outline(v)])),
  ).toMatchSnapshot();
});
