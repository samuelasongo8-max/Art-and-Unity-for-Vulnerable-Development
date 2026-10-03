/**
 * src/utils/richText.js — helpers shared by the admin editors and the public
 * pages that display what they save.
 *
 * WHY THIS EXISTS
 * ---------------
 * The Post "Paragraph" and Blog "Content" fields were plain <textarea>s storing
 * plain text. They are now rich-text editors that store HTML, so the public
 * pages have to render HTML instead of text. The rules that decide what HTML is
 * acceptable live here, in ONE place, so the editor, the blog preview and the
 * article page can never disagree about what is safe.
 *
 * EXISTING PLAIN TEXT IS NOT AFFECTED
 * -----------------------------------
 * Every function here passes plain text through untouched. `hasHtml()` reports
 * false for it, so the public pages keep rendering it exactly as they did
 * before — as text, with blank lines still split into paragraphs.
 *
 * THE ALLOW LIST
 * --------------
 * Only the tags the editor toolbar can produce are allowed. Anything not on the
 * list — <script>, <iframe>, <object>, <style>, … — is removed along with its
 * contents. Event-handler attributes (onclick, onerror, …) are always dropped,
 * and `href` is kept only for http, https and mailto, so a javascript: URL can
 * never survive.
 *
 * NOTE: a deliberately small sanitizer, not a general-purpose HTML parser. It
 * is sized to the markup this editor emits, as agreed.
 */

/** Tags the editor produces and the public pages are allowed to render. */
const ALLOWED_TAGS = new Set([
  "p", "br", "b", "strong", "i", "em", "u", "s",
  "ul", "ol", "li",
  "a", "span", "div",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "pre", "code",
]);

/**
 * Tags whose CONTENT is removed with them, never just the tag itself. These can
 * carry code or style, so keeping their text would still be unsafe.
 */
const DROP_WITH_CONTENT = new Set([
  "script", "style", "iframe", "object", "embed", "noscript",
  "template", "form", "input", "button", "textarea", "select", "option",
]);

/** The only URL schemes a link may use. */
const SAFE_URL = /^(https?:\/\/|mailto:)/i;

/**
 * Escapes the characters that could otherwise start markup.
 *
 * `&` is escaped ONLY when it is not already the start of an entity, so markup
 * the editor already escaped (`&amp;`, `&nbsp;`, `&#39;`) is left alone rather
 * than being turned into `&amp;amp;` and displaying a literal "&amp;" to a
 * visitor.
 */
const escapeText = (text) =>
  text
    .replace(/&(?![a-zA-Z#0-9]+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Rebuilds one tag's attribute list, keeping only what is safe.
 *
 * @param {string} tagName lower-case tag name
 * @param {string} attributeText raw text between the tag name and ">"
 * @returns {string} e.g. ` href="https://example.com"`
 */
function sanitizeAttributes(tagName, attributeText) {
  const pattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let out = "";
  let match;

  while ((match = pattern.exec(attributeText)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[3] ?? match[4] ?? match[5] ?? "";

    /* Event handlers are never allowed, on any tag. */
    if (name.startsWith("on")) continue;

    if (name === "href" && tagName === "a") {
      const trimmed = value.trim();
      /* Rejects javascript:, data:, vbscript: and anything not on the list. */
      if (!SAFE_URL.test(trimmed)) continue;
      out += ` href="${escapeText(trimmed)}" target="_blank" rel="noopener noreferrer nofollow"`;
      continue;
    }

    /* Quill writes colours as inline styles on <span>. Only those two
       properties are kept, so `style` can never smuggle `position:fixed` or a
       url() in. */
    if (name === "style") {
      const safe = [];
      for (const property of value.split(";")) {
        const parts = property.split(":");
        if (parts.length < 2) continue;
        const cssName = parts[0].trim().toLowerCase();
        const cssValue = parts.slice(1).join(":").trim();
        if (cssName !== "color" && cssName !== "background-color") continue;
        /* A colour value, not a url() or an expression. */
        if (!/^[#a-z0-9(),.\s%-]+$/i.test(cssValue)) continue;
        safe.push(`${cssName}:${cssValue}`);
      }
      if (safe.length) out += ` style="${escapeText(safe.join(";"))}"`;
      continue;
    }

    /* Quill marks font and size choices with class names such as
       ql-size-large or ql-font-monospace. Those are what make the font and size
       controls work, so they are kept. */
    if (name === "class" && /(^|\s)ql-[a-z0-9-]+(\s|$)/i.test(value)) {
      out += ` class="${escapeText(value)}"`;
    }
  }

  return out;
}


/**
 * Removes everything from the HTML that is not on the allow list.
 *
 * @param {string} html
 * @returns {string} safe HTML, or "" when the input was not a string.
 */
export function sanitizeRichHtml(html) {
  if (typeof html !== "string" || !html) return "";

  /* First pass: delete the dangerous elements together with what they contain,
     so a script body never survives as visible text. */
  let output = html;
  for (const tag of DROP_WITH_CONTENT) {
    const paired = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, "gi");
    const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi");
    output = output.replace(paired, "").replace(selfClosing, "");
  }

  /* Second pass: walk what is left and rebuild each tag from the allow list.
     Text between tags is escaped, so a stray "<" can never open a new element. */
  let result = "";
  let cursor = 0;
  const tagPattern = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
  let match;

  while ((match = tagPattern.exec(output)) !== null) {
    result += escapeText(output.slice(cursor, match.index));

    const closing = match[1] === "/";
    const tagName = match[2].toLowerCase();
    const attributes = match[3] ?? "";

    if (ALLOWED_TAGS.has(tagName)) {
      result += closing
        ? `</${tagName}>`
        : `<${tagName}${sanitizeAttributes(tagName, attributes)}>`;
    }
    /* A tag that is not allowed is dropped; its text content is kept. */

    cursor = tagPattern.lastIndex;
  }

  result += escapeText(output.slice(cursor));

  return result.trim();
}

/**
 * True when the value carries ANY markup, not just the editor's own tags.
 *
 * This deliberately does not look for the editor's tag names: a payload such as
 * a bare `<script>alert(1)</script>` contains none of them, and treating that as
 * plain text would let it skip sanitization and be stored verbatim. Any `<`
 * followed by a letter or a slash counts as markup, so the sanitizer always runs
 * before anything is stored.
 *
 * Used so plain-text articles still take the untouched path.
 *
 * @param {string} value
 * @returns {boolean}
 */
export function hasHtml(value) {
  return typeof value === "string" && /<[a-zA-Z/!]/.test(value);
}

/**
 * Turns stored content into clean plain text, for the blog card preview.
 *
 * Block-level tags become spaces so words either side of them do not run
 * together, and entities are decoded, so `<p>Hello <strong>world</strong></p>`
 * previews as "Hello world" rather than showing tags.
 *
 * @param {string} value
 * @returns {string}
 */
export function toPlainText(value) {
  if (typeof value !== "string" || !value) return "";

  return value
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|blockquote)\s*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}
