export function getDriveImageUrl(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "";

  try {
    const url = new URL(raw);
    if (url.hostname !== "drive.google.com") return raw;
    if (/^\/(?:uc|thumbnail)\/?$/.test(url.pathname)) return raw;

    const fileMatch = url.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = fileMatch?.[1] || url.searchParams.get("id");
    if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) return raw;

    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w800`;
  } catch {
    return raw;
  }
}
