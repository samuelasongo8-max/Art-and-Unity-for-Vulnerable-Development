import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPost.css";

/* ==========================================================================
   /admin/news — News Management.

   A SEPARATE page inside the existing Admin Dashboard, not a redesign of it. It
   reuses the same building blocks the Posts dashboard already uses:

     - the same /api/admin/me auth gate, and the same redirect when it denies
     - the same dashboard CSS (AdminPost.css), so it looks like the dashboard
     - the same image picker and /api/admin/upload endpoint
     - the same create / edit / delete shape

   WHAT IT DOES NOT TOUCH
   ---------------------
   The four news items already on the site live in src/data/news.json. This page
   never reads or writes that file; it only manages items in the "news"
   collection, which News.jsx merges with the file at render time. Nothing here
   can change an existing news item.

   FIELDS
   ------
   Chosen to match what the existing News.jsx cards already render: a topic (the
   page groups by topic), a title, a body, a date, and an optional image with its
   alt text. Date is what puts a new item at the top of its topic.
   ========================================================================== */

/** Must match TOPICS in lib/newsValidation.js. */
const TOPICS = ["education", "music", "dance", "vocational"];

const EMPTY_FORM = { date: "", topic: "education", image: "", imageAlt: "", title: "", body: "" };

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Today's date, so the date field is never blank on a new item. */
const todayIso = () => new Date().toISOString().slice(0, 10);

const readJson = async (response) => response.json().catch(() => null);

