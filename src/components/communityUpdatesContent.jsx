import { Link } from "react-router-dom";
import { updates } from "../data/updates";
import { getDriveImageUrl } from "../utils/reportLinks";

export { updates };

export function toCommunityUpdate(update) {
  if (!update || typeof update !== "object") return null;

  const title = typeof update.title === "string" ? update.title : "";
  const slug = typeof update.slug === "string" ? update.slug : "";
  if (!title || !slug) return null;

  const rawBody = update.body;
  const body = Array.isArray(rawBody)
    ? rawBody
    : typeof rawBody === "string"
      ? rawBody.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean).map((text) => ({ type: "p", text }))
      : [];
  const excerpt = typeof update.excerpt === "string" ? update.excerpt : "";
  const createdAt = typeof update.createdAt === "string" ? update.createdAt : "";
  const category = typeof update.category === "string" ? update.category : "";
  const author = typeof update.author === "string" ? update.author : "";

  return {
    ...update,
    slug,
    title,
    image: getDriveImageUrl(update.imageUrl || update.image || ""),
    alt: update.alt || update.imageAlt || title,
    to: update.to || `/updates/${encodeURIComponent(slug)}`,
    date: update.date || (createdAt ? createdAt.slice(0, 10) : ""),
    place: update.place || [category, author].filter(Boolean).join(" · "),
    preview: update.preview || excerpt || body.find((block) => block.type === "p")?.text || "",
    body,
    readMore: update.readMore || "Read more",
  };
}

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatPostDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return `${MONTH_ABBR[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function renderInline(text) {
  const parts = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match;
  let key = 0;

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }

    const [, label, url] = match;
    parts.push(
      /^https?:\/\//.test(url) ? (
        <a key={key++} href={url} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ) : (
        <Link key={key++} to={url}>
          {label}
        </Link>
      )
    );
    last = linkPattern.lastIndex;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts;
}

export function renderBody(blocks) {
  if (!Array.isArray(blocks)) return null;

  return blocks.map((block, index) => {
    if (block.type === "ul" || block.type === "ol") {
      const List = block.type;
      return (
        <List key={index}>
          {(block.items || []).map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </List>
      );
    }
    return <p key={index}>{renderInline(block.text || "")}</p>;
  });
}
