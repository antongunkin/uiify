"use client";
import { createPartContext } from "@gunkin/uiify/core";
import type { FileUploadContextValue } from "./types.js";

export const [FileUploadProvider, useFileUploadContext] =
  createPartContext<FileUploadContextValue>("FileUpload");
