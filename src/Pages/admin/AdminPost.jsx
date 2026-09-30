import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPost.css";

/* ==========================================================================
   /admin/post — the dashboard: add, edit and delete feed posts.

   WHAT THIS IS
   ------------
   An internal tool, not a public page. It has no Navbar and no Footer, does
   not use the site's i18n (it is read by one person, in one language), and
   only borrows the --impact-* colour tokens where they cost nothing. What it
   does share with the public site is the shape of the data: the seven fields
   here are exactly the seven GET /api/posts returns, so a post saved here is
   the post visitors see on /our-impact/post.

   THE AUTH GATE — READ THIS BEFORE THE RENDER
   --------------------------------------------
   `auth` starts as "checking" and NOTHING admin-only is rendered until
   GET /api/admin/me has come back and said yes. That check runs on mount,
   before the post list is even requested, and it is not cosmetic: it is what
   stops the form and the Edit/Delete buttons from flashing on screen for a
   moment when an unauthenticated visitor opens this URL directly. Until it
   passes, the only thing on screen is a short "Checking…" line.

   The real protection is server-side — every write endpoint calls
   requireAdmin() — so this is a UX guard, not the security boundary. Bypassing
   it in the browser would reveal the form and nothing more: each POST, PUT and
   DELETE would still answer 401.

   EVERY FETCH SENDS CREDENTIALS
   -----------------------------
   The session is an httpOnly cookie, so `credentials: "include"` is what makes
   the browser attach it. Every request below sets it, without exception.
   ========================================================================== */

/** The four topics, in the order they appear in the dropdown. */
const TOPICS = [
  { value: "education", label: "Education" },
  { value: "music", label: "Music" },
  { value: "dance", label: "Dance" },
  { value: "vocational", label: "Vocational Training" },
];

/** A blank form. Also the shape every form field is keyed by. */
const EMPTY_FORM = {
  date: "",
  topic: "education",
  image: "",
  imageAlt: "",
  caption: "",
  paragraph: "",
};

/** Reads a JSON body, tolerating an empty or non-JSON answer. */
const readJson = async (response) => response.json().catch(() => null);

