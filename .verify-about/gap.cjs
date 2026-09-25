const { chromium } = require("playwright");

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto("http://localhost:5173/about", { waitUntil: "load" });
  await p.waitForTimeout(1500);

  const out = await p.evaluate(() => {
    const res = [];
    [...document.querySelectorAll(".auvd-story-section")].forEach((band, i) => {
      const body = band.querySelector(".auvd-story-body");
      const title = band.querySelector(".auvd-story-title");
      const text = band.querySelector(".auvd-story-text");
      const box = (el) => (el ? { top: Math.round(el.getBoundingClientRect().top + window.scrollY), h: Math.round(el.getBoundingClientRect().height) } : null);
      const cs = (el, p) => (el ? getComputedStyle(el).getPropertyValue(p) : null);
      res.push({
        band: i,
        bodyDisplay: cs(body, "display"),
        cols: cs(body, "grid-template-columns"),
        rows: cs(body, "grid-template-rows"),
        rowGap: cs(body, "row-gap"),
        bodyBox: box(body),
        title: { ...box(title), minH: cs(title, "min-height"), margin: cs(title, "margin"), padB: cs(title, "padding-bottom"), align: cs(title, "align-self") },
        text: { ...box(text), minH: cs(text, "min-height"), margin: cs(text, "margin"), align: cs(text, "align-self") },
      });
    });
    return res;
  });

  out.forEach((r) => console.log(JSON.stringify(r, null, 1)));
  await p.close();
  await b.close();
})();
