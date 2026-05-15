import { readFileSync } from 'fs';
const code = readFileSync('src/App.tsx', 'utf8');
const match = code.match(/\{!\isEmbed.*?<\//g);
if (match) {
  console.log("Found: ", match.length);
}
