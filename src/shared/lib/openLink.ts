/** Opens a download (with its file name) or a web link in a new tab. Used for signed URLs from the API. */
export function openLink({ url, fileName }: { url: string; fileName: string | null }) {
  if (fileName) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.rel = 'noopener';
    anchor.click();
    // A preview blob URL is used once; free it after the download starts.
    if (url.startsWith('blob:')) setTimeout(() => URL.revokeObjectURL(url), 0);
    return;
  }
  window.open(url, '_blank', 'noopener');
}
