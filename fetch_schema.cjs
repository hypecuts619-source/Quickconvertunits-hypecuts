const http = require('http');

http.get('http://127.0.0.1:3000/feet-to-meters', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const regex = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
    let match;
    let schemas = [];
    while ((match = regex.exec(data)) !== null) {
      try {
        schemas.push(JSON.parse(match[1]));
      } catch (e) {
        console.error("Parse error", match[1]);
      }
    }
    console.log(JSON.stringify(schemas, null, 2));
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
