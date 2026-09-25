import { useEffect } from "react";

const SITE_URL = "https://art-and-unity-for-vulnerable-develo.vercel.app/";

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    const attribute = selector.includes('property="') ? "property" : "name";
    const match = selector.match(new RegExp(`${attribute}="([^"]+)"`));
    if (match) element.setAttribute(attribute, match[1]);
    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
};

function PageSeo({ title, description, canonicalPath, image, jsonLd }) {
  useEffect(() => {
    const previousTitle = document.title;
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    const imageUrl = `${SITE_URL}${image}`;
    const previousCanonical = document.head.querySelector('link[rel="canonical"]')?.href;
    const previousMeta = {
      description: document.head.querySelector('meta[name="description"]')?.content,
      "og:title": document.head.querySelector('meta[property="og:title"]')?.content,
      "og:description": document.head.querySelector('meta[property="og:description"]')?.content,
      "og:url": document.head.querySelector('meta[property="og:url"]')?.content,
      "og:image": document.head.querySelector('meta[property="og:image"]')?.content,
      "twitter:title": document.head.querySelector('meta[name="twitter:title"]')?.content,
      "twitter:description": document.head.querySelector('meta[name="twitter:description"]')?.content,
      "twitter:image": document.head.querySelector('meta[name="twitter:image"]')?.content,
    };

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", imageUrl);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let structuredData = document.getElementById("auvd-page-jsonld");
    if (jsonLd) {
      if (!structuredData) {
        structuredData = document.createElement("script");
        structuredData.id = "auvd-page-jsonld";
        structuredData.type = "application/ld+json";
        document.head.appendChild(structuredData);
      }
      structuredData.textContent = JSON.stringify(jsonLd);
    } else {
      structuredData?.remove();
    }

    return () => {
      document.title = previousTitle;
      if (previousCanonical) {
        document.head.querySelector('link[rel="canonical"]').href = previousCanonical;
      }
      Object.entries(previousMeta).forEach(([key, value]) => {
        if (value !== undefined) {
          const selector = key.startsWith("og:") ? `meta[property="${key}"]` : `meta[name="${key}"]`;
          setMeta(selector, "content", value);
        }
      });
      structuredData?.remove();
    };
  }, [title, description, canonicalPath, image, jsonLd]);

  return null;
}

export default PageSeo;
