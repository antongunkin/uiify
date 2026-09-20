import {
  renderToString as _renderToString,
  renderToStaticMarkup as _renderToStaticMarkup,
} from "react-dom/server";
import type { ReactNode } from "react";

export function renderToString(element: ReactNode): string {
  return _renderToString(element);
}

export function renderToStaticMarkup(element: ReactNode): string {
  return _renderToStaticMarkup(element);
}

export function assertSSRRenderable(element: ReactNode): string {
  const markup = renderToStaticMarkup(element);
  if (!markup) {
    throw new Error("SSR: component rendered empty markup");
  }
  return markup;
}
