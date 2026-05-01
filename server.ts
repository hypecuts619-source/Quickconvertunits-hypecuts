import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We define a small map of the most common units to serve rich SEO tags quickly.
// If a unit is not in this map, we fallback to formatting the URL string.
const popularUnits: Record<string, { name: string; symbol: string }> = {
  meter: { name: "Meter", symbol: "m" },
  kilometer: { name: "Kilometer", symbol: "km" },
  centimeter: { name: "Centimeter", symbol: "cm" },
  millimeter: { name: "Millimeter", symbol: "mm" },
  mile: { name: "Mile", symbol: "mi" },
  yard: { name: "Yard", symbol: "yd" },
  foot: { name: "Foot", symbol: "ft" },
  inch: { name: "Inch", symbol: "in" },
  kilogram: { name: "Kilogram", symbol: "kg" },
  gram: { name: "Gram", symbol: "g" },
  pound: { name: "Pound", symbol: "lb" },
  ounce: { name: "Ounce", symbol: "oz" },
  celsius: { name: "Celsius", symbol: "°C" },
  fahrenheit: { name: "Fahrenheit", symbol: "°F" },
  kelvin: { name: "Kelvin", symbol: "K" },
  square_meter: { name: "Square Meter", symbol: "m²" },
  acre: { name: "Acre", symbol: "ac" },
  hectare: { name: "Hectare", symbol: "ha" },
  square_foot: { name: "Square Foot", symbol: "ft²" },
  liter: { name: "Liter", symbol: "L" },
  milliliter: { name: "Milliliter", symbol: "mL" },
  gallon_us: { name: "US Gallon", symbol: "gal" },
  cup_us: { name: "US Cup", symbol: "cup" },
  second: { name: "Second", symbol: "s" },
  minute: { name: "Minute", symbol: "min" },
  hour: { name: "Hour", symbol: "h" },
  day: { name: "Day", symbol: "d" }
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Let Vite handle API routes if needed, otherwise skip
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    console.log("Starting Vite development server...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    
    // Serve static files EXCEPT index.html
    app.use(express.static(distPath, { index: false }));

    // For all other routes, serve index.html with injected SEO tags
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app.get("*", (req: any, res: any) => {
      const templatePath = path.join(distPath, "index.html");
      let template = "";
      try {
        template = fs.readFileSync(templatePath, "utf-8");
      } catch (e) {
        return res.status(500).send("index.html not found. Did you build the app?");
      }

      const urlPath = req.path.replace(/^\//, "");
      
      if (urlPath && urlPath.includes("-to-")) {
        const parts = urlPath.split("-to-");
        if (parts.length === 2) {
          const fromId = parts[0];
          const toId = parts[1];
          
          const fromUnit = popularUnits[fromId] || { name: capitalize(fromId), symbol: capitalize(fromId) };
          const toUnit = popularUnits[toId] || { name: capitalize(toId), symbol: capitalize(toId) };
          
          const title = `${fromUnit.symbol.toUpperCase()} to ${toUnit.symbol.toUpperCase()} Converter | ${fromUnit.name} to ${toUnit.name} Fast`;
          const description = `Convert ${fromUnit.name.toLowerCase()} to ${toUnit.name.toLowerCase()} instantly and accurately. Enter value, select units—get results to 10 decimals. Perfect for cooking, fitness, shipping.`;

          template = template.replace(
            /<title>(.*?)<\/title>/,
            `<title>${title} - QuickConvert</title>`
          );
          template = template.replace(
            /<meta name="description" content="(.*?)" \/>/,
            `<meta name="description" content="${description}" />`
          );
          template = template.replace(
            /<meta property="og:title" content="(.*?)" \/>/,
            `<meta property="og:title" content="${title} - QuickConvert" />`
          );
          template = template.replace(
            /<meta property="og:description" content="(.*?)" \/>/,
            `<meta property="og:description" content="${description}" />`
          );
          template = template.replace(
            /<meta property="og:url" content="(.*?)" \/>/,
            `<meta property="og:url" content="https://quickconvertunits.com/${urlPath}" />`
          );
          
          const staticContent = `
            <div style="display:none;" aria-hidden="true">
              <h1>${fromUnit.name} to ${toUnit.name} Converter</h1>
              <p>${description}</p>
              <section>
                <h2>How to convert ${fromUnit.name} to ${toUnit.name}</h2>
                <p>To convert a value from ${fromUnit.name} to ${toUnit.name}, simply use our fast, responsive calculator above. Enter any number into the ${fromUnit.name} field and the conversion to ${toUnit.name} will evaluate instantly. We use the most precise conversion rates available.</p>
              </section>
              <section>
                <h2>Quick Conversion Reference</h2>
                <ul>
                  <li>1 ${fromUnit.name} to ${toUnit.name}</li>
                  <li>5 ${fromUnit.name} to ${toUnit.name}</li>
                  <li>10 ${fromUnit.name} to ${toUnit.name}</li>
                  <li>50 ${fromUnit.name} to ${toUnit.name}</li>
                  <li>100 ${fromUnit.name} to ${toUnit.name}</li>
                </ul>
              </section>
              <section>
                <h2>Frequently Asked Questions</h2>
                <h3>How do I convert ${fromUnit.name} to ${toUnit.name}?</h3>
                <p>Enter the number of ${fromUnit.symbol} you wish to convert in the top input box. The corresponding ${toUnit.symbol} value will instantly populate in the bottom input box.</p>
                <h3>Is this ${fromUnit.name} to ${toUnit.name} converter free?</h3>
                <p>Yes, all conversions on QuickConvertUnits including ${fromUnit.name} to ${toUnit.name} are 100% free and work offline.</p>
                <h3>Why should I use this converter?</h3>
                <p>We built this tool to provide instant, precise unit conversions without intrusive ads. The ${fromUnit.name} to ${toUnit.name} tool works perfectly on both mobile and desktop.</p>
              </section>
            </div>
          `;

          // Replace the placeholder static content with our custom SEO block
          template = template.replace(
            /<div style="display:none;" aria-hidden="true">[\s\S]*?<\/div>/,
            staticContent
          );
          
          // Basic Schema.org injection
          const schema = {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": `${title} - QuickConvert`,
                "applicationCategory": "UtilityApplications",
                "operatingSystem": "All",
                "description": description,
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": `How do I convert ${fromUnit.name} to ${toUnit.name}?`,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": `Enter the number of ${fromUnit.name} you wish to convert in the top input box. The corresponding ${toUnit.name} value will instantly populate in the bottom input box.`
                    }
                  },
                  {
                    "@type": "Question",
                    "name": `Is this ${fromUnit.name} to ${toUnit.name} converter free?`,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": `Yes, all conversions on QuickConvertUnits including ${fromUnit.name} to ${toUnit.name} are 100% free and work offline.`
                    }
                  },
                  {
                    "@type": "Question",
                    "name": `Why should I use this converter?`,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": `We built this tool to provide instant, precise unit conversions without intrusive ads. The ${fromUnit.name} to ${toUnit.name} tool works perfectly on both mobile and desktop.`
                    }
                  }
                ]
              }
            ]
          };
          
          template = template.replace(
            /<\/head>/,
            `<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`
          );
        }
      }

      res.status(200).set({ "Content-Type": "text/html" }).send(template);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
