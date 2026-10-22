import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { validateFiles } from "./file-upload-store.js";
import { FileUpload as ServerFileUpload, FileUpload as ClientFileUpload } from "./FileUpload.js";

function createFile(name: string, type: string, size: number): File {
  return new File(["x".repeat(size)], name, { type });
}

describe("file-upload-store", () => {
  it("accepts case-insensitive extensions and MIME wildcards while rejecting mismatches", () => {
    const document = createFile("REPORT.PDF", "application/pdf", 10);
    const image = createFile("photo.png", "image/png", 10);
    const text = createFile("notes.txt", "text/plain", 10);

    expect(
      validateFiles([document, image, text], { accept: [".pdf", "image/*"], multiple: true }),
    ).toEqual({
      accepted: [document, image],
      rejected: [{ file: text, reason: "accept" }],
    });
    expect(validateFiles([text, image], { accept: ["text/plain"], multiple: true })).toEqual({
      accepted: [text],
      rejected: [{ file: image, reason: "accept" }],
    });
  });

  it("includes the size boundaries and rejects files outside them", () => {
    const tooSmall = createFile("small.txt", "text/plain", 9);
    const minimum = createFile("minimum.txt", "text/plain", 10);
    const maximum = createFile("maximum.txt", "text/plain", 20);
    const tooLarge = createFile("large.txt", "text/plain", 21);

    expect(
      validateFiles([tooSmall, minimum, maximum, tooLarge], {
        minSize: 10,
        maxSize: 20,
        multiple: true,
      }),
    ).toEqual({
      accepted: [minimum, maximum],
      rejected: [
        { file: tooSmall, reason: "max-size" },
        { file: tooLarge, reason: "max-size" },
      ],
    });
  });
});

