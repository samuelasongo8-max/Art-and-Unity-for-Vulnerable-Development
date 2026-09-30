import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaLock } from "react-icons/fa6";
import AdminLoginForm from "../../components/AdminLoginForm";
import "./AdminLogin.css";

/* ==========================================================================
   /admin/login — the login form on its own page.

   The footer opens the same form in a small modal, which is the quiet way in.
   This page exists for the other case: the dashboard at /admin/post sends
   anyone who is not signed in here, so the redirect has somewhere real to land
   (and so a bookmarked /admin/post works).

   It renders no Navbar and no Footer. A login screen wrapped in the public
   chrome would be a page every visitor could stumble onto, and this one has no
   reason to look like the rest of the site.

   WHICH FORM SHOWS is decided by the form itself, from GET
   /api/admin/setup-status: a one-time "create your admin account" form before
   an account exists, and the ordinary login form afterwards. On success either
   way it goes straight to the dashboard — creating the account also signs you
   in, so there is no second step.
   ========================================================================== */
const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  /* Reported by the form, so this page's own <h1> never contradicts what the
     form below it is actually asking for. */
  const [mode, setMode] = useState("checking");

  return (
    <main className="auvd-adminlogin">
      <div className="auvd-adminlogin-box">
        <p className="auvd-adminlogin-icon" aria-hidden="true">
          <FaLock />
        </p>

        {/* Hidden in register mode, where the form supplies its own heading. */}
        {mode === "register" ? null : (
          <h1 className="auvd-adminlogin-title">{t("footer.admin.title")}</h1>
        )}

        <AdminLoginForm
          onModeChange={setMode}
          onSuccess={() => navigate("/admin/post", { replace: true })}
        />
      </div>
    </main>
  );
};

export default AdminLogin;