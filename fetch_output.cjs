const https = require('https');
https.get('https://quickconvertunits.com/meter-to-kilometer?val=113', (res) => {
  let body = "";
  res.on('data', chunk => body+=chunk);
  res.on('end', () => {
    require('fs').writeFileSync('output.html', body);
    console.log("Written to output.html");
  });
});
