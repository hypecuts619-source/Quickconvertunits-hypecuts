import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We define a small map of the most common units to serve rich SEO tags quickly.
// If a unit is not in this map, we fallback to formatting the URL string.
const popularUnits: Record<string, { name: string; symbol: string; factor?: number; base?: string }> = {
  meter: { name: "Meter", symbol: "m", factor: 1, base: "length" },
  kilometer: { name: "Kilometer", symbol: "km", factor: 1000, base: "length" },
  centimeter: { name: "Centimeter", symbol: "cm", factor: 0.01, base: "length" },
  millimeter: { name: "Millimeter", symbol: "mm", factor: 0.001, base: "length" },
  mile: { name: "Mile", symbol: "mi", factor: 1609.344, base: "length" },
  yard: { name: "Yard", symbol: "yd", factor: 0.9144, base: "length" },
  foot: { name: "Foot", symbol: "ft", factor: 0.3048, base: "length" },
  inch: { name: "Inch", symbol: "in", factor: 0.0254, base: "length" },
  kilogram: { name: "Kilogram", symbol: "kg", factor: 1, base: "weight" },
  gram: { name: "Gram", symbol: "g", factor: 0.001, base: "weight" },
  pound: { name: "Pound", symbol: "lb", factor: 0.45359237, base: "weight" },
  ounce: { name: "Ounce", symbol: "oz", factor: 0.0283495231, base: "weight" },
  celsius: { name: "Celsius", symbol: "°C", base: "temperature" },
  fahrenheit: { name: "Fahrenheit", symbol: "°F", base: "temperature" },
  kelvin: { name: "Kelvin", symbol: "K", base: "temperature" },
  square_meter: { name: "Square Meter", symbol: "m²", factor: 1, base: "area" },
  acre: { name: "Acre", symbol: "ac", factor: 4046.856, base: "area" },
  hectare: { name: "Hectare", symbol: "ha", factor: 10000, base: "area" },
  square_foot: { name: "Square Foot", symbol: "ft²", factor: 0.092903, base: "area" },
  liter: { name: "Liter", symbol: "L", factor: 1, base: "volume" },
  milliliter: { name: "Milliliter", symbol: "mL", factor: 0.001, base: "volume" },
  gallon_us: { name: "US Gallon", symbol: "gal", factor: 3.78541, base: "volume" },
  cup_us: { name: "US Cup", symbol: "cup", factor: 0.236588, base: "volume" },
  second: { name: "Second", symbol: "s", factor: 1, base: "time" },
  minute: { name: "Minute", symbol: "min", factor: 60, base: "time" },
  hour: { name: "Hour", symbol: "h", factor: 3600, base: "time" },
  day: { name: "Day", symbol: "d", factor: 86400, base: "time" }
};

function formatValue(val: number): string {
  // Try to keep it readable, avoid scientific notation if possible
  if (val >= 10000 || val < 0.0001) {
    return val.toExponential(4);
  }
  return Number.isInteger(val) ? val.toString() : parseFloat(val.toFixed(6)).toString();
}

