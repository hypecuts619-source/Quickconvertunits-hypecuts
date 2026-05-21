const https = require('https');
https.get('https://developers.google.com/search/docs/appearance/structured-data/math-solvers', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { 
    const match = data.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    console.log(match);
    const pre = data.match(/<pre[^>]*>([\s\S]*?)<\/pre>/g);
    if (pre) {
      pre.forEach(p => console.log(p.replace(/<[^>]+>/g, '').substring(0, 500)));
    }
  });
});
