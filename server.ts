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
      
      const staticContent = `\n      <noscript>\n        <div>
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
      </noscript>
    `;

      // Replace the placeholder static content with our custom SEO block
      template = template.replace(
        /<noscript>\n        <div>[\s\S]*?<\/div>/,
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
            "url": `https://quickconvertunits.com/${urlPath}`
          },
          {
            "@type": "HowTo",
            "name": `How to convert ${fromUnit.name} to ${toUnit.name}`,
            "description": `Instructions to convert ${fromUnit.name} (${fromUnit.symbol}) to ${toUnit.name} (${toUnit.symbol}).`,
            "step": [
              {
                "@type": "HowToStep",
                "name": "Enter value",
                "text": `Enter the quantity of ${fromUnit.name} you want to convert in the input field.`
              },
              {
                "@type": "HowToStep",
                "name": "Read result",
                "text": `The equivalent value in ${toUnit.name} will be automatically displayed in the result field.`
              }
            ],
            "totalTime": "PT1S"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `How do I convert ${fromUnit.name} to ${toUnit.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Simply enter the value of ${fromUnit.name} into our online converter. The tool will instantly calculate and display the corresponding value in ${toUnit.name} based on the most accurate conversion factor.`
                }
              },
              {
                "@type": "Question",
                "name": `Is this ${fromUnit.name} to ${toUnit.name} converter free?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Yes, our conversion tool is 100% free for all users and works instantly on both mobile and desktop devices.`
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
    
    const categorySpecifics: Record<string, { desc: string, intro: string, faq2: string, faq2A: string, faq3: string, faq3A: string, faq4: string, faq4A: string, tableItem1: string, tableItem2: string, tableItem3: string, tableItem4: string }> = {
      "length": {
        desc: "Convert length and distance measurements from meters, feet, kilometers, and miles. Real-time formatting with high precision.",
        intro: "Instantly convert between various length and distance units, including metric and imperial systems. The conversion formula relies on standard metric prefixes or exact statutory definitions (like 1 inch = 2.54 cm).",
        faq2: "How do I convert between imperial and metric length?",
        faq2A: "You can use this calculator. Simply enter your imperial value (e.g. inches) to instantly see the metric equivalent (e.g. centimeters).",
        faq3: "How do I calculate length conversions?",
        faq3A: "You generally multiply by a conversion factor. For example, to convert meters to feet, multiply by 3.28084.",
        faq4: "Does this length converter work for very small units?",
        faq4A: "Yes, you can convert micrometers, millimeters, and nanometers accurately.",
        tableItem1: "1 Meter = 3.28084 Feet",
        tableItem2: "1 Kilometer = 0.621371 Miles",
        tableItem3: "1 Inch = 2.54 Centimeters",
        tableItem4: "1 Mile = 1.60934 Kilometers"
      },
      "weight": {
        desc: "Convert weight and mass units instantly. Easily calculate pounds to kilograms, ounces to grams, and stone.",
        intro: "Convert between various mass and weight units smoothly. Computations use standard international agreements, making it easy for cooking, shipping, or scientific conversions.",
        faq2: "What is the difference between mass and weight?",
        faq2A: "While interchangeably used in everyday life, mass measures the amount of matter, whereas weight measures gravitational force. Our converter handles standard earth-equivalent mass conversions.",
        faq3: "What is the formula for weight conversions?",
        faq3A: "Simply multiply the source weight by its specific conversion factor relative to the target unit.",
        faq4: "Can I convert small cooking units?",
        faq4A: "Yes, converting between grams and ounces is fully supported for precise baking.",
        tableItem1: "1 Kilogram = 2.20462 Pounds",
        tableItem2: "1 Pound = 0.453592 Kilograms",
        tableItem3: "1 Ounce = 28.3495 Grams",
        tableItem4: "1 Gram = 0.035274 Ounces"
      },
      "temperature": {
        desc: "Convert temperatures between Celsius, Fahrenheit, and Kelvin. Precise scientific and everyday weather conversions using official scaling formulas.",
        intro: "Transform temperature readings between differing scales. Because temperature scales have varying zero points (like 32°F roughly equalling 0°C), temperature conversions use offset formulas rather than simple multiplication.",
        faq2: "Why does temperature conversion use addition/subtraction?",
        faq2A: "Unlike distance or weight, Celsius and Fahrenheit scales do not start at absolute zero. They require an offset operation before applying the scaling factor.",
        faq3: "What is the formula for Celsius to Fahrenheit?",
        faq3A: "Multiply the Celsius temperature by 9/5 and add 32.",
        faq4: "Can I convert to Kelvin?",
        faq4A: "Yes, Kelvin conversions are fully supported for scientific standard calculations.",
        tableItem1: "0 °C = 32 °F",
        tableItem2: "100 °C = 212 °F",
        tableItem3: "0 °C = 273.15 K",
        tableItem4: "-40 °C = -40 °F"
      },
      "currency": {
        desc: "Live currency converter for USD, EUR, GBP, INR, and more. Global exchange rates updated frequently.",
        intro: "Calculate current exchange rates between fiat currencies. Keep in mind that real-world trading markets fluctuate constantly, so live conversion rates may vary slightly from static references.",
        faq2: "Are the exchange rates live?",
        faq2A: "We strive to provide relatively recent estimation based on market data for reference purposes. However, always verify with your financial institution before making transactions.",
        faq3: "Does this include cryptocurrency?",
        faq3A: "Currently, we focus on major global fiat currencies compared against USD, EUR, and more.",
        faq4: "What is currency spread?",
        faq4A: "Spread is the difference between buy and sell rates. We utilize a mid-market rate estimate for standard conversion.",
        tableItem1: "1 USD = Variable EUR",
        tableItem2: "1 EUR = Variable USD",
        tableItem3: "1 GBP = Variable USD",
        tableItem4: "1 USD = Variable INR"
      },
      "time-zone": {
        desc: "Time zone converter for UTC, EST, PST, CET. Schedule global meetings and convert standard and daylight time accurately.",
        intro: "Seamlessly translate coordinates of time between global zones. Accounting for longitude offsets and Daylight Saving Time (DST) complexities, this tool produces accurate local times anywhere.",
        faq2: "Does this tool account for Daylight Saving Time?",
        faq2A: "Yes, our converter accounts for variations due to DST shifts automatically depending on the specific date you enter.",
        faq3: "Can I convert directly from PST to EST?",
        faq3A: "Absolutely, you can select any supported From and To time regions directly.",
        faq4: "Is UTC the same as GMT?",
        faq4A: "For most general timekeeping purposes, yes, UTC shares the same current time standard as GMT.",
        tableItem1: "UTC + 0 = GMT",
        tableItem2: "UTC - 5 = EST",
        tableItem3: "UTC - 8 = PST",
        tableItem4: "UTC + 1 = CET"
      }
    };

    const specifics = categorySpecifics[catNameRaw.toLowerCase()] || {
      desc: `Free ${catNameRaw.toLowerCase()} unit converter. Precise calculations with real-time results. Convert measurements instantly.`,
      intro: `Instantly convert between various ${catNameRaw.toLowerCase()} units. Our calculator is built for speed and precision, offering real-time conversions without page reloads.`,
      faq2: `How accurate is this ${catNameRaw} converter?`,
      faq2A: `Our tool uses officially recognized constants and factors up to multiple decimal places to ensure excellent accuracy.`,
      faq3: `Is it completely free?`,
      faq3A: `Yes, no ads or paywalls interrupt your conversion experience.`,
      faq4: `Can I use it offline?`,
      faq4A: `Yes, once loaded, basic math conversions work entirely in your browser.`,
      tableItem1: `Popular ${catNameRaw} conversions natively supported`,
      tableItem2: "Instant real-time math execution",
      tableItem3: "High decimal precision format",
      tableItem4: "Cross-platform browser compatibility"
    };

    const description = specifics.desc;

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
    
    const staticContent = `\n      <noscript>\n        <div>
        <h1>${title}</h1>
        <p>${description}</p>
        <section>
          <h2>About ${capitalize(catNameRaw)} Conversion</h2>
          <p>${specifics.intro}</p>
          <p>Whether you're a professional, student, or just need a quick calculation, our interface responds to inputs live.</p>
        </section>
        <section>
          <h2>Popular ${capitalize(catNameRaw)} Reference Table</h2>
          <table border="1" cellpadding="8" style="border-collapse: collapse; margin-top: 10px;">
            <tr><th>Conversion Examples</th></tr>
            <tr><td>${specifics.tableItem1}</td></tr>
            <tr><td>${specifics.tableItem2}</td></tr>
            <tr><td>${specifics.tableItem3}</td></tr>
            <tr><td>${specifics.tableItem4}</td></tr>
          </table>
        </section>
        <section>
          <h2>Frequently Asked Questions</h2>
          <h3>Is this ${capitalize(catNameRaw)} converter free?</h3>
          <p>Yes, all conversions on our platform are completely free and work offline where supported.</p>
          <h3>${specifics.faq2}</h3>
          <p>${specifics.faq2A}</p>
          <h3>${specifics.faq3}</h3>
          <p>${specifics.faq3A}</p>
          <h3>${specifics.faq4}</h3>
          <p>${specifics.faq4A}</p>
        </section>
      </div>
      </noscript>
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
      let template = cachedTemplate;
      try {
        template = applySEO(requestedUrlInfo.split("?")[0], cachedTemplate);
      } catch (seoErr: any) {
        console.error("SEO Error generating template:", seoErr.message, seoErr.stack);
        // gracefully fallback to untransformed template
      }
      res.status(200).set({ "Content-Type": "text/html" }).send(template);
    } catch (e: any) {
      console.error("Server 500 error:", e.message, e.stack);
      return res.status(500).send("Server Error: " + e.message + " stack: " + e.stack);
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
      } catch (e: any) {
        console.error("Vite Transform Error:", e.message, e.stack);
        return res.status(500).send("index.html not found, or SSR transform failed: " + e.message);
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
