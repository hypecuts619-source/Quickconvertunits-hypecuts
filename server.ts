import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel path fallback
let currentDir = process.cwd();

// We define a small map of the most common units to serve rich SEO tags quickly.
// If a unit is not in this map, we fallback to formatting the URL string.
const popularUnits: Record<string, { name: string; symbol: string; factor?: number; base?: string }> = {
  // Length
  meter: { name: "Meter", symbol: "m", factor: 1, base: "length" },
  meters: { name: "Meter", symbol: "m", factor: 1, base: "length" },
  m: { name: "Meter", symbol: "m", factor: 1, base: "length" },
  kilometer: { name: "Kilometer", symbol: "km", factor: 1000, base: "length" },
  kilometers: { name: "Kilometer", symbol: "km", factor: 1000, base: "length" },
  km: { name: "Kilometer", symbol: "km", factor: 1000, base: "length" },
  centimeter: { name: "Centimeter", symbol: "cm", factor: 0.01, base: "length" },
  centimeters: { name: "Centimeter", symbol: "cm", factor: 0.01, base: "length" },
  cm: { name: "Centimeter", symbol: "cm", factor: 0.01, base: "length" },
  millimeter: { name: "Millimeter", symbol: "mm", factor: 0.001, base: "length" },
  millimeters: { name: "Millimeter", symbol: "mm", factor: 0.001, base: "length" },
  mm: { name: "Millimeter", symbol: "mm", factor: 0.001, base: "length" },
  mile: { name: "Mile", symbol: "mi", factor: 1609.344, base: "length" },
  miles: { name: "Mile", symbol: "mi", factor: 1609.344, base: "length" },
  mi: { name: "Mile", symbol: "mi", factor: 1609.344, base: "length" },
  yard: { name: "Yard", symbol: "yd", factor: 0.9144, base: "length" },
  yards: { name: "Yard", symbol: "yd", factor: 0.9144, base: "length" },
  yd: { name: "Yard", symbol: "yd", factor: 0.9144, base: "length" },
  foot: { name: "Foot", symbol: "ft", factor: 0.3048, base: "length" },
  feet: { name: "Foot", symbol: "ft", factor: 0.3048, base: "length" },
  ft: { name: "Foot", symbol: "ft", factor: 0.3048, base: "length" },
  inch: { name: "Inch", symbol: "in", factor: 0.0254, base: "length" },
  inches: { name: "Inch", symbol: "in", factor: 0.0254, base: "length" },
  in: { name: "Inch", symbol: "in", factor: 0.0254, base: "length" },
  // Weight
  kilogram: { name: "Kilogram", symbol: "kg", factor: 1, base: "weight" },
  kilograms: { name: "Kilogram", symbol: "kg", factor: 1, base: "weight" },
  kg: { name: "Kilogram", symbol: "kg", factor: 1, base: "weight" },
  gram: { name: "Gram", symbol: "g", factor: 0.001, base: "weight" },
  grams: { name: "Gram", symbol: "g", factor: 0.001, base: "weight" },
  g: { name: "Gram", symbol: "g", factor: 0.001, base: "weight" },
  milligram: { name: "Milligram", symbol: "mg", factor: 0.000001, base: "weight" },
  mg: { name: "Milligram", symbol: "mg", factor: 0.000001, base: "weight" },
  pound: { name: "Pound", symbol: "lb", factor: 0.45359237, base: "weight" },
  pounds: { name: "Pound", symbol: "lb", factor: 0.45359237, base: "weight" },
  lb: { name: "Pound", symbol: "lb", factor: 0.45359237, base: "weight" },
  lbs: { name: "Pound", symbol: "lb", factor: 0.45359237, base: "weight" },
  ounce: { name: "Ounce", symbol: "oz", factor: 0.0283495231, base: "weight" },
  ounces: { name: "Ounce", symbol: "oz", factor: 0.0283495231, base: "weight" },
  oz: { name: "Ounce", symbol: "oz", factor: 0.0283495231, base: "weight" },
  // Temperature
  celsius: { name: "Celsius", symbol: "°C", base: "temperature" },
  fahrenheit: { name: "Fahrenheit", symbol: "°F", base: "temperature" },
  kelvin: { name: "Kelvin", symbol: "K", base: "temperature" },
  // Area
  square_meter: { name: "Square Meter", symbol: "m²", factor: 1, base: "area" },
  square_meters: { name: "Square Meter", symbol: "m²", factor: 1, base: "area" },
  acre: { name: "Acre", symbol: "ac", factor: 4046.856, base: "area" },
  acres: { name: "Acre", symbol: "ac", factor: 4046.856, base: "area" },
  hectare: { name: "Hectare", symbol: "ha", factor: 10000, base: "area" },
  hectares: { name: "Hectare", symbol: "ha", factor: 10000, base: "area" },
  square_foot: { name: "Square Foot", symbol: "ft²", factor: 0.092903, base: "area" },
  square_feet: { name: "Square Foot", symbol: "ft²", factor: 0.092903, base: "area" },
  // Volume
  liter: { name: "Liter", symbol: "L", factor: 1, base: "volume" },
  liters: { name: "Liter", symbol: "L", factor: 1, base: "volume" },
  l: { name: "Liter", symbol: "L", factor: 1, base: "volume" },
  millilitre: { name: "Millilitre", symbol: "mL", factor: 0.001, base: "volume" },
  millilitres: { name: "Millilitre", symbol: "mL", factor: 0.001, base: "volume" },
  milliliter: { name: "Milliliter", symbol: "mL", factor: 0.001, base: "volume" },
  milliliters: { name: "Milliliter", symbol: "mL", factor: 0.001, base: "volume" },
  ml: { name: "Milliliter", symbol: "mL", factor: 0.001, base: "volume" },
  gallon_us: { name: "US Gallon", symbol: "gal", factor: 3.78541, base: "volume" },
  gallons: { name: "Gallon", symbol: "gal", factor: 3.78541, base: "volume" },
  gal: { name: "Gallon", symbol: "gal", factor: 3.78541, base: "volume" },
  cup_us: { name: "US Cup", symbol: "cup", factor: 0.236588, base: "volume" },
  cups: { name: "Cup", symbol: "cup", factor: 0.236588, base: "volume" },
  // Time
  second: { name: "Second", symbol: "s", factor: 1, base: "time" },
  seconds: { name: "Second", symbol: "s", factor: 1, base: "time" },
  s: { name: "Second", symbol: "s", factor: 1, base: "time" },
  minute: { name: "Minute", symbol: "min", factor: 60, base: "time" },
  minutes: { name: "Minute", symbol: "min", factor: 60, base: "time" },
  min: { name: "Minute", symbol: "min", factor: 60, base: "time" },
  hour: { name: "Hour", symbol: "h", factor: 3600, base: "time" },
  hours: { name: "Hour", symbol: "h", factor: 3600, base: "time" },
  h: { name: "Hour", symbol: "h", factor: 3600, base: "time" },
  day: { name: "Day", symbol: "d", factor: 86400, base: "time" },
  days: { name: "Day", symbol: "d", factor: 86400, base: "time" },
  d: { name: "Day", symbol: "d", factor: 86400, base: "time" },
  // Speed
  meter_per_second: { name: "m/s", symbol: "m/s", factor: 1, base: "speed" },
  kilometer_per_hour: { name: "km/h", symbol: "km/h", factor: 0.277778, base: "speed" },
  mile_per_hour: { name: "mph", symbol: "mph", factor: 0.44704, base: "speed" },
  kph: { name: "km/h", symbol: "km/h", factor: 0.277778, base: "speed" },
  mph: { name: "mph", symbol: "mph", factor: 0.44704, base: "speed" },
  knots: { name: "Knots", symbol: "kn", factor: 0.514444, base: "speed" },
  knot: { name: "Knot", symbol: "kn", factor: 0.514444, base: "speed" },
  // Currency (Base USD)
  usd: { name: "US Dollar", symbol: "$", factor: 1, base: "currency" },
  eur: { name: "Euro", symbol: "€", factor: 1.08, base: "currency" },
  gbp: { name: "Pound", symbol: "£", factor: 1.25, base: "currency" },
  inr: { name: "Rupee", symbol: "₹", factor: 0.012, base: "currency" },
  rub: { name: "Ruble", symbol: "₽", factor: 0.011, base: "currency" },
  zar: { name: "Rand", symbol: "R", factor: 0.053, base: "currency" },
  brl: { name: "Real", symbol: "R$", factor: 0.2, base: "currency" },
  mxn: { name: "Peso", symbol: "$", factor: 0.057, base: "currency" },
  sek: { name: "Krona", symbol: "kr", factor: 0.093, base: "currency" },
  // Power
  watt: { name: "Watt", symbol: "W", factor: 1, base: "power" },
  watts: { name: "Watt", symbol: "W", factor: 1, base: "power" },
  w: { name: "Watt", symbol: "W", factor: 1, base: "power" },
  kilowatt: { name: "Kilowatt", symbol: "kW", factor: 1000, base: "power" },
  kilowatts: { name: "Kilowatt", symbol: "kW", factor: 1000, base: "power" },
  kw: { name: "Kilowatt", symbol: "kW", factor: 1000, base: "power" },
  megawatt: { name: "Megawatt", symbol: "MW", factor: 1000000, base: "power" },
  megawatts: { name: "Megawatt", symbol: "MW", factor: 1000000, base: "power" },
  mw: { name: "Megawatt", symbol: "MW", factor: 1000000, base: "power" },
  horsepower: { name: "Horsepower", symbol: "hp", factor: 745.7, base: "power" },
  hp: { name: "Horsepower", symbol: "hp", factor: 745.7, base: "power" },
  metric_horsepower: { name: "Metric Horsepower", symbol: "PS", factor: 735.5, base: "power" },
  ps: { name: "Metric Horsepower", symbol: "PS", factor: 735.5, base: "power" },
  // Angle
  degree: { name: "Degree", symbol: "°", factor: 1, base: "angle" },
  degrees: { name: "Degree", symbol: "°", factor: 1, base: "angle" },
  deg: { name: "Degree", symbol: "°", factor: 1, base: "angle" },
  radian: { name: "Radian", symbol: "rad", factor: 57.2958, base: "angle" },
  radians: { name: "Radian", symbol: "rad", factor: 57.2958, base: "angle" },
  rad: { name: "Radian", symbol: "rad", factor: 57.2958, base: "angle" },
  gradian: { name: "Gradian", symbol: "grad", factor: 0.9, base: "angle" },
  gradians: { name: "Gradian", symbol: "grad", factor: 0.9, base: "angle" },
  grad: { name: "Gradian", symbol: "grad", factor: 0.9, base: "angle" },
  arcsecond: { name: "Arcsecond", symbol: "\"", factor: 0.000277, base: "angle" },
  arcminute: { name: "Arcminute", symbol: "'", factor: 0.016666, base: "angle" },
  // Digital Storage
  bit: { name: "Bit", symbol: "b", factor: 0.125, base: "digital" },
  bits: { name: "Bit", symbol: "b", factor: 0.125, base: "digital" },
  byte: { name: "Byte", symbol: "B", factor: 1, base: "digital" },
  bytes: { name: "Byte", symbol: "B", factor: 1, base: "digital" },
  kilobyte: { name: "Kilobyte", symbol: "KB", factor: 1024, base: "digital" },
  kilobytes: { name: "Kilobyte", symbol: "KB", factor: 1024, base: "digital" },
  kb: { name: "Kilobyte", symbol: "KB", factor: 1024, base: "digital" },
  megabyte: { name: "Megabyte", symbol: "MB", factor: 1048576, base: "digital" },
  megabytes: { name: "Megabyte", symbol: "MB", factor: 1048576, base: "digital" },
  mb: { name: "Megabyte", symbol: "MB", factor: 1048576, base: "digital" },
  gigabyte: { name: "Gigabyte", symbol: "GB", factor: 1073741824, base: "digital" },
  gigabytes: { name: "Gigabyte", symbol: "GB", factor: 1073741824, base: "digital" },
  gb: { name: "Gigabyte", symbol: "GB", factor: 1073741824, base: "digital" },
  terabyte: { name: "Terabyte", symbol: "TB", factor: 1099511627776, base: "digital" },
  terabytes: { name: "Terabyte", symbol: "TB", factor: 1099511627776, base: "digital" },
  tb: { name: "Terabyte", symbol: "TB", factor: 1099511627776, base: "digital" },
  // Pressure
  pascal: { name: "Pascal", symbol: "Pa", factor: 1, base: "pressure" },
  pascals: { name: "Pascal", symbol: "Pa", factor: 1, base: "pressure" },
  pa: { name: "Pascal", symbol: "Pa", factor: 1, base: "pressure" },
  bar: { name: "Bar", symbol: "bar", factor: 100000, base: "pressure" },
  bars: { name: "Bar", symbol: "bar", factor: 100000, base: "pressure" },
  psi: { name: "PSI", symbol: "psi", factor: 6894.76, base: "pressure" },
  atm: { name: "Atmosphere", symbol: "atm", factor: 101325, base: "pressure" },
  atmosphere: { name: "Atmosphere", symbol: "atm", factor: 101325, base: "pressure" },
  // Frequency
  hertz: { name: "Hertz", symbol: "Hz", factor: 1, base: "frequency" },
  hz: { name: "Hertz", symbol: "Hz", factor: 1, base: "frequency" },
  kilohertz: { name: "Kilohertz", symbol: "kHz", factor: 1000, base: "frequency" },
  khz: { name: "Kilohertz", symbol: "kHz", factor: 1000, base: "frequency" },
  megahertz: { name: "Megahertz", symbol: "MHz", factor: 1000000, base: "frequency" },
  mhz: { name: "Megahertz", symbol: "MHz", factor: 1000000, base: "frequency" },
  gigahertz: { name: "Gigahertz", symbol: "GHz", factor: 1000000000, base: "frequency" },
  ghz: { name: "Gigahertz", symbol: "GHz", factor: 1000000000, base: "frequency" },
};

