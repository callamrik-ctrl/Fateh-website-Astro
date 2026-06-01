import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pagesDir = path.join(root, "src", "pages");
const checks = [];

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

function expect(name, condition, message) {
  checks.push({ name, ok: Boolean(condition), message });
}

const styles = await read("public/styles.css");
const script = await read("public/script.js");
const layout = await read("src/layouts/BaseLayout.astro");
const pages = (await readdir(pagesDir)).filter((file) => file.endsWith(".astro"));

expect(
  "header css lock marker",
  styles.includes("LOCKED HEADER AREA"),
  "public/styles.css is missing the locked header warning comment."
);
expect(
  "header js lock marker",
  script.includes("LOCKED HEADER AREA"),
  "public/script.js is missing the locked header warning comment."
);
expect(
  "header script cache bust",
  layout.includes('/script.js?v=20260531-brampton-reviews'),
  "src/layouts/BaseLayout.astro should keep the cache-busted header script URL."
);
expect(
  "header stylesheet cache bust",
  layout.includes('/styles.css?v=20260601-electrical-red-lock'),
  "src/layouts/BaseLayout.astro should keep the cache-busted header stylesheet URL."
);
expect(
  "mega menu closes on link click",
  script.includes('document.querySelectorAll(".mega-menu a")'),
  "public/script.js should close mega menus when a menu link is selected."
);
expect(
  "electrical red lock marker",
  styles.includes("LOCKED ELECTRICAL PAGE RED ACCENTS"),
  "public/styles.css is missing the electrical red accent lock comment."
);
expect(
  "electrical red hub icons",
  styles.includes(".electrical-hub-band .hub-icon { background: #ef233c; }"),
  "Electrical service hub icons should stay red on electrical pages."
);
expect(
  "electrical red trust icons",
  styles.includes(".electrical-trust-banner .trust-feature-icon") && styles.includes("background: #ef233c;"),
  "Electrical trust banner icons should stay red on electrical pages."
);
expect(
  "electrical red process steps",
  styles.includes(".electrical-process-band .process-steps span") && styles.includes("rgba(239, 35, 60, .16)"),
  "Electrical process step numbers should stay red on electrical pages."
);
expect(
  "electrical red problem cards",
  styles.includes(".electrical-problem-band .problem-grid a") && styles.includes("color: #b80009;"),
  "Electrical problem-card links should stay red on electrical pages."
);
expect(
  "electrical red cta band",
  styles.includes(".electrical-cta-band") && styles.includes("linear-gradient(135deg, #3a0a12, #a81220)"),
  "Electrical CTA bands should stay red on electrical pages."
);

for (const file of pages) {
  const relativePath = path.join("src", "pages", file);
  const content = await read(relativePath);
  expect(
    `${file} clean visual logo`,
    !content.includes('brand-logo\\" src=\\"assets/fateh-logo.png\\"'),
    `${relativePath} should use fateh-logo-clean.png for the visible header logo.`
  );
  expect(
    `${file} no default open menu`,
    !content.includes("mega-wrap active"),
    `${relativePath} should not render a mega menu open by default.`
  );
}

const failures = checks.filter((check) => !check.ok);

if (failures.length) {
  console.error("Header lock check failed:");
  for (const failure of failures) {
    console.error(`- ${failure.name}: ${failure.message}`);
  }
  process.exit(1);
}

console.log(`Header lock check passed (${checks.length} checks).`);
