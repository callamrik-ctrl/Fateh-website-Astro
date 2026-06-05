import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const lockedFiles = {
  "src/pages/index.astro": "7b961188666f156a69381ab2df86921db122d2c7ff9de9d709560c7a8445f34f",
  "src/pages/brampton-plumber.astro": "3708a488c7aa51bd4387dea885256707c8ab2ebb5eab29099db156c258d6d231",
  "src/pages/brampton-electrician.astro": "c4deeb1fefa86863d376743cb356c603f9134ce1b1dc3877ec694b3e62970290",
  "src/pages/emergency-plumber.astro": "7ee64a11c51b6f45a413a1bc76fd268902b913f8bf2c3d96026c8bc916f06b25",
  "src/pages/leak-detection.astro": "884121e71d0bd60315934dc9da67a89c292b0dee486b11103ee2ab56ebb8439a",
  "src/pages/pipe-repair.astro": "c1f981c2a2f3c51fbef1c0373cc8a936f459a5575964d232ead5adf1e54e5505",
  "src/pages/burst-pipe-repair.astro": "11af4b042799cd0a48ba58ed2138ee32eab0c6954cdac94ea55cb315f8df14d9",
  "src/pages/main-drain-backup.astro": "41e4b41fce2a7998de05e4aa46c6fc7553f9ecd4b49259322e59d2c99df9b3b5",
  "src/pages/bidet-installation.astro": "d17dd094d3b995c442054c9bba23319f4d8b5b6ed2f8b22e650ec816c87d0d46",
  "src/pages/laundry-tub-installation.astro": "bc27e28005f189e3f1fe1730e15f393eda870961a65993359f8af3dc07f4edf2",
  "src/data/emergencyRepairPages.js": "92dfd693e0fa1e47c52bf30b3f6f26bf4dfd01055b314d2f2896f6bddf0c49b9",
  "src/pages/emergency-electrician.astro": "5e30fc2a2a0d8162fec72cb9e388b54ebdf40570177b91482578b254c6d3076a",
  "src/pages/panel-upgrade.astro": "195549aa79ab34b9cf2b73223bda448f8f9461b266c9351d27e3e218c70a0955",
  "src/pages/ev-charger-installation.astro": "c537492d820a23ea63ca61be70678987a6ced88ef882441dd6cfcb6c3e97e8a4",
  "src/pages/lighting-smart-home.astro": "f06646a18afc96827c92a49eea93859c6f0ddde6ef96aa8e6a80a0db55613c56",
  "src/pages/disclaimer.astro": "6f489e0b7414c95077a7521e6019b0d823cfbcd9ee0ff34a53a0924bd4701a5f",
  "src/components/SiteHeader.astro": "4c8f88e214da3ead0f70e7f71107cf33e72508b861228fa65883184c49919db3",
  "src/components/SiteFooter.astro": "e182f4b0ba86d5133a87ae0f11cca09f78572ad567c11bcd1abce9e9d2b65c94",
  "src/components/ElectricalServicePage.astro": "fccb1e35e40d0e74cead450fd09bb83feabdf92a070a0f01db2805d94d595d87",
  "public/styles.css": "ebeeefc505948016652d917ad4f17e509b0a1c1c952d4fe5f5206f5de18e8c7d",
};

const changed = [];

for (const [file, expected] of Object.entries(lockedFiles)) {
  const content = await readFile(file);
  const actual = createHash("sha256").update(content).digest("hex");
  if (actual !== expected) {
    changed.push(`${file}\n  expected ${expected}\n  actual   ${actual}`);
  }
}

if (changed.length) {
  console.error("Content lock failed. These protected pages/components changed:\n\n" + changed.join("\n\n"));
  console.error("\nOnly update this lock after Amrik explicitly approves changing those protected files.");
  process.exit(1);
}

console.log(`Content lock passed (${Object.keys(lockedFiles).length} protected files).`);
