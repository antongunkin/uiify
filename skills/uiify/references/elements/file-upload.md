# file-upload

Binding: file-upload

Let people select and manage files for a form or task.

## Use when

Let people attach one or more files to a form or task.

## Avoid when

Do not require drag and drop as the only way to choose files. Avoid asking for files unrelated to the task.

## Structure

Use FileUpload.Root with a labelled HiddenInput and an optional Trigger or Dropzone. Explain allowed formats, size limits, and maximum file count before selection; show selected filenames and provide a named remove action for each file.

## Responsive

Keep the browse control and selected-file list usable at narrow widths. Do not rely on a large drop target that pushes the file picker off screen.

## States

Report rejected files with the reason, including type, size, or count limits. Keep the accepted files and let people remove them. Treat accept as a picker hint; validate file type and size on the server.

## Verify

Test keyboard file selection, the accessible input name, multiple-file selection, dropzone as an optional path, rejected-file feedback, removal, and server-side validation.

## Common mistake

Treating the accept attribute as security validation or failing silently when a file is rejected.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/instructions/) (verified 2026-10-17)
