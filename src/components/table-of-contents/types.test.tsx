import { describe, expect, it } from "vitest";
import { TableOfContents } from "./index.js";
function TypeCases() {
  // @ts-expect-error Trigger requires a surface target.
  const missingTarget = <TableOfContents.Trigger />;
  // @ts-expect-error Links remain native anchors with required href.
  const missingHref = <TableOfContents.Link />;
  // @ts-expect-error Indicators require the corresponding target ID.
  const missingValue = <TableOfContents.Indicator />;
  // @ts-expect-error HTML headings have six levels.
  const badLevel = <TableOfContents.Link href="#a" level={7} />;
  // @ts-expect-error Styling is static; callbacks are not class names.
  const badClass = <TableOfContents.Root className={() => "active"} />;
  // @ts-expect-error Controlled selection belongs to /client.
  const controlledNative = <TableOfContents.Root value="a" />;
  // @ts-expect-error Invokers must render a button.
  const anchorTrigger = <TableOfContents.Trigger target="a" as="a" />;
  return (
    <>
      {missingTarget}
      {missingHref}
      {missingValue}
      {badLevel}
      {badClass}
      {controlledNative}
      {anchorTrigger}
    </>
  );
}
describe("TableOfContents type contract", () => {
  it("retains compile-time invalid usage cases", () => {
    expect(TypeCases).toBeDefined();
  });
});

TypeCases.displayName = "TypeCases";
