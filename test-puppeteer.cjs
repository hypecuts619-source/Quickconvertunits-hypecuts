const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });
  
  await page.goto('http://localhost:3000/kph-to-mph?embed=true', { waitUntil: 'networkidle2' });
  
  const content = await page.content();
  if (content.includes('Something went wrong')) {
    console.log("Found crash screen!");
    const preText = await page.evaluate(() => document.querySelector('pre')?.textContent);
    console.log("CRASH DETAIL:", preText);
  } else {
    console.log("No crash screen found?! Length:", content.length);
  }
  
  await browser.close();
})();
