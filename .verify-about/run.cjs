/* Temporary verification for the restyled About page. */
const { chromium } = require("playwright");
const fs = require("fs");

const BASE = "http://localhost:5173";
const OUT = ".verify-about";
const T = {
  hero: "Creative empowerment for vulnerable communities in Kakuma.",
  heroP: "Art and Unity for Vulnerable Development (AUVD) is a nonprofit community-based and refugee-led organization working in Kakuma Refugee Camp, Kenya. Since 2022, AUVD has supported refugees, women, youth, children, and persons with disabilities through arts, skills development, and inclusive community programs.",
  mission: "Empower vulnerable communities through creative arts, inclusive education, psychosocial support and sustainable development opportunities.",
  vision: "A peaceful and inclusive community where vulnerable individuals thrive through art, education, dignity and sustainable livelihoods.",
  whoTitle: "Building hope through art, learning, and community action.",
  whoP1: "AUVD was established in response to the social and economic challenges faced by displaced and marginalized populations in Kakuma Refugee Camp and surrounding host communities. We believe art and creativity are powerful tools for healing, empowerment, education, and social transformation.",
  whoP2: "Through music, dance, visual arts, and community development programs, AUVD creates safe spaces where people can develop confidence, strengthen their well-being, and build pathways toward greater social and economic inclusion.",
  goalTitle: "Resilient and empowered communities",
  goalP1: "Our goal is to create resilient and empowered vulnerable populations in Kakuma Refugee Camp and host communities by improving mental well-being, strengthening livelihood skills, and expanding opportunities for economic and social inclusion through arts-based training and community development programs.",
  goalP2: "AUVD remains committed to promoting dignity, creativity, equality, and peaceful coexistence among diverse communities.",
  serveTitle: "Who We Serve",
  serveP: "AUVD programs are designed to meet people where they are and strengthen dignity, healing, inclusion, and opportunity across the community.",
  list: ["Refugees and displaced populations", "Women and girls", "Youth and children", "Persons with disabilities", "Host community members"],
};

