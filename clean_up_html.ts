import fs from 'fs';

let content = fs.readFileSync('src/lib/blogPosts.ts', 'utf-8');

// I will just replace `<a href='...'>text</a>` with `text` anywhere except between `content: \`` and the closing `\``
const parts = content.split('content: `');
for (let i = 0; i < parts.length; i++) {
  if (i === 0) {
    // Top of file before the first content: `
    parts[i] = parts[i].replace(/<a href='[^']*'>([^<]*)<\/a>/g, '$1');
    parts[i] = parts[i].replace(/<a href="[^"]*">([^<]*)<\/a>/g, '$1');
  } else {
    // parts[i] starts with the content string. Find the closing backtick.
    const closeTickIndex = parts[i].indexOf('`');
    if (closeTickIndex !== -1) {
      const restOfObject = parts[i].substring(closeTickIndex);
      const cleanedRest = restOfObject.replace(/<a href='[^']*'>([^<]*)<\/a>/g, '$1').replace(/<a href="[^"]*">([^<]*)<\/a>/g, '$1');
      parts[i] = parts[i].substring(0, closeTickIndex) + cleanedRest;
    }
  }
}

fs.writeFileSync('src/lib/blogPosts.ts', parts.join('content: `'));
console.log('Fixed accidentally replaced slugs and names.');
