const http = require('http');

http.get('http://0.0.0.0:3000/feet-to-meters', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      console.log(JSON.parse(match[1]));
    }
  });
});
