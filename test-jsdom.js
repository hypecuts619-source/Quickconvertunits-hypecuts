import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Read the index.html from dist
const html = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf8');

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "http://localhost:3000/blog/how-to-convert-kph-to-mph-easily"
});

dom.window.addEventListener('error', (event) => {
  console.error("DOM ERROR:", event.error);
});

// We need to wait for scripts to load and execute
setTimeout(() => {
  console.log("Body innerHTML length:", dom.window.document.body.innerHTML.length);
  // See if "App Crashed" is in the HTML
  if (dom.window.document.body.innerHTML.includes('App Crashed')) {
    console.log("App Crashed found!");
  } else {
    console.log("App Crashed not found. html:", dom.window.document.body.innerHTML.slice(0, 500));
  }
}, 3000);