const COLLECT = () => {
  const n = (s) => (s || "").replace(/\s+/g, " ").trim();
  const g = (el, p) => (el ? getComputedStyle(el).getPropertyValue(p) : null);
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: b.top + window.scrollY, left: b.left, right: b.right, w: b.width, h: b.height, bottom: b.bottom + window.scrollY };
  };
  const after = (el) => getComputedStyle(el, "::after").content;
  const nav = document.querySelector("header, nav");
  const wrap = document.querySelector(".about-hero-bleed");
  const hero = wrap && wrap.querySelector(".auvd-impact-hero");

  const bands = [...document.querySelectorAll(".about-page .auvd-story-section")].map((b) => {
    const label = b.querySelector(".auvd-story-label");
    const labels = [...b.querySelectorAll(".auvd-story-label")];
    const title = b.querySelector(".auvd-story-title");
    const text = b.querySelector(".auvd-story-text");
    const gal = b.querySelector(".auvd-story-gallery");
    const list = b.querySelector(".about-beneficiary-list");
    return {
      bg: g(b, "background-color"),
      pad: g(b, "padding-top"),
      box: r(b),
      cMax: g(b.querySelector(".auvd-story-container"), "max-width"),
      cPad: g(b.querySelector(".auvd-story-container"), "padding-left"),
      dir: g(b.querySelector(".auvd-story-body"), "flex-direction"),
      labels: labels.map((el) => ({ text: n(el.textContent), font: g(el, "font-family"), weight: g(el, "font-weight"), bb: g(el, "border-bottom-width"), deco: g(el, "text-decoration-line"), after: after(el) })),
      statements: [...b.querySelectorAll(".about-mv-text")].map((el) => ({ text: n(el.textContent), font: g(el, "font-family"), size: g(el, "font-size"), lh: g(el, "line-height") })),
      label: label && { text: n(label.textContent), font: g(label, "font-family"), weight: g(label, "font-weight"), bb: g(label, "border-bottom-width"), deco: g(label, "text-decoration-line"), after: after(label) },
      title: title && { text: n(title.textContent), font: g(title, "font-family"), size: g(title, "font-size"), transform: g(title, "text-transform"), color: g(title, "color"), lead: title.classList.contains("auvd-story-title--lead"), box: r(title), after: after(title), bb: g(title, "border-bottom-width") },
      text: text && { font: g(text, "font-family"), box: r(text), ps: [...text.querySelectorAll("p")].map((p) => ({ text: n(p.textContent), font: g(p, "font-family"), size: g(p, "font-size"), lh: g(p, "line-height"), color: g(p, "color") })) },
      gal: gal && { box: r(gal) },
      imgs: [...b.querySelectorAll("img")].map((i) => ({ src: i.getAttribute("src"), alt: i.getAttribute("alt"), fit: g(i, "object-fit"), ok: i.complete && i.naturalWidth > 0, nat: i.naturalWidth + "x" + i.naturalHeight, op: Number(g(i, "opacity")) })),
      cards: [...b.querySelectorAll(".about-mv-card")].map((c) => ({ box: r(c), bg: g(c, "background-color"), pad: g(c, "padding-top") })),
      list: list && { cols: g(list, "grid-template-columns").split(" ").length, items: [...list.querySelectorAll(".about-beneficiary-item")].map((li) => ({ text: n(li.textContent), icons: li.querySelectorAll("svg").length, font: g(li, "font-family"), size: g(li, "font-size"), lh: g(li, "line-height") })) },
      hr: b.querySelectorAll("hr").length,
      bad: [...b.querySelectorAll("p, h2, h3, ul, li, .auvd-story-text, .auvd-story-container")].filter((el) => parseFloat(g(el, "border-top-width")) > 0 || parseFloat(g(el, "border-bottom-width")) > 0).length,
    };
  });

  const hi = hero && hero.querySelector(".auvd-impact-hero__image");
  const ht = hero && hero.querySelector(".auvd-impact-hero__title");
  const hp = hero && hero.querySelector(".auvd-impact-hero__text");
  const hc = hero && hero.querySelector(".auvd-impact-hero__content");

  return {
    nav: nav && { pos: g(nav, "position"), bottom: nav.getBoundingClientRect().bottom },
    hero: hero && {
      box: r(hero),
      overlay: g(hero.querySelector(".auvd-impact-hero__overlay"), "background-image"),
      img: { src: hi.getAttribute("src"), alt: hi.getAttribute("alt"), fit: g(hi, "object-fit"), ok: hi.complete && hi.naturalWidth > 0, nat: hi.naturalWidth + "x" + hi.naturalHeight },
      title: { text: n(ht.textContent), font: g(ht, "font-family"), size: g(ht, "font-size"), color: g(ht, "color"), tag: ht.tagName },
      text: { text: n(hp.textContent), font: g(hp, "font-family"), size: g(hp, "font-size"), lh: g(hp, "line-height") },
      meta: n(wrap.querySelector(".auvd-impact-hero__meta") && wrap.querySelector(".auvd-impact-hero__meta").textContent),
      label: n(wrap.querySelector(".auvd-impact-hero__meta strong") && wrap.querySelector(".auvd-impact-hero__meta strong").textContent),
      caption: n(wrap.querySelector(".auvd-impact-hero__meta span") && wrap.querySelector(".auvd-impact-hero__meta span").textContent),
      contentTop: r(hc).top,
      btn: wrap.querySelectorAll(".auvd-impact-hero__button").length,
      labelCount: wrap.querySelectorAll(".auvd-impact-hero__label").length,
    },
    wrapBottom: r(wrap) && r(wrap).bottom,
    bands,
    titles: [...document.querySelectorAll(".auvd-story-title")].map((t) => ({ font: g(t, "font-family"), size: g(t, "font-size") })),
    h1: document.querySelectorAll("h1").length,
    hr: document.querySelectorAll(".about-page hr").length,
    old: document.querySelectorAll(".about-hero, .mission-section, .split-container, .about-story, .about-goals-card, .why-container, .doctor-slideshow, .about-section-label").length,
    noOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
    vw: window.innerWidth,
    fonts: { bebas: document.fonts.check('16px "Bebas Neue"'), ss: document.fonts.check('16px "Source Sans 3"'), anton: document.fonts.check('16px "Anton"'), roboto: document.fonts.check('16px "Roboto"') },
    faceNames: [...new Set([...document.fonts].map((f) => f.family))],
  };
};