/**
 * POST /api/posts — adds a post.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
async function createPost(form) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });

  const result = await readJson(response);
  if (!response.ok || !result?.ok) {
    return { ok: false, error: result?.error || `Could not save the post (HTTP ${response.status}).` };
  }
  return { ok: true };
}

/** PUT /api/posts/:id — saves an edit. */
async function updatePost(id, form) {
  const response = await fetch(`/api/posts/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });

  const result = await readJson(response);
  if (!response.ok || !result?.ok) {
    return { ok: false, error: result?.error || `Could not save the post (HTTP ${response.status}).` };
  }
  return { ok: true };
}

/** DELETE /api/posts/:id — removes a post. */
async function deletePost(id) {
  const response = await fetch(`/api/posts/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await readJson(response);
  if (!response.ok || !result?.ok) {
    return { ok: false, error: result?.error || `Could not delete the post (HTTP ${response.status}).` };
  }
  return { ok: true };
}

/** POST /api/admin/logout — ends the session and returns to the home page. */
async function logout() {
  await fetch("/api/admin/logout", { method: "POST", credentials: "include" }).catch(() => null);
  /* A navigation happens either way: if the request failed the cookie may still
     be there, but leaving the admin on a page they asked to leave is the right
     call, and a reload will send them back to the login form if it is. */
}

const AdminPost = () => {
  const navigate = useNavigate();

  /* "checking" | "allowed" | "denied". Nothing admin-only renders unless this
     is "allowed" — see the note at the top of the file. */
  const [auth, setAuth] = useState("checking");

  const [posts, setPosts] = useState([]);
  const [postsStatus, setPostsStatus] = useState("loading"); // loading | ready | error
  const [listError, setListError] = useState("");

  /* The form is shared by "add new" and "edit existing". `editingId` is null
     when adding, and the post's id when editing — that one value is what
     decides whether Save POSTs or PUTs. */
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  /* The list, refetched after every successful write so what is on screen is
     always what the database actually holds. */
  const refreshPosts = useCallback(async () => {
    setPostsStatus("loading");
    try {
      const response = await fetch("/api/posts", { credentials: "include" });
      const result = await readJson(response);

      if (!response.ok || !result?.ok || !Array.isArray(result.posts)) {
        throw new Error(`HTTP ${response.status}`);
      }

      setPosts(result.posts);
      setPostsStatus("ready");
      setListError("");
    } catch (error) {
      console.error(`[admin] could not load posts: ${error?.message ?? error}`);
      setPostsStatus("error");
      setListError("Could not load the posts. Check your connection and reload.");
    }
  }, []);

  /* The auth gate. Runs once, before anything else is requested. */
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const response = await fetch("/api/admin/me", { credentials: "include" });

        if (cancelled) return;

        if (response.ok) {
          setAuth("allowed");
          /* Only now, with the session confirmed, is the list fetched. */
          refreshPosts();
        } else {
          /* 401 is the normal answer for someone who simply is not signed in,
             not an error worth logging. */
          setAuth("denied");
        }
      } catch (error) {
        if (cancelled) return;
        /* A network failure must NOT be treated as "allowed" — failing closed
           is the whole point of this gate. The visitor is sent to the login
           form, where the real check happens again. */
        console.error(`[admin] the session check could not reach the server: ${error?.message ?? error}`);
        setAuth("denied");
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [refreshPosts]);

  /* Redirect to the login form once we know there is no session. replace:true
     so the dashboard is not left in history for the back button to return to. */
  useEffect(() => {
    if (auth === "denied") {
      navigate("/admin/login", { replace: true });
    }
  }, [auth, navigate]);

  const handleField = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    /* Typing clears a stale error, so the message never contradicts the form. */
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setFormError("");
    setNotice("");

    const result = editingId ? await updatePost(editingId, form) : await createPost(form);

    if (!result.ok) {
      setFormError(result.error);
      setSaving(false);
      return;
    }

    /* Saved: clear the form back to "add new" and reload the list, so the next
       post starts from a blank form rather than the one just submitted. */
    setForm(EMPTY_FORM);
    setEditingId(null);
    setNotice(editingId ? "Post updated." : "Post added.");
    setSaving(false);
    refreshPosts();
  };

  /** Loads a post into the form and switches it to edit mode. */
  const handleEdit = (post) => {
    setForm({
      date: post.date,
      topic: post.topic,
      image: post.image,
      imageAlt: post.imageAlt,
      caption: post.caption,
      paragraph: post.paragraph,
    });
    setEditingId(post.id);
    setFormError("");
    setNotice("");
  };

  /** Returns the form to "add new" without saving anything. */
  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
  };

  const handleDelete = async (post) => {
    /* A real confirmation, because there is no undo: this is a DELETE on the
       database and the post leaves the public feed immediately. */
    const confirmed = window.confirm("Are you sure? This deletes the post for good.");
    if (!confirmed) return;

    setNotice("");
    const result = await deletePost(post.id);

    if (!result.ok) {
      setNotice(result.error);
      return;
    }

    /* If the deleted post was open in the form, drop back to "add new" rather
       than leaving it loaded — the next Save would otherwise fail on a post
       that no longer exists. */
    if (editingId === post.id) handleCancel();

    setNotice("Post deleted.");
    refreshPosts();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  /* ---- The gate. Nothing below this line renders until the session is
     confirmed, so the form and the Edit/Delete buttons are never briefly
     visible to someone who is not signed in. ---- */
  if (auth !== "allowed") {
    return (
      <main className="auvd-admin">
        <p className="auvd-admin-checking" role="status">
          {auth === "denied" ? "Redirecting to the login form..." : "Checking..."}
        </p>
      </main>
    );
  }

  return (
    <main className="auvd-admin">
      <header className="auvd-admin-header">
        <div>
          <h1 className="auvd-admin-title">Post</h1>
          <p className="auvd-admin-subtitle">
            Add, edit and delete the posts shown on /our-impact/post.
          </p>
        </div>
        <button type="button" className="auvd-admin-logout" onClick={handleLogout}>
          Log out
        </button>
      </header>

      {notice ? (
        <p className="auvd-admin-notice" role="status" aria-live="polite">
          {notice}
        </p>
      ) : null}

      <div className="auvd-admin-grid">
        {/* ===== FORM ===== */}
        <section className="auvd-admin-panel">
          <h2 className="auvd-admin-panel-title">
            {editingId ? "Edit post" : "Add a post"}
          </h2>

          <form className="auvd-admin-dash-form" onSubmit={handleSubmit} noValidate>
            <div className="auvd-admin-dash-field">
              <label htmlFor="ap-date">Date</label>
              <input
                id="ap-date"
                type="date"
                required
                value={form.date}
                onChange={handleField("date")}
                disabled={saving}
              />
            </div>

            <div className="auvd-admin-dash-field">
              <label htmlFor="ap-topic">Topic</label>
              <select
                id="ap-topic"
                required
                value={form.topic}
                onChange={handleField("topic")}
                disabled={saving}
              >
                {TOPICS.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="auvd-admin-dash-field">
              <label htmlFor="ap-image">Image URL</label>
              <input
                id="ap-image"
                type="text"
                required
                placeholder="/moments/example.jpg or https://..."
                value={form.image}
                onChange={handleField("image")}
                disabled={saving}
              />

              {/* A live preview once there is something to preview, so a wrong
                  URL is obvious before the post is saved. alt is empty because
                  this is a preview of an image whose real alt text is a
                  separate field below, and repeating it would be noise. */}
              {form.image.trim() ? (
                <img className="auvd-admin-preview" src={form.image.trim()} alt="" />
              ) : null}
            </div>

            <div className="auvd-admin-dash-field">
              <label htmlFor="ap-imageAlt">Image alt text</label>
              <input
                id="ap-imageAlt"
                type="text"
                required
                value={form.imageAlt}
                onChange={handleField("imageAlt")}
                disabled={saving}
              />
            </div>

            <div className="auvd-admin-dash-field">
              <label htmlFor="ap-caption">Caption</label>
              <input
                id="ap-caption"
                type="text"
                required
                value={form.caption}
                onChange={handleField("caption")}
                disabled={saving}
              />
            </div>

            <div className="auvd-admin-dash-field">
              <label htmlFor="ap-paragraph">Paragraph</label>
              <textarea
                id="ap-paragraph"
                rows={5}
                required
                value={form.paragraph}
                onChange={handleField("paragraph")}
                disabled={saving}
              />
            </div>

            {formError ? (
              <p className="auvd-admin-dash-error" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="auvd-admin-actions">
              <button type="submit" className="auvd-admin-primary" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>

              {/* Only offered in edit mode: there is nothing to cancel when the
                  form is already blank. */}
              {editingId ? (
                <button
                  type="button"
                  className="auvd-admin-secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="auvd-admin-panel">
          <h2 className="auvd-admin-panel-title">Posts ({posts.length})</h2>

          {postsStatus === "loading" ? (
            <p className="auvd-admin-muted" role="status">
              Loading...
            </p>
          ) : postsStatus === "error" ? (
            <p className="auvd-admin-dash-error" role="alert">
              {listError}
            </p>
          ) : posts.length === 0 ? (
            <p className="auvd-admin-muted">
              No posts yet. Add the first one with the form.
            </p>
          ) : (
            <ul className="auvd-admin-list">
              {posts.map((post) => (
                <li className="auvd-admin-list-item" key={post.id}>
                  <img className="auvd-admin-thumb" src={post.image} alt="" />

                  <div className="auvd-admin-list-body">
                    <p className="auvd-admin-list-caption">{post.caption}</p>
                    <p className="auvd-admin-list-meta">
                      {post.date} &middot; {post.topic}
                    </p>
                  </div>

                  <div className="auvd-admin-list-buttons">
                    <button
                      type="button"
                      className="auvd-admin-secondary"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="auvd-admin-danger"
                      onClick={() => handleDelete(post)}
                    >
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
};

export default AdminPost;
