const { chromium } = require("playwright");

const EXPECTED =
  "Art and Unity for Vulnerable Development (AUVD) is a nonprofit community-based and refugee-led organization working in Kakuma Refugee Camp, Kenya. Since 2022, AUVD has supported refugees, women, youth, children, and persons with disabilities through arts, skills development, and inclusive community programs.";

(async () => {
  const b = await chromium.launch();

  for (const path of ["/about", "/pricing"]) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(`http://localhost:5173${path}`, { waitUntil: "load" });
    await p.waitForTimeout(2500);
    const info = await p.evaluate(() => {
      const para = document.querySelector(".auvd-impact-hero__text");
      const faces = [];
      document.fonts.forEach((f) => faces.push(`${f.family}:${f.status}`));
      return {
        raw: para ? para.textContent.slice(0, 200) : null,
        normalized: para ? para.textContent.replace(/\s+/g, " ").trim() : null,
        length: para ? para.textContent.replace(/\s+/g, " ").trim().length : 0,
        family: para ? getComputedStyle(para).fontFamily : null,
        faces: [...new Set(faces)],
        checks: {
          roboto: document.fonts.check('16px "Roboto"'),
          anton: document.fonts.check('16px "Anton"'),
        },
      };
    });

    console.log(`\n===== ${path} =====`);
    console.log("computed family:", info.family);
    console.log("normalized length:", info.length);
    console.log("roboto/anton loaded:", JSON.stringify(info.checks));
    console.log("faces:", info.faces.join(" | "));
    if (path === "/about") {
      const actual = info.normalized || "";
      if (actual === EXPECTED) {
        console.log("TEXT MATCHES");
      } else {
        let i = 0;
        while (i < Math.min(actual.length, EXPECTED.length) && actual[i] === EXPECTED[i]) i += 1;
        console.log("first difference at index", i);
        console.log("actual :", JSON.stringify(actual.slice(Math.max(0, i - 40), i + 40)));
        console.log("expected:", JSON.stringify(EXPECTED.slice(Math.max(0, i - 40), i + 40)));
      }
      const labels = await p.evaluate(() =>
        [...document.querySelectorAll(".auvd-story-label")].map((el) => el.textContent.replace(/\s+/g, " ").trim())
      );
      console.log("all labels:", JSON.stringify(labels));
      const statements = await p.evaluate(() =>
        [...document.querySelectorAll(".about-mv-text")].map((el) => el.textContent.replace(/\s+/g, " ").trim().slice(0, 40))
      );
      console.log("mv statements:", JSON.stringify(statements));
      const meta = await p.evaluate(() => {
        const m = document.querySelector(".auvd-impact-hero__meta");
        return m ? { text: m.textContent.replace(/\s+/g, " ").trim(), label: m.querySelector("strong")?.textContent, caption: m.querySelector("span")?.textContent } : null;
      });
      console.log("meta pieces:", JSON.stringify(meta));
    }
    await p.close();
  }

  await b.close();
})();
