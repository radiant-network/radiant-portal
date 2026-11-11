const FILENAME_PATTERN = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i;

export function getFilenameFromContentDisposition(header: string | undefined, fallback: string): string {
  const filename = header?.match(FILENAME_PATTERN)?.[1]?.trim();
  return filename ? decodeURIComponent(filename) : fallback;
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
