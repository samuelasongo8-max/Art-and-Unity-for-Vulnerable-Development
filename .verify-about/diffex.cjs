/* Compares the expectation strings inside run.cjs with the rendered page. */
const fs = require("fs");

const src = fs.readFileSync(".verify-about/run.cjs", "utf8");
const grab = (key) => {
  const m = src.match(new RegExp(`^  ${key}: "(.*)",$`, "m"));
  return m ? m[1] : null;
};

const EXPECTED =
  "Art and Unity for Vulnerable Development (AUVD) is a nonprofit community-based and refugee-led organization working in Kakuma Refugee Camp, Kenya. Since 2022, AUVD has supported refugees, women, youth, children, and persons with disabilities through arts, skills development, and inclusive community programs.";

const got = grab("heroP");
console.log("heroP length in script :", got ? got.length : "not found");
console.log("expected length        :", EXPECTED.length);
let i = 0;
while (got && i < Math.min(got.length, EXPECTED.length) && got[i] === EXPECTED[i]) i += 1;
console.log("first difference at     :", i);
console.log("script  :", JSON.stringify((got || "").slice(Math.max(0, i - 30), i + 30)));
console.log("expected:", JSON.stringify(EXPECTED.slice(Math.max(0, i - 30), i + 30)));

["mission", "vision", "whoTitle", "whoP1", "whoP2", "goalTitle", "goalP1", "goalP2", "serveTitle", "serveP"].forEach((k) => {
  console.log(k, "->", JSON.stringify((grab(k) || "").slice(0, 40)));
});
