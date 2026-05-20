/**
 * Downloads stock legal imagery into public/images for local serving.
 * Run: node scripts/fetch-media.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMG = path.join(ROOT, "public", "images");

/** Unsplash (free to use per Unsplash license) — legal / professional */
const FILES = {
  "saumya-upadhyay.jpg":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85&auto=format&fit=crop",
  "advocacy/hero-courthouse.jpg":
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=85&auto=format&fit=crop",
  "advocacy/courtroom.jpg":
    "https://images.unsplash.com/photo-1505664194771-60be225b47a2?w=1400&q=85&auto=format&fit=crop",
  "advocacy/law-library.jpg":
    "https://images.unsplash.com/photo-1521587760476-6c2f97ffdf98?w=1400&q=85&auto=format&fit=crop",
  "practice/insolvency.jpg":
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=85&auto=format&fit=crop",
  "practice/arbitration.jpg":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=85&auto=format&fit=crop",
  "practice/corporate.jpg":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=85&auto=format&fit=crop",
  "practice/ip.jpg":
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=85&auto=format&fit=crop",
  "practice/cyber.jpg":
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=85&auto=format&fit=crop",
  "practice/litigation.jpg":
    "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800&q=85&auto=format&fit=crop",
};

async function download(relPath, url) {
  const dest = path.join(IMG, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) {
    console.log(`  skip (exists): ${relPath}`);
    return;
  }
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  ok: ${relPath} (${Math.round(buf.length / 1024)} KB)`);
}

console.log("Fetching media into public/images …\n");
let failed = 0;
for (const [rel, url] of Object.entries(FILES)) {
  try {
    await download(rel, url);
  } catch (err) {
    failed += 1;
    console.error(`  FAIL: ${rel} — ${err.message}`);
  }
}
console.log(failed ? `\n${failed} file(s) failed.` : "\nDone.");
process.exit(failed ? 1 : 0);
