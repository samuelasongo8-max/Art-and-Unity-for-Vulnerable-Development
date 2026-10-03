import { apiUrl, imageUrl } from "../../utils/api";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./AdminPost.css";

/* ==========================================================================
   BlogManagement — the Blog Management section.

   Rendered as its own section at the BOTTOM of the existing Post Dashboard
   (/admin/post). It is NOT a separate page and has no route of its own: there
   is exactly one Blog Management system, and AdminPost.jsx mounts this.

   WHY IT HAS NO AUTH GATE OF ITS OWN
   ----------------------------------
   AdminPost.jsx already verifies the admin session before it renders anything,
   so re-checking /api/admin/me here would be a second, redundant round trip.
   The real protection is server-side regardless: every write here goes to
   /api/blogs, and those routes are gated by lib/requireAdmin.js exactly like
   the post routes.

   IT REUSES THE EXISTING BUILDING BLOCKS
   --------------------------------------
   The same dashboard CSS (AdminPost.css), the same /api/admin/upload endpoint
   and the same imageUrl() resolver the rest of the dashboard uses.

   BLOGS STAY OFF THE PUBLIC SITE
   ------------------------------
   Articles live in their own "blogs" collection. The public Blogs.jsx page is
   deliberately left empty and reads nothing; nothing here is read by the Home
   page, GrantNews, ImpactGrid or GET /api/posts.
   ========================================================================== */

/* TWO SEPARATE images:
     image        -> the hero picture on the Blog Details page
     contentImage -> a second picture shown inside the article body
   Both optional, and completely independent of each other. */
