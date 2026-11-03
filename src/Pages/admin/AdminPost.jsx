import { apiUrl, imageUrl } from "../../utils/api";
import { getDriveImageUrl } from "../../utils/driveImage";
import SafeImage from "../../components/SafeImage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./AdminPost.css";
import BlogManagement from "./AdminBlog";

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
 * POST /api/admin/upload — sends the chosen image to the server.
 *
 * The server expects one multipart field named "image". Let the browser set the
 * multipart Content-Type and boundary; the returned Cloudinary URL is saved
 * with the post.
 *
 * @returns {Promise<{ ok: boolean, url?: string, error?: string }>}
 */
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file, file.name);

  let response;
  try {
    response = await fetch(apiUrl("/api/admin/upload"), {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } catch (error) {
    return {
      ok: false,
      error: `Could not reach the image upload service: ${error?.message ?? "Network error."}`,
    };
  }

  const result = await readJson(response);
  if (!response.ok || !result?.ok) {
    return { ok: false, error: result?.error || `The image could not be saved (HTTP ${response.status}).` };
  }

  return { ok: true, url: result.url };
}

/** The formats the picker offers, mirroring what the server accepts. */
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** The same 10 MB limit the server enforces. Checked here so the file is
 *  refused before it is uploaded, not after. */
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/* ==========================================================================
   THE RICH-TEXT EDITOR

   The Paragraph field used to be a plain <textarea>. It is now a Quill editor
   so an admin can format the text before saving, exactly like the Blog Content
   field in AdminBlog.jsx.

   THE TOOLBAR
   -----------
   Only the eight formatting controls that were asked for are listed, nothing
   else, so the bar stays as simple as a basic Word toolbar:

     bullet list · numbered list · text colour · theme colour · font ·
     increase size · decrease size · link · paragraph spacing

   `header` is included only so the paragraph-spacing and heading controls have
   something to act on; the inline formats (bold/italic/underline) are left in
   the text itself rather than added to the bar.

   THE VALUE IS HTML
   -----------------
   ReactQuill reports its contents as an HTML string, which is written straight
   into the existing `paragraph` field. No new database field is created and no
   API route changes: `paragraph` was already a string, and it is still a string.
   ========================================================================== */
const PARAGRAPH_MODULES = {
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
const PARAGRAPH_FORMATS = [
  "list", "color", "background", "font", "size", "link", "header", "align",
];

/**
 * POST /api/posts — adds a post.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
async function createPost(form) {
  const response = await fetch(apiUrl("/api/posts"), {
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
  const response = await fetch(apiUrl(`/api/posts/${encodeURIComponent(id)}`), {
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
  const response = await fetch(apiUrl(`/api/posts/${encodeURIComponent(id)}`), {
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
  await fetch(apiUrl("/api/admin/logout"), { method: "POST", credentials: "include" }).catch(() => null);
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

  const [reportTitle, setReportTitle] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportFileUrl, setReportFileUrl] = useState("");
  const [reportFileName, setReportFileName] = useState("");
  const [reportImageUrl, setReportImageUrl] = useState("");
  const [reportImageError, setReportImageError] = useState(false);
  const [reportImageLoaded, setReportImageLoaded] = useState(false);
  const [reportEditingId, setReportEditingId] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportsStatus, setReportsStatus] = useState("loading");
  const [reportsError, setReportsError] = useState("");
  const [reportDeleteError, setReportDeleteError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reportErrors, setReportErrors] = useState({});
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportFormOpen, setReportFormOpen] = useState(false);
  const reportSuccessTimer = useRef(null);

  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBody, setUpdateBody] = useState("");
  const [updateExcerpt, setUpdateExcerpt] = useState("");
  const [updateCategory, setUpdateCategory] = useState("Community");
  const [updateImageUrl, setUpdateImageUrl] = useState("");
  const [updateAuthor, setUpdateAuthor] = useState("");
  const [updateImageErr, setUpdateImageErr] = useState(false);
  const [updateErrors, setUpdateErrors] = useState({});
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [updatesStatus, setUpdatesStatus] = useState("loading");
  const [updatesListError, setUpdatesListError] = useState("");
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [updateDeleteConfirm, setUpdateDeleteConfirm] = useState(null);
  const [updateDeleteLoading, setUpdateDeleteLoading] = useState(false);
  const [updateDeleteError, setUpdateDeleteError] = useState("");
  const updateSuccessTimer = useRef(null);

  /* ---- THE FEATURED IMAGE ----
     `image` in the form is always the stored URL that goes into MongoDB, never a
     temporary preview. `imageName` is the administrator's own filename, shown so
     they can recognise what they picked; it is never used as the stored path.
     `imagePreview` is a local object URL used ONLY to preview the file before it
     is uploaded, and it is revoked as soon as it is replaced — it is never
     saved, because an object URL dies with the page and would leave a broken
     image on the public page. */
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  /* The list, refetched after every successful write so what is on screen is
     always what the database actually holds. */
  const refreshPosts = useCallback(async () => {
    setPostsStatus("loading");
    try {
      const response = await fetch(apiUrl("/api/posts"), { credentials: "include" });
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

  const refreshReports = useCallback(async () => {
    setReportsStatus("loading");
    try {
      const response = await fetch(apiUrl("/api/reports"), { credentials: "include" });
      const result = await readJson(response);
      if (!response.ok || !result?.ok || !Array.isArray(result.reports)) {
        throw new Error(result?.error || `Could not load reports (HTTP ${response.status}).`);
      }

      setReports(result.reports);
      setReportsStatus("ready");
      setReportsError("");
    } catch (error) {
      console.error(`[admin] could not load reports: ${error?.message ?? error}`);
      setReportsStatus("error");
      setReportsError("Could not load reports. Check your connection and reload.");
    }
  }, []);

  const refreshCommunityUpdates = useCallback(async () => {
    setUpdatesStatus("loading");
    try {
      const response = await fetch(apiUrl("/api/updates"), {
        credentials: "include",
        cache: "no-store",
      });
      const result = await readJson(response);
      if (!response.ok || !result?.ok || !Array.isArray(result.updates)) {
        throw new Error(result?.error || `Could not load updates (HTTP ${response.status}).`);
      }

      setUpdates(result.updates);
      setUpdatesStatus("ready");
      setUpdatesListError("");
    } catch (error) {
      console.error(`[admin] could not load community updates: ${error?.message ?? error}`);
      setUpdatesStatus("error");
      setUpdatesListError("Could not load community updates. Check your connection and reload.");
    }
  }, []);

  /* The auth gate. Runs once, before anything else is requested. */
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const response = await fetch(apiUrl("/api/admin/me"), { credentials: "include" });

        if (cancelled) return;

        if (response.ok) {
          setAuth("allowed");
          /* Only now, with the session confirmed, is the list fetched. */
          refreshPosts();
          refreshReports();
          refreshCommunityUpdates();
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
  }, [refreshPosts, refreshReports, refreshCommunityUpdates]);

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

  /**
   * The rich-text editors do not fire a DOM event: ReactQuill's onChange hands
   * over the HTML string directly as its first argument. handleField() above is
   * left exactly as it was for every other field, and this reads the new value
   * the same way, so both paths behave identically.
   */
  const handleRichField = (field) => (html) => {
    setForm((current) => ({ ...current, [field]: html }));
    setFormError("");
  };

  /* ---- IMAGE SELECTION ---- */

  /** Drops the local preview URL so the browser can free the blob. */
  const clearPreview = useCallback(() => {
    setImagePreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return "";
    });
  }, []);

  /* The preview URL is released when the component unmounts, so navigating away
     mid-selection cannot leak the blob for the life of the tab. */
  useEffect(() => clearPreview, [clearPreview]);

  /**
   * Handles the device file picker.
   *
   * The file is validated here for an immediate answer, then uploaded straight
   * away — before the post is saved. That ordering is deliberate: by the time
   * Save is pressed, `form.image` already holds a real stored URL, so the post
   * can never be written pointing at an image that does not exist.
   */
  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    /* Cleared so choosing the same file twice in a row still fires onChange. */
    event.target.value = "";
    if (!file) return;

    setFormError("");

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFormError(
        `“${file.name}” is not a supported image. Please choose a JPG, PNG or WEBP file.`
      );
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setFormError(
        `“${file.name}” is too large (max ${MAX_IMAGE_BYTES / (1024 * 1024)} MB). Please choose a smaller image.`
      );
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
         looks chosen but would save as a broken post. */
      clearPreview();
      setImageName("");
      setFormError(result.error);
      return;
    }

    setForm((current) => ({ ...current, image: result.url }));
  };

  /** Removes the selected image, leaving the field empty. */
  const handleRemoveImage = () => {
    clearPreview();
    setImageName("");
    setForm((current) => ({ ...current, image: "" }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving || uploading) return;

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
       post starts from a blank form rather than the one just submitted. The
       image state is cleared with it, or the next post would appear to already
       have the previous post's image. */
    setForm(EMPTY_FORM);
    clearPreview();
    setImageName("");
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
    /* The post's saved image is already in `form.image`, so it stays exactly
       as it is unless a new file is chosen. The preview is cleared because the
       <img> below falls back to form.image for an existing post, and the
       administrator's original filename is not stored anywhere we can read it
       back from. */
    clearPreview();
    setImageName("");
    setEditingId(post.id);
    setFormError("");
    setNotice("");
  };

  /** Returns the form to "add new" without saving anything. */
  const handleCancel = () => {
    setForm(EMPTY_FORM);
    clearPreview();
    setImageName("");
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

  useEffect(() => () => {
    if (reportSuccessTimer.current) clearTimeout(reportSuccessTimer.current);
    if (updateSuccessTimer.current) clearTimeout(updateSuccessTimer.current);
  }, []);

  const validateReport = () => {
    const errors = {};
    if (!reportTitle.trim()) errors.reportTitle = "Report title is required";
    if (!reportCategory) errors.reportCategory = "Please select a category";
    if (!reportDate) errors.reportDate = "Report date is required";
    if (!isValidHttpUrl(reportFileUrl)) errors.fileUrl = "Enter a valid report link";
    if (reportImageUrl.trim() && !isValidHttpUrl(reportImageUrl)) {
      errors.imageUrl = "Enter a valid cover image link";
    }
    return errors;
  };

  const isValidHttpUrl = (value) => {
    try {
      const url = new URL(value.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    if (reportSubmitting) return;

    const errors = validateReport();
    if (Object.keys(errors).length > 0) {
      setReportErrors(errors);
      setReportSuccess("");
      return;
    }

    setReportSubmitting(true);
    setReportErrors({});

    try {
      const response = await fetch(
        apiUrl(reportEditingId ? `/api/reports/${reportEditingId}` : "/api/reports"),
        {
          method: reportEditingId ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: reportTitle,
            category: reportCategory,
            reportDate,
            description: reportDesc,
            fileUrl: reportFileUrl,
            fileName: reportFileName.trim() || reportTitle,
            imageUrl: getDriveImageUrl(reportImageUrl),
          }),
        }
      );

      const result = await readJson(response);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || `Could not save the report (HTTP ${response.status}).`);
      }

      setReportSuccess(reportEditingId ? "Report updated successfully!" : "Report submitted successfully!");
      setReportTitle("");
      setReportCategory("");
      setReportDate("");
      setReportDesc("");
      setReportFileUrl("");
      setReportFileName("");
      setReportImageUrl("");
      setReportImageError(false);
      setReportImageLoaded(false);
      setReportEditingId(null);
      await refreshReports();

      if (reportSuccessTimer.current) clearTimeout(reportSuccessTimer.current);
      reportSuccessTimer.current = setTimeout(() => {
        setReportSuccess("");
        reportSuccessTimer.current = null;
      }, 4000);
    } catch (error) {
      console.error("Report submit error:", error);
      setReportErrors({
        submit: error?.message || "Failed to submit the report. Try again.",
      });
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleReportEdit = (report) => {
    setReportTitle(report.title);
    setReportCategory(report.category);
    setReportDate(report.reportDate);
    setReportDesc(report.description || "");
    setReportFileUrl(report.fileUrl);
    setReportFileName(report.fileName || report.title);
    setReportImageUrl(report.imageUrl || "");
    setReportImageError(false);
    setReportImageLoaded(false);
    setReportEditingId(report.id);
    setReportErrors({});
    setReportSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReportCancelEdit = () => {
    setReportTitle("");
    setReportCategory("");
    setReportDate("");
    setReportDesc("");
    setReportFileUrl("");
    setReportFileName("");
    setReportImageUrl("");
    setReportImageError(false);
    setReportImageLoaded(false);
    setReportEditingId(null);
    setReportErrors({});
    setReportSuccess("");
  };

  const handleReportDelete = async (id) => {
    setDeleteLoading(true);
    setReportDeleteError("");

    try {
      const response = await fetch(apiUrl(`/api/reports/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      const result = await readJson(response);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || `Could not delete report (HTTP ${response.status}).`);
      }

      if (reportEditingId === id) handleReportCancelEdit();
      setDeleteConfirm(null);
      setReportDeleteError("");
      await refreshReports();
    } catch (error) {
      console.error("Report delete error:", error);
      setReportDeleteError(error?.message || "Could not delete the report. Try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetCommunityUpdateForm = () => {
    setUpdateTitle("");
    setUpdateBody("");
    setUpdateExcerpt("");
    setUpdateCategory("Community");
    setUpdateImageUrl("");
    setUpdateAuthor("");
    setUpdateImageErr(false);
    setUpdateErrors({});
    setEditingUpdateId(null);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    if (updateSubmitting) return;

    const errors = {};
    if (!updateTitle.trim()) errors.title = "Title is required";
    if (!updateBody.trim()) errors.body = "Body content is required";
    if (updateImageUrl.trim() && !isValidHttpUrl(updateImageUrl)) {
      errors.imageUrl = "Enter a valid image link";
    }

    if (Object.keys(errors).length > 0) {
      setUpdateErrors(errors);
      setUpdateSuccess(false);
      return;
    }

    setUpdateSubmitting(true);
    setUpdateErrors({});
    setUpdateSuccess(false);

    try {
      const response = await fetch(
        apiUrl(editingUpdateId ? `/api/updates/${editingUpdateId}` : "/api/updates"),
        {
          method: editingUpdateId ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updateTitle,
            body: updateBody,
            excerpt: updateExcerpt,
            category: updateCategory,
            imageUrl: getDriveImageUrl(updateImageUrl),
            author: updateAuthor,
          }),
        }
      );
      const result = await readJson(response);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || `Could not save update (HTTP ${response.status}).`);
      }

      setUpdateSuccess(true);
      resetCommunityUpdateForm();
      await refreshCommunityUpdates();
      if (updateSuccessTimer.current) clearTimeout(updateSuccessTimer.current);
      updateSuccessTimer.current = setTimeout(() => {
        setUpdateSuccess(false);
        updateSuccessTimer.current = null;
      }, 4000);
    } catch (error) {
      console.error("Community update submit error:", error);
      setUpdateErrors({ submit: error?.message || "Failed to post update. Try again." });
    } finally {
      setUpdateSubmitting(false);
    }
  };

  const handleUpdateEdit = (update) => {
    setUpdateTitle(update.title || "");
    setUpdateBody(update.body || "");
    setUpdateExcerpt(update.excerpt || "");
    setUpdateCategory(update.category || "Community");
    setUpdateImageUrl(update.imageUrl || "");
    setUpdateAuthor(update.author === "Admin" ? "" : update.author || "");
    setUpdateImageErr(false);
    setUpdateErrors({});
    setUpdateSuccess(false);
    setEditingUpdateId(update.id);
    document.getElementById("admin-community-updates")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpdateDelete = async (id) => {
    setUpdateDeleteLoading(true);
    setUpdateDeleteError("");

    try {
      const response = await fetch(apiUrl(`/api/updates/${encodeURIComponent(id)}`), {
        method: "DELETE",
        credentials: "include",
      });
      const result = await readJson(response);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || `Could not delete update (HTTP ${response.status}).`);
      }

      if (editingUpdateId === id) resetCommunityUpdateForm();
      setUpdateDeleteConfirm(null);
      await refreshCommunityUpdates();
    } catch (error) {
      console.error("Community update delete error:", error);
      setUpdateDeleteError(error?.message || "Could not delete update. Try again.");
    } finally {
      setUpdateDeleteLoading(false);
    }
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
          <h1 className="auvd-admin-title">{reportFormOpen ? "Make a Report" : "Post"}</h1>
          <p className="auvd-admin-subtitle">
            {reportFormOpen
              ? "Complete the form below to prepare a report."
              : "Add, edit and delete the posts shown on /our-impact/post."}
          </p>
        </div>
        <div className="auvd-admin-header-actions">
          <button type="button" className="auvd-admin-logout" onClick={handleLogout}>
            Log out
          </button>
          <button
            type="button"
            className={reportFormOpen ? "auvd-admin-secondary" : "auvd-admin-primary"}
            onClick={() => setReportFormOpen((open) => !open)}
            aria-expanded={reportFormOpen}
            aria-controls="admin-report-section"
          >
            {reportFormOpen ? "Back to Dashboard" : "Make a Report"}
          </button>
        </div>
      </header>

      {!reportFormOpen && notice ? (
        <p className="auvd-admin-notice" role="status" aria-live="polite">
          {notice}
        </p>
      ) : null}

      <div className={`auvd-admin-grid${reportFormOpen ? " auvd-admin-grid--report" : ""}`}>
        {!reportFormOpen ? (
          <>
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

            {/* ---- FEATURED IMAGE ----
                A file picker, not a URL box. The image is uploaded the moment it
                is chosen and `form.image` is set to the stored URL, so what
                Save writes to MongoDB is always a path that really exists.
                While an existing post is being edited its saved image is shown
                and left alone unless a new file is chosen. */}
            <div className="auvd-admin-dash-field">
              <label htmlFor="ap-image">Featured Image</label>

              {/* The real input is visually hidden but still the control the
                  label points at, so the picker opens on click AND on
                  keyboard activation, and it is a native file input — the OS
                  dialog does the rest. */}
              <input
                id="ap-image"
                type="file"
                className="auvd-admin-file-input"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={handleImageChange}
                disabled={saving || uploading}
              />

              <div className="auvd-admin-image-row">
                <label htmlFor="ap-image" className="auvd-admin-file-btn">
                  {imageName || form.image ? "Change Image" : "Choose Image"}
                </label>

                {uploading ? <span className="auvd-admin-image-status">Uploading…</span> : null}

                {/* Only offered once something is actually chosen, so it can
                    never clear a field that was already empty. */}
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

              {/* The preview shows the local file while it uploads, and the
                  STORED url afterwards. Falling back to form.image is what
                  makes an existing post's image visible when it is opened for
                  editing — no temporary blob is ever saved. alt is empty
                  because this is a preview, and the real alt text is the field
                  below. */}
              {imagePreview || form.image ? (
                <SafeImage
                  className="auvd-admin-preview"
                  src={imagePreview || imageUrl(form.image)}
                  alt=""
                  fallbackLabel="Image preview unavailable"
                />
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
              {/* Rich text instead of the old <textarea>. `form.paragraph` is
                  bound exactly as the textarea was, so handleField, the edit
                  form, clearing the field and the existing validation all keep
                  working unchanged. Plain-text posts load as-is: Quill renders
                  text without markup unchanged. */}
              <ReactQuill
                id="ap-paragraph"
                theme="snow"
                modules={PARAGRAPH_MODULES}
                formats={PARAGRAPH_FORMATS}
                value={form.paragraph}
                onChange={handleRichField("paragraph")}
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
                  <SafeImage
                    className="auvd-admin-thumb"
                    src={imageUrl(post.image)}
                    alt=""
                    fallbackLabel="Image unavailable"
                  />

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

        {/* Blog Management - its own section at the BOTTOM of the dashboard,
            below the Posts list above. This is the same component the standalone
            page used, so there is one Blog Management system, not two. */}
        <BlogManagement />
          </>
        ) : null}

        {reportFormOpen ? (
          <>
            <section id="admin-report-section" className="admin-report-section">
          {reportSuccess ? (
            <div className="admin-report-success" role="status" aria-live="polite">
              {reportSuccess}
            </div>
          ) : null}

          <h2 className="admin-report-title">
            {reportEditingId ? "Edit Report" : "Make a Report"}
          </h2>
          <form
            onSubmit={handleReportSubmit}
            className="admin-report-form"
            noValidate
          >
            {reportErrors.submit ? (
              <div className="admin-report-error" role="alert">
                {reportErrors.submit}
              </div>
            ) : null}

            <div className="admin-report-field">
              <label className="admin-report-label" htmlFor="ar-title">
                Report Title <span className="required">*</span>
              </label>
              <input
                id="ar-title"
                type="text"
                className="admin-report-input"
                placeholder="Enter report title"
                value={reportTitle}
                onChange={(event) => {
                  setReportTitle(event.target.value);
                  setReportErrors((current) => ({ ...current, reportTitle: "" }));
                }}
                aria-invalid={Boolean(reportErrors.reportTitle)}
              />
              {reportErrors.reportTitle ? (
                <span className="admin-report-error" role="alert">{reportErrors.reportTitle}</span>
              ) : null}
            </div>

            <div className="admin-report-field">
              <label className="admin-report-label" htmlFor="ar-image-url">
                Cover Image Link
                <span className="admin-report-optional">(optional)</span>
              </label>
              <input
                id="ar-image-url"
                type="url"
                className="admin-report-input"
                placeholder="https://drive.google.com/file/d/.../view"
                value={reportImageUrl}
                onChange={(event) => {
                  setReportImageUrl(event.target.value);
                  setReportImageError(false);
                  setReportImageLoaded(false);
                  setReportErrors((current) => ({ ...current, imageUrl: "" }));
                }}
                aria-invalid={Boolean(reportErrors.imageUrl)}
              />
              <p className="admin-report-hint">
                Paste a Google Drive image link. Make sure sharing is set to “Anyone with the link”.
              </p>
              {reportErrors.imageUrl ? (
                <span className="admin-report-error" role="alert">{reportErrors.imageUrl}</span>
              ) : null}
              {reportImageUrl.trim() ? (
                <div className="admin-report-img-preview">
                  <p className="admin-report-preview-label">Preview:</p>
                  <img
                    key={getDriveImageUrl(reportImageUrl)}
                    src={getDriveImageUrl(reportImageUrl)}
                    alt="Report cover preview"
                    className="admin-report-preview-img"
                    onLoad={() => {
                      setReportImageError(false);
                      setReportImageLoaded(true);
                    }}
                    onError={() => {
                      setReportImageError(true);
                      setReportImageLoaded(false);
                    }}
                  />
                  {reportImageError ? (
                    <p className="admin-report-img-error" role="status">
                      Image could not load. Check that the Drive file is shared with “Anyone with the link”.
                    </p>
                  ) : reportImageLoaded ? (
                    <p className="admin-report-img-ok" role="status">Image loaded successfully</p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="admin-report-field">
              <label className="admin-report-label" htmlFor="ar-category">
                Category <span className="required">*</span>
              </label>
              <select
                id="ar-category"
                className="admin-report-select"
                value={reportCategory}
                onChange={(event) => {
                  setReportCategory(event.target.value);
                  setReportErrors((current) => ({ ...current, reportCategory: "" }));
                }}
                aria-invalid={Boolean(reportErrors.reportCategory)}
              >
                <option value="" disabled>Select a category</option>
                <option value="annual">Annual Report</option>
                <option value="financial">Financial Report</option>
                <option value="activity">Activity Report</option>
                <option value="other">Other</option>
              </select>
              {reportErrors.reportCategory ? (
                <span className="admin-report-error" role="alert">{reportErrors.reportCategory}</span>
              ) : null}
            </div>

            <div className="admin-report-field">
              <label className="admin-report-label" htmlFor="ar-report-date">
                Report Date <span className="required">*</span>
              </label>
              <input
                id="ar-report-date"
                type="date"
                className="admin-report-input"
                value={reportDate}
                onChange={(event) => {
                  setReportDate(event.target.value);
                  setReportErrors((current) => ({ ...current, reportDate: "" }));
                }}
                aria-invalid={Boolean(reportErrors.reportDate)}
              />
              {reportErrors.reportDate ? (
                <span className="admin-report-error" role="alert">{reportErrors.reportDate}</span>
              ) : null}
            </div>

            <div className="admin-report-field">
              <label className="admin-report-label" htmlFor="ar-description">
                Description <span className="admin-report-optional">(optional)</span>
              </label>
              <textarea
                id="ar-description"
                className="admin-report-textarea"
                placeholder="Brief description of the report"
                rows={4}
                value={reportDesc}
                onChange={(event) => setReportDesc(event.target.value)}
              />
            </div>

            <div className="admin-report-field">
              <label className="admin-report-label" htmlFor="ar-report-file-url">
                Report File Link <span className="required">*</span>
              </label>
              <input
                id="ar-report-file-url"
                type="url"
                className="admin-report-input"
                placeholder="https://drive.google.com/..."
                value={reportFileUrl}
                onChange={(event) => {
                  setReportFileUrl(event.target.value);
                  setReportErrors((current) => ({ ...current, fileUrl: "" }));
                }}
                aria-invalid={Boolean(reportErrors.fileUrl)}
              />
              <p className="admin-report-hint">
                Upload your PDF to Google Drive, click “Share” → “Anyone with the link” → paste the link here
              </p>
              {reportErrors.fileUrl ? (
                <span className="admin-report-error" role="alert">{reportErrors.fileUrl}</span>
              ) : null}
            </div>

            <div className="admin-report-field">
              <label className="admin-report-label" htmlFor="ar-report-file-name">
                Download File Name <span className="admin-report-optional">(optional)</span>
              </label>
              <input
                id="ar-report-file-name"
                type="text"
                className="admin-report-input"
                placeholder="Defaults to the report title"
                value={reportFileName}
                onChange={(event) => setReportFileName(event.target.value)}
              />
            </div>

            <button
              type="submit"
              className="admin-report-submit"
              disabled={reportSubmitting}
            >
              {reportSubmitting
                ? reportEditingId ? "Saving..." : "Submitting..."
                : reportEditingId ? "Save Changes" : "Submit Report"}
            </button>
            {reportEditingId ? (
              <button
                type="button"
                className="auvd-admin-secondary admin-report-cancel"
                onClick={handleReportCancelEdit}
                disabled={reportSubmitting}
              >
                Cancel Editing
              </button>
            ) : null}
          </form>
            </section>
            <section className="auvd-admin-panel admin-report-list-section">
              <h2 className="auvd-admin-panel-title">Reports ({reports.length})</h2>
              {reportDeleteError ? (
                <p className="auvd-admin-dash-error" role="alert">{reportDeleteError}</p>
              ) : null}

              {reportsStatus === "loading" ? (
                <p className="auvd-admin-muted" role="status">Loading reports...</p>
              ) : reportsStatus === "error" ? (
                <p className="auvd-admin-dash-error" role="alert">{reportsError}</p>
              ) : reports.length === 0 ? (
                <p className="auvd-admin-muted">No reports yet.</p>
              ) : (
                <ul className="auvd-admin-list">
                  {reports.map((report) => (
                    <li className="auvd-admin-list-item" key={report.id}>
                      {report.imageUrl ? (
                        <SafeImage
                          className="auvd-admin-thumb"
                          src={imageUrl(report.imageUrl)}
                          alt=""
                          fallbackLabel="Image unavailable"
                        />
                      ) : null}
                      <div className="auvd-admin-list-body">
                        <p className="auvd-admin-list-caption">{report.title}</p>
                        <p className="auvd-admin-list-meta">
                          {report.reportDate} &middot; {report.category}
                        </p>
                      </div>
                      <div className="auvd-admin-list-buttons">
                        <button
                          type="button"
                          className="auvd-admin-secondary"
                          onClick={() => handleReportEdit(report)}
                          disabled={reportSubmitting || deleteLoading}
                        >
                          Edit
                        </button>
                        {deleteConfirm === report.id ? (
                          <>
                            <span className="auvd-admin-list-meta">Delete this report?</span>
                            <button
                              type="button"
                              className="auvd-admin-danger"
                              onClick={() => handleReportDelete(report.id)}
                              disabled={deleteLoading}
                            >
                              {deleteLoading ? "Deleting..." : "Confirm"}
                            </button>
                            <button
                              type="button"
                              className="auvd-admin-secondary"
                              onClick={() => setDeleteConfirm(null)}
                              disabled={deleteLoading}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="auvd-admin-danger"
                            onClick={() => {
                              setDeleteConfirm(report.id);
                              setReportDeleteError("");
                            }}
                            disabled={reportSubmitting || deleteLoading}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <hr className="admin-section-divider" />
            <section id="admin-community-updates" className="admin-cu-section">
              <h2 className="admin-cu-title">Community Updates</h2>

              {updateSuccess ? (
                <div className="admin-cu-success" role="status" aria-live="polite">
                  Community update saved successfully!
                </div>
              ) : null}
              {updateErrors.submit ? (
                <p className="admin-cu-error" role="alert">{updateErrors.submit}</p>
              ) : null}

              <form onSubmit={handleUpdateSubmit} className="admin-cu-form" noValidate>
                <div className="admin-cu-field">
                  <label className="admin-cu-label" htmlFor="update-title">
                    Title <span className="required">*</span>
                  </label>
                  <input
                    id="update-title"
                    type="text"
                    className="admin-cu-input"
                    value={updateTitle}
                    maxLength={200}
                    onChange={(event) => {
                      setUpdateTitle(event.target.value);
                      setUpdateErrors((current) => ({ ...current, title: "", submit: "" }));
                    }}
                    aria-invalid={Boolean(updateErrors.title)}
                    required
                    disabled={updateSubmitting}
                  />
                  {updateErrors.title ? (
                    <span className="admin-cu-error" role="alert">{updateErrors.title}</span>
                  ) : null}
                </div>

                <div className="admin-cu-field">
                  <label className="admin-cu-label" htmlFor="update-body">
                    Update <span className="required">*</span>
                  </label>
                  <textarea
                    id="update-body"
                    className="admin-cu-textarea"
                    placeholder="Write your community update here..."
                    rows={8}
                    value={updateBody}
                    onChange={(event) => {
                      setUpdateBody(event.target.value);
                      setUpdateErrors((current) => ({ ...current, body: "", submit: "" }));
                    }}
                    aria-invalid={Boolean(updateErrors.body)}
                    required
                    disabled={updateSubmitting}
                  />
                  {updateErrors.body ? (
                    <span className="admin-cu-error" role="alert">{updateErrors.body}</span>
                  ) : null}
                </div>

                <div className="admin-cu-field">
                  <label className="admin-cu-label" htmlFor="update-excerpt">
                    Short Excerpt <span className="admin-cu-optional">(optional)</span>
                  </label>
                  <textarea
                    id="update-excerpt"
                    className="admin-cu-textarea admin-cu-excerpt"
                    rows={3}
                    value={updateExcerpt}
                    maxLength={500}
                    onChange={(event) => {
                      setUpdateExcerpt(event.target.value);
                      setUpdateErrors((current) => ({ ...current, excerpt: "", submit: "" }));
                    }}
                    disabled={updateSubmitting}
                  />
                  <p className="admin-cu-hint">If left blank, the beginning of the update is used.</p>
                  {updateErrors.excerpt ? (
                    <span className="admin-cu-error" role="alert">{updateErrors.excerpt}</span>
                  ) : null}
                </div>

                <div className="admin-cu-field">
                  <label className="admin-cu-label" htmlFor="update-category">Category</label>
                  <select
                    id="update-category"
                    className="admin-cu-input"
                    value={updateCategory}
                    onChange={(event) => {
                      setUpdateCategory(event.target.value);
                      setUpdateErrors((current) => ({ ...current, submit: "" }));
                    }}
                    disabled={updateSubmitting}
                  >
                    <option value="Community">Community</option>
                    <option value="Stories">Stories</option>
                    <option value="News">News</option>
                    <option value="Events">Events</option>
                    <option value="Programs">Programs</option>
                  </select>
                </div>

                <div className="admin-cu-field">
                  <label className="admin-cu-label" htmlFor="update-image-url">
                    Cover Image Link <span className="admin-cu-optional">(optional, Google Drive)</span>
                  </label>
                  <input
                    id="update-image-url"
                    type="url"
                    className="admin-cu-input"
                    placeholder="https://drive.google.com/file/d/.../view"
                    value={updateImageUrl}
                    onChange={(event) => {
                      setUpdateImageUrl(event.target.value);
                      setUpdateImageErr(false);
                      setUpdateErrors((current) => ({ ...current, imageUrl: "", submit: "" }));
                    }}
                    aria-invalid={Boolean(updateErrors.imageUrl)}
                    disabled={updateSubmitting}
                  />
                  <p className="admin-cu-hint">
                    Share the image with “Anyone with the link” before pasting its Google Drive URL.
                  </p>
                  {updateErrors.imageUrl ? (
                    <span className="admin-cu-error" role="alert">{updateErrors.imageUrl}</span>
                  ) : null}
                  {updateImageUrl.trim() ? (
                    <div className="admin-cu-preview-wrap">
                      <img
                        key={getDriveImageUrl(updateImageUrl)}
                        src={getDriveImageUrl(updateImageUrl)}
                        alt="Community update cover preview"
                        className="admin-cu-preview-img"
                        onLoad={() => setUpdateImageErr(false)}
                        onError={() => setUpdateImageErr(true)}
                      />
                      {updateImageErr ? (
                        <p className="admin-cu-error" role="status">
                          Image preview could not load. Check the Drive sharing settings.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="admin-cu-field">
                  <label className="admin-cu-label" htmlFor="update-author">
                    Author <span className="admin-cu-optional">(optional)</span>
                  </label>
                  <input
                    id="update-author"
                    type="text"
                    className="admin-cu-input"
                    value={updateAuthor}
                    maxLength={120}
                    onChange={(event) => {
                      setUpdateAuthor(event.target.value);
                      setUpdateErrors((current) => ({ ...current, submit: "" }));
                    }}
                    disabled={updateSubmitting}
                  />
                </div>

                <div className="auvd-admin-actions">
                  <button type="submit" className="admin-cu-submit" disabled={updateSubmitting}>
                    {updateSubmitting
                      ? "Saving..."
                      : editingUpdateId
                        ? "Save Changes"
                        : "Post Community Update"}
                  </button>
                  {editingUpdateId ? (
                    <button
                      type="button"
                      className="auvd-admin-secondary"
                      onClick={resetCommunityUpdateForm}
                      disabled={updateSubmitting}
                    >
                      Cancel Editing
                    </button>
                  ) : null}
                </div>
              </form>

              <section className="admin-cu-list-section" aria-labelledby="admin-cu-list-title">
                <h3 id="admin-cu-list-title" className="admin-cu-list-title">
                  Published Updates ({updates.length})
                </h3>
                {updateDeleteError ? (
                  <p className="admin-cu-error" role="alert">{updateDeleteError}</p>
                ) : null}
                {updatesStatus === "loading" ? (
                  <p className="auvd-admin-muted" role="status">Loading updates...</p>
                ) : updatesStatus === "error" ? (
                  <p className="admin-cu-error" role="alert">{updatesListError}</p>
                ) : updates.length === 0 ? (
                  <p className="auvd-admin-muted">No community updates have been published yet.</p>
                ) : (
                  <ul className="auvd-admin-list">
                    {updates.map((update) => (
                      <li className="auvd-admin-list-item" key={update.id}>
                        {update.imageUrl ? (
                          <SafeImage
                            className="auvd-admin-thumb"
                            src={getDriveImageUrl(update.imageUrl)}
                            alt=""
                            fallbackLabel="Image unavailable"
                          />
                        ) : null}
                        <div className="auvd-admin-list-body">
                          <p className="auvd-admin-list-caption">{update.title}</p>
                          <p className="auvd-admin-list-meta">
                            {update.date} &middot; {update.category}
                          </p>
                        </div>
                        <div className="auvd-admin-list-buttons">
                          <button
                            type="button"
                            className="auvd-admin-secondary"
                            onClick={() => handleUpdateEdit(update)}
                            disabled={updateSubmitting || updateDeleteLoading}
                          >
                            Edit
                          </button>
                          {updateDeleteConfirm === update.id ? (
                            <>
                              <span className="auvd-admin-list-meta">Delete this update?</span>
                              <button
                                type="button"
                                className="auvd-admin-danger"
                                onClick={() => handleUpdateDelete(update.id)}
                                disabled={updateDeleteLoading}
                              >
                                {updateDeleteLoading ? "Deleting..." : "Confirm"}
                              </button>
                              <button
                                type="button"
                                className="auvd-admin-secondary"
                                onClick={() => setUpdateDeleteConfirm(null)}
                                disabled={updateDeleteLoading}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="auvd-admin-danger"
                              onClick={() => {
                                setUpdateDeleteConfirm(update.id);
                                setUpdateDeleteError("");
                              }}
                              disabled={updateSubmitting || updateDeleteLoading}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
};

export default AdminPost;
