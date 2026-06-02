import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const lockedFiles = {
  "src/pages/index.astro": "37e1aab3df7208bb0106dcdb07d2107b850b6a228cedd7140d4854035d219a86",
  "src/pages/brampton-plumber.astro": "cee36816d03214339233c73544680054f6a27a35489716357f3b22297adfc53f",
  "src/pages/brampton-electrician.astro": "8bc2e92927d9fa34eabe09510a06de35735dfb9c38618f2d0c5350d80cb6af62",
  "src/pages/emergency-plumber.astro": "00b82fc57aaf9c9e4d6015017821c8c29aa5ea2ffac136d7dcd95ef120e882f2",
  "src/pages/emergency-electrician.astro": "ee29a4b099848f7d2f365a8d2b193cf2255fec89b047eda36924a5558b2b97b0",
  "src/pages/panel-upgrade.astro": "6bfcb39bcee7b3c174c09d07ea9a056fcb55d302e499b6c37d58a3db3bfe1af2",
  "src/pages/ev-charger-installation.astro": "3f615624337abe9c3e6d54daf8d14a163920f43f884f9bb23281fad00a7f89fb",
  "src/pages/lighting-smart-home.astro": "cde33063f715c5935d2e4fd5ebff2c22a0d4bdd6e47f9f65beef462f50440d60",
  "src/pages/disclaimer.astro": "6f489e0b7414c95077a7521e6019b0d823cfbcd9ee0ff34a53a0924bd4701a5f",
  "src/components/SiteHeader.astro": "649897bc46af762963c3127da05157abfee2f620abd59b2260d1cdf97026d66b",
  "src/components/SiteFooter.astro": "d7c94312249ed4754aecd9dec4166ff2754c6c20675494338d3aa79c6f53ef10",
  "src/components/ElectricalServicePage.astro": "fccb1e35e40d0e74cead450fd09bb83feabdf92a070a0f01db2805d94d595d87",
  "public/styles.css": "6375455c185923b5b839ecca471c31bd55f80c65c86ce6e2735d8a06117f8236",
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
