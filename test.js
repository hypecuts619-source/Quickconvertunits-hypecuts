import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  const response = await page.goto('http://localhost:3000');
  console.log('STATUS:', response.status());
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
