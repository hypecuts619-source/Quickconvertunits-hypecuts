import fs from 'fs';

let content = fs.readFileSync('src/lib/blogPosts.ts', 'utf-8');

// The issue occurs anywhere we have `<a href="...">` inside a string defined with double quotes.
// We can find any string that starts with `"text": "` or `"name": "` and fix the broken quotes inside it.
// The easiest fix since we just did this is to replace `<a href="/...` with `<a href='/...`
content = content.replace(/<a href="([^"]+)">/g, "<a href='$1'>");

fs.writeFileSync('src/lib/blogPosts.ts', content);
console.log('Replaced double quotes with single quotes in href');
