import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageSeo from "../components/PageSeo";
import "./NotFound.css";

/* Catch-all page for any URL that does not match a route. It is fully
   translated like every other page. */
function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <PageSeo
        title={t("notFound.title")}
        description={t("notFound.text")}
        canonicalPath=""
        image="logo%20l.png"
      />
      <main className="notfound-page">
        <p className="auvd-story-label">404</p>
        <h1 className="notfound-title">{t("notFound.heading")}</h1>
        <p className="notfound-text">{t("notFound.text")}</p>
        <Link to="/" className="notfound-link">
          {t("notFound.backHome")}
        </Link>
      </main>
    </>
  );
}

export default NotFound;
