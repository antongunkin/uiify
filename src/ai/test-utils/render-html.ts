import { createElement, Suspense } from "react";
import { renderToReadableStream } from "react-dom/server";
import { UiDocument } from "../UiDocument.js";

/** Stream-renders a document (typed or untrusted, like `UiDocument`'s own prop) inside a Suspense boundary and resolves to the finished HTML. */
export async function renderDocumentHtml(node: unknown): Promise<string> {
  const stream = await renderToReadableStream(
    createElement(Suspense, null, createElement(UiDocument, { node })),
  );
  await stream.allReady;
  return new Response(stream).text();
}
