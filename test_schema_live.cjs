const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// just run a dummy test that fetches from our cloudflare worker endpoint we can use curl for this
const https = require('https');
https.get('https://quickconvertunits.com/meter-to-kilometer?val=113', (res) => {
  let body = "";
  res.on('data', chunk => body+=chunk);
  res.on('end', () => {
    const match = body.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
    if (match) console.log(JSON.parse(match[1]));
    else console.log("No match");
  });
});
