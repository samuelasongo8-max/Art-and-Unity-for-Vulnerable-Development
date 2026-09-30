/* Verify the nav color/polish changes on desktop and mobile. */
const { chromium } = require("playwright");

const BASE = process.env.BASE || "http://localhost:5175";
const OUT = ".verify-nav";
const BLUE = "rgb(31, 118, 190)";
const ORANGE = "rgb(194, 65, 12)";

const results = [];
const errors = [];
const pass = (l, d = "") => results.push(`PASS | ${l} | ${d}`);
const fail = (l, d = "") => results.push(`FAIL | ${l} | ${d}`);

// Relative luminance + contrast ratio, for the white-on-orange CTA check.
const lum = (rgb) => {
  const c = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const parse = (s) => (s.match(/\d+/g) || []).slice(0, 3).map(Number);

const navState = (p) =>
  p.evaluate(() => {
    const g = (sel, prop) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el)[prop] : "MISSING";
    };
    const active = document.querySelector(".nav-link.active");
    return {
      logoSpans: [...document.querySelectorAll(".logo-text span")].map((s) => ({
        cls: s.className,
        color: getComputedStyle(s).color,
      })),
      logoBase: g(".logo-text", "color"),
      donateColor: g(".donate-btn", "color"),
      donateBg: g(".donate-btn", "backgroundColor"),
      donateRadius: g(".donate-btn", "borderRadius"),
      donateBorder: g(".donate-btn", "borderColor"),
      donateH: g(".donate-btn", "minHeight"),
      linkGap: g(".nav-links", "gap"),
      activeColor: active ? getComputedStyle(active).color : null,
      activeWeight: active ? getComputedStyle(active).fontWeight : null,
      activeUnderline: active
        ? getComputedStyle(active).borderBottomColor
        : null,
      activeAria: active ? active.getAttribute("aria-current") : null,
      ariaExpanded: [...document.querySelectorAll("[aria-expanded]")].map((e) =>
        e.getAttribute("aria-expanded"),
      ),
      impactCount: document.querySelectorAll(".auvd-nav-dropdown").length,
      impactChildren: document.querySelectorAll(
        ".auvd-nav-dropdown .auvd-dropdown-link",
      ).length,
      itemCount: document.querySelectorAll(".nav-links > .nav-link, .nav-links > .nav-dropdown").length,
    };
  });


