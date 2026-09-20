import type { Story } from "@ladle/react";
import { useState } from "react";
import { Header, Header as HeaderClient, useHeaderScrollState } from "./Header.js";

const demoStyles = `
  .header-demo {
    font-family: system-ui, sans-serif;
    color: #111;
  }
  .header-demo__shell {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
  }
  .header-demo__bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
  }
  .header-demo__brand {
    font-weight: 700;
    text-decoration: none;
    color: inherit;
  }
  .header-demo__nav {
    display: none;
    gap: 12px;
    margin-left: auto;
  }
  .header-demo__nav a {
    color: #374151;
    text-decoration: none;
  }
  .header-demo__cta {
    display: none;
    margin-left: 8px;
    padding: 8px 14px;
    border-radius: 999px;
    border: none;
    background: #111827;
    color: #fff;
    cursor: pointer;
  }
  .header-demo__toggle {
    margin-left: auto;
    border: 1px solid #d1d5db;
    background: #fff;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
  }
  .header-demo__utility {
    display: none;
    gap: 8px;
    margin-left: auto;
  }
  .header-demo__utility button {
    border: 1px solid #d1d5db;
    background: #fff;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
  }
  .header-demo__promo {
    background: #111827;
    color: #fff;
    text-align: center;
    padding: 8px 12px;
    font-size: 13px;
  }
  .header-demo__content {
    padding: 24px 16px 120vh;
    color: #4b5563;
    line-height: 1.6;
  }
  .header-demo [data-root][data-placement="sticky"],
  .header-demo [data-root][data-placement="fixed"] {
    position: sticky;
    top: 0;
    z-index: 20;
    background: #fff;
  }
  .header-demo [data-root][data-scrolled] {
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  }
  .header-demo [data-root][data-hidden] {
    transform: translateY(-110%);
    transition: transform 180ms ease;
  }
  .header-demo [data-root][data-mobile-mode="collapse"] nav[data-open] {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 16px 16px;
    border-top: 1px solid #e5e7eb;
  }
  .header-demo dialog nav {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    min-width: min(320px, 90vw);
  }
  .header-demo dialog[data-side="bottom"] nav {
    min-width: 100%;
  }
  .header-demo dialog[data-mobile-mode="fullscreen"] nav,
  .header-demo [data-mobile-mode="fullscreen"] nav {
    min-height: 100vh;
    justify-content: center;
    font-size: 24px;
  }
  @media (min-width: 768px) {
    .header-demo__nav,
    .header-demo__cta,
    .header-demo__utility {
      display: flex;
      align-items: center;
    }
    .header-demo__toggle {
      display: none;
    }
  }
`;

function DemoStyles() {
  return <style>{demoStyles}</style>;
}
DemoStyles.displayName = "DemoStyles";

function MarketingHeaderDemo() {
  return (
    <div className="header-demo">
      <DemoStyles />
      <div className="header-demo__shell">
        <Header.Root data-root mobileMode="drawer" placement="sticky">
          <header className="header-demo__bar">
            <a className="header-demo__brand" href="/">
              Acme
            </a>
            <nav className="header-demo__nav" aria-label="Main">
              <a href="/docs">Docs</a>
              <a href="/pricing">Pricing</a>
              <a href="/blog">Blog</a>
            </nav>
            <button type="button" className="header-demo__cta">
              Get started
            </button>
            <Header.Toggle className="header-demo__toggle" />
          </header>
          <Header.MobileNav>
            <a href="/docs">Docs</a>
            <a href="/pricing">Pricing</a>
            <a href="/blog">Blog</a>
            <button type="button">Get started</button>
          </Header.MobileNav>
        </Header.Root>
        <div className="header-demo__content">
          Marketing header with desktop links, CTA, and a drawer menu on small screens.
        </div>
      </div>
    </div>
  );
}
MarketingHeaderDemo.displayName = "MarketingHeaderDemo";

function AppHeaderDemo() {
  const { scrolled } = useHeaderScrollState({ behavior: "elevate-on-scroll", threshold: 8 });
  return (
    <div className="header-demo">
      <DemoStyles />
      <div className="header-demo__shell">
        <Header.Root
          data-root
          mobileMode="drawer"
          placement="sticky"
          behavior="elevate-on-scroll"
          scrolled={scrolled}
        >
          <header className="header-demo__bar">
            <a className="header-demo__brand" href="/">
              Workspace
            </a>
            <div className="header-demo__utility">
              <button type="button">Search</button>
              <button type="button">Help</button>
              <button type="button">Account</button>
            </div>
            <Header.Toggle className="header-demo__toggle" />
          </header>
          <Header.MobileNav>
            <button type="button">Search</button>
            <button type="button">Help</button>
            <button type="button">Account</button>
          </Header.MobileNav>
        </Header.Root>
        <div className="header-demo__content">
          App header with utility actions and sticky elevation after scroll.
        </div>
      </div>
    </div>
  );
}
AppHeaderDemo.displayName = "AppHeaderDemo";

function DocsHeaderDemo() {
  return (
    <div className="header-demo">
      <DemoStyles />
      <div className="header-demo__shell">
        <Header.Root data-root mobileMode="collapse" placement="sticky">
          <header className="header-demo__bar">
            <a className="header-demo__brand" href="/">
              UI
            </a>
            <nav className="header-demo__nav" aria-label="Main">
              <a href="/components">Components</a>
              <a href="/hooks">Hooks</a>
              <a href="/styles">Styles</a>
            </nav>
            <div className="header-demo__utility">
              <button type="button">GitHub</button>
            </div>
            <Header.Toggle className="header-demo__toggle" />
          </header>
          <Header.MobileNav aria-label="Mobile">
            <a href="/components">Components</a>
            <a href="/hooks">Hooks</a>
            <a href="/styles">Styles</a>
            <button type="button">GitHub</button>
          </Header.MobileNav>
        </Header.Root>
        <div className="header-demo__content">Docs header with inline collapse on mobile.</div>
      </div>
    </div>
  );
}
DocsHeaderDemo.displayName = "DocsHeaderDemo";

