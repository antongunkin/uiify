"use client";
import { createContext } from "react";
import type { TableOfContentsClientContextValue } from "../types.js";
export const TableOfContentsContext = createContext<TableOfContentsClientContextValue | null>(null);
