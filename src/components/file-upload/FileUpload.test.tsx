import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { validateFiles } from "./file-upload-store.js";
import { FileUpload as ServerFileUpload, FileUpload as ClientFileUpload } from "./FileUpload.js";

function createFile(name: string, type: string, size: number): File {
  return new File(["x".repeat(size)], name, { type });
}

describe("file-upload-store", () => {
  it("rejects files over maxSize", () => {
    const file = createFile("big.txt", "text/plain", 200);
    const { accepted, rejected } = validateFiles([file], { maxSize: 100 });
    expect(accepted).toHaveLength(0);
    expect(rejected[0]?.reason).toBe("max-size");
  });

  it("rejects files with wrong accept type", () => {
    const file = createFile("photo.png", "image/png", 10);
    const { accepted, rejected } = validateFiles([file], { accept: ["text/plain"] });
    expect(accepted).toHaveLength(0);
    expect(rejected[0]?.reason).toBe("accept");
  });
});

describe("FileUpload", () => {
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
      <ClientFileUpload.Root onChange={onChange}>
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
      <ClientFileUpload.Root onChange={onChange}>
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
