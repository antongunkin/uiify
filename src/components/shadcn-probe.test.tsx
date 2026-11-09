import { expect, it } from "vitest";
import { renderToStaticMarkup } from "./test-utils/ssr.js";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb/index.js";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer/index.js";
import {
  Drawer as ClientDrawer,
  DrawerClose as ClientDrawerClose,
  DrawerContent as ClientDrawerContent,
  DrawerDescription as ClientDrawerDescription,
  DrawerFooter as ClientDrawerFooter,
  DrawerHeader as ClientDrawerHeader,
  DrawerTitle as ClientDrawerTitle,
  DrawerTrigger as ClientDrawerTrigger,
} from "./drawer/client.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table/index.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip/index.js";

// Literal shadcn/ui snippets (names and props as an agent writes them from memory) compile and
// render against UIify (M3 P6). The only addition is the Tier 0 Drawer's id/target pairing.

it("a shadcn Table snippet needs no id and no Root", () => {
  const html = renderToStaticMarkup(
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell>Paid</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(html).toContain('class="uiify-table-head"');
});

it("a shadcn Tooltip snippet uses Tooltip as its root", () => {
  const html = renderToStaticMarkup(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent>Add to library</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
  expect(html).toContain("Add to library");
});

it("a shadcn Breadcrumb snippet renders BreadcrumbPage for the current page", () => {
  const html = renderToStaticMarkup(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>,
  );
  expect(html).toContain('aria-current="page"');
});

it("a shadcn Drawer snippet compiles with the client Drawer as written", () => {
  const html = renderToStaticMarkup(
    <ClientDrawer>
      <ClientDrawerTrigger>Open</ClientDrawerTrigger>
      <ClientDrawerContent>
        <ClientDrawerHeader>
          <ClientDrawerTitle>Are you absolutely sure?</ClientDrawerTitle>
          <ClientDrawerDescription>This action cannot be undone.</ClientDrawerDescription>
        </ClientDrawerHeader>
        <ClientDrawerFooter>
          <ClientDrawerClose>Cancel</ClientDrawerClose>
        </ClientDrawerFooter>
      </ClientDrawerContent>
    </ClientDrawer>,
  );
  expect(html).toContain("Open");
});

it("the Tier 0 Drawer pairs trigger and content by id/target, as Dialog does", () => {
  const html = renderToStaticMarkup(
    <>
      <DrawerTrigger target="settings">Open</DrawerTrigger>
      <DrawerContent id="settings">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Changes save automatically.</DrawerDescription>
          <DrawerClose target="settings">Close</DrawerClose>
        </DrawerHeader>
        <DrawerFooter>Done</DrawerFooter>
      </DrawerContent>
      <Drawer id="all-in-one" trigger="Open" title="Settings" />
    </>,
  );
  expect(html).toContain('commandfor="settings"');
});
