import type { TagsInputStore, TagsInputStoreOptions } from "./types.js";

export function createTagsInputStore(
  initial: readonly string[] = [],
  options: TagsInputStoreOptions = {},
): TagsInputStore {
  let tags = [...initial];
  const listeners = new Set<() => void>();
  let { allowDuplicates = false, maxTags, validate } = options;

  const emit = () => listeners.forEach((listener) => listener());

  const canAdd = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return false;
    if (validate && !validate(trimmed)) return false;
    if (!allowDuplicates && tags.includes(trimmed)) return false;
    if (maxTags !== undefined && tags.length >= maxTags) return false;
    return true;
  };

  return {
    addTag(tag: string) {
      const trimmed = tag.trim();
      if (!canAdd(trimmed)) return false;
      tags = [...tags, trimmed];
      emit();
      return true;
    },
    addTags(nextTags: readonly string[]) {
      let changed = false;
      for (const tag of nextTags) {
        if (canAdd(tag)) {
          tags = [...tags, tag.trim()];
          changed = true;
        }
      }
      if (changed) emit();
    },
    getTags: () => tags,
    removeAt(index: number) {
      if (index < 0 || index >= tags.length) return;
      tags = tags.filter((_, i) => i !== index);
      emit();
    },
    removeLast() {
      if (tags.length === 0) return;
      tags = tags.slice(0, -1);
      emit();
    },
    setTags(next: readonly string[]) {
      tags = [...next];
      emit();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    updateOptions(next: TagsInputStoreOptions) {
      if (next.allowDuplicates !== undefined) allowDuplicates = next.allowDuplicates;
      if (next.maxTags !== undefined) maxTags = next.maxTags;
      if (next.validate !== undefined) validate = next.validate;
    },
  };
}

export function splitTags(text: string, delimiters: readonly string[]): string[] {
  if (delimiters.length === 0) return [text.trim()].filter(Boolean);
  const pattern = delimiters.map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  return text
    .split(new RegExp(pattern))
    .map((part) => part.trim())
    .filter(Boolean);
}
