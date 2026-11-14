"use client";

import { useRef, useState, type FormEvent } from "react";
import type { DemoKnowledgeSourceType } from "@askwell/shared";
import { FILE_ACCEPT, FILE_REJECTED_MESSAGE, parseSourceTitle, sourceTypeFromFileName } from "../lib/knowledge";

const input = "mt-1 w-full rounded-control border border-line bg-transparent px-3 py-2.5 text-ink";
const submit =
  "rounded-control bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90";

type Add = (source: { title: string; type: DemoKnowledgeSourceType }) => void;

/** Two ways to add a source. Only the title (or file name) and type are kept; text and file contents are never read or stored. */
export function KnowledgeAddForm({ onAdd }: { onAdd: Add }) {
  const [textError, setTextError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function addText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = parseSourceTitle(String(data.get("title") ?? ""));
    if (!title.ok) return setTextError(title.error);
    if (!String(data.get("text") ?? "").trim()) return setTextError("Paste some text.");
    setTextError(null);
    onAdd({ title: title.title, type: "text" });
    form.reset();
  }

  function addFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return setFileError("Choose a file.");
    const type = sourceTypeFromFileName(file.name);
    if (!type) return setFileError(FILE_REJECTED_MESSAGE);
    const title = parseSourceTitle(file.name);
    if (!title.ok) return setFileError(title.error);
    setFileError(null);
    onAdd({ title: title.title, type });
    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={addText} noValidate className="space-y-3">
        <h2 className="font-semibold">Paste text</h2>
        <label className="block text-sm font-medium">
          Title
          <input name="title" type="text" autoComplete="off" className={input} />
        </label>
        <label className="block text-sm font-medium">
          Text
          <textarea name="text" rows={4} className={input} />
        </label>
        {textError ? (
          <p role="alert" className="text-sm text-danger">
            {textError}
          </p>
        ) : null}
        <button type="submit" className={submit}>
          Add text
        </button>
      </form>
      <form onSubmit={addFile} noValidate className="space-y-3">
        <h2 className="font-semibold">Upload a file</h2>
        <label className="block text-sm font-medium">
          File (.pdf, .md or .txt)
          <input ref={fileRef} type="file" accept={FILE_ACCEPT} className={input} />
        </label>
        <p className="text-sm text-muted">Only the file name is kept. The file is never read or uploaded.</p>
        {fileError ? (
          <p role="alert" className="text-sm text-danger">
            {fileError}
          </p>
        ) : null}
        <button type="submit" className={submit}>
          Add file
        </button>
      </form>
    </div>
  );
}
