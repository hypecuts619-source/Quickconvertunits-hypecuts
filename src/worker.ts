import { getCanonicalUnitId, getSEOUrlPath } from '../src/lib/units';

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
  cad: { name: "Canadian Dollar", symbol: "C$", factor: 0.74, base: "currency" },
  cny: { name: "Chinese Yuan", symbol: "¥", factor: 0.14, base: "currency" },
  hkd: { name: "Hong Kong Dollar", symbol: "HK$", factor: 0.13, base: "currency" },
  jpy: { name: "Japanese Yen", symbol: "¥", factor: 0.0067, base: "currency" },
  aud: { name: "Australian Dollar", symbol: "A$", factor: 0.65, base: "currency" },
  chf: { name: "Swiss Franc", symbol: "CHF", factor: 1.13, base: "currency" },
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
  // Data Transfer Rate
  bps: { name: "Bit per second", symbol: "bps", factor: 1, base: "data_rate" },
  kbps: { name: "Kilobit per second", symbol: "Kbps", factor: 1000, base: "data_rate" },
  mbps: { name: "Megabit per second", symbol: "Mbps", factor: 1000000, base: "data_rate" },
  gbps: { name: "Gigabit per second", symbol: "Gbps", factor: 1000000000, base: "data_rate" },
  MBps: { name: "Megabyte per second", symbol: "MB/s", factor: 8000000, base: "data_rate" },
  GBps: { name: "Gigabyte per second", symbol: "GB/s", factor: 8000000000, base: "data_rate" },
  // Torque
  newton_meter: { name: "Newton-meter", symbol: "N·m", factor: 1, base: "torque" },
  pound_foot: { name: "Pound-foot", symbol: "lb·ft", factor: 1.3558, base: "torque" },
  pound_inch: { name: "Pound-inch", symbol: "lb·in", factor: 0.113, base: "torque" },
  kilogram_meter: { name: "Kilogram-meter", symbol: "kg·m", factor: 9.807, base: "torque" },
};

