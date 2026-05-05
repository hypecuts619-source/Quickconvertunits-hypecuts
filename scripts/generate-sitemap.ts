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
  
  // Specific requested pair shortcuts
  if (fromId === 'usd' && toId === 'inr') return '/usd-to-inr';
  if (fromId === 'mile_per_hour' && toId === 'kilometer_per_hour') return '/mph-to-kph';
  if (fromId === 'liter' && toId === 'us_gallon') return '/liters-to-gallons';
  if (fromId === 'acre' && toId === 'square_meter') return '/acres-to-square-meters';
  if (fromId === 'square_foot' && toId === 'square_meter') return '/square-feet-to-square-meters';
  if (fromId === 'celsius' && toId === 'fahrenheit') return '/celsius-to-fahrenheit';
  if (fromId === 'fahrenheit' && toId === 'celsius') return '/fahrenheit-to-celsius';

  return `/${fromId}-to-${toId}`;
};

// All valid conversion combinations
addUrl("/time-zone-converter", "0.9", "weekly");

const magicNumbers = [1, 5, 10, 20, 25, 50, 100, 150, 180, 200, 250, 500, 1000, 1500, 2000, 3000, 5000];

for (const category of categories) {
  addUrl(`/${category.id.replace(/_/g, '-')}-converter`, "0.9", "weekly");
  
  for (const fromUnit of category.units) {
    for (const toUnit of category.units) {
      if (fromUnit.id !== toUnit.id) {
        let pathStr = getSEOUrlPath(fromUnit.id, toUnit.id);
        // bump priority of top 10 keywords
        let priority = "0.7";
        if (["/kg-to-lbs", "/inches-to-cm", "/cm-to-inches", "/lbs-to-kg", "/feet-to-meters", "/miles-to-km", "/mm-to-inches"].includes(pathStr)) {
          priority = "0.9";
        }
        addUrl(pathStr, priority, "monthly");

        // Add dynamic conversions for popular SEO queries
        for (const val of magicNumbers) {
          // pathStr is e.g. "/lbs-to-kg"
          // we want "/convert-150-lbs-to-kg"
          const dynamicPath = `/convert-${val}${pathStr.replace('/', '-')}`;
          addUrl(dynamicPath, priority === "0.9" ? "0.8" : "0.5", "monthly");
        }
      }
    }
  }
}

sitemap += `</urlset>\n`;

fs.writeFileSync(sitemapPath, sitemap, "utf8");
const programmaticPath = path.resolve(process.cwd(), "public/sitemap-programmatic.xml");
fs.writeFileSync(programmaticPath, sitemap, "utf8");
console.log(`Generated sitemaps at ${sitemapPath} and ${programmaticPath}`);