let cachedTemplate = "";

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
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ").replace(/-/g, " ");
}

function applySEO(urlPath: string, template: string): string {
  // ensure leading slash is removed
  urlPath = urlPath.replace(/^\//, "");
  
  if (urlPath && urlPath.includes("-to-")) {
    const parts = urlPath.split("-to-");
    if (parts.length === 2 && parts[0] && parts[1]) {
      const fromId = parts[0];
      const toId = parts[1];
      
      const fromUnit = popularUnits[fromId] || { name: capitalize(fromId), symbol: capitalize(fromId) };
      const toUnit = popularUnits[toId] || { name: capitalize(toId), symbol: capitalize(toId) };
      
      const title = `1 ${fromUnit.name} to ${toUnit.name} (${fromUnit.symbol} to ${toUnit.symbol}) - Free Converter`;
      const description = `Convert 1 ${fromUnit.name.toLowerCase()} to ${toUnit.name.toLowerCase()} instantly. Free online conversion calculator. Enter value, select units—get precise results fast.`;

      template = template.replace(
        /<title>(.*?)<\/title>/,
        `<title>${title} | QuickConvert</title>`
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
        /<link rel="canonical" href="(.*?)" \/>/,
        `<link rel="canonical" href="https://quickconvertunits.com/${urlPath}" />`
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
        if (fromId === 'celsius' && toId === 'fahrenheit') formulaText = `The formula to convert Celsius to Fahrenheit is: <strong>(°C × 9/5) + 32 = °F</strong>.`;
        else if (fromId === 'fahrenheit' && toId === 'celsius') formulaText = `The formula to convert Fahrenheit to Celsius is: <strong>(°F − 32) × 5/9 = °C</strong>.`;
        else if (fromId === 'celsius' && toId === 'kelvin') formulaText = `The formula to convert Celsius to Kelvin is: <strong>°C + 273.15 = K</strong>.`;
        else if (fromId === 'kelvin' && toId === 'celsius') formulaText = `The formula to convert Kelvin to Celsius is: <strong>K − 273.15 = °C</strong>.`;
        else if (fromId === 'fahrenheit' && toId === 'kelvin') formulaText = `The formula to convert Fahrenheit to Kelvin is: <strong>(°F − 32) × 5/9 + 273.15 = K</strong>.`;
        else if (fromId === 'kelvin' && toId === 'fahrenheit') formulaText = `The formula to convert Kelvin to Fahrenheit is: <strong>(K − 273.15) × 9/5 + 32 = °F</strong>.`;
        else formulaText = `Temperature conversions rely on specific formulas rather than a simple multiplier.`;
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
  } else if (urlPath && urlPath.endsWith("-converter")) {
    const catNameRaw = urlPath.replace("-converter", "");
    const title = `${capitalize(catNameRaw)} Conversion Calculator | QuickConvert`;
    const description = `Free ${catNameRaw.toLowerCase()} unit converter. Precise calculations with real-time results. Convert measurements instantly.`;

    template = template.replace(
      /<title>(.*?)<\/title>/,
      `<title>${title}</title>`
    );
    template = template.replace(
      /<meta name="description" content="(.*?)" \/>/,
      `<meta name="description" content="${description}" />`
    );
    template = template.replace(
      /<meta property="og:title" content="(.*?)" \/>/,
      `<meta property="og:title" content="${title}" />`
    );
    template = template.replace(
      /<meta property="og:description" content="(.*?)" \/>/,
      `<meta property="og:description" content="${description}" />`
    );
    template = template.replace(
      /<link rel="canonical" href="(.*?)" \/>/,
      `<link rel="canonical" href="https://quickconvertunits.com/${urlPath}" />`
    );
    template = template.replace(
      /<meta property="og:url" content="(.*?)" \/>/,
      `<meta property="og:url" content="https://quickconvertunits.com/${urlPath}" />`
    );
    
    const staticContent = `
      <div style="display:none;" aria-hidden="true">
        <h1>${capitalize(catNameRaw)} Converter</h1>
        <p>${description}</p>
        <section>
          <h2>About ${capitalize(catNameRaw)} Conversion</h2>
          <p>Instantly convert between various ${catNameRaw.toLowerCase()} units. Our calculator is built for speed and precision, offering real-time conversions without page reloads.</p>
        </section>
        <section>
          <h2>Frequently Asked Questions</h2>
          <h3>Is this ${capitalize(catNameRaw)} converter free?</h3>
          <p>Yes, all conversions on our platform are completely free and work offline.</p>
        </section>
      </div>
    `;

    template = template.replace(
      /<div style="display:none;" aria-hidden="true">[\s\S]*?<\/div>/,
      staticContent
    );
  }
  return template;
}

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL || !!process.env.VERCEL_ENV;

let distStaticPath = path.resolve(process.cwd(), "dist");
if (!fs.existsSync(distStaticPath)) {
  distStaticPath = path.resolve(currentDir, "..", "dist");
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Explicit routes for crawlers to avoid any ambiguity
app.get("/robots.txt", (req, res) => {
  const p = path.resolve(isProd ? path.join(distStaticPath, "robots.txt") : "public/robots.txt");
  if (fs.existsSync(p)) return res.sendFile(p);
  res.status(200).send("User-agent: *\nAllow: /");
});

app.get("/ads.txt", (req, res) => {
  const p = path.resolve(isProd ? path.join(distStaticPath, "ads.txt") : "public/ads.txt");
  if (fs.existsSync(p)) return res.sendFile(p);
  res.status(404).send("ads.txt not found");
});

app.get("/sitemap.xml", (req, res) => {
  const p = path.resolve(isProd ? path.join(distStaticPath, "sitemap.xml") : "public/sitemap.xml");
  if (fs.existsSync(p)) return res.sendFile(p);
  res.status(404).send("sitemap.xml not found");
});

if (isProd) {
  // Production routes (Synchronous)
  
  app.use(express.static(distStaticPath, { index: false }));
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.get("*", (req: any, res: any) => {
    // Determine the original URL. If Vercel rewrote it to /api/server, use the original host and path headers if available
    let requestedUrlInfo = req.originalUrl || req.url;
    if (req.headers["x-now-route-matches"]) {
      try {
        const matches = new URLSearchParams(req.headers["x-now-route-matches"] as string);
        if (matches.has("1")) requestedUrlInfo = "/" + matches.get("1");
      } catch (e) {}
    } else if (req.headers["x-vercel-forwarded-for"]) {
      // Vercel sometimes passes the original path inside the host
    }
    // simple hack: if req.path is /api/server and we have a query parameter or just use req.originalUrl 
    if (requestedUrlInfo === "/api/server" && req.headers["x-invoke-path"]) {
       requestedUrlInfo = req.headers["x-invoke-path"] as string;
    } else if (requestedUrlInfo.startsWith("/api/server")) {
       const proto = req.headers["x-forwarded-proto"] || "https";
       const host = req.headers["host"] || "localhost";
       try {
          const urlObj = new URL(req.url, `${proto}://${host}`);
          requestedUrlInfo = urlObj.pathname + urlObj.search;
       } catch (e) {}
    }

    if (!cachedTemplate) {
      let templatePath = path.resolve(__dirname, "dist", "index.html");
      if (!fs.existsSync(templatePath)) {
        templatePath = path.resolve(process.cwd(), "dist", "index.html");
      }
      if (!fs.existsSync(templatePath)) {
        templatePath = path.resolve(__dirname, "..", "dist", "index.html");
      }
      if (!fs.existsSync(templatePath)) {
        templatePath = path.resolve(currentDir, "dist", "index.html");
      }

      try {
        if (!fs.existsSync(templatePath)) {
          throw new Error("File not found at " + templatePath);
        }
        cachedTemplate = fs.readFileSync(templatePath, "utf-8");
      } catch (e: any) {
        // If it's a static file request that reached here, 404 instead of 500
        if (requestedUrlInfo.includes(".") && !requestedUrlInfo.endsWith(".html")) {
          return res.status(404).send("File not found: " + requestedUrlInfo);
        }

        let debugInfo = "";
        try { debugInfo += "CWD: " + process.cwd(); } catch(e){}
        try { debugInfo += " | __dirname: " + __dirname; } catch(e){}
        try { debugInfo += " | CWD files: " + fs.readdirSync(process.cwd()).join(", "); } catch(e){}
        try { 
          const distP = path.resolve(process.cwd(), "dist");
          if (fs.existsSync(distP)) {
            debugInfo += " | dist files: " + fs.readdirSync(distP).join(", ");
          } else {
            debugInfo += " | dist folder missing at " + distP;
          }
        } catch(e){}
        return res.status(500).send("index.html not found. Path: " + templatePath + " | " + debugInfo + " | Error: " + e.message);
      }
    }

    try {
      const template = applySEO(requestedUrlInfo.split("?")[0], cachedTemplate);
      res.status(200).set({ "Content-Type": "text/html" }).send(template);
    } catch (e: any) {
      return res.status(500).send("SEO Error: " + e.message + " stack: " + e.stack);
    }
  });
}

async function startServer() {
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
        template = fs.readFileSync(path.resolve(currentDir, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
      } catch (e) {
        return res.status(500).send("index.html not found.");
      }

      template = applySEO(req.path, template);
      res.status(200).set({ "Content-Type": "text/html" }).send(template);
    });
  }

  // Only start listening if we are not running on Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