function formatValue(val: number): string {
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

// Simple in-memory rate limiting for the API (resets on worker restart, but serves as a basic hardcoded limit)
const ipRequests = new Map<string, { count: number; timestamp: number }>();
const MAX_REQUESTS = 1000;
const TIME_WINDOW = 3600 * 1000; // 1 hour

/**
 * Basic Cloudflare Pages Middleware
 */
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/^\//, "");

    if (pathname === "sitemap.xml") {
      const urls: string[] = [];
      const bases = ["weight", "length", "temperature", "volume", "area", "time", "speed", "power", "digital", "pressure", "frequency", "angle", "data_rate", "torque"];
      bases.forEach(base => {
        const units = Object.entries(popularUnits).filter(([_, u]) => u.base === base);
        for (let i = 0; i < units.length; i++) {
          for (let j = 0; j < units.length; j++) {
            if (i !== j) {
              const fromId = units[i][0];
              const toId = units[j][0];
              const canonicalFromId = getCanonicalUnitId(fromId);
              const canonicalToId = getCanonicalUnitId(toId);
              const canonicalPath = getSEOUrlPath(canonicalFromId, canonicalToId);
              urls.push(`https://quickconvertunits.com/${canonicalPath}`);
            }
          }
        }
      });
      // Deduplicate
      const uniqueUrls = Array.from(new Set(urls)).slice(0, 10000); 

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://quickconvertunits.com/</loc><changefreq>daily</changefreq></url>
  ${uniqueUrls.map(u => `<url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`;
      return new Response(sitemap, {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=86400"
        }
      });
    }

    // Free REST API for developers (high quality backlink strategy)
    if (pathname.startsWith("api/v1/convert")) {
      const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
      const now = Date.now();
      
      let record = ipRequests.get(ip);
      if (!record || (now - record.timestamp > TIME_WINDOW)) {
        record = { count: 0, timestamp: now };
      }
      
      record.count += 1;
      ipRequests.set(ip, record);

      if (record.count > MAX_REQUESTS) {
        const retryAfter = Math.ceil((TIME_WINDOW - (now - record.timestamp)) / 1000).toString();
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Maximum 1000 requests per hour per IP allowed for fair use.",
          retry_after_seconds: retryAfter
        }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Retry-After": retryAfter
          }
        });
      }

      const value = parseFloat(url.searchParams.get("value") || "1");
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");

      if (!from || !to || isNaN(value)) {
        return new Response(JSON.stringify({ error: "Missing or invalid parameters. Example: /api/v1/convert?value=1&from=kg&to=lbs" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      const resVal = calculateConversion(value, from, to);
      if (resVal === "N/A") {
        return new Response(JSON.stringify({ error: "Unsupported conversion between units." }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      return new Response(JSON.stringify({
        value: value,
        from: from,
        to: to,
        result: resVal,
        timestamp: new Date().toISOString(),
        attribution: "Powered by QuickConvert API - https://quickconvertunits.com"
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    const response = await env.ASSETS.fetch(request);
    
    const contentType = response.headers.get("Content-Type") || "";
    if (!contentType.includes("text/html")) {
      if (pathname.includes("-to-")) {
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Cache-Control", `public, max-age=31536000, immutable`);
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        });
      }
      return response;
    }
    
    let template = await response.text();
    
    // Path-based i18n
    const langMatch = pathname.match(/^(es|fr|de|hi|zh|ja|ru|pt|it|ar)\/(.*)$/);
    let lang = "en";
    let urlPath = pathname;
    if (langMatch) {
      lang = langMatch[1];
      urlPath = langMatch[2];
    }
    
    const hreflangTags = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ja', 'ru', 'pt', 'it', 'ar']
      .map(l => `<link rel="alternate" hreflang="${l}" href="https://quickconvertunits.com/${l === 'en' ? '' : l + '/'}${urlPath}" />`)
      .join('\n    ');
    
    template = template.replace(/<head>/i, `<head>\n    ${hreflangTags}`);
    template = template.replace(/<html lang="en">/i, `<html lang="${lang}">`);

    if (urlPath && urlPath.includes("-to-") && !urlPath.includes("blog")) {
      const parts = urlPath.split("-to-");
      if (parts.length === 2 && parts[0] && parts[1]) {
        let val = 1;
        let fromId = parts[0];
        const toId = parts[1];

        if (fromId.startsWith("convert-")) {
          const valMatch = fromId.match(/^convert-([\d.]+)-(.*)$/);
          if (valMatch) {
            val = parseFloat(valMatch[1]);
            fromId = valMatch[2];
          }
        }
        
        const fromUnit = popularUnits[fromId] || { name: capitalize(fromId), symbol: capitalize(fromId) };
        const toUnit = popularUnits[toId] || { name: capitalize(toId), symbol: capitalize(toId) };
        
        const valText = val === 1 ? "1" : val.toString();
        const resVal = calculateConversion(val, fromId, toId);
        
        const canonicalFromId = getCanonicalUnitId(fromId);
        const canonicalToId = getCanonicalUnitId(toId);
        const canonicalPathBase = getSEOUrlPath(canonicalFromId, canonicalToId);
        const canonicalPath = val === 1 ? canonicalPathBase : `convert-${val}-${canonicalPathBase}`;
        const finalCanonicalPath = lang === 'en' ? canonicalPath : `${lang}/${canonicalPath}`;
        
        let intentAction = "Converter";
        if (fromUnit.base === "weight") intentAction = "Weight Calculator";
        else if (fromUnit.base === "volume") intentAction = "Baking Converter";
        else if (fromUnit.base === "length") intentAction = "Length Converter";
        else if (fromUnit.base === "temperature") intentAction = "Temperature Calculator";
        else if (fromUnit.base === "time") intentAction = "Time Calculator";
        else if (fromUnit.base === "digital") intentAction = "Data Converter";
        
        let title = `${fromUnit.name} to ${toUnit.name} (${fromUnit.symbol} to ${toUnit.symbol}) ${intentAction}`;
        if (val !== 1 && resVal !== "N/A") {
          title = `${valText} ${fromUnit.name} to ${toUnit.name} (${fromUnit.symbol} to ${toUnit.symbol}) ${intentAction}`;
        }
        
        const description = val === 1 
          ? `Convert 1 ${fromUnit.name.toLowerCase()} to ${toUnit.name.toLowerCase()} instantly. Free online ${intentAction.toLowerCase()}. Enter value, select units—get precise results fast.`
          : `What is ${valText} ${fromUnit.name} in ${toUnit.name}? ${valText} ${fromUnit.symbol} = ${resVal} ${toUnit.symbol}. Detailed conversion steps and formula included.`;

        template = template.replace(
          /<title[^>]*>.*?<\/title>/,
          `<title data-react-helmet="true">${title}</title>`
        );
      template = template.replace(
        /<meta[^>]*name="description"[^>]*\/>/,
        `<meta data-react-helmet="true" name="description" content="${description}" />`
      );
      template = template.replace(
        /<meta[^>]*property="og:title"[^>]*\/>/,
        `<meta data-react-helmet="true" property="og:title" content="${title} - QuickConvert" />`
      );
      template = template.replace(
        /<meta[^>]*property="og:description"[^>]*\/>/,
        `<meta data-react-helmet="true" property="og:description" content="${description}" />`
      );
      template = template.replace(
        /<meta[^>]*name="twitter:title"[^>]*\/>/,
        `<meta data-react-helmet="true" name="twitter:title" content="${title}" />`
      );
      template = template.replace(
        /<meta[^>]*name="twitter:description"[^>]*\/>/,
        `<meta data-react-helmet="true" name="twitter:description" content="${description}" />`
      );
      template = template.replace(
        /<link[^>]*rel="canonical"[^>]*\/>/,
        `<link data-react-helmet="true" rel="canonical" href="https://quickconvertunits.com/${finalCanonicalPath}" />`
      );

      template = template.replace(
        /<meta[^>]*property="og:url"[^>]*\/>/,
        `<meta data-react-helmet="true" property="og:url" content="https://quickconvertunits.com/${finalCanonicalPath}" />`
      );
      
      let formulaText = `To calculate, you multiply the ${fromUnit.name} value by the conversion factor.`;
      if (canonicalPathBase === 'lbs-to-kg') {
        formulaText = `The formula in plain text: 1 pound = 0.453592 kilograms`;
      } else if (canonicalPathBase === 'meters-to-feet') {
        formulaText = `The formula in plain text: 1 meter = 3.28084 feet`;
      } else if (canonicalPathBase === 'km-to-miles') {
        formulaText = `The formula in plain text: 1 kilometer = 0.621371 miles`;
      } else if (canonicalPathBase === 'inches-to-pixels') {
        formulaText = `The formula in plain text: 1 inch = 96 pixels`;
      } else if (canonicalPathBase === 'pixels-to-inches') {
        formulaText = `The formula in plain text: 1 pixel ≈ 0.0104166 inches`;
      } else if (canonicalPathBase === 'inches-to-cm') {
        formulaText = `The formula in plain text: 1 inch = 2.54 centimeters`;
      } else if (fromUnit.base === 'temperature') {
        if (fromId === 'celsius' && toId === 'fahrenheit') formulaText = `The formula to convert Celsius to Fahrenheit is: <strong>(°C × 9/5) + 32 = °F</strong>.`;
        else if (fromId === 'fahrenheit' && toId === 'celsius') formulaText = `The formula to convert Fahrenheit to Celsius is: <strong>(°F − 32) × 5/9 = °C</strong>.`;
        else if (fromId === 'celsius' && toId === 'kelvin') formulaText = `The formula to convert Celsius to Kelvin is: <strong>°C + 273.15 = K</strong>.`;
        else if (fromId === 'kelvin' && toId === 'celsius') formulaText = `The formula to convert Kelvin to Celsius is: <strong>K − 273.15 = °C</strong>.`;
        else if (fromId === 'fahrenheit' && toId === 'kelvin') formulaText = `The formula to convert Fahrenheit to Kelvin is: <strong>(°F − 32) × 5/9 + 273.15 = K</strong>.`;
        else if (fromId === 'kelvin' && toId === 'fahrenheit') formulaText = `The formula to convert Kelvin to Fahrenheit is: <strong>(K − 273.15) × 9/5 + 32 = °F</strong>.`;
        else formulaText = `Temperature conversions rely on specific formulas rather than a simple multiplier.`;
      } else if (fromUnit.factor && toUnit.factor) {
        let conversionRatio = fromUnit.factor / toUnit.factor;
        formulaText = `The conversion factor is approximately <strong>${formatValue(conversionRatio)}</strong>. Therefore, 1 ${fromUnit.name} is equal to ${calculateConversion(1, fromId, toId)} ${toUnit.name}.`;
      }
      
      let customTable = "";
      if (canonicalPathBase === 'lbs-to-kg') {
        customTable = `
            <table>
              <thead>
                <tr>
                  <th>Pounds (lb)</th>
                  <th>Kilograms (kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><a href="https://quickconvertunits.com/convert-1-lbs-to-kg">1 lb</a></td><td>0.453592 kg</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-5-lbs-to-kg">5 lb</a></td><td>2.26796 kg</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-10-lbs-to-kg">10 lb</a></td><td>4.53592 kg</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-25-lbs-to-kg">25 lb</a></td><td>11.3398 kg</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-50-lbs-to-kg">50 lb</a></td><td>22.6796 kg</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-100-lbs-to-kg">100 lb</a></td><td>45.3592 kg</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-150-lbs-to-kg">150 lb</a></td><td>68.0388 kg</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-200-lbs-to-kg">200 lb</a></td><td>90.7184 kg</td></tr>
                <tr><td><a href="https://quickconvertunits.com/lbs-to-kg">Full Pound to Kilogram Series</a></td><td>Varied</td></tr>
              </tbody>
            </table>
        `;
      } else if (canonicalPathBase === 'meters-to-feet') {
        customTable = `
            <table>
              <thead>
                <tr>
                  <th>Meters (m)</th>
                  <th>Feet (ft)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><a href="https://quickconvertunits.com/convert-1-meters-to-feet">1 m</a></td><td>3.28084 ft</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-5-meters-to-feet">5 m</a></td><td>16.4042 ft</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-10-meters-to-feet">10 m</a></td><td>32.8084 ft</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-25-meters-to-feet">25 m</a></td><td>82.021 ft</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-50-meters-to-feet">50 m</a></td><td>164.042 ft</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-100-meters-to-feet">100 m</a></td><td>328.084 ft</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-150-meters-to-feet">150 m</a></td><td>492.126 ft</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-200-meters-to-feet">200 m</a></td><td>656.168 ft</td></tr>
                <tr><td><a href="https://quickconvertunits.com/meters-to-feet">Full Meter to Foot Series</a></td><td>Varied</td></tr>
              </tbody>
            </table>
        `;
      } else if (canonicalPathBase === 'km-to-miles') {
        customTable = `
            <table>
              <thead>
                <tr>
                  <th>Kilometers (km)</th>
                  <th>Miles (mi)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><a href="https://quickconvertunits.com/convert-1-km-to-miles">1 km</a></td><td>0.621371 mi</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-5-km-to-miles">5 km</a></td><td>3.10686 mi</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-10-km-to-miles">10 km</a></td><td>6.21371 mi</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-25-km-to-miles">25 km</a></td><td>15.5343 mi</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-50-km-to-miles">50 km</a></td><td>31.0686 mi</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-100-km-to-miles">100 km</a></td><td>62.1371 mi</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-150-km-to-miles">150 km</a></td><td>93.2057 mi</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-200-km-to-miles">200 km</a></td><td>124.274 mi</td></tr>
                <tr><td><a href="https://quickconvertunits.com/km-to-miles">Full Kilometer to Mile Series</a></td><td>Varied</td></tr>
              </tbody>
            </table>
        `;
      } else if (canonicalPathBase === 'inches-to-pixels') {
        customTable = `
            <table>
              <thead>
                <tr>
                  <th>Inches (in)</th>
                  <th>Pixels (px)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><a href="https://quickconvertunits.com/convert-1-inches-to-pixels">1 in</a></td><td>96 px</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-2-inches-to-pixels">2 in</a></td><td>192 px</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-3-inches-to-pixels">3 in</a></td><td>288 px</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-5-inches-to-pixels">5 in</a></td><td>480 px</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-10-inches-to-pixels">10 in</a></td><td>960 px</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-15-inches-to-pixels">15 in</a></td><td>1440 px</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-20-inches-to-pixels">20 in</a></td><td>1920 px</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-100-inches-to-pixels">100 in</a></td><td>9600 px</td></tr>
                <tr><td><a href="https://quickconvertunits.com/inches-to-pixels">Full Inch to Pixel Series</a></td><td>Varied</td></tr>
              </tbody>
            </table>
        `;
      } else if (canonicalPathBase === 'pixels-to-inches') {
        customTable = `
            <table>
              <thead>
                <tr>
                  <th>Pixels (px)</th>
                  <th>Inches (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><a href="https://quickconvertunits.com/convert-10-pixels-to-inches">10 px</a></td><td>0.104 in</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-50-pixels-to-inches">50 px</a></td><td>0.521 in</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-96-pixels-to-inches">96 px</a></td><td>1 in</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-100-pixels-to-inches">100 px</a></td><td>1.042 in</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-500-pixels-to-inches">500 px</a></td><td>5.208 in</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-1000-pixels-to-inches">1000 px</a></td><td>10.417 in</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-2000-pixels-to-inches">2000 px</a></td><td>20.833 in</td></tr>
                <tr><td><a href="https://quickconvertunits.com/pixels-to-inches">Full Pixel to Inch Series</a></td><td>Varied</td></tr>
              </tbody>
            </table>
        `;
      } else if (canonicalPathBase === 'inches-to-cm') {
        customTable = `
            <table>
              <thead>
                <tr>
                  <th>Inches (in)</th>
                  <th>Centimeters (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><a href="https://quickconvertunits.com/convert-1-inches-to-cm">1 in</a></td><td>2.54 cm</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-2-inches-to-cm">2 in</a></td><td>5.08 cm</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-5-inches-to-cm">5 in</a></td><td>12.7 cm</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-10-inches-to-cm">10 in</a></td><td>25.4 cm</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-12-inches-to-cm">12 in</a></td><td>30.48 cm</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-24-inches-to-cm">24 in</a></td><td>60.96 cm</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-36-inches-to-cm">36 in</a></td><td>91.44 cm</td></tr>
                <tr><td><a href="https://quickconvertunits.com/convert-100-inches-to-cm">100 in</a></td><td>254 cm</td></tr>
                <tr><td><a href="https://quickconvertunits.com/inches-to-cm">Full Inch to Centimeter Series</a></td><td>Varied</td></tr>
              </tbody>
            </table>
        `;
      } else {
        customTable = `
            <table>
              <thead>
                <tr>
                  <th>${fromUnit.name} (${fromUnit.symbol})</th>
                  <th>${toUnit.name} (${toUnit.symbol})</th>
                </tr>
              </thead>
              <tbody>
                ${Array.from(new Set([1, 5, 10, 50, 100, Math.max(1, Math.floor(val - 1)), val, Math.ceil(val + 1), Math.ceil(val + 5), Math.ceil(val + 10), Math.ceil(val * 2)]))
                  .filter(n => n > 0 && n <= 10000).sort((a,b)=>a-b)
                  .map(n => `<tr><td><a href="https://quickconvertunits.com/convert-${n}-${canonicalPathBase}">${n} ${fromUnit.name}</a></td><td>${calculateConversion(n, fromId, toId) !== 'N/A' ? calculateConversion(n, fromId, toId) : '?'} ${toUnit.name}</td></tr>`)
                  .join("\\n")}
                <tr><td><a href="https://quickconvertunits.com/${canonicalPathBase}">Full ${fromUnit.name} to ${toUnit.name} Series</a></td><td>Varied</td></tr>
              </tbody>
            </table>
        `;
      }

      let customFAQ = "";
      if (canonicalPathBase === 'lbs-to-kg') {
        customFAQ = `
            <h3>How many kilograms are in a pound?</h3>
            <p>There are approximately 0.453592 kilograms in one pound.</p>
            <h3>How do I easily convert lbs to kg in my head?</h3>
            <p>A quick mental math trick is to divide the pounds by 2, then subtract 10% from that result. For example, for 100 lbs: half is 50, minus 10% (5) is 45 kg (actual is ~45.36 kg).</p>
            <h3>Is a pound heavier than a kilogram?</h3>
            <p>No, a kilogram is heavier. One kilogram is equal to about 2.20462 pounds.</p>
            <h3>Why do we use both pounds and kilograms?</h3>
            <p>Pounds are primarily used in the United States and a few other countries (Imperial system), while kilograms are the standard unit of mass in the metric system used by most of the world.</p>
        `;
      } else if (canonicalPathBase === 'meters-to-feet') {
        customFAQ = `
            <h3>How many feet are in a meter?</h3>
            <p>There are exactly 3.28084 feet in a single meter.</p>
            <h3>Is 1 meter the same as 3 feet?</h3>
            <p>It's close, but 1 meter is actually a bit longer than 3 feet. It is exactly 3.28084 feet, or about 3 feet and 3.37 inches.</p>
            <h3>How do I convert meters to feet easily?</h3>
            <p>To get a rough estimate, you can multiply the meters by 3.3. For exact measurements, multiply the meters by 3.28084.</p>
            <h3>Why is the meter used internationally instead of feet?</h3>
            <p>The meter is the base unit of length in the International System of Units (SI), which is a global standard that makes scientific and international communication much simpler.</p>
        `;
      } else if (canonicalPathBase === 'km-to-miles') {
        customFAQ = `
            <h3>How many miles are in a kilometer?</h3>
            <p>One kilometer is equal to approximately 0.621371 miles.</p>
            <h3>Which is longer, a mile or a kilometer?</h3>
            <p>A mile is longer. One mile is equal to 1.60934 kilometers, making a mile roughly 1.6 times longer than a kilometer.</p>
            <h3>How do I convert kilometers to miles easily?</h3>
            <p>A common mental math trick is to multiply the kilometers by 6 and drop the last digit (or divide by 10). For example, 10 km x 6 = 60, divide by 10 is 6 miles. For better accuracy, use the Fibonacci sequence (e.g. 5 is roughly 3, 8 is roughly 5, 13 is roughly 8).</p>
            <h3>When did countries stop using miles?</h3>
            <p>Many countries switched to kilometers during metrication in the late 20th century. However, the UK and US still use miles extensively for road speeds and distances.</p>
        `;
      } else if (canonicalPathBase === 'inches-to-cm') {
        customFAQ = `
            <h3>How many centimeters are in an inch?</h3>
            <p>There are exactly 2.54 centimeters in one inch. This is an internationally agreed-upon standard.</p>
            <h3>How do I convert inches to cm quickly?</h3>
            <p>Just multiply your inches by 2.54. For an easy mental estimate, multiply by 2.5. So 10 inches is roughly 25 cm (exactly 25.4 cm).</p>
            <h3>Are there 100 cm in an inch?</h3>
            <p>No, there are 100 centimeters in one meter! There are 2.54 centimeters in an inch.</p>
            <h3>How big is 1 inch in cm on a ruler?</h3>
            <p>If you look at a standard ruler with both metric and imperial units, you will see the 1-inch mark aligns perfectly between the 2.5 cm and 2.6 cm marks.</p>
        `;
      } else {
        customFAQ = `
            <h3>How do I convert ${fromUnit.name} to ${toUnit.name}?</h3>
            <p>Enter the number of ${fromUnit.symbol} you wish to convert in the top input box. The corresponding ${toUnit.symbol} value will instantly populate in the bottom input box.</p>
            <h3>What is ${fromUnit.name}?</h3>
            <p>The ${fromUnit.name} (${fromUnit.symbol}) is a unit of measurement. It is commonly used both historically and modernly in various contexts.</p>
            <h3>What is ${toUnit.name}?</h3>
            <p>The ${toUnit.name} (${toUnit.symbol}) is another unit of measurement to express similar quantities. Our calculator ensures quick transformation between them.</p>
            <h3>Is this ${fromUnit.name} to ${toUnit.name} converter free?</h3>
            <p>Yes, all conversions on QuickConvertUnits including ${fromUnit.name} to ${toUnit.name} are 100% free and work offline.</p>
        `;
      }

      const staticContent = `
      <div style="display:none;" aria-hidden="true">
        <div>
          <h1>${val !== 1 ? `${valText} ${fromUnit.name} to ${toUnit.name} Conversion` : `${fromUnit.name} to ${toUnit.name} Converter`}</h1>
          <p>${description}</p>
          <section>
            <h2>How to convert ${valText} ${fromUnit.name} to ${toUnit.name}</h2>
            <p>To convert a value from ${fromUnit.name} to ${toUnit.name}, simply use our fast, responsive calculator above. Enter any number into the ${fromUnit.name} field and the conversion to ${toUnit.name} will evaluate instantly. We use the most precise conversion rates available.</p>
            ${val !== 1 && resVal !== "N/A" ? `
              <p>Result: <strong>${valText} ${fromUnit.symbol} = ${resVal} ${toUnit.symbol}</strong></p>
            ` : ""}
            <p><strong>Conversion Formula:</strong> ${formulaText}</p>
          </section>

          <section>
            <h2>Step-by-Step ${fromUnit.name} to ${toUnit.name} Guide</h2>
            <p>Converting between ${fromUnit.name.toLowerCase()} and ${toUnit.name.toLowerCase()} is straightforward when you understand the exact mathematical relationship. Here is the best way to calculate the result:</p>
            <ol>
              <li><strong>Identify the exact conversion factor:</strong> 1 ${fromUnit.name.toLowerCase()} is exactly ${formatNum(convFactor)} ${toUnit.name.toLowerCase()}.</li>
              <li><strong>Determine your starting measurement:</strong> For instance, let's say you need to convert 10 ${fromUnit.name.toLowerCase()}.</li>
              <li><strong>Apply the mathematical formula:</strong> Multiply your starting value by the conversion factor.</li>
              <li><strong>Calculate the final result:</strong> 10 &times; ${formatNum(convFactor)} = ${formatNum(10 * convFactor)} ${toUnit.symbol}.</li>
            </ol>
          </section>

          <section>
            <h2>Quick Conversion Reference (Table)</h2>
            <p>Below is a quick reference table showing common and related values for ${fromUnit.name} and their equivalent in ${toUnit.name}.</p>
            ${customTable}
          </section>

          <section>
            <h2>Fractional Values: ${fromUnit.name} to ${toUnit.name}</h2>
            <p>In many practical, everyday scenarios, you might need to convert fractions or decimals of a ${fromUnit.name.toLowerCase()}. Here are the most common fractional conversions, perfect for precise measurements in cooking, engineering, or scientific applications:</p>
            <ul>
              <li>0.1 ${fromUnit.symbol} = ${formatNum(0.1 * convFactor)} ${toUnit.symbol}</li>
              <li>0.25 ${fromUnit.symbol} = ${formatNum(0.25 * convFactor)} ${toUnit.symbol}</li>
              <li>0.5 ${fromUnit.symbol} = ${formatNum(0.5 * convFactor)} ${toUnit.symbol}</li>
              <li>0.75 ${fromUnit.symbol} = ${formatNum(0.75 * convFactor)} ${toUnit.symbol}</li>
            </ul>
          </section>

          <section>
            <h2>Historical Origins and Context</h2>
            <p>The origins of the <strong>${fromUnit.name}</strong> and the <strong>${toUnit.name}</strong> trace back to the pressing need for standardized tracking in commerce, agriculture, engineering, and science. In early civilizations, physical artifacts, local agreements, or natural phenomena were used to define local units. Over time, groups like the International System of Units (SI) standardized the conversion factors you rely on today.</p>
            <p>While the ${fromUnit.name.toLowerCase()} may be rooted in older traditional systems or regional standards, it maintains a permanent, precise mathematical relationship with the ${toUnit.name.toLowerCase()}. Knowing the history helps appreciate why accurate, digital unit converters have become indispensable computing tools today.</p>
          </section>

          <section>
            <h2>Real-World Examples: When to Use ${fromUnit.name} vs ${toUnit.name}</h2>
            <p>${fromUnit.name} and ${toUnit.name} are utilized differently globally depending on the specific contextual application, geographical location, and industry norms:</p>
            <ul>
              <li><strong>Daily Life &amp; Home:</strong> Depending on where you live (regions adopting the metric system versus those using the US customary / imperial system), you might use ${fromUnit.name} for everyday measurements while someone in another country natively uses ${toUnit.name}.</li>
              <li><strong>Science and Engineering:</strong> Professionals heavily favor standard metric units. When drafting architecture, writing code, or communicating blueprints across borders, converting ${fromUnit.name} to ${toUnit.name} ensures absolute precision and avoids critical errors.</li>
              <li><strong>Trade and Commerce:</strong> Packaging manufactured goods often requires strict dual labeling, prominently displaying both ${fromUnit.symbol} and ${toUnit.symbol} to satisfy rigorous international shipping laws and retail regulations.</li>
            </ul>
          </section>

          <section>
            <h2>Frequently Asked Questions</h2>
            ${customFAQ}
          </section>
        </div>
      </div>
    `;

      // Replace the placeholder static content with our custom SEO block
      template = template.replace(
        /<div style="display:none;" aria-hidden="true">[\s\S]*?<\/div>/,
        staticContent
      );
      
      // Parse custom FAQ for JSON-LD
      const faqQuestions: { question: string; answer: string }[] = [];
      const h3Regex = /<h3>(.*?)<\/h3>/g;
      const pRegex = /<p>(.*?)<\/p>/g;
      let h3Match;
      let pMatch;
      while ((h3Match = h3Regex.exec(customFAQ)) !== null && (pMatch = pRegex.exec(customFAQ)) !== null) {
        faqQuestions.push({
          question: h3Match[1].trim(),
          answer: pMatch[1].trim()
        });
      }

      // Basic Schema.org injection
      const schema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "SoftwareApplication",
            "name": `${title} - QuickConvert`,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Windows, macOS, Android, iOS",
            "description": description,
            "url": `https://quickconvertunits.com/${urlPath}`,
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://quickconvertunits.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": capitalize(fromUnit.base || "Unit") + " Converter",
                "item": "https://quickconvertunits.com/" + (fromUnit.base || "unit") + "-converter"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": `https://quickconvertunits.com/${urlPath}`
              }
            ]
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
          (faqQuestions.length > 0 ? {
            "@type": "FAQPage",
            "mainEntity": faqQuestions.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          } : null),
          ...(val !== 1 && resVal !== "N/A" ? [{
            "@type": "MathSolver",
            "name": `Conversion from ${valText} ${fromUnit.symbol} to ${toUnit.symbol}`,
            "learningResourceType": "Math Solver",
            "educationalAlignment": {
              "@type": "AlignmentObject",
              "alignmentType": "educationalSubject",
              "targetName": "Math"
            },
            "potentialAction": {
              "@type": "SolveMathAction",
              "target": `https://quickconvertunits.com/convert-${valText}-${canonicalPathBase}`,
              "eduQuestionType": "Conversion",
              "mathExpression": `${valText} ${fromUnit.name} = x ${toUnit.name}`
            }
          }] : [])
        ].filter(Boolean)
      };
      
      template = template.replace(
        /<\/head>/,
        `<script data-rh="true" type="application/ld+json">${JSON.stringify(schema)}</script></head>`
      );
    }
  } else if (urlPath === "bmi-calculator" || urlPath === "time-zone-converter") {
    let title = "";
    let description = "";
    if (urlPath === "bmi-calculator") {
      title = "BMI Calculator: Calculate Body Mass Index Online Free";
      description = "Free, fast, and easy-to-use BMI calculator. Check your Body Mass Index using metric or imperial units to see if you are at a healthy weight.";
    } else {
      title = "Time Zone Converter: Convert UTC, EST, PST, CET | QuickConvert";
      description = "Instantly convert between time zones to schedule global meetings easily. Supports UTC, EST, PST, standard and daylight time conversions.";
    }
    
    template = template.replace(/<title[^>]*>.*?<\/title>/, `<title data-react-helmet="true">${title}</title>`);
    template = template.replace(/<meta[^>]*name="description"[^>]*\/>/, `<meta data-react-helmet="true" name="description" content="${description}" />`);
    template = template.replace(/<meta[^>]*property="og:title"[^>]*\/>/, `<meta data-react-helmet="true" property="og:title" content="${title}" />`);
    template = template.replace(/<meta[^>]*property="og:description"[^>]*\/>/, `<meta data-react-helmet="true" property="og:description" content="${description}" />`);
    template = template.replace(/<meta[^>]*name="twitter:title"[^>]*\/>/, `<meta data-react-helmet="true" name="twitter:title" content="${title}" />`);
    template = template.replace(/<meta[^>]*name="twitter:description"[^>]*\/>/, `<meta data-react-helmet="true" name="twitter:description" content="${description}" />`);
    template = template.replace(/<link[^>]*rel="canonical"[^>]*\/>/, `<link data-react-helmet="true" rel="canonical" href="https://quickconvertunits.com/${urlPath}" />`);
    template = template.replace(/<meta[^>]*property="og:url"[^>]*\/>/, `<meta data-react-helmet="true" property="og:url" content="https://quickconvertunits.com/${urlPath}" />`);
    
    const staticContent = `
      <div style="display:none;" aria-hidden="true">
        <div>
          <h1>${title}</h1>
          <p>${description}</p>
        </div>
      </div>
    `;
    template = template.replace(/<div style="display:none;" aria-hidden="true">[\\s\\S]*?<\/div>/, staticContent);
  } else if (urlPath && urlPath.endsWith("-converter") && !urlPath.includes("blog")) {
    const catNameRaw = urlPath.replace("-converter", "");
    const title = `Fast ${capitalize(catNameRaw)} Converter - Instant Conversions`;
    
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
      },
      "cooking": {
        desc: "Accurate cooking measurement converter. Convert cups to ml, teaspoons to tablespoons, and ounces to grams.",
        intro: "Precision in cooking and baking often requires converting between volume and weight. Our converter helps you scale recipes perfectly across international standards.",
        faq2: "How many teaspoons are in a tablespoon?",
        faq2A: "There are exactly 3 US teaspoons in 1 US tablespoon.",
        faq3: "Is a US cup different from a UK cup?",
        faq3A: "Yes, a US cup is 236.59 ml, while a traditional UK cup is often defined as 250 ml.",
        faq4: "How many teaspoons are in a fluid ounce?",
        faq4A: "In the US customary system, there are 6 US teaspoons in 1 US fluid ounce.",
        tableItem1: "1 Cup = 236.59 mL",
        tableItem2: "1 Tbsp = 14.79 mL",
        tableItem3: "1 Tsp = 4.93 mL",
        tableItem4: "1 Fl Oz = 29.57 mL"
      },
      "speed": {
        desc: "Fast speed unit converter. Convert MPH to KPH, Knots to MPH, and Meters per Second.",
        intro: "Convert travel speeds across different systems instantly. Ideal for understanding global speed limits or aviation and maritime navigation values.",
        faq2: "What is 100 km/h in mph?",
        faq2A: "100 kilometers per hour is approximately 62.14 miles per hour.",
        faq3: "What is a Knot?",
        faq3A: "A knot is one nautical mile per hour, which is roughly 1.15 standard miles per hour.",
        faq4: "Is speed different from velocity?",
        faq4A: "Speed is a scalar quantity (just magnitude), while velocity is a vector (magnitude and direction).",
        tableItem1: "100 km/h = 62.14 mph",
        tableItem2: "1 knot = 1.15 mph",
        tableItem3: "1 m/s = 3.6 km/h",
        tableItem4: "60 mph = 96.56 km/h"
      },
      "area": {
        desc: "Convert area units like square feet to square meters, acres to hectares, and square miles.",
        intro: "Calculate land and property sizes accurately. Essential for real estate, construction, and global landscaping projects.",
        faq2: "How many acres are in a hectare?",
        faq2A: "There are approximately 2.471 acres in 1 hectare.",
        faq3: "How many square feet are in a square meter?",
        faq3A: "1 square meter equals approximately 10.764 square feet.",
        faq4: "What is a square mile in kilometers?",
        faq4A: "1 square mile is approximately 2.59 square kilometers.",
        tableItem1: "1 Hectare = 2.47 Acres",
        tableItem2: "1 Sq Meter = 10.76 Sq Ft",
        tableItem3: "1 Acre = 43,560 Sq Ft",
        tableItem4: "1 Sq Mile = 640 Acres"
      }
    };

    const specifics = categorySpecifics[catNameRaw.toLowerCase()] || {
      desc: `Free ${catNameRaw.toLowerCase()} unit converter. Precise calculations with real-time results. Convert measurements instantly.`,
      intro: `Instantly convert between various ${catNameRaw.toLowerCase()} units. Our calculator is built for speed and precision, offering real-time conversions without page reloads.`,
      faq2: `How is ${catNameRaw} conversion calculated?`,
      faq2A: `Our tool uses officially recognized constants and factors to ensure excellent accuracy according to international standards.`,
      faq3: `Is this a reliable tool?`,
      faq3A: `Yes, we utilize standard mathematical formulas up to multiple decimal places for precision.`,
      faq4: `Can I use this on mobile?`,
      faq4A: `Yes, the interface is fully responsive and works perfectly on all modern smartphones and tablets.`,
      tableItem1: `Popular ${catNameRaw} conversions supported`,
      tableItem2: "Instant real-time execution",
      tableItem3: "High decimal precision format",
      tableItem4: "Cross-platform compatibility"
    };

    const description = specifics.desc;

    template = template.replace(
      /<title[^>]*>.*?<\/title>/,
      `<title data-react-helmet="true">${title}</title>`
    );
    template = template.replace(
      /<meta[^>]*name="description"[^>]*\/>/,
      `<meta data-react-helmet="true" name="description" content="${description}" />`
    );
    template = template.replace(
      /<meta[^>]*property="og:title"[^>]*\/>/,
      `<meta data-react-helmet="true" property="og:title" content="${title}" />`
    );
    template = template.replace(
      /<meta[^>]*property="og:description"[^>]*\/>/,
      `<meta data-react-helmet="true" property="og:description" content="${description}" />`
    );
    template = template.replace(
      /<meta[^>]*name="twitter:title"[^>]*\/>/,
      `<meta data-react-helmet="true" name="twitter:title" content="${title}" />`
    );
    template = template.replace(
      /<meta[^>]*name="twitter:description"[^>]*\/>/,
      `<meta data-react-helmet="true" name="twitter:description" content="${description}" />`
    );
    const finalCanonicalPath = lang === 'en' ? urlPath : `${lang}/${urlPath}`;
    
    template = template.replace(
      /<link[^>]*rel="canonical"[^>]*\/>/,
      `<link data-react-helmet="true" rel="canonical" href="https://quickconvertunits.com/${finalCanonicalPath}" />`
    );
    template = template.replace(
      /<meta[^>]*property="og:url"[^>]*\/>/,
      `<meta data-react-helmet="true" property="og:url" content="https://quickconvertunits.com/${finalCanonicalPath}" />`
    );
    
    const staticContent = `
      <div style="display:none;" aria-hidden="true">
        <div>
          <h1>${title}</h1>
          <p>${description}</p>
          <section>
            <h2>About ${capitalize(catNameRaw)} Conversion</h2>
            <p>${specifics.intro}</p>
            <p>Whether you're an engineering professional, architecture student, or just need a quick calculation for a recipe, our dynamic interface responds to inputs live.</p>
            
            <h3>Understanding Context & Applications</h3>
            <p>Conversions in the ${capitalize(catNameRaw)} category are required across the world due to the fragmented nature of historical and geographic standards. While most of the planet operates strictly under the International System of Units (SI system), powerful economies like the US continue utilizing customary standard systems. Bridging this gap seamlessly is vital for manufacturing, scientific exchange, trade compliance, and daily travel.</p>
            
            <h3>How to Evaluate Conversion Rates</h3>
            <p>Most modern conversions are exact and defined by strict international statutory acts. We execute these translations computationally with maximum permitted decimal precision, preventing floating point drifts and guaranteeing accuracy for enterprise, academic, and industrial scaling.</p>
          </section>
          
          <section>
            <h2>Popular ${capitalize(catNameRaw)} Reference Table</h2>
            <p>For quick lookup, here are the core traits and features built into this dedicated conversion tool:</p>
            <table border="1" cellpadding="8" style="border-collapse: collapse; margin-top: 10px; width: 100%;">
              <thead>
                <tr><th style="text-align:left;">Functional Advantages & Specifications</th></tr>
              </thead>
              <tbody>
                <tr><td>${specifics.tableItem1}</td></tr>
                <tr><td>${specifics.tableItem2}</td></tr>
                <tr><td>${specifics.tableItem3}</td></tr>
                <tr><td>${specifics.tableItem4}</td></tr>
                <tr><td>Works natively offline via Progressive Web Application support</td></tr>
                <tr><td>No server roundtrips required for evaluating formulas</td></tr>
              </tbody>
            </table>
          </section>
          
          <section>
            <h2>Frequently Asked Questions</h2>
            <h3>How do I use this ${capitalize(catNameRaw)} converter efficiently?</h3>
            <p>Simply enter the value you wish to convert in the 'From' field, select or scroll to your desired units, and the exact result will materialize instantaneously. The platform operates offline on both desktop and high-end mobile browsers without ads disrupting your workflow.</p>
            
            <h3>Why are there so many different ${capitalize(catNameRaw)} units?</h3>
            <p>Historically, units were tied to localized physical objects, human anatomy, or agricultural milestones. Before global communications forced international standardization bodies (like the BIPM) to invent exact SI definitions, nearly every country utilized localized measures. We support both archaic and modern units.</p>

            <h3>${specifics.faq2}</h3>
            <p>${specifics.faq2A}</p>
            
            <h3>${specifics.faq3}</h3>
            <p>${specifics.faq3A}</p>
            
            <h3>${specifics.faq4}</h3>
            <p>${specifics.faq4A}</p>
          </section>
        </div>
      </div>
    `;

    template = template.replace(
      /<div style="display:none;" aria-hidden="true">[\\s\\S]*?<\/div>/,
      staticContent
    );
    
    // Add BreadcrumbList schema for category pages
    const categorySchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://quickconvertunits.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": title,
              "item": `https://quickconvertunits.com/${urlPath}`
            }
          ]
        }
      ]
    };
    template = template.replace(
      /<\/head>/,
      `<script data-rh="true" type="application/ld+json">${JSON.stringify(categorySchema)}</script></head>`
    );
  }

  const newHeaders = new Headers(response.headers);
  if (urlPath && urlPath.includes("-to-")) {
    newHeaders.set("Cache-Control", `public, max-age=31536000, immutable`);
  } else {
    // Basic caching for index and other non-programmatic pages via edge
    newHeaders.set("Cache-Control", `public, max-age=3600`);
  }

  return new Response(template, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
}
