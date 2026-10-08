/**
 * IndexNow submitter — instantly notifies Bing (and Yandex, Seznam, Naver…) of
 * the site's URLs so they get crawled without waiting for a scheduled recrawl.
 *
 * Prerequisites:
 *   1. The site must be LIVE at https://www.swivtv.be and serving the key file
 *      public/<KEY>.txt at https://www.swivtv.be/<KEY>.txt (it ships in public/).
 *   2. Run this AFTER `npm run build` (it reads dist/ sitemaps for the URL list).
 *
 * Usage:  node scripts/indexnow-submit.mjs
 *
 * Also submit the sitemap in Bing Webmaster Tools once:
 *   https://www.bing.com/webmasters  →  Sitemaps  →  https://www.swivtv.be/sitemap.xml
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "..", "dist");

const HOST = "www.swivtv.be";
const KEY = "89bdb7978a422a052dd599e166d0740e";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Pull every <loc> out of the per-language sitemaps written by prerender.ts.
const urls = new Set();
for (const f of readdirSync(DIST).filter((f) => f.startsWith("sitemap") && f.endsWith(".xml"))) {
  const xml = readFileSync(resolve(DIST, f), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (m[1].includes(HOST) && !m[1].endsWith(".xml")) urls.add(m[1]);
  }
}

const urlList = [...urls];
console.log(`Submitting ${urlList.length} URLs to IndexNow for ${HOST}…`);

// IndexNow accepts up to 10,000 URLs per request.
for (let i = 0; i < urlList.length; i += 10000) {
  const batch = urlList.slice(i, i + 10000);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
  });
  console.log(`  batch ${i / 10000 + 1}: HTTP ${res.status} ${res.statusText}`);
}
console.log("Done. 200/202 = accepted; 403 = key file not reachable yet; 422 = URL/host mismatch.");
