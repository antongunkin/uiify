import type { Story } from "@ladle/react";
import { TableOfContents } from "./client/index.js";

export const Article: Story = () => (
  <div>
    <TableOfContents.Root aria-label="Article contents" contentTarget="story-toc-article">
      <TableOfContents.Trigger target="story-toc-panel" aria-label="Article contents">
        <TableOfContents.Rail>
          <TableOfContents.Indicator value="story-toc-overview" />
          <TableOfContents.Indicator value="story-toc-details" level={3} />
        </TableOfContents.Rail>
      </TableOfContents.Trigger>
      <TableOfContents.Content id="story-toc-panel" side="bottom">
        <TableOfContents.List>
          <TableOfContents.Link href="#story-toc-overview">Overview</TableOfContents.Link>
          <TableOfContents.Link href="#story-toc-details" level={3}>
            Details
          </TableOfContents.Link>
        </TableOfContents.List>
      </TableOfContents.Content>
    </TableOfContents.Root>
    <article id="story-toc-article">
      <h2 id="story-toc-overview">Overview</h2>
      <p>Hover the rail to reveal the headings, or activate its button.</p>
      <h3 id="story-toc-details">Details</h3>
      <p>Click keeps the list open; Escape dismisses it.</p>
    </article>
  </div>
);

Article.displayName = "Article";
