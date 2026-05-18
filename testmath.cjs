import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// A crude script that prints the JSON-LD when we hit the server
async function test() {
  const fetch = (await import('node-fetch')).default;
  try {
    const res = await fetch('http://127.0.0.1:3000/feet-to-meters');
    const text = await res.text();
    const dom = new JSDOM(text);
    const scripts = dom.window.document.querySelectorAll('script[type="application/ld+json"]');
    
    scripts.forEach((script) => {
      const data = JSON.parse(script.textContent);
      console.log(JSON.stringify(data, null, 2));
    });
  } catch (e) {
    console.error(e);
  }
}

test();
