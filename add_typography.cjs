const fs = require('fs');

const translations = {
  en: "Typography",
  de: "Typografie",
  fr: "Typographie",
  hi: "टाइपोग्राफी",
  zh: "排版",
  ar: "الطباعة",
  es: "Tipografía",
  pt: "Tipografia",
  ru: "Типографика",
  ja: "タイポグラフィ",
  it: "Tipografia"
};

let i18n = fs.readFileSync('src/lib/i18n.ts', 'utf8');

for (const [lang, text] of Object.entries(translations)) {
  const regex = new RegExp(`(${lang}:\\s*{[\\s\\S]*?currency:\\s*["'][^"']+["'])`, 'g');
  i18n = i18n.replace(regex, `$1,\n        typography: "${text}"`);
}

fs.writeFileSync('src/lib/i18n.ts', i18n);
console.log("Done adding typography to i18n");
