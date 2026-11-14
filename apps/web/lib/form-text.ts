/** A form field's text. A missing field or a file gives "", never "[object File]". */
export function formText(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}
