import { apiUrl, imageUrl } from "../utils/api";
import ImpactHero from "../components/ImpactHero";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./BlogDetails.css";

/* ==========================================================================
   /blog/:id — the details page for ONE blog.

   WHICH BLOG IS SHOWN
   -------------------
   The id comes from the URL (/blog/:id), so Blog A and Blog B get their own
   separate page. Two different ids can therefore never render the same article.

   WHERE THE DATA COMES FROM
   -------------------------
   GET /api/blogs — the same public endpoint the blog list uses. The backend has
   no GET /api/blogs/:id (its [id] route handles PUT and DELETE only), and the
   brief is not to add an endpoint unnecessarily, so the page fetches the list
   and selects the requested id from it. The result is still "loaded by id" and
   is the current database state on every visit, so an admin edit in
   /admin/post shows up here as soon as the page is loaded again.

   HERO
   ----
   The hero is the project's own shared ImpactHero component — the same one Home,
   Our Story, Work, Pricing and Events use — so the typography, overlay, spacing
   and responsive behaviour belong to the existing site rather than being a
   generic blog template.
   ========================================================================== */

/**
 * Splits the stored article into paragraphs on blank lines. The text is never
 * truncated; single line breaks inside a paragraph are preserved by CSS
 * (white-space), so the author's own formatting survives.
 *
 * @param {string} content
 * @returns {string[]}
 */
function toParagraphs(content) {
  if (typeof content !== "string" || !content.trim()) return [];

  return content
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+$/, ""))
    .filter(Boolean);
}

export default function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [status, setStatus] = useState("loading");

  const loadBlog = useCallback(async () => {
    setStatus("loading");
    setBlog(null);

    try {
      const response = await fetch(apiUrl("/api/blogs"));
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok || !Array.isArray(result.blogs)) {
        throw new Error("request failed");
      }

      const match = result.blogs.find((item) => String(item.id) === String(id));

      /* A bad or unknown id is a normal outcome, not an error: the visitor gets
         a clear message instead of a broken page. */
      if (!match) {
        setStatus("not-found");
        return;
      }

      setBlog(match);
      setStatus("ready");
    } catch {
      /* The reason is deliberately not shown: an HTTP status or stack trace is
         not something a public visitor can act on. */
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    loadBlog();
  }, [loadBlog]);

  const backLink = (
    <Link className="blog-details__back" to="/our-impact/blogs">
      <span aria-hidden="true">←</span> Back to Blogs
    </Link>
  );

  if (status === "loading") {
    return (
      <main className="blog-details">
        <div className="blog-details__message" role="status">
          Loading...
        </div>
      </main>
    );
  }

  if (status === "not-found") {
    return (
      <main className="blog-details">
        <div className="blog-details__message">
          <h1>Blog not found</h1>
          <p>This blog may have been removed.</p>
          {backLink}
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="blog-details">
        <div className="blog-details__message">
          <h1>Something went wrong</h1>
          <p>We could not load this blog. Please try again shortly.</p>
          {backLink}
        </div>
      </main>
    );
  }

  const paragraphs = toParagraphs(blog.content);

  /* Built once here, rendered in either layout below. */
  const article = (
    <article className="blog-details__content">
      {paragraphs.map((paragraph, index) => (
        /* Index is the key because two paragraphs of one article can be
           identical text, and the article itself is stable for this render. */
        <p key={index}>{paragraph}</p>
      ))}
    </article>
  );

  return (
    <main className="blog-details">
      <div className="blog-details__hero">
        <ImpactHero
          label="Blog"
          heading={blog.title}
          image={blog.image ? imageUrl(blog.image) : ""}
          imageAlt={blog.imageAlt || blog.title || ""}
        />
      </div>

      <div className="blog-details__back-wrap">{backLink}</div>

      {/* The article is built once and rendered in one of two layouts, so
          there is no duplicated markup between them.

          With a content image: two columns, image on the LEFT, full text on
          the RIGHT. Without one (which is every blog saved before this field
          existed): the original single, centred column, completely unchanged. */}
      {blog.contentImage ? (
        <div className="blog-details__body">
          <figure className="blog-details__figure">
            <img
              className="blog-details__content-image"
              src={imageUrl(blog.contentImage)}
              alt={blog.imageAlt || blog.title || ""}
            />
          </figure>

          {article}
        </div>
      ) : (
        article
      )}
    </main>
  );
}
