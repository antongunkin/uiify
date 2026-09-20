import type { ReactElement, ReactNode, Ref } from "react";
import { expect, it } from "vitest";
import { PopoverSurface, PopoverTrigger } from "./Popover.js";

function CustomButton(props: {
  readonly children?: ReactNode;
  readonly onClick?: () => void;
  readonly ref?: Ref<HTMLButtonElement>;
}) {
  return <button {...props} type="button" />;
}
CustomButton.displayName = "CustomButton";

it("only accepts a native button or a button-forwarding component as `as`", () => {
  const elements: ReactElement[] = [
    <PopoverTrigger key="default" target="help">
      Help
    </PopoverTrigger>,
    <PopoverTrigger key="button" as="button" target="help">
      Help
    </PopoverTrigger>,
    <PopoverTrigger key="custom" as={CustomButton} target="help">
      Help
    </PopoverTrigger>,
    <PopoverTrigger key="action" action="show" target="help">
      Help
    </PopoverTrigger>,
    // @ts-expect-error -- an anchor cannot invoke a popover.
    <PopoverTrigger key="anchor" as="a" target="help">
      Help
    </PopoverTrigger>,
    // @ts-expect-error -- target is required.
    <PopoverTrigger key="missing">Help</PopoverTrigger>,
    // @ts-expect-error -- action only accepts toggle/show/hide.
    <PopoverTrigger key="bad-action" action="explode" target="help">
      Help
    </PopoverTrigger>,
    // @ts-expect-error -- the library owns the popover attribute.
    <PopoverSurface key="popover" id="help" popover="manual">
      Text
    </PopoverSurface>,
  ];
  expect(elements).toHaveLength(8);
});

it("requires an id on the surface", () => {
  const surface = <PopoverSurface id="help">Text</PopoverSurface>;
  // @ts-expect-error -- id is the native relationship; it is required.
  const missingId = <PopoverSurface>Text</PopoverSurface>;
  expect([surface, missingId]).toHaveLength(2);
});
