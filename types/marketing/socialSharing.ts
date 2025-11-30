// src/components/marketing-hub/utils/socialSharing.ts
export const openInNew = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
export const urlencode = (s: string) => encodeURIComponent(s);

export const shareToTwitter = (text: string) => {
  const url = `https://twitter.com/intent/tweet?text=${urlencode(text)}`;
  openInNew(url);
};

export const shareToFacebook = (text: string) => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${urlencode("https://example.com")}&quote=${urlencode(text)}`;
  openInNew(url);
};

export const downloadTxt = (filename: string, text: string) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadImage = (dataUrl: string, filename: string) => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// --- Shootak helpers ---
// Assuming Shootak supports web intents similar to Twitter; if not, we fall back to Web Share API or copy workflow upstream.
// Text post intent: prefill content parameter
export const shareTextToShootak = (text: string) => {
  const base = "https://shootak.com/intent/post";
  const url = `${base}?text=${urlencode(text)}`;
  openInNew(url);
};

// Video share helper: navigate to upload with optional caption prefilled
export const shareVideoToShootak = (caption: string) => {
  const base = "https://shootak.com/upload";
  const url = `${base}?caption=${urlencode(caption)}`;
  openInNew(url);
};