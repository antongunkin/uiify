import { render, screen } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { createPartContext } from "./create-part-context.js";

interface DemoValue {
  readonly label: string;
}

const [DemoProvider, useDemoContext] = createPartContext<DemoValue>("Demo");
const [, useProviderRootContext] = createPartContext<DemoValue>("Tooltip", "Provider");

function DemoPart(): ReactElement {
  const { label } = useDemoContext("Part");
  return <span>{label}</span>;
}
DemoPart.displayName = "DemoPart";

function ProviderPart(): ReactElement {
  const { label } = useProviderRootContext("Trigger");
  return <span>{label}</span>;
}
ProviderPart.displayName = "ProviderPart";

function Wrapper({ children }: { readonly children: ReactNode }): ReactElement {
  return <DemoProvider value={{ label: "from context" }}>{children}</DemoProvider>;
}
Wrapper.displayName = "Wrapper";

describe("createPartContext", () => {
  it("delivers the value to a part rendered under the provider", () => {
    render(
      <Wrapper>
        <DemoPart />
      </Wrapper>,
    );
    expect(screen.getByText("from context")).toBeTruthy();
  });

  it("throws a named error when a part renders outside the provider", () => {
    expect(() => render(<DemoPart />)).toThrow("Demo.Part must be used within Demo.Root");
  });

  it("names a custom root in the error message", () => {
    expect(() => render(<ProviderPart />)).toThrow(
      "Tooltip.Trigger must be used within Tooltip.Provider",
    );
  });

  it("gives each call its own independent context", () => {
    const [OtherProvider] = createPartContext<DemoValue>("Other");
    render(
      <OtherProvider value={{ label: "other" }}>
        <Wrapper>
          <DemoPart />
        </Wrapper>
      </OtherProvider>,
    );
    expect(screen.getByText("from context")).toBeTruthy();
  });
});