/** Sends the chosen image to the existing upload endpoint and returns its URL. */
async function uploadImage(file) {
  const response = await fetch("/api/admin/upload", {
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

function AdminNews() {
  const navigate = useNavigate();

  const [auth, setAuth] = useState("checking");
  const [items, setItems] = useState([]);
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

  const refresh = useCallback(async () => {
    setListStatus("loading");
    try {
      const response = await fetch("/api/news", { credentials: "include" });
      const result = await readJson(response);

      if (!response.ok || !result?.ok || !Array.isArray(result.news)) {
        throw new Error(`HTTP ${response.status}`);
      }

      setItems(result.news);
      setListStatus("ready");
      setListError("");
    } catch (error) {
      console.error(`[admin] could not load news: ${error?.message ?? error}`);
      setListStatus("error");
      setListError("Could not load the news. Check your connection and reload.");
    }
  }, []);

  /* The auth gate — identical to the Posts dashboard. Nothing is requested until
     the session is confirmed, and a network failure fails CLOSED. */
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const response = await fetch("/api/admin/me", { credentials: "include" });
        if (cancelled) return;

        if (response.ok) {
          setAuth("allowed");
          refresh();
        } else {
          setAuth("denied");
        }
      } catch (error) {
        if (cancelled) return;
        console.error(`[admin] the session check could not reach the server: ${error?.message ?? error}`);
        setAuth("denied");
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => {
    if (auth === "denied") {
      navigate("/admin/login", { replace: true });
    }
  }, [auth, navigate]);

  const handleField = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  /* ---- IMAGE SELECTION — the same picker the Posts dashboard uses ---- */

  const clearPreview = useCallback(() => {
    setImagePreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return "";
    });
  }, []);

  useEffect(() => clearPreview, [clearPreview]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    /* Cleared so choosing the same file twice in a row still fires onChange. */
    event.target.value = "";
    if (!file) return;

    setFormError("");

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFormError(`"${file.name}" is not a supported image. Please choose a JPG, PNG or WEBP file.`);
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setFormError(`"${file.name}" is too large (max ${MAX_IMAGE_BYTES / (1024 * 1024)} MB).`);
      return;
    }

    clearPreview();
    setImagePreview(URL.createObjectURL(file));
    setImageName(file.name);
    setUploading(true);

    const result = await uploadImage(file);
    setUploading(false);

    if (!result.ok) {
      /* Nothing was stored, so the form must not be left holding a preview that
         looks chosen but would save a broken item. */
      clearPreview();
      setImageName("");
      setFormError(result.error);
      return;
    }

    setForm((current) => ({ ...current, image: result.url }));
  };

  const handleRemoveImage = () => {
    clearPreview();
    setImageName("");
    setForm((current) => ({ ...current, image: "" }));
    setFormError("");
  };

  /* ---- CRUD ---- */

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving || uploading) return;

    setSaving(true);
    setFormError("");
    setNotice("");

    const url = editingId ? `/api/news/${encodeURIComponent(editingId)}` : "/api/news";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const result = await readJson(response);

      if (!response.ok || !result?.ok) {
        setFormError(result?.error || `Could not save the news (HTTP ${response.status}).`);
        return;
      }

      setNotice(
        editingId ? "News updated." : "News published. It appears on the News page straight away."
      );
      setForm({ ...EMPTY_FORM, date: todayIso() });
      clearPreview();
      setImageName("");
      setEditingId(null);
      await refresh();
    } catch (error) {
      setFormError(`Could not reach the server: ${error?.message ?? error}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      date: item.date,
      topic: item.topic,
      image: item.image ?? "",
      imageAlt: item.imageAlt?.en ?? "",
      title: item.title?.en ?? "",
      /* The stored body is an array of paragraphs, joined back into text for the
         textarea and split again on save. */
      body: (item.body?.en ?? []).join("\n\n"),
    });
    clearPreview();
    setImageName("");
    setEditingId(item.id);
    setFormError("");
    setNotice("");
  };

  const handleCancel = () => {
    setForm({ ...EMPTY_FORM, date: todayIso() });
    clearPreview();
    setImageName("");
    setEditingId(null);
    setFormError("");
  };

  const handleDelete = async (item) => {
    /* Native confirm, so nothing is removed by a mis-click. The wording is
       explicit because this page only ever sees dashboard-created items. */
    const confirmed = window.confirm(
      `Delete this news item?\n\n"${item.title?.en ?? ""}"\n\nOnly items created in this dashboard can be deleted. The site's existing news is not affected.`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/news/${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await readJson(response);

      if (!response.ok || !result?.ok) {
        setListError(result?.error || `Could not delete the news (HTTP ${response.status}).`);
        return;
      }

      if (editingId === item.id) handleCancel();
      await refresh();
    } catch (error) {
      setListError(`Could not reach the server: ${error?.message ?? error}`);
    }
  };

  if (auth === "checking") {
    return (
      <main className="auvd-admin-dash">
        <p className="auvd-admin-muted" role="status">
          Checking...
        </p>
      </main>
    );
  }

  return (
    <main className="auvd-admin-dash">
      <header className="auvd-admin-dash-head">
        <h1 className="auvd-admin-dash-title">News Management</h1>
        <p className="auvd-admin-muted">
          Publish a news item and it appears on the public News page immediately, ordered by date.
          The news already on the site is managed separately and is not listed or altered here.
        </p>
      </header>

      <div className="auvd-admin-dash-grid">
        <section className="auvd-admin-panel">
          <h2 className="auvd-admin-panel-title">{editingId ? "Edit News" : "Add News"}</h2>

          <form className="auvd-admin-form" onSubmit={handleSubmit} noValidate>
            <div className="auvd-admin-dash-field">
              <label htmlFor="an-title">Title</label>
              <input
                id="an-title"
                type="text"
                required
                value={form.title}
                onChange={handleField("title")}
                disabled={saving}
              />
            </div>

            <div className="auvd-admin-dash-field">
              <label htmlFor="an-topic">Topic</label>
              {/* The same four topics the public News page groups by. */}
              <select id="an-topic" value={form.topic} onChange={handleField("topic")} disabled={saving}>
                {TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div className="auvd-admin-dash-field">
              {/* The date is what decides the order, so it is stated here: a newer
                  date puts the item at the top of its topic. */}
              <label htmlFor="an-date">Publication date</label>
              <input
                id="an-date"
                type="date"
                required
                value={form.date}
                onChange={handleField("date")}
                disabled={saving}
              />
            </div>

            <div className="auvd-admin-dash-field">
              <label htmlFor="an-body">Content</label>
              <textarea
                id="an-body"
                rows={7}
                required
                placeholder="One paragraph. Leave a blank line between paragraphs."
                value={form.body}
                onChange={handleField("body")}
                disabled={saving}
              />
            </div>

            {/* Same picker as the Posts dashboard. */}
            <div className="auvd-admin-dash-field">
              <label htmlFor="an-image">Image (optional)</label>

              <input
                id="an-image"
                type="file"
                className="auvd-admin-file-input"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={handleImageChange}
                disabled={saving || uploading}
              />

              <div className="auvd-admin-image-row">
                <label htmlFor="an-image" className="auvd-admin-file-btn">
                  {imageName || form.image ? "Change Image" : "Choose Image"}
                </label>

                {uploading ? <span className="auvd-admin-image-status">Uploading...</span> : null}

                {imageName || form.image ? (
                  <button
                    type="button"
                    className="auvd-admin-secondary"
                    onClick={handleRemoveImage}
                    disabled={saving || uploading}
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <p className="auvd-admin-image-name">
                {imageName || form.image || "No image selected"}
              </p>

              {imagePreview || form.image ? (
                <img className="auvd-admin-preview" src={imagePreview || form.image.trim()} alt="" />
              ) : null}
            </div>

            <div className="auvd-admin-dash-field">
              <label htmlFor="an-imageAlt">Image description (alt text)</label>
              <input
                id="an-imageAlt"
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
              <button type="submit" className="auvd-admin-primary" disabled={saving || uploading}>
                {saving ? "Saving..." : editingId ? "Save Changes" : "Publish News"}
              </button>

              {editingId ? (
                <button type="button" className="auvd-admin-secondary" onClick={handleCancel} disabled={saving}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="auvd-admin-panel">
          <h2 className="auvd-admin-panel-title">Published News ({items.length})</h2>

          {listStatus === "loading" ? (
            <p className="auvd-admin-muted" role="status">
              Loading...
            </p>
          ) : listStatus === "error" ? (
            <p className="auvd-admin-dash-error" role="alert">
              {listError}
            </p>
          ) : items.length === 0 ? (
            <p className="auvd-admin-muted">
              No news published from this dashboard yet. The news already on the site is unaffected.
            </p>
          ) : (
            <ul className="auvd-admin-list">
              {items.map((item) => (
                <li className="auvd-admin-list-item" key={item.id}>
                  {item.image ? <img className="auvd-admin-thumb" src={item.image} alt="" /> : null}

                  <div className="auvd-admin-list-body">
                    <p className="auvd-admin-list-caption">{item.title?.en}</p>
                    <p className="auvd-admin-list-meta">
                      {item.date} &middot; {item.topic}
                    </p>
                  </div>

                  <div className="auvd-admin-list-buttons">
                    <button type="button" className="auvd-admin-secondary" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button type="button" className="auvd-admin-danger" onClick={() => handleDelete(item)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminNews;