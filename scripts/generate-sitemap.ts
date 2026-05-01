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

// All valid conversion combinations
for (const category of categories) {
  for (const fromUnit of category.units) {
    for (const toUnit of category.units) {
      if (fromUnit.id !== toUnit.id) {
        addUrl(`/${fromUnit.id}-to-${toUnit.id}`, "0.7", "monthly");
      }
    }
  }
}

sitemap += `</urlset>\n`;

fs.writeFileSync(sitemapPath, sitemap, "utf8");
console.log(`Generated sitemap with length: ${sitemap.length} bytes at ${sitemapPath}`);
