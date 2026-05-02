import fs from "fs";
import path from "path";
import { categories } from "../src/lib/units";
import { blogPosts } from "../src/lib/blogPosts";

const DOMAIN = process.env.APP_URL || "https://quickconvertunits.com"; // Provide a default domain, or the app url

const sitemapPath = path.resolve(process.cwd(), "public/sitemap.xml");

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

function addUrl(urlPath, priority = "0.8", changefreq = "monthly") {
  sitemap += `  <url>
    <loc>${DOMAIN}${urlPath}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
}

// Static routes
addUrl("/", "1.0", "daily");
addUrl("/privacy-policy", "0.3", "yearly");
addUrl("/terms", "0.3", "yearly");
addUrl("/about", "0.5", "yearly");
addUrl("/contact", "0.4", "yearly");
addUrl("/blog", "0.9", "weekly");

// Blog posts
for (const post of blogPosts) {
  addUrl(`/blog/${post.slug}`, "0.8", "monthly");
}

const getSEOUrlPath = (fromId, toId) => {
  if (fromId === 'kilogram' && toId === 'pound') return '/kg-to-lbs';
  if (fromId === 'inch' && toId === 'centimeter') return '/inches-to-cm';
  if (fromId === 'centimeter' && toId === 'inch') return '/cm-to-inches';
  if (fromId === 'pound' && toId === 'kilogram') return '/lbs-to-kg';
  if (fromId === 'foot' && toId === 'meter') return '/feet-to-meters';
  if (fromId === 'mile' && toId === 'kilometer') return '/miles-to-km';
  if (fromId === 'millimeter' && toId === 'inch') return '/mm-to-inches';
  return `/${fromId}-to-${toId}`;
};

// All valid conversion combinations
for (const category of categories) {
  for (const fromUnit of category.units) {
    for (const toUnit of category.units) {
      if (fromUnit.id !== toUnit.id) {
        let path = getSEOUrlPath(fromUnit.id, toUnit.id);
        // bump priority of top 10 keywords
        let priority = "0.7";
        if (["/kg-to-lbs", "/inches-to-cm", "/cm-to-inches", "/lbs-to-kg", "/feet-to-meters", "/miles-to-km", "/mm-to-inches"].includes(path)) {
          priority = "0.9";
        }
        addUrl(path, priority, "monthly");
      }
    }
  }
}

sitemap += `</urlset>\n`;

fs.writeFileSync(sitemapPath, sitemap, "utf8");
console.log(`Generated sitemap with length: ${sitemap.length} bytes at ${sitemapPath}`);
