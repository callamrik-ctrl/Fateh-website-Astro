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
  layout.includes('/script.js?v=20260604-bathroom-pages-v2'),
  "src/layouts/BaseLayout.astro should keep the cache-busted header script URL."
);
expect(
  "header stylesheet cache bust",
  layout.includes('/styles.css?v=20260604-bathroom-pages-v2'),
  "src/layouts/BaseLayout.astro should keep the cache-busted header stylesheet URL."
);
expect(
  "header stays sticky",
  styles.includes(".site-header {\n  position: sticky; top: 0; z-index: 120;"),
  "public/styles.css should keep the logo/menu header sticky at the top on all screen sizes."
);
expect(
  "mobile overflow does not break sticky",
  styles.includes("html, body { width: 100%; max-width: 100%; overflow-x: clip; }") && styles.includes("body { overflow-x: clip; }"),
  "public/styles.css should clip horizontal overflow without breaking sticky header behavior."
);
expect(
  "mega menu closes on link click",
  script.includes('document.querySelectorAll(".mega-menu a")'),
  "public/script.js should close mega menus when a menu link is selected."
);
expect(
  "plumbing menu uses approved bathroom links",
  script.includes('<a href="bathroom-plumbing.html">Bathroom Plumbing</a>') &&
    script.includes('<a href="toilet-repair.html">Toilet Repair</a>') &&
    script.includes('<a href="bidet-installation.html">Bidet Installation</a>') &&
    script.includes('<a href="laundry-tub-installation.html">Laundry Tub Installation</a>') &&
    script.includes('<a href="clogged-toilet.html">Clogged Toilet</a>') &&
    script.includes('<a href="clogged-sink.html">Clogged Sink</a>') &&
    !script.includes("shower-tub-repair.html"),
  "The plumbing mega menu should keep the approved bathroom links and not restore the removed shower/tub page."
);
expect(
  "plumbing menu uses approved drains and sewer links",
  script.includes('<a href="sewer-line-repair.html">Sewer Line Repair</a>') &&
    script.includes('<a href="sewer-camera-inspection.html">Sewer Camera Inspection</a>') &&
    script.includes('<a href="backwater-valve.html">Backwater Valve</a>') &&
    script.includes('<a href="basement-plumbing.html">Basement Plumbing</a>') &&
    !script.includes('href="pipe-repair.html">Basement Plumbing</a>'),
  "The plumbing mega menu should keep the approved drains and sewer links and not restore basement plumbing to pipe repair."
);
expect(
  "plumbing menu uses approved emergency repair links",
    script.includes('<a href="emergency-plumber.html">Emergency Plumber</a>') &&
    script.includes('<a href="leak-detection.html">Leak Detection</a>') &&
    script.includes('<a href="pipe-repair.html">Pipe Repair</a>') &&
    script.includes('<a href="burst-pipe-repair.html">Burst Pipe Repair</a>') &&
    script.includes('<a href="main-drain-backup.html">Main Drain Backup</a>') &&
    !script.includes('class="menu-needs-work" href="pipe-repair.html">Pipe Repair</a>') &&
    !script.includes('class="menu-needs-work" href="emergency-plumber.html">Burst / Frozen Pipe</a>') &&
    !script.includes('<a href="burst-frozen-pipe.html">Burst / Frozen Pipe</a>') &&
    !script.includes('<a href="water-line-repair.html">Water Line Repair</a>') &&
    !script.includes('class="menu-needs-work" href="drain-cleaning.html">Main Drain Backup</a>'),
  "The plumbing mega menu should keep the approved emergency links and not restore placeholder routes."
);
expect(
  "mobile mega menu opens as single column",
  styles.includes(".mega-wrap.mobile-open .mega-menu { display: grid !important; }") &&
    styles.includes(".mega-menu.plumbing-menu, .mega-menu.electrical-menu, .mega-menu.commercial-menu { grid-template-columns: minmax(0, 1fr); max-width: 100%; }") &&
    styles.includes(".mega-menu .mega-footer { display: none; }"),
  "Mobile mega menus should open as a single-column menu without the desktop footer panel."
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
