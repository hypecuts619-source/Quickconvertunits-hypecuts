import fs from 'fs';

let content = fs.readFileSync('src/lib/blogPosts.ts', 'utf-8');

// Strip all HTML tags from lines that contain title:, excerpt:, date:, readTime:, "name":, "text":
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (
    line.includes('title:') || 
    line.includes('excerpt:') || 
    line.includes('readTime:') || 
    line.includes('"name":') || 
    line.includes('"text":')
  ) {
    // replace any <a href='...'> or <a href="..."> with just the inner text, recursively stripping all HTML tags
    lines[i] = line.replace(/<[^>]*>/g, '');
  }
}

fs.writeFileSync('src/lib/blogPosts.ts', lines.join('\n'));
console.log('Stripped HTML from string props');
