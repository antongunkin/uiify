import type { ReactElement, ReactNode, Ref } from "react";
import { expect, it } from "vitest";
import { NativePopoverSurface, NativePopoverTrigger } from "./NativePopover.js";

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
    <NativePopoverTrigger key="default" target="help">
      Help
    </NativePopoverTrigger>,
    <NativePopoverTrigger key="button" as="button" target="help">
      Help
    </NativePopoverTrigger>,
    <NativePopoverTrigger key="custom" as={CustomButton} target="help">
      Help
    </NativePopoverTrigger>,
    <NativePopoverTrigger key="action" action="show" target="help">
      Help
    </NativePopoverTrigger>,
    // @ts-expect-error -- an anchor cannot invoke a popover.
    <NativePopoverTrigger key="anchor" as="a" target="help">
      Help
    </NativePopoverTrigger>,
    // @ts-expect-error -- target is required.
    <NativePopoverTrigger key="missing">Help</NativePopoverTrigger>,
    // @ts-expect-error -- action only accepts toggle/show/hide.
    <NativePopoverTrigger key="bad-action" action="explode" target="help">
      Help
    </NativePopoverTrigger>,
    <NativePopoverSurface key="popover" id="help" popover="manual">
      Text
    </NativePopoverSurface>,
  ];
  expect(elements).toHaveLength(8);
});

it("requires an id on the surface", () => {
  const surface = <NativePopoverSurface id="help">Text</NativePopoverSurface>;
  // @ts-expect-error -- id is the native relationship; it is required.
  const missingId = <NativePopoverSurface>Text</NativePopoverSurface>;
  expect([surface, missingId]).toHaveLength(2);
});
