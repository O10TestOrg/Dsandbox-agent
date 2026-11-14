"use client";

import { useRef, useState, type FormEvent } from "react";
import type { DemoKnowledgeSourceType } from "@askwell/shared";
import { Button } from "./Button";
import { INPUT, LABEL } from "./field";
import { Eyebrow } from "./Text";
import { SignalMessage } from "./Signal";
import { FILE_ACCEPT, FILE_REJECTED_MESSAGE, parseSourceTitle, sourceTypeFromFileName } from "../lib/knowledge";


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

  // One primary action per view: adding text is the main path, a file is the alternative.
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <form onSubmit={addText} noValidate className="space-y-6" aria-labelledby="add-text-heading">
        <Eyebrow>
          <span id="add-text-heading">Paste text</span>
        </Eyebrow>
        <label className={LABEL}>
          Title
          <input name="title" type="text" autoComplete="off" className={INPUT} />
        </label>
        <label className={LABEL}>
          Text
          <textarea name="text" rows={4} className={INPUT} />
        </label>
        {textError ? (
          <SignalMessage tone="danger" role="alert">
            {textError}
          </SignalMessage>
        ) : null}
        <Button type="submit">Add text</Button>
      </form>
      <form onSubmit={addFile} noValidate className="space-y-6" aria-labelledby="add-file-heading">
        <Eyebrow>
          <span id="add-file-heading">Upload a file</span>
        </Eyebrow>
        <label className={LABEL}>
          File (.pdf, .md or .txt)
          <input
            ref={fileRef}
            type="file"
            accept={FILE_ACCEPT}
            className={`${INPUT} file:mr-4 file:min-h-10 file:cursor-pointer file:rounded-pill file:border file:border-line file:bg-paper file:px-4 file:text-body file:text-ink`}
          />
        </label>
        <p className="text-body text-muted">Only the file name is kept. The file is never read or uploaded.</p>
        {fileError ? (
          <SignalMessage tone="danger" role="alert">
            {fileError}
          </SignalMessage>
        ) : null}
        <Button type="submit" variant="secondary">
          Add file
        </Button>
      </form>
    </div>
  );
}
