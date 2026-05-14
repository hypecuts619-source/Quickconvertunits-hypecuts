import fs from 'fs';

let content = fs.readFileSync('src/lib/blogPosts.ts', 'utf-8');

// The naive interlinking accidentally broke the FAQSchema string values for 'name'.
// We need to restore it. 
content = content.replace(/"name":\s*"([^"]*<a[^>]*>[^<]*<\/a>[^"]*)"/g, (match, urlInside) => {
  // strip HTML tags
  const stripped = urlInside.replace(/<[^>]+>/g, '');
  return `"name": "${stripped}"`;
});

fs.writeFileSync('src/lib/blogPosts.ts', content);
console.log('Fixed broken schema names.');
