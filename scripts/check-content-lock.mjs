import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const lockedFiles = {
  "src/pages/index.astro": "7b961188666f156a69381ab2df86921db122d2c7ff9de9d709560c7a8445f34f",
  "src/pages/brampton-plumber.astro": "3708a488c7aa51bd4387dea885256707c8ab2ebb5eab29099db156c258d6d231",
  "src/pages/brampton-electrician.astro": "c4deeb1fefa86863d376743cb356c603f9134ce1b1dc3877ec694b3e62970290",
  "src/pages/emergency-plumber.astro": "e6f4a12217777099956d1622a1e25220eeffbf09e0f5e9ad48a0e8fdb0e67fa8",
  "src/pages/emergency-electrician.astro": "5e30fc2a2a0d8162fec72cb9e388b54ebdf40570177b91482578b254c6d3076a",
  "src/pages/panel-upgrade.astro": "195549aa79ab34b9cf2b73223bda448f8f9461b266c9351d27e3e218c70a0955",
  "src/pages/ev-charger-installation.astro": "c537492d820a23ea63ca61be70678987a6ced88ef882441dd6cfcb6c3e97e8a4",
  "src/pages/lighting-smart-home.astro": "f06646a18afc96827c92a49eea93859c6f0ddde6ef96aa8e6a80a0db55613c56",
  "src/pages/disclaimer.astro": "6f489e0b7414c95077a7521e6019b0d823cfbcd9ee0ff34a53a0924bd4701a5f",
  "src/components/SiteHeader.astro": "649897bc46af762963c3127da05157abfee2f620abd59b2260d1cdf97026d66b",
  "src/components/SiteFooter.astro": "4600d7877003a2d6b4fd6e8ba9e9102fc8ab6b1bac22f6f778aebc9712e5d69e",
  "src/components/ElectricalServicePage.astro": "fccb1e35e40d0e74cead450fd09bb83feabdf92a070a0f01db2805d94d595d87",
  "public/styles.css": "d2a66e9d3a41fb00cc7bcb751739fc5925bfffc96005bea3cb49c4f0962b41ef",
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
