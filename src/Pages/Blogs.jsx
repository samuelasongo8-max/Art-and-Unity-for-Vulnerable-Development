import { apiUrl, imageUrl } from "../utils/api";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Blogs.css";

/* ==========================================================================
   The public Blog page.

   Reads GET /api/blogs — the SAME endpoint the Admin Dashboard's Blog
   Management section writes to (POST / PUT / DELETE on /api/blogs/:id). There
   is one blog store, in the separate "blogs" MongoDB collection, and nothing
   is duplicated into the frontend: a blog saved at /admin/post shows up here
   the next time this page loads.

   THE RESPONSE SHAPE
   ------------------
   GET /api/blogs returns { ok, blogs } where each blog is
   { id, title, content, date, image, imageAlt } (see toPublicBlog in
   lib/blogValidation.js).

   There is deliberately NO category field on a blog, so no category is shown
   here — one is not invented, and the backend is not changed to add one.

   Read More is a link to /blog/:id, the details page for THAT specific blog
   (src/Pages/BlogDetails.jsx). The id is carried in the URL, so every card
   opens its own article.
   ========================================================================== */

/** How much of the article a card shows before the Read More affordance. */
const PREVIEW_LENGTH = 280;

/**
 * Formats the stored "YYYY-MM-DD" date for display. The stored value is never
 * changed — this only makes it readable.
 *
 * @param {string} isoDate
 * @returns {string} e.g. "5 January 2026", or "" when there is no date.
 */
function formatDate(isoDate) {
  if (typeof isoDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "";

  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** True when the article is longer than the preview, i.e. Read More is needed. */
const isTruncated = (content) => typeof content === "string" && content.length > PREVIEW_LENGTH;

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const loadBlogs = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch(apiUrl("/api/blogs"));
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok || !Array.isArray(result.blogs)) {
        throw new Error(`HTTP ${response.status}`);
      }

      setBlogs(result.blogs);
      setError("");
      setStatus("ready");
    } catch (loadError) {
      setError(`The blogs could not be loaded (${loadError.message}).`);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  return (
    <main className="blogs-page">
      <div className="news-container">
        {status === "loading" ? (
          <p className="auvd-admin-muted" role="status">
            Loading...
          </p>
        ) : status === "error" ? (
          <p className="news-load-error" role="alert">
            {error}
          </p>
        ) : blogs.length === 0 ? (
          <p className="news-load-error">No blogs have been published yet.</p>
        ) : (
          blogs.map((blog) => {
            const preview = isTruncated(blog.content)
              ? `${blog.content.slice(0, PREVIEW_LENGTH).trimEnd()}...`
              : blog.content;

            return (
              <article className="news-card" key={blog.id}>
                {blog.image ? (
                  <img className="news-card-image" src={imageUrl(blog.image)} alt={blog.imageAlt || ""} />
                ) : null}

                <div className="news-card-content">
                  {formatDate(blog.date) ? (
                    <div className="news-meta">
                      <span className="news-date">{formatDate(blog.date)}</span>
                    </div>
                  ) : null}

                  <h2 className="news-title">{blog.title}</h2>

                  <p className="news-excerpt">{preview}</p>

                  {isTruncated(blog.content) ? (
                    <Link className="news-read-more" to={`/blog/${blog.id}`}>
                      Read More <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