describe("FileUpload", () => {
  it("keeps controlled files authoritative and follows external replacements", () => {
    const first = createFile("one.txt", "text/plain", 10);
    const second = createFile("two.txt", "text/plain", 20);
    const onValueChange = vi.fn();
    const ui = (files: File[]) => (
      <ClientFileUpload.Root value={files} onValueChange={onValueChange}>
        <ClientFileUpload.Dropzone>Drop</ClientFileUpload.Dropzone>
        <ClientFileUpload.List>
          <ClientFileUpload.Item index={0} />
        </ClientFileUpload.List>
      </ClientFileUpload.Root>
    );
    ui.displayName = "FileUploadControlledExample";
    const { rerender } = render(ui([first]));
    fireEvent.drop(screen.getByRole("region"), { dataTransfer: { files: [second] } });
    expect(screen.getByRole("listitem").textContent).toBe("one.txt");
    expect(onValueChange).toHaveBeenCalledWith([second]);
    rerender(ui([second]));
    expect(screen.getByRole("listitem").textContent).toBe("two.txt");
    rerender(ui([]));
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  it("limits the total files across separate additions", () => {
    const onReject = vi.fn();
    render(
      <ClientFileUpload.Root multiple maxFiles={1} onReject={onReject}>
        <ClientFileUpload.Dropzone>Drop</ClientFileUpload.Dropzone>
        <ClientFileUpload.List>
          <ClientFileUpload.Item index={0} />
          <ClientFileUpload.Item index={1} />
        </ClientFileUpload.List>
      </ClientFileUpload.Root>,
    );
    fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: { files: [createFile("one.txt", "text/plain", 10)] },
    });
    fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: { files: [createFile("two.txt", "text/plain", 10)] },
    });
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(onReject.mock.calls[0]?.[0]?.[0]?.reason).toBe("max-files");
  });

  it("renders selected files through List children and removes them", () => {
    render(
      <ClientFileUpload.Root>
        <ClientFileUpload.HiddenInput name="attachment" data-testid="picker" />
        <ClientFileUpload.List>
          {(files) =>
            files.map((file, index) => (
              <ClientFileUpload.Item key={file.name} index={index}>
                <span>{file.name}</span>
                <ClientFileUpload.ItemRemove index={index} aria-label={`Remove ${file.name}`}>
                  ×
                </ClientFileUpload.ItemRemove>
              </ClientFileUpload.Item>
            ))
          }
        </ClientFileUpload.List>
      </ClientFileUpload.Root>,
    );
    fireEvent.change(screen.getByTestId("picker"), {
      target: { files: [createFile("notes.txt", "text/plain", 12)] },
    });
    expect(screen.getByRole("listitem").textContent).toContain("notes.txt");
    fireEvent.click(screen.getByRole("button", { name: "Remove notes.txt" }));
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  it("keeps the default remove name and formats an opted-in name template", () => {
    const file = createFile("notes.txt", "text/plain", 12);
    const renderUpload = (labels?: { remove?: string }) => (
      <ClientFileUpload.Root defaultValue={[file]} {...(labels ? { labels } : {})}>
        <ClientFileUpload.List>
          <ClientFileUpload.Item index={0}>
            <ClientFileUpload.ItemRemove index={0}>×</ClientFileUpload.ItemRemove>
          </ClientFileUpload.Item>
        </ClientFileUpload.List>
      </ClientFileUpload.Root>
    );
    renderUpload.displayName = "FileUploadRemoveLabelsExample";

    const { rerender } = render(renderUpload());
    expect(screen.getByRole("button", { name: "Remove file" })).toBeTruthy();
    rerender(renderUpload({ remove: "Remove {name}" }));
    expect(screen.getByRole("button", { name: "Remove notes.txt" })).toBeTruthy();
  });

  it("uses translated dropzone and remove fallback labels", () => {
    render(
      <ClientFileUpload.Root
        defaultValue={[createFile("notes.txt", "text/plain", 12)]}
        labels={{ dropzone: "Déposez les fichiers", removeFallback: "Supprimer le fichier" }}
      >
        <ClientFileUpload.Dropzone>Drop</ClientFileUpload.Dropzone>
        <ClientFileUpload.List>
          <ClientFileUpload.Item index={0}>
            <ClientFileUpload.ItemRemove index={0}>×</ClientFileUpload.ItemRemove>
          </ClientFileUpload.Item>
        </ClientFileUpload.List>
      </ClientFileUpload.Root>,
    );
    expect(screen.getByRole("region", { name: "Déposez les fichiers" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Supprimer le fichier" })).toBeTruthy();
  });
  it("renders a native picker contract before hydration", () => {
    const markup = renderToStaticMarkup(
      <ServerFileUpload.Root>
        <ServerFileUpload.HiddenInput />
        <ServerFileUpload.Trigger>Upload</ServerFileUpload.Trigger>
        <ServerFileUpload.Dropzone>Drop here</ServerFileUpload.Dropzone>
      </ServerFileUpload.Root>,
    );

    expect(markup).toContain('type="file"');
    expect(markup).toContain("<label");
    expect(markup).toContain("Drop here");
  });

  it("opens picker from trigger", () => {
    const click = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    render(
      <ClientFileUpload.Root>
        <ClientFileUpload.HiddenInput />
        <ClientFileUpload.Trigger as="button">Upload</ClientFileUpload.Trigger>
      </ClientFileUpload.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Upload" }));
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });

  it("accepts dropped files", () => {
    const onChange = vi.fn();
    render(
      <ClientFileUpload.Root onValueChange={onChange}>
        <ClientFileUpload.Dropzone>Drop here</ClientFileUpload.Dropzone>
      </ClientFileUpload.Root>,
    );

    const file = createFile("doc.txt", "text/plain", 10);
    fireEvent.drop(screen.getByRole("region", { name: "Drop files here" }), {
      dataTransfer: { files: [file] },
    });
    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it("lets a consumer onDrop veto file processing (policy #6: dismiss/drag veto)", () => {
    const onChange = vi.fn();
    render(
      <ClientFileUpload.Root onValueChange={onChange}>
        <ClientFileUpload.Dropzone onDrop={(event) => event.preventDefault()}>
          Drop here
        </ClientFileUpload.Dropzone>
      </ClientFileUpload.Root>,
    );

    const file = createFile("doc.txt", "text/plain", 10);
    fireEvent.drop(screen.getByRole("region", { name: "Drop files here" }), {
      dataTransfer: { files: [file] },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("lets a consumer onDragOver veto the internal preventDefault (policy #6: dismiss/drag veto)", () => {
    const internalCalls: string[] = [];
    render(
      <ClientFileUpload.Root>
        <ClientFileUpload.Dropzone
          onDragOver={(event) => {
            internalCalls.push("consumer");
            event.preventDefault();
          }}
        >
          Drop here
        </ClientFileUpload.Dropzone>
      </ClientFileUpload.Root>,
    );

    const zone = screen.getByRole("region", { name: "Drop files here" });
    const event = createEvent.dragOver(zone);
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    fireEvent(zone, event);

    expect(internalCalls).toEqual(["consumer"]);
    // the consumer already prevented default, so the internal handler's own
    // preventDefault() call is skipped entirely (not merely idempotent)
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  });

  it("owns aria-controls on Trigger regardless of a consumer override attempt", () => {
    render(
      <ClientFileUpload.Root>
        <ClientFileUpload.HiddenInput />
        <ClientFileUpload.Trigger as="button" aria-controls="wrong-id">
          Upload
        </ClientFileUpload.Trigger>
      </ClientFileUpload.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Upload" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(trigger.getAttribute("aria-controls")).toBe(input.id);
    expect(trigger.getAttribute("aria-controls")).not.toBe("wrong-id");
  });

  it("owns role/aria-label/data-disabled on Dropzone regardless of consumer override attempts", () => {
    render(
      <ClientFileUpload.Root>
        <ClientFileUpload.Dropzone role="button" aria-label="Wrong label" data-disabled="nope">
          Drop here
        </ClientFileUpload.Dropzone>
      </ClientFileUpload.Root>,
    );

    const zone = screen.getByRole("region", { name: "Drop files here" });
    expect(zone.getAttribute("role")).toBe("region");
    expect(zone.getAttribute("aria-label")).toBe("Drop files here");
    expect(zone.hasAttribute("data-disabled")).toBe(false);
  });

  it("owns role/data-name on Item regardless of consumer override attempts", () => {
    render(
      <ClientFileUpload.Root>
        <ClientFileUpload.Dropzone>Drop here</ClientFileUpload.Dropzone>
        <ClientFileUpload.List>
          <ClientFileUpload.Item index={0} role="button" data-name="wrong" />
        </ClientFileUpload.List>
      </ClientFileUpload.Root>,
    );

    const file = createFile("doc.txt", "text/plain", 10);
    fireEvent.drop(screen.getByRole("region", { name: "Drop files here" }), {
      dataTransfer: { files: [file] },
    });

    const item = screen.getByRole("listitem");
    expect(item.getAttribute("data-name")).toBe("doc.txt");
  });

  it("calls onReject for invalid files", () => {
    const onReject = vi.fn();
    render(
      <ClientFileUpload.Root accept={["text/plain"]} onReject={onReject}>
        <ClientFileUpload.HiddenInput />
      </ClientFileUpload.Root>,
    );

    const file = createFile("photo.png", "image/png", 10);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, "files", { value: [file] });
    fireEvent.change(input);
    expect(onReject).toHaveBeenCalled();
  });
});

it("preserves a removal button's native disabled flag", () => {
  render(
    <ClientFileUpload.Root defaultValue={[createFile("keep.txt", "text/plain", 5)]}>
      <ClientFileUpload.List>
        <ClientFileUpload.Item index={0} />
        <ClientFileUpload.ItemRemove index={0} disabled>
          Remove
        </ClientFileUpload.ItemRemove>
      </ClientFileUpload.List>
    </ClientFileUpload.Root>,
  );
  const button = screen.getByRole("button", { name: "Remove file" });
  expect((button as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(button);
  expect(screen.getByRole("listitem").textContent).toBe("keep.txt");
});
