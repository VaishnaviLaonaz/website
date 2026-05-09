// scripts/generate-sitemap.js
const fs = require("fs");
const path = require("path");
const { initializeApp, deleteApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  goOffline,
} = require("firebase/database");

const SITE_URL = "https://laonaz.co.in";

/*
 * Load .env manually.
 * CRA loads .env automatically for React,
 * but this Node script runs before CRA build,
 * so we load the same REACT_APP_* values here.
 */
function loadEnvFile() {
  const envFiles = [".env.local", ".env"];

  let loadedAny = false;

  envFiles.forEach((fileName) => {
    const envPath = path.join(process.cwd(), fileName);

    if (!fs.existsSync(envPath)) return;

    loadedAny = true;

    const envText = fs.readFileSync(envPath, "utf8");

    envText.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) return;

      const equalIndex = trimmed.indexOf("=");

      if (equalIndex === -1) return;

      const key = trimmed.slice(0, equalIndex).trim();
      let value = trimmed.slice(equalIndex + 1).trim();

      value = value.replace(/^["']|["']$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
  });

  if (!loadedAny) {
    console.warn("No .env.local or .env file found. Using existing process.env only.");
  }
}

loadEnvFile();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const staticRoutes = [
  { path: "/", priority: "1.00", changefreq: "daily" },
  { path: "/home", priority: "0.95", changefreq: "daily" },
  { path: "/articlesPage", priority: "0.95", changefreq: "daily" },
  { path: "/community-guide", priority: "0.85", changefreq: "weekly" },
  { path: "/about", priority: "0.70", changefreq: "monthly" },
  { path: "/terms", priority: "0.30", changefreq: "yearly" },
  { path: "/privacy", priority: "0.30", changefreq: "yearly" },
  { path: "/security", priority: "0.30", changefreq: "yearly" },
  { path: "/cookies", priority: "0.30", changefreq: "yearly" },
];

function validateFirebaseConfig() {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      `Missing Firebase config values: ${missing.join(
        ", "
      )}. Check your .env file.`
    );
  }
}

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatDate(timestamp) {
  if (!timestamp) return new Date().toISOString();

  const date = new Date(Number(timestamp));

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function createUrlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(lastmod || new Date().toISOString())}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generateSitemap() {
  validateFirebaseConfig();

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const entries = [];

  staticRoutes.forEach((route) => {
    entries.push(
      createUrlEntry({
        loc: `${SITE_URL}${route.path}`,
        lastmod: new Date().toISOString(),
        changefreq: route.changefreq,
        priority: route.priority,
      })
    );
  });

  const articlesQuery = query(
    ref(database, "articles"),
    orderByChild("createdAt")
  );

  const snapshot = await get(articlesQuery);

  if (snapshot.exists()) {
    snapshot.forEach((childSnap) => {
      const articleId = childSnap.key;
      const article = childSnap.val() || {};

      entries.push(
        createUrlEntry({
          loc: `${SITE_URL}/article/${articleId}`,
          lastmod: formatDate(article.updatedAt || article.createdAt),
          changefreq: "weekly",
          priority: "0.80",
        })
      );
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${entries.join("\n")}
</urlset>
`;

  const outputPath = path.join(process.cwd(), "public", "sitemap.xml");

  fs.writeFileSync(outputPath, xml, "utf8");

  console.log(`Sitemap generated: ${outputPath}`);
  console.log(`Total URLs: ${entries.length}`);
  
  goOffline(database);
  await deleteApp(app);
}

generateSitemap().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exit(1);
});