const { chromium } = require("playwright");
const OUT = ".verify-about";

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto("http://localhost:5173/about", { waitUntil: "load" });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1200);

  const bands = p.locator(".auvd-story-section");
  await bands.nth(0).screenshot({ path: `${OUT}/crop-mission.png` });
  await bands.nth(2).screenshot({ path: `${OUT}/crop-goal.png` });
  await bands.nth(3).screenshot({ path: `${OUT}/crop-serve.png` });

  const goalLabel = p.locator(".auvd-story-label").nth(2);
  const box = await goalLabel.boundingBox();
  const bandBox = await bands.nth(2).boundingBox();
  console.log("goal label box:", JSON.stringify(box));
  console.log("goal band box :", JSON.stringify(bandBox));
  console.log("label left offset inside band:", Math.round(box.x - bandBox.x));
  console.log("label HTML:", (await goalLabel.evaluate((el) => el.outerHTML)).slice(0, 300));

  const strip = await p.evaluate(() => {
    const s = document.querySelector(".about-mv-strip");
    if (!s) return null;
    const imgs = [...s.querySelectorAll("img")].map((i) => ({
      src: i.getAttribute("src"),
      nat: `${i.naturalWidth}x${i.naturalHeight}`,
      box: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}`,
    }));
    return { cols: getComputedStyle(s).gridTemplateColumns, imgs };
  });
  console.log("mission strip:", JSON.stringify(strip));

  await p.close();
  await b.close();
})();
