import type { FileRejection, FileUploadStore, FileUploadStoreOptions } from "./types.js";

function matchesAccept(file: File, accept: readonly string[]): boolean {
  if (accept.length === 0) return true;
  return accept.some((pattern) => {
    if (pattern.startsWith(".")) return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    if (pattern.endsWith("/*")) {
      const prefix = pattern.slice(0, -1);
      return file.type.startsWith(prefix);
    }
    return file.type === pattern;
  });
}

export function validateFiles(
  files: readonly File[],
  options: FileUploadStoreOptions,
): { accepted: File[]; rejected: FileRejection[] } {
  const { accept = [], maxFiles, maxSize, minSize = 0, multiple = false } = options;
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  const limit = multiple ? maxFiles : 1;

  for (const file of files) {
    if (limit !== undefined && accepted.length >= limit) {
      rejected.push({ file, reason: "max-files" });
      continue;
    }
    if (!matchesAccept(file, accept)) {
      rejected.push({ file, reason: "accept" });
      continue;
    }
    if (file.size < minSize || (maxSize !== undefined && file.size > maxSize)) {
      rejected.push({ file, reason: "max-size" });
      continue;
    }
    accepted.push(file);
  }

  return { accepted, rejected };
}

export function createFileUploadStore(initial: readonly File[] = []): FileUploadStore {
  let files = [...initial];
  const listeners = new Set<() => void>();

  return {
    addFiles(next: readonly File[]) {
      files = [...files, ...next];
      listeners.forEach((listener) => listener());
    },
    clear() {
      files = [];
      listeners.forEach((listener) => listener());
    },
    getFiles: () => files,
    removeAt(index: number) {
      if (index < 0 || index >= files.length) return;
      files = files.filter((_, i) => i !== index);
      listeners.forEach((listener) => listener());
    },
    setFiles(next: readonly File[]) {
      files = [...next];
      listeners.forEach((listener) => listener());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
