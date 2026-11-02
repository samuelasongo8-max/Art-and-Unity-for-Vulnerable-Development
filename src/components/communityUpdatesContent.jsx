import { Link } from "react-router-dom";
import { updates } from "../data/updates";

export { updates };

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