function CommerceHeaderDemo() {
  return (
    <div className="header-demo">
      <DemoStyles />
      <div className="header-demo__shell">
        <div className="header-demo__promo">Free shipping over $50 this week</div>
        <Header.Root data-root mobileMode="sheet" placement="sticky">
          <header className="header-demo__bar">
            <a className="header-demo__brand" href="/">
              Shop
            </a>
            <nav className="header-demo__nav" aria-label="Categories">
              <a href="/new">New</a>
              <a href="/sale">Sale</a>
              <a href="/accessories">Accessories</a>
            </nav>
            <div className="header-demo__utility">
              <button type="button">Cart (2)</button>
            </div>
            <Header.Toggle className="header-demo__toggle" />
          </header>
          <Header.MobileNav aria-label="Mobile categories">
            <a href="/new">New</a>
            <a href="/sale">Sale</a>
            <a href="/accessories">Accessories</a>
            <button type="button">Cart (2)</button>
          </Header.MobileNav>
        </Header.Root>
        <div className="header-demo__content">
          Commerce header with promo strip and bottom-sheet mobile menu.
        </div>
      </div>
    </div>
  );
}
CommerceHeaderDemo.displayName = "CommerceHeaderDemo";

function FullscreenHeaderDemo() {
  return (
    <div className="header-demo">
      <DemoStyles />
      <div className="header-demo__shell">
        <Header.Root data-root mobileMode="fullscreen" placement="sticky">
          <header className="header-demo__bar">
            <a className="header-demo__brand" href="/">
              Studio
            </a>
            <Header.Toggle className="header-demo__toggle" />
          </header>
          <Header.MobileNav data-mobile-mode="fullscreen" aria-label="Mobile">
            <a href="/work">Work</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <Header.Close>Close</Header.Close>
          </Header.MobileNav>
        </Header.Root>
        <div className="header-demo__content">Fullscreen mobile takeover variant.</div>
      </div>
    </div>
  );
}
FullscreenHeaderDemo.displayName = "FullscreenHeaderDemo";

function ScrollBehaviorDemo() {
  const { scrolled } = useHeaderScrollState({ behavior: "solid-on-scroll", threshold: 1 });
  return (
    <div className="header-demo">
      <DemoStyles />
      <div className="header-demo__shell">
        <Header.Root
          data-root
          placement="sticky"
          behavior="solid-on-scroll"
          scrolled={scrolled}
          mobileMode="none"
        >
          <header className="header-demo__bar">
            <a className="header-demo__brand" href="/">
              Scroll
            </a>
            <nav className="header-demo__nav" aria-label="Main">
              <a href="/one">One</a>
              <a href="/two">Two</a>
            </nav>
          </header>
        </Header.Root>
        <div className="header-demo__content">
          Scroll to see the sticky header become elevated/solid via IntersectionObserver.
        </div>
      </div>
    </div>
  );
}
ScrollBehaviorDemo.displayName = "ScrollBehaviorDemo";

function HideOnScrollDemo() {
  const { hidden, scrolled } = useHeaderScrollState({
    behavior: "hide-on-scroll-down",
    threshold: 24,
  });
  return (
    <div className="header-demo">
      <DemoStyles />
      <div className="header-demo__shell">
        <Header.Root
          data-root
          placement="sticky"
          behavior="hide-on-scroll-down"
          hidden={hidden}
          scrolled={scrolled}
          mobileMode="none"
        >
          <header className="header-demo__bar">
            <a className="header-demo__brand" href="/">
              Hide
            </a>
            <nav className="header-demo__nav" aria-label="Main">
              <a href="/alpha">Alpha</a>
              <a href="/beta">Beta</a>
            </nav>
          </header>
        </Header.Root>
        <div className="header-demo__content">
          Scroll down to hide the header; scroll up to reveal it again.
        </div>
      </div>
    </div>
  );
}
HideOnScrollDemo.displayName = "HideOnScrollDemo";

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="header-demo">
      <DemoStyles />
      <HeaderClient.Root mobileMode="drawer" open={open} onOpenChange={setOpen}>
        <header className="header-demo__bar">
          <span className="header-demo__brand">Controlled</span>
          <HeaderClient.Toggle className="header-demo__toggle" />
        </header>
        <HeaderClient.MobileNav>
          <a href="/one">One</a>
          <HeaderClient.Close>Close</HeaderClient.Close>
        </HeaderClient.MobileNav>
      </HeaderClient.Root>
    </div>
  );
}
ControlledDemo.displayName = "ControlledDemo";

export const Marketing: Story = () => <MarketingHeaderDemo />;
Marketing.displayName = "Marketing";
export const App: Story = () => <AppHeaderDemo />;
App.displayName = "App";
export const Docs: Story = () => <DocsHeaderDemo />;
Docs.displayName = "Docs";
export const Commerce: Story = () => <CommerceHeaderDemo />;
Commerce.displayName = "Commerce";
export const Fullscreen: Story = () => <FullscreenHeaderDemo />;
Fullscreen.displayName = "Fullscreen";
export const ScrollBehavior: Story = () => <ScrollBehaviorDemo />;
ScrollBehavior.displayName = "ScrollBehavior";
export const HideOnScroll: Story = () => <HideOnScrollDemo />;
HideOnScroll.displayName = "HideOnScroll";
export const Controlled: Story = () => <ControlledDemo />;
Controlled.displayName = "Controlled";
