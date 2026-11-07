import type { Story } from "@ladle/react";
import {
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@gunkin/uiify/components/dialog";
import { HeaderClient } from "@gunkin/uiify/components/header/client";
import { Header } from "./Header.js";

const styles = `
  .header-story {
    block-size: 24rem;
    overflow: auto;
    border: 1px solid var(--border);
    color: var(--foreground);
    background: var(--background);
  }
  .header-story .uiify-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    background: var(--background);
    border-block-end: 1px solid var(--border);
  }
  .header-story a {
    color: inherit;
    text-decoration: none;
  }
  .header-story-desktop-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .header-story-trigger {
    display: none;
  }
  .header-story-modal .uiify-dialog-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding-inline-end: 0;
  }
  .header-story-modal .uiify-dialog-title {
    grid-column: 2;
  }
  .header-story-modal .uiify-dialog-header > .uiify-dialog-close {
    position: static;
    grid-column: 3;
    justify-self: end;
    min-inline-size: 2.75rem;
    min-block-size: 2.75rem;
  }
  .header-story-modal nav {
    display: grid;
    gap: 1rem;
    padding-block: 1rem;
  }
  .header-story main {
    min-block-size: 48rem;
    padding: 1rem;
  }
  .header-story main section {
    min-block-size: 18rem;
  }
  @media (width < 40rem) {
    .header-story-desktop-nav {
      display: none;
    }
    .header-story-trigger {
      display: inline-flex;
    }
  }
`;

function HeaderStory({ enhanced = false }: { readonly enhanced?: boolean }) {
  const prefix = enhanced ? "header-client-story" : "header-native-story";
  const navigation = (
    <>
      <a href={`#${prefix}-home`}>Orbit</a>
      <nav aria-label="Main" className="header-story-desktop-nav">
        <a href={`#${prefix}-home`}>Overview</a>
        <a href={`#${prefix}-docs`}>Docs</a>
        <a href={`#${prefix}-projects`}>New project</a>
      </nav>
      <DialogTrigger className="header-story-trigger" target={`${prefix}-navigation`}>
        Navigation
      </DialogTrigger>
      <DialogContent
        aria-labelledby={`${prefix}-navigation-title`}
        className="header-story-modal"
        id={`${prefix}-navigation`}
        size="full"
      >
        <DialogHeader>
          <DialogTitle aria-label="Orbit navigation" id={`${prefix}-navigation-title`}>
            Orbit
          </DialogTitle>
          <DialogClose aria-label="Close navigation" target={`${prefix}-navigation`}>
            ×
          </DialogClose>
        </DialogHeader>
        <DialogBody>
          <nav aria-label="Main">
            <a href={`#${prefix}-home`}>Overview</a>
            <a href={`#${prefix}-docs`}>Docs</a>
            <a href={`#${prefix}-projects`}>New project</a>
          </nav>
        </DialogBody>
      </DialogContent>
    </>
  );
  return (
    <div className="header-story" id={`${prefix}-scrollport`}>
      <style>{styles}</style>
      {enhanced ? (
        <HeaderClient hideOnScroll scrollTarget={`${prefix}-scrollport`}>
          {navigation}
        </HeaderClient>
      ) : (
        <Header.Root placement="sticky">{navigation}</Header.Root>
      )}
      <main id={`${prefix}-home`}>
        <h1>Team workspace</h1>
        <p>
          {enhanced
            ? "Scroll down to hide the header and up to reveal it."
            : "Scroll this panel. Navigation opens a full screen modal on narrow screens."}
        </p>
        <section id={`${prefix}-docs`}>
          <h2>Docs</h2>
          <p>Find guides for organizing projects and collaborating with your team.</p>
        </section>
        <section id={`${prefix}-projects`}>
          <h2>Projects</h2>
          <p>Start a new project and plan your next milestone.</p>
        </section>
      </main>
    </div>
  );
}

HeaderStory.displayName = "HeaderStory";

export const NativeSticky: Story = () => <HeaderStory />;
NativeSticky.displayName = "NativeSticky";

export const HideOnScroll: Story = () => <HeaderStory enhanced />;
HideOnScroll.displayName = "HideOnScroll";