(async () => {
  const browser = await chromium.launch();

  /* ---------------- desktop ---------------- */
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (e) => errors.push(`desktop pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`desktop console: ${m.text()}`);
  });

  
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForSelector(".navbar .donate-btn");
  await page.waitForTimeout(1200);

  const s = await navState(page);

  // 1. Logo accent is blue, base letters untouched.
  const spansBlue = s.logoSpans.length > 0 && s.logoSpans.every((x) => x.color === BLUE);
  spansBlue
    ? pass("logo accented spans are --impact-blue", s.logoSpans.map((x) => `${x.cls}=${x.color}`).join(" "))
    : fail("logo accented spans are --impact-blue", JSON.stringify(s.logoSpans));
  s.logoBase === "rgba(46, 92, 218, 0.753)"
    ? pass("rest of logo text color unchanged", s.logoBase)
    : fail("rest of logo text color unchanged", s.logoBase);



  // 2. Donate: white text, and confirm it actually reads against the fill.
  s.donateColor === "rgb(255, 255, 255)"
    ? pass("donate text is white", s.donateColor)
    : fail("donate text is white", s.donateColor);
  s.donateBg === ORANGE
    ? pass("donate background is saturated orange", s.donateBg)
    : fail("donate background is saturated orange", s.donateBg);

  const cr = ratio(parse(s.donateColor), parse(s.donateBg));
  cr >= 4.5
    ? pass("donate white-on-orange contrast AA", `${cr.toFixed(2)}:1`)
    : fail("donate white-on-orange contrast AA", `${cr.toFixed(2)}:1`);

  // Square corners + correct sizing (global .btn leak previously won).
  s.donateRadius === "0px"
    ? pass("donate corners square", s.donateRadius)
    : fail("donate corners square", s.donateRadius);
  s.donateH === "0px"
    ? pass("donate min-height reset (no 48px leak)", s.donateH)
    : fail("donate min-height reset (no 48px leak)", s.donateH);
  s.donateBorder === ORANGE
    ? pass("donate border orange", s.donateBorder)
    : fail("donate border orange", s.donateBorder);

  // 3. Structure / IA untouched.
  s.itemCount === 8
    ? pass("nav item count unchanged (8)", String(s.itemCount))
    : fail("nav item count unchanged (8)", String(s.itemCount));
  s.impactCount === 1 && s.impactChildren === 4
    ? pass("Our Impact dropdown intact", `1 parent, ${s.impactChildren} children`)
    : fail("Our Impact dropdown intact", `${s.impactCount} / ${s.impactChildren}`);

  // Active link distinct + aria-current preserved.
  s.activeWeight === "700"
    ? pass("active link bold", s.activeWeight)
    : fail("active link bold", s.activeWeight);
  s.activeUnderline === BLUE
    ? pass("active link blue underline", s.activeUnderline)
    : fail("active link blue underline", String(s.activeUnderline));
  s.activeAria === "page"
    ? pass("aria-current=page on active link", s.activeAria)
    : fail("aria-current=page on active link", String(s.activeAria));

  // Even spacing.
  s.linkGap === "24px"
    ? pass("even nav item spacing", s.linkGap)
    : fail("even nav item spacing", s.linkGap);

  // Hover state: blue underline appears on a nav link.
  const work = page.locator(".nav-links > a.nav-link", { hasText: "Work" }).first();
  const before = await work.evaluate((el) => getComputedStyle(el).borderBottomColor);
  await work.hover();
  await page.waitForTimeout(300);
  const after = await work.evaluate((el) => ({
    border: getComputedStyle(el).borderBottomColor,
    color: getComputedStyle(el).color,
  }));
  before !== BLUE && after.border === BLUE
    ? pass("hover adds blue underline", `${before} -> ${after.border}`)
    : fail("hover adds blue underline", `${before} -> ${after.border}`);
  await page.mouse.move(0, 600);
  await page.waitForTimeout(300);

  // Scrolled state: active link + donate stay correct on the solid white bar.
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(700);
  const sc = await navState(page);
  sc.activeUnderline === BLUE && sc.donateColor === "rgb(255, 255, 255)"
    ? pass("scrolled bar keeps blue active + white donate", `${sc.activeUnderline} / ${sc.donateColor}`)
    : fail("scrolled bar keeps blue active + white donate", `${sc.activeUnderline} / ${sc.donateColor}`);
  await page.screenshot({ path: `${OUT}/nav-desktop-scrolled.png`, clip: { x: 0, y: 0, width: 1440, height: 90 } });

  // Dropdowns still open.
  await page.locator(".auvd-nav-trigger").first().hover();
  await page.waitForTimeout(500);
  const ddOpen = await page.evaluate(() => {
    const m = document.querySelector(".auvd-dropdown-menu");
    return m ? getComputedStyle(m).visibility : "MISSING";
  });
  ddOpen === "visible"
    ? pass("Our Impact dropdown still opens on hover", ddOpen)
    : fail("Our Impact dropdown still opens on hover", ddOpen);

  await page.locator(".nav-trigger").first().click();
  await page.waitForTimeout(500);
  const aboutOpen = await page.evaluate(() => {
    const el = document.querySelector(".nav-dropdown .dropdown-menu");
    return el ? getComputedStyle(el).visibility : "MISSING";
  });
  aboutOpen === "visible"
    ? pass("About dropdown still opens on click", aboutOpen)
    : fail("About dropdown still opens on click", aboutOpen);
  await page.keyboard.press("Escape");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/nav-desktop-top.png`, clip: { x: 0, y: 0, width: 1440, height: 90 } });

  /* ---------------- mobile ---------------- */
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  m.on("pageerror", (e) => errors.push(`mobile pageerror: ${e.message}`));
  await m.goto(`${BASE}/`, { waitUntil: "load" });
  await m.waitForSelector(".menu-toggle");
  await m.waitForTimeout(1200);

  const toggleVisible = await m.locator(".menu-toggle").isVisible();
  toggleVisible
    ? pass("mobile hamburger visible")
    : fail("mobile hamburger visible");

  const toggleAria = await m.locator(".menu-toggle").getAttribute("aria-expanded");
  toggleAria === "false"
    ? pass("hamburger aria-expanded: closed initially", String(toggleAria))
    : fail("hamburger aria-expanded: closed initially", String(toggleAria));

  const toggleControls = await m.locator(".menu-toggle").getAttribute("aria-controls");
  toggleControls === "mobile-nav-links"
    ? pass("hamburger aria-controls targets mobile menu", String(toggleControls))
    : fail("hamburger aria-controls targets mobile menu", String(toggleControls));

  const ddAria = await m.evaluate(() => ({
    about: document.querySelector(".nav-trigger")?.getAttribute("aria-expanded"),
    chevron: document.querySelector(".auvd-nav-chevron")?.getAttribute("aria-expanded"),
  }));
  ddAria.about === "false" && ddAria.chevron === "false"
    ? pass("disclosure triggers keep aria-expanded", JSON.stringify(ddAria))
    : fail("disclosure triggers keep aria-expanded", JSON.stringify(ddAria));

  const mDonate = await m.evaluate(() => {
    const el = document.querySelector(".navbar .donate-btn");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      color: cs.color,
      bg: cs.backgroundColor,
      radius: cs.borderRadius,
      width: el.getBoundingClientRect().width,
    };
  });
  mDonate && mDonate.color === "rgb(255, 255, 255)" && mDonate.radius === "0px"
    ? pass("mobile donate white + square", `${mDonate.color} on ${mDonate.bg}, r=${mDonate.radius}`)
    : fail("mobile donate white + square", JSON.stringify(mDonate));

  const mActive = await m.evaluate(() => {
    const el = document.querySelector(".nav-link.active");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { color: cs.color, weight: cs.fontWeight, shadow: cs.boxShadow };
  });
  mActive && mActive.weight === "700" && mActive.shadow === "none"
    ? pass("mobile active link distinct", `${mActive.color} w=${mActive.weight}`)
    : fail("mobile active link distinct", JSON.stringify(mActive));

  const noOverflow = await m.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
  noOverflow ? pass("no horizontal overflow on mobile") : fail("no horizontal overflow on mobile");

  // Mobile menu opens and closes.
  await m.locator(".menu-toggle").click();
  await m.waitForTimeout(600);
  const drawerOpen = await m.evaluate(() => {
    const links = document.querySelector(".nav-links");
    return {
      open: links?.classList.contains("open"),
      aria: document.querySelector(".menu-toggle")?.getAttribute("aria-expanded"),
    };
  });
  drawerOpen.open && drawerOpen.aria === "true"
    ? pass("mobile drawer opens and exposes aria-expanded=true", JSON.stringify(drawerOpen))
    : fail("mobile drawer opens and exposes aria-expanded=true", JSON.stringify(drawerOpen));

  await m.screenshot({ path: `${OUT}/nav-mobile-open.png` });

  await m.locator(".menu-toggle").click();
  await m.waitForTimeout(600);
  const drawerClosed = await m.evaluate(() => {
    const el = document.querySelector(".nav-links");
    return el ? !el.classList.contains("open") : false;
  });
  drawerClosed
    ? pass("mobile drawer closes again")
    : fail("mobile drawer closes again");

  await browser.close();
  console.log(results.join("\n"));
  console.log("\nerrors: " + JSON.stringify(errors, null, 2));
  const failures = results.filter((r) => r.startsWith("FAIL"));
  console.log(`\n${results.length - failures.length}/${results.length} passed`);
  process.exit(failures.length ? 1 : 0);
})();
