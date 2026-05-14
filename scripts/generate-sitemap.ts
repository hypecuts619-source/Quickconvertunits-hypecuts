import fs from "fs";
import path from "path";
import { categories } from "../src/lib/units";
import { blogPosts } from "../src/lib/blogPosts";

const DOMAIN = "https://quickconvertunits.com";

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
  if (fromId === 'inch' && toId === 'pixel') return '/inches-to-pixels';
  if (fromId === 'pixel' && toId === 'inch') return '/pixels-to-inches';
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

const top50Paths = [
  "/kg-to-lbs",
  "/lbs-to-kg",
  "/inches-to-cm",
  "/cm-to-inches",
  "/feet-to-meters",
  "/meters-to-feet",
  "/miles-to-km",
  "/km-to-miles",
  "/mm-to-inches",
  "/inches-to-mm",
  "/inches-to-pixels",
  "/pixels-to-inches",
  "/celsius-to-fahrenheit",
  "/fahrenheit-to-celsius",
  "/usd-to-inr",
  "/mph-to-kph",
  "/kph-to-mph",
  "/liters-to-gallons",
  "/gallons-to-liters",
  "/acres-to-square-meters",
  "/square-feet-to-square-meters",
  "/usd-to-eur",
  "/eur-to-usd",
  "/gbp-to-usd",
  "/usd-to-gbp",
  "/grams-to-ounces",
  "/ounces-to-grams",
  "/ml-to-cups",
  "/cups-to-ml",
  "/ml-to-oz",
  "/oz-to-ml",
  "/mbps-to-MBps",
  "/gbps-to-GBps",
  "/joules-to-calories",
  "/calories-to-joules",
  "/sq-meters-to-sq-feet",
  "/sq-km-to-sq-miles",
  "/sq-miles-to-sq-km",
  "/kpa-to-psi",
  "/psi-to-kpa",
  "/bar-to-psi",
  "/watt-to-horsepower",
  "/horsepower-to-watt",
  "/bits-to-bytes",
  "/bytes-to-bits",
  "/kg-to-stone",
  "/stone-to-kg",
  "/km-to-m",
  "/m-to-km"
];

for (const pathStr of top50Paths) {
  addUrl(pathStr, "0.9", "monthly");
}

sitemap += `</urlset>\n`;

fs.writeFileSync(sitemapPath, sitemap, "utf8");
const programmaticPath = path.resolve(process.cwd(), "public/sitemap-programmatic.xml");
fs.writeFileSync(programmaticPath, sitemap, "utf8");
console.log(`Generated sitemaps at ${sitemapPath} and ${programmaticPath}`);