function calculateConversion(val: number, fromId: string, toId: string): string {
  if (fromId === toId) return val.toString();
  const fromUnit = popularUnits[fromId];
  const toUnit = popularUnits[toId];
  
  if (fromUnit?.base === "temperature" && toUnit?.base === "temperature") {
    let c = val;
    if (fromId === "fahrenheit") c = (val - 32) * 5 / 9;
    if (fromId === "kelvin") c = val - 273.15;
    
    if (toId === "fahrenheit") return formatValue((c * 9 / 5) + 32);
    if (toId === "kelvin") return formatValue(c + 273.15);
    return formatValue(c);
  }
  
  if (fromUnit?.factor && toUnit?.factor) {
    const baseValue = val * fromUnit.factor;
    return formatValue(baseValue / toUnit.factor);
  }
  return "N/A";
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

function applySEO(urlPath: string, template: string): string {
  // ensure leading slash is removed
  urlPath = urlPath.replace(/^\//, "");
  
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
      
      const val1 = calculateConversion(1, fromId, toId);
      const val5 = calculateConversion(5, fromId, toId);
      const val10 = calculateConversion(10, fromId, toId);
      const val50 = calculateConversion(50, fromId, toId);
      const val100 = calculateConversion(100, fromId, toId);
      
      let formulaText = `To calculate, you multiply the ${fromUnit.name} value by the conversion factor.`;
      if (fromUnit.base === 'temperature') {
        formulaText = `Temperature conversions rely on specific formulas rather than a simple multiplier.`;
      } else if (fromUnit.factor && toUnit.factor) {
        let conversionRatio = fromUnit.factor / toUnit.factor;
        formulaText = `The conversion factor is approximately <strong>${formatValue(conversionRatio)}</strong>. Therefore, 1 ${fromUnit.name} is equal to ${val1} ${toUnit.name}.`;
      }
      
      const staticContent = `
        <div style="display:none;" aria-hidden="true">
          <h1>${fromUnit.name} to ${toUnit.name} Converter</h1>
          <p>${description}</p>
          <section>
            <h2>How to convert ${fromUnit.name} to ${toUnit.name}</h2>
            <p>To convert a value from ${fromUnit.name} to ${toUnit.name}, simply use our fast, responsive calculator above. Enter any number into the ${fromUnit.name} field and the conversion to ${toUnit.name} will evaluate instantly. We use the most precise conversion rates available.</p>
            <p><strong>Conversion Formula:</strong> ${formulaText}</p>
          </section>
          <section>
            <h2>Quick Conversion Reference (Table)</h2>
            <p>Below is a quick reference table showing common values for ${fromUnit.name} and their equivalent in ${toUnit.name}.</p>
            <table>
              <thead>
                <tr>
                  <th>${fromUnit.name} (${fromUnit.symbol})</th>
                  <th>${toUnit.name} (${toUnit.symbol})</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1 ${fromUnit.name}</td><td>${val1 !== 'N/A' ? val1 : '?'} ${toUnit.name}</td></tr>
                <tr><td>5 ${fromUnit.name}</td><td>${val5 !== 'N/A' ? val5 : '?'} ${toUnit.name}</td></tr>
                <tr><td>10 ${fromUnit.name}</td><td>${val10 !== 'N/A' ? val10 : '?'} ${toUnit.name}</td></tr>
                <tr><td>50 ${fromUnit.name}</td><td>${val50 !== 'N/A' ? val50 : '?'} ${toUnit.name}</td></tr>
                <tr><td>100 ${fromUnit.name}</td><td>${val100 !== 'N/A' ? val100 : '?'} ${toUnit.name}</td></tr>
                <tr><td>500 ${fromUnit.name}</td><td>${calculateConversion(500, fromId, toId)} ${toUnit.name}</td></tr>
                <tr><td>1000 ${fromUnit.name}</td><td>${calculateConversion(1000, fromId, toId)} ${toUnit.name}</td></tr>
              </tbody>
            </table>
          </section>
          <section>
            <h2>Frequently Asked Questions</h2>
            <h3>How do I convert ${fromUnit.name} to ${toUnit.name}?</h3>
            <p>Enter the number of ${fromUnit.symbol} you wish to convert in the top input box. The corresponding ${toUnit.symbol} value will instantly populate in the bottom input box.</p>
            <h3>What is ${fromUnit.name}?</h3>
            <p>The ${fromUnit.name} is a unit of measurement. It is commonly used both historically and modernly in various contexts.</p>
            <h3>What is ${toUnit.name}?</h3>
            <p>The ${toUnit.name} (${toUnit.symbol}) is another unit of measurement to express similar quantities. Our calculator ensures quick transformation between them.</p>
            <h3>Is this ${fromUnit.name} to ${toUnit.name} converter free?</h3>
            <p>Yes, all conversions on QuickConvertUnits including ${fromUnit.name} to ${toUnit.name} are 100% free and work offline.</p>
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
  return template;
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
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res) => {
      let template = "";
      try {
        template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
      } catch (e) {
        return res.status(500).send("index.html not found.");
      }

      template = applySEO(req.path, template);
      res.status(200).set({ "Content-Type": "text/html" }).send(template);
    });
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

      template = applySEO(req.path, template);

      res.status(200).set({ "Content-Type": "text/html" }).send(template);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