let pass = 0;
let fail = 0;
const ck = (name, ok, detail = "") => {
  if (ok) pass += 1;
  else fail += 1;
  console.log(`${ok ? "PASS" : "FAIL"} | ${name}${detail ? " | " + detail : ""}`);
};

const note = (name, detail = "") => console.log(`NOTE | ${name}${detail ? " | " + detail : ""}`);

const measure = async (browser, url, fn, viewport = { width: 1440, height: 900 }) => {
  const p = await browser.newPage({ viewport });
  p.setDefaultTimeout(60000);
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
  });
  await p.waitForTimeout(1500);
  const out = await p.evaluate(fn);
  await p.close();
  return out;
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const errors = [];

  const refHeroAt = (viewport) => measure(browser, `${BASE}/pricing`, () => {
    const s = (el, p) => getComputedStyle(el).getPropertyValue(p);
    const hero = document.querySelector(".auvd-impact-hero");
    const t = hero.querySelector(".auvd-impact-hero__title");
    const p = hero.querySelector(".auvd-impact-hero__text");
    const i = hero.querySelector(".auvd-impact-hero__image");
    const o = hero.querySelector(".auvd-impact-hero__overlay");
    return { titleFont: s(t, "font-family"), titleSize: s(t, "font-size"), titleColor: s(t, "color"), pFont: s(p, "font-family"), pSize: s(p, "font-size"), pLh: s(p, "line-height"), fit: s(i, "object-fit"), overlay: s(o, "background-image") };
  }, viewport);

  const refSectionAt = (viewport) => measure(browser, BASE, () => {
    const s = (el, p) => getComputedStyle(el).getPropertyValue(p);
    const v = document.querySelector(".visual-section");
    const t = v.querySelector(".auvd-story-title");
    const p = v.querySelector(".auvd-story-text p");
    return { titleFont: s(t, "font-family"), titleSize: s(t, "font-size"), titleColor: s(t, "color"), titleTransform: s(t, "text-transform"), pFont: s(p, "font-family"), pSize: s(p, "font-size"), pLh: s(p, "line-height") };
  }, viewport);

  for (const vp of [{ name: "desktop", w: 1440, h: 900, m: false }, { name: "mobile", w: 390, h: 844, m: true }]) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    page.setDefaultTimeout(60000);
    page.on("pageerror", (e) => errors.push(`${vp.name}: ${e.message}`));
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(`${vp.name}: ${msg.text()}`); });
    const refHero = await refHeroAt({ width: vp.w, height: vp.h });
    const refSection = await refSectionAt({ width: vp.w, height: vp.h });
    console.log(`\n===== ${vp.name} (${vp.w}x${vp.h}) =====`);

    await page.goto(`${BASE}/about`, { waitUntil: "load" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1800);

    const m = await page.evaluate(COLLECT);
    const d = !vp.m;
    const [mission, who, goal, serve] = m.bands;

    ck("[hero] shared hero at the very top, full viewport width", m.hero !== null && m.hero.box.top === 0 && m.hero.box.w === vp.w, `top=${m.hero && m.hero.box.top} w=${m.hero && m.hero.box.w}`);
    ck("[hero] no gap under the fixed nav", m.nav.pos === "fixed" && m.nav.bottom > 0 && m.hero.box.top <= m.nav.bottom, `navBottom=${Math.round(m.nav.bottom)}`);
    ck("[hero] dark gradient overlay", /linear-gradient/.test(m.hero.overlay), m.hero.overlay.slice(0, 48));
    ck("[hero] About's own photo, loaded, cover-cropped", m.hero.img.src.includes("together1.jpg") && m.hero.img.ok && m.hero.img.fit === "cover", `${m.hero.img.nat} ${m.hero.img.fit}`);
    ck("[hero] heading wording unchanged, Anton, only h1", m.hero.title.text === T.hero && /Anton/.test(m.hero.title.font) && m.hero.title.tag === "H1" && m.h1 === 1, m.hero.title.text.slice(0, 36));
    ck("[hero] paragraph wording unchanged, same stack as /pricing", m.hero.text.text === T.heroP && m.hero.text.font === refHero.pFont && m.hero.text.size === refHero.pSize && m.hero.text.lh === refHero.pLh, `${m.hero.text.font} ${m.hero.text.size}/${m.hero.text.lh}`);
    ck("[hero] Founded panel wording kept", m.hero.label === "Founded 2022" && m.hero.caption === "Formally registered in 2025 to expand healing, education, and livelihoods support.", `${m.hero.label} / ${m.hero.caption}`);
    ck("[hero] no button or label invented", m.hero.btn === 0 && m.hero.labelCount === 0, `btn=${m.hero.btn} label=${m.hero.labelCount}`);
    ck("[hero] same design as the /pricing hero", m.hero.title.font === refHero.titleFont && m.hero.title.size === refHero.titleSize && m.hero.title.color === refHero.titleColor && m.hero.text.font === refHero.pFont && m.hero.text.size === refHero.pSize && m.hero.text.lh === refHero.pLh && m.hero.overlay === refHero.overlay && m.hero.img.fit === refHero.fit, `${m.hero.title.font} ${m.hero.title.size} ${m.hero.title.color}`);

    const h1Box = await page.locator(".auvd-impact-hero__title").boundingBox();
    const navBox = await page.locator("header, nav").first().boundingBox();
    ck("[hero] heading clears the fixed nav", h1Box.y >= navBox.y + navBox.height - 1, `h1Y=${Math.round(h1Box.y)} navBottom=${Math.round(navBox.y + navBox.height)}`);

    ck("[bands] four sections after the hero", m.bands.length === 4, String(m.bands.length));
    ck("[bands] alternate tinted / white", m.bands.map((b) => b.bg).join(" ") === "rgb(246, 249, 252) rgb(255, 255, 255) rgb(246, 249, 252) rgb(255, 255, 255)", m.bands.map((b) => b.bg).join(" "));
    ck("[bands] 940px container, 24px gutters, 72/56px padding", m.bands.every((b) => b.cMax === "940px" && b.cPad === "24px" && b.pad === (d ? "72px" : "56px")), `${m.bands[0].cMax} / ${m.bands[0].pad}`);
    ck("[bands] no <hr> and no rule lines", m.hr === 0 && m.bands.every((b) => b.hr === 0 && b.bad === 0), `hr=${m.hr} bad=${m.bands.map((b) => b.bad).join(",")}`);
    ck("[bands] labels small, bold, no rule under them", m.bands.flatMap((b) => b.labels).every((l) => l.after === "none" && parseFloat(l.bb) === 0 && l.deco === "none" && /Source Sans 3/.test(l.font) && Number(l.weight) >= 700), m.bands.flatMap((b) => b.labels).map((l) => `${l.text}:${l.after}`).join(" | "));
    ck("[bands] label wording unchanged (all five kept)", m.bands.flatMap((b) => b.labels).map((l) => l.text).join("|") === "OUR MISSION|OUR VISION|Who We Are|Our Goal|Target Beneficiaries", m.bands.flatMap((b) => b.labels).map((l) => l.text).join("|"));
    ck("[bands] titles Bebas Neue 44/34px, same as Visual Arts", m.titles.every((t) => /Bebas Neue/.test(t.font) && t.size === (d ? "44px" : "34px") && t.font === refSection.titleFont && t.size === refSection.titleSize), `${m.titles[0] && m.titles[0].size} vs ${refSection.titleSize}`);
    ck("[bands] title colour/transform match Visual Arts, no rule", m.bands.filter((b) => b.title).every((b) => b.title.color === refSection.titleColor && b.title.transform === refSection.titleTransform && b.title.after === "none" && parseFloat(b.title.bb) === 0), m.bands[2].title.color);
    ck("[bands] body copy Source Sans 3 16px/26px #333, same as Visual Arts", m.bands.filter((b) => b.text).every((b) => b.text.ps.every((p) => /Source Sans 3/.test(p.font) && p.size === refSection.pSize && p.lh === refSection.pLh && p.color === "rgb(51, 51, 51)")), m.bands.filter((b) => b.text).flatMap((b) => b.text.ps).map((p) => `${p.size}/${p.lh}`).join(","));
    ck("[bands] no leftover old markup, no horizontal overflow", m.old === 0 && m.noOverflow, `old=${m.old} overflow=${!m.noOverflow}`);
    ck("[fonts] Anton / Bebas Neue / Source Sans 3 loaded, Roboto declared for heroes", m.fonts.anton && m.fonts.bebas && m.fonts.ss && m.faceNames.includes("Roboto"), JSON.stringify(m.fonts) + " faces=" + m.faceNames.filter((f) => /Roboto|Anton|Bebas|Source Sans/.test(f)).join(","));

    if (d) ck("[mission] two equal cards side by side (desktop)", mission.cards.length === 2 && Math.abs(mission.cards[0].box.w - mission.cards[1].box.w) <= 1 && mission.cards[0].box.top === mission.cards[1].box.top, mission.cards.map((c) => `${Math.round(c.box.w)}@${Math.round(c.box.top)}`).join(" "));
    ck("[mission] clean white padded cards", mission.cards.every((c) => c.bg === "rgb(255, 255, 255)" && parseFloat(c.pad) >= 20), mission.cards.map((c) => c.pad).join(" "));
    ck("[mission] not the two-column image layout", !mission.gal, "no gallery");
    ck("[mission] statement wording unchanged", mission.statements.map((p) => p.text).join("|") === `${T.mission}|${T.vision}`, mission.statements.map((p) => p.text.slice(0, 24)).join(" | "));
    ck("[mission] statements 16px/26px Source Sans 3", mission.statements.every((p) => /Source Sans 3/.test(p.font) && p.size === "16px" && p.lh === "26px"), `${mission.statements[0].size}/${mission.statements[0].lh}`);
    ck("[mission] both existing photo references kept unchanged", mission.imgs.length === 2 && mission.imgs.map((i) => `${i.src}|${i.alt}`).join(" ") === "/Upcoming project 1 (1).jpg|Mission /AUVD.education.jpg|Vision", mission.imgs.map((i) => `${i.src}|${i.alt}`).join(" "));
    if (!mission.imgs.every((i) => i.ok)) note("/AUVD.education.jpg is not in public/ (pre-existing 404, reference kept as-is)", mission.imgs.map((i) => `${i.alt}=${i.nat}`).join(" "));
    if (vp.m) ck("[mission] cards stack on mobile", mission.cards[0].box.top < mission.cards[1].box.top, mission.cards.map((c) => Math.round(c.box.top)).join(" "));

    ck("[who] label/title/paragraphs wording unchanged", who.label.text === "Who We Are" && who.title.text === T.whoTitle && who.text.ps.map((p) => p.text).join("|") === `${T.whoP1}|${T.whoP2}`, who.title.text.slice(0, 32));
    if (d) ck("[who] no photo: title leads the narrower left column", !who.gal && who.title.lead && who.title.box.w < who.text.box.w, `title=${Math.round(who.title.box.w)} text=${Math.round(who.text.box.w)}`);
    ck(vp.m ? "[who] stacks to one column on mobile" : "[who] title left of the paragraphs", vp.m ? who.title.box.top < who.text.box.top && Math.abs(who.title.box.left - who.text.box.left) <= 1 : who.title.box.left < who.text.box.left, `${Math.round(who.title.box.left)} / ${Math.round(who.text.box.left)}`);

    ck("[goal] label/title/paragraphs wording unchanged", goal.label.text === "Our Goal" && goal.title.text === T.goalTitle && goal.text.ps.map((p) => p.text).join("|") === `${T.goalP1}|${T.goalP2}`, goal.title.text);
    if (d) {
      ck("[goal] same two-column pattern as Who We Are", !goal.gal && goal.title.lead && goal.title.box.w < goal.text.box.w && goal.dir === who.dir, `title=${Math.round(goal.title.box.w)} text=${Math.round(goal.text.box.w)} dir=${goal.dir}`);
    } else {
      ck("[goal] stacks to one column on mobile", goal.dir === "column" && goal.title.box.top < goal.text.box.top && goal.title.box.w === goal.text.box.w, `dir=${goal.dir}`);
    }

    for (const [name, band] of [["who", who], ["goal", goal]]) {
      if (d) {
        ck(`[${name}] the two columns start on the same line`, Math.abs(band.title.box.top - band.text.box.top) <= 20, `${Math.round(band.title.box.top)} / ${Math.round(band.text.box.top)}`);
      } else {
        const gap = band.text.box.top - (band.title.box.top + band.title.box.h);
        ck(`[${name}] stacked columns sit tight (no leftover flex-basis)`, gap <= 64 && band.title.box.h <= 220, `gap=${Math.round(gap)} titleH=${Math.round(band.title.box.h)}`);
      }
    }

    ck("[serve] label/title/intro wording unchanged", serve.label.text === "Target Beneficiaries" && serve.title.text === T.serveTitle && serve.text.ps[0].text === T.serveP, serve.title.text);
    if (d) ck("[serve] two columns: gallery beside the text", !!serve.gal && serve.gal.box.left < serve.text.box.left, `gallery=${Math.round(serve.gal.box.left)} text=${Math.round(serve.text.box.left)}`);
    ck("[serve] gallery framed 460/308 like the pattern", Math.abs(serve.gal.box.w - serve.gal.box.h * (460 / 308)) <= 2, `${Math.round(serve.gal.box.w)}x${Math.round(serve.gal.box.h)}`);
    ck("[serve] all six existing photos kept and loading", serve.imgs.length === 6 && serve.imgs.every((i) => i.ok), `${serve.imgs.length} images`);
    ck("[serve] crossfade running (one slide visible)", serve.imgs.filter((i) => i.op > 0.5).length >= 1, serve.imgs.map((i) => i.op.toFixed(1)).join(","));
    ck(vp.m ? "[serve] list 1 column on mobile" : "[serve] list 2 columns on desktop", serve.list.cols === (vp.m ? 1 : 2), String(serve.list.cols));
    ck("[serve] list items unchanged, one icon each", serve.list.items.map((i) => i.text).join("|") === T.list.join("|") && serve.list.items.every((i) => i.icons === 1), serve.list.items.map((i) => i.text.slice(0, 12)).join(" | "));
    ck("[serve] list copy 16px/26px Source Sans 3", serve.list.items.every((i) => /Source Sans 3/.test(i.font) && i.size === "16px" && i.lh === "26px"), `${serve.list.items[0].size}/${serve.list.items[0].lh}`);
    if (vp.m) ck("[serve] gallery stacks above the text on mobile", serve.gal.box.top < serve.text.box.top, `${Math.round(serve.gal.box.top)} < ${Math.round(serve.text.box.top)}`);

    await page.screenshot({ path: `${OUT}/about-${vp.name}.png`, fullPage: true });
    await page.locator(".about-hero-bleed").screenshot({ path: `${OUT}/about-hero-${vp.name}.png` });
    console.log(`screenshot -> ${OUT}/about-${vp.name}.png`);
    await page.close();
  }

  console.log("\nerrors:", errors.length ? errors : "none");
  ck("[page] no console or runtime errors", errors.length === 0, errors.slice(0, 2).join(" | "));

  await browser.close();
  console.log(`\nTOTAL: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
})();