const EMPTY_FORM = {
  title: "",
  content: "",
  date: "",
  image: "",
  imageAlt: "",
  contentImage: "",
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 100 * 1024 * 1024;

/* ==========================================================================
   THE RICH-TEXT EDITOR

   The Blog Content field used to be a plain <textarea>. It is now a Quill
   editor, matching the Paragraph field in AdminPost.jsx, so an admin can
   format an article before saving it.

   The toolbar holds only the controls that were asked for, so it stays as
   simple as a basic Word toolbar: bullet list, numbered list, text colour,
   theme colour, font, increase size, decrease size, link and paragraph
   spacing. `header` gives the spacing and heading controls something to act on.

   The editor reports HTML, which is written into the existing `content` field.
   No new database field is created and no API route changes — `content` was
   already a string and is still a string.
   ========================================================================== */
const CONTENT_MODULES = {
  toolbar: [
    [{ list: "bullet" }],
    [{ list: "ordered" }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["link"],
    [{ header: [false, 2, 3] }],
    [{ align: [] }],
  ],
  clipboard: { matchVisual: false },
};

/* "list" covers BOTH the bullet and the numbered button — there is no separate
   "bullet" format, and listing one makes Quill log an error on every render. */
const CONTENT_FORMATS = [
  "list", "color", "background", "font", "size", "link", "header", "align",
];

/** How much of the article to show in the saved-blogs list. */
const PREVIEW_LENGTH = 140;

/** Today's date, so the date field is never blank on a new article. */
const todayIso = () => new Date().toISOString().slice(0, 10);

const readJson = async (response) => response.json().catch(() => null);

/** Sends the chosen image to the existing upload endpoint and returns its URL. */
async function uploadImage(file) {
  const response = await fetch(apiUrl("/api/admin/upload"), {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    credentials: "include",
    body: file,
  });

  const result = await readJson(response);
  if (!response.ok || !result?.ok) {
    return { ok: false, error: result?.error || `The image could not be saved (HTTP ${response.status}).` };
  }

  return { ok: true, url: result.url };
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [listStatus, setListStatus] = useState("loading");
  const [listError, setListError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  /* The content image has its own state and its own preview object URL, so it
     can never disturb the hero image field above it. */
  const [contentImageName, setContentImageName] = useState("");
  const [contentImagePreview, setContentImagePreview] = useState("");
  const [uploadingContent, setUploadingContent] = useState(false);
  const contentImageRef = useRef(null);
  const contentPreviewUrlRef = useRef("");
  /* Object URLs are revoked on change and on unmount so a long admin session
     does not hold every preview in memory. */
  const previewUrlRef = useRef("");

  const refresh = useCallback(async () => {
    setListStatus("loading");
    try {
      const response = await fetch(apiUrl("/api/blogs"), { credentials: "include" });
      const result = await readJson(response);

      if (!response.ok || !result?.ok || !Array.isArray(result.blogs)) {
        throw new Error(`HTTP ${response.status}`);
      }

      setBlogs(result.blogs);
      setListStatus("ready");
    } catch (error) {
      setListError(`The blogs could not be loaded (${error.message}).`);
      setListStatus("error");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const handleField = (field) => (event) => {
    const { value } = event.target;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  /**
   * ReactQuill does not fire a DOM event: its onChange passes the HTML string
   * directly as the first argument. handleField() above is left exactly as it
   * was for every other field in this form.
   */
  const handleRichField = (field) => (html) => {
    setForm((previous) => ({ ...previous, [field]: html }));
  };

  const releasePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
  };

  const resetContentImageUi = () => {
    if (contentPreviewUrlRef.current) {
      URL.revokeObjectURL(contentPreviewUrlRef.current);
      contentPreviewUrlRef.current = "";
    }
    setContentImagePreview("");
    setContentImageName("");
    if (contentImageRef.current) contentImageRef.current.value = "";
  };

  const resetImageUi = () => {
    releasePreview();
    setImagePreview("");
    setImageName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFormError("Please choose a JPEG, PNG or WebP image.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setFormError(
        `That image is larger than ${MAX_IMAGE_BYTES / (1024 * 1024)} MB. Please choose a smaller one.`
      );
      return;
    }

    setUploading(true);
    setFormError("");

    /* Show the picture straight away rather than after the round trip. */
    releasePreview();
    const localUrl = URL.createObjectURL(file);
    previewUrlRef.current = localUrl;
    setImagePreview(localUrl);
    setImageName(file.name);

    const result = await uploadImage(file);
    if (!result.ok) {
      setFormError(result.error);
      setUploading(false);
      return;
    }

    setForm((previous) => ({ ...previous, image: result.url }));
    setUploading(false);
  };

  const clearImage = () => {
    resetImageUi();
    resetContentImageUi();
    setForm((previous) => ({ ...previous, image: "" }));
  };

  /* Uploads through the SAME /api/admin/upload endpoint as the hero image. */
  const handleContentImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFormError("Please choose a JPEG, PNG or WebP image.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setFormError(
        `That image is larger than ${MAX_IMAGE_BYTES / (1024 * 1024)} MB. Please choose a smaller one.`
      );
      return;
    }

    setUploadingContent(true);
    setFormError("");

    if (contentPreviewUrlRef.current) URL.revokeObjectURL(contentPreviewUrlRef.current);
    const localUrl = URL.createObjectURL(file);
    contentPreviewUrlRef.current = localUrl;
    setContentImagePreview(localUrl);
    setContentImageName(file.name);

    const result = await uploadImage(file);
    if (!result.ok) {
      setFormError(result.error);
      setUploadingContent(false);
      return;
    }

    setForm((previous) => ({ ...previous, contentImage: result.url }));
    setUploadingContent(false);
  };

  const clearContentImage = () => {
    resetContentImageUi();
    setForm((previous) => ({ ...previous, contentImage: "" }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, date: todayIso() });
    resetImageUi();
    resetContentImageUi();
    setFormError("");
    setNotice("");
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title || "",
      content: blog.content || "",
      date: blog.date || "",
      image: blog.image || "",
      imageAlt: blog.imageAlt || "",
      contentImage: blog.contentImage || "",
    });
    /* No preview here: the file input holds a stored path, not a file. The
       Remove image button is what clears the stored image. */
    resetImageUi();
    resetContentImageUi();
    setImageName(blog.image || "");
    setContentImageName(blog.contentImage || "");
    setFormError("");
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (uploading) return;

    setSaving(true);
    setFormError("");
    setNotice("");

    const endpoint = editingId ? `/api/blogs/${editingId}` : "/api/blogs";

    try {
      const response = await fetch(apiUrl(endpoint), {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await readJson(response);

      if (!response.ok || !result?.ok) {
        setFormError(result?.error || `The blog could not be saved (HTTP ${response.status}).`);
        return;
      }

      setNotice(editingId ? "Blog updated." : "Blog added.");
      setEditingId(null);
      setForm({ ...EMPTY_FORM, date: todayIso() });
      resetImageUi();
    resetContentImageUi();
      await refresh();
    } catch {
      setFormError("The blog could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(`Delete "${blog.title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const response = await fetch(apiUrl(`/api/blogs/${blog.id}`), {
        method: "DELETE",
        credentials: "include",
      });

      const result = await readJson(response);
      if (!response.ok || !result?.ok) {
        setListError(result?.error || `The blog could not be deleted (HTTP ${response.status}).`);
        return;
      }

      if (editingId === blog.id) handleCancel();

      setNotice("Blog deleted.");
      await refresh();
    } catch {
      setListError("The blog could not be deleted. Please try again.");
    }
  };

  return (
    <div className="auvd-admin-blogs">
      <section className="auvd-admin-panel">
        <h2 className="auvd-admin-panel-title">Blog Management</h2>
        <p className="auvd-admin-muted">
          Add, edit and remove blog articles. These are stored separately and are not shown on the
          public site yet.
        </p>

        <form className="auvd-admin-form" onSubmit={handleSubmit}>
          <div className="auvd-admin-dash-field">
            <label htmlFor="ab-title">Blog Title</label>
            <input
              id="ab-title"
              type="text"
              value={form.title}
              onChange={handleField("title")}
              disabled={saving}
              required
            />
          </div>

          <div className="auvd-admin-dash-field">
            <label htmlFor="ab-content">Blog Content</label>
            {/* Rich text instead of the old <textarea>. `form.content` is bound
                exactly as the textarea was, so the edit form, clearing the field
                and the existing API calls all keep working unchanged. Existing
                plain-text articles load as-is. */}
            <ReactQuill
              id="ab-content"
              theme="snow"
              modules={CONTENT_MODULES}
              formats={CONTENT_FORMATS}
              value={form.content}
              onChange={handleRichField("content")}
              disabled={saving}
            />
          </div>

          <div className="auvd-admin-dash-field">
            <label htmlFor="ab-date">Date</label>
            <input
              id="ab-date"
              type="date"
              value={form.date}
              onChange={handleField("date")}
              disabled={saving}
            />
          </div>

          <div className="auvd-admin-dash-field">
            <label htmlFor="ab-image">Blog Image</label>
            <input
              id="ab-image"
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={handleImage}
              disabled={saving || uploading || uploadingContent}
            />

            {form.image ? (
              <button type="button" className="auvd-admin-secondary" onClick={clearImage} disabled={saving}>
                Remove image
              </button>
            ) : null}

            <p className="auvd-admin-image-name">
              {imageName || form.image || "No image selected"}
            </p>

            {imagePreview || form.image ? (
              <img className="auvd-admin-preview" src={imagePreview || imageUrl(form.image)} alt="" />
            ) : null}
          </div>

          {/* SECOND image. Separate from the hero image above: this one is
              shown inside the article body on the Blog Details page. It uploads
              through the same endpoint and is stored as its own field. */}
          <div className="auvd-admin-dash-field">
            <label htmlFor="ab-contentImage">Blog Content Image</label>
            <input
              id="ab-contentImage"
              ref={contentImageRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={handleContentImage}
              disabled={saving || uploadingContent}
            />

            {form.contentImage ? (
              <button
                type="button"
                className="auvd-admin-secondary"
                onClick={clearContentImage}
                disabled={saving}
              >
                Remove image
              </button>
            ) : null}

            <p className="auvd-admin-image-name">
              {contentImageName || form.contentImage || "No content image selected"}
            </p>

            {contentImagePreview || form.contentImage ? (
              <img
                className="auvd-admin-preview"
                src={contentImagePreview || imageUrl(form.contentImage)}
                alt=""
              />
            ) : null}
          </div>

          <div className="auvd-admin-dash-field">
            <label htmlFor="ab-imageAlt">Image Alt Text</label>
            <input
              id="ab-imageAlt"
              type="text"
              value={form.imageAlt}
              onChange={handleField("imageAlt")}
              disabled={saving}
            />
          </div>

          {formError ? (
            <p className="auvd-admin-dash-error" role="alert">
              {formError}
            </p>
          ) : null}

          {notice ? (
            <p className="auvd-admin-muted" role="status">
              {notice}
            </p>
          ) : null}

          <div className="auvd-admin-actions">
            <button type="submit" className="auvd-admin-primary" disabled={saving || uploading || uploadingContent}>
              {saving ? "Saving..." : editingId ? "Update Blog" : "Add Blog"}
            </button>

            {editingId ? (
              <button type="button" className="auvd-admin-secondary" onClick={handleCancel} disabled={saving}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="auvd-admin-panel">
        <h3 className="auvd-admin-panel-title">Saved Blogs ({blogs.length})</h3>

        {listStatus === "loading" ? (
          <p className="auvd-admin-muted" role="status">
            Loading...
          </p>
        ) : listStatus === "error" ? (
          <p className="auvd-admin-dash-error" role="alert">
            {listError}
          </p>
        ) : blogs.length === 0 ? (
          <p className="auvd-admin-muted">No blogs saved yet. Use the form above to add your first one.</p>
        ) : (
          <ul className="auvd-admin-list">
            {blogs.map((blog) => (
              <li className="auvd-admin-list-item" key={blog.id}>
                {blog.image ? <img className="auvd-admin-thumb" src={imageUrl(blog.image)} alt="" /> : null}

                <div className="auvd-admin-list-body">
                  <p className="auvd-admin-list-caption">{blog.title}</p>
                  <p className="auvd-admin-list-meta">
                    {blog.date}
                    {blog.content && blog.content.length > PREVIEW_LENGTH
                      ? ` · ${blog.content.slice(0, PREVIEW_LENGTH).trimEnd()}...`
                      : blog.content
                        ? ` · ${blog.content}`
                        : ""}
                  </p>
                </div>

                <div className="auvd-admin-list-buttons">
                  <button type="button" className="auvd-admin-secondary" onClick={() => handleEdit(blog)}>
                    Edit
                  </button>
                  <button type="button" className="auvd-admin-danger" onClick={() => handleDelete(blog)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
