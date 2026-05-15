import fs from 'fs';
import ts from 'typescript';

const code = fs.readFileSync('src/App.tsx', 'utf8');

let divOpen = 0;
let divClose = 0;
let fragOpen = 0;
let fragClose = 0;

const lines = code.split('\n');

lines.forEach((line, i) => {
  const opens = (line.match(/<div\b[^>]*>/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  divOpen += opens;
  divClose += closes;
  
  const fOpens = (line.match(/<[^a-zA-Z]/g) || []).filter(m => m === '<>').length;
  const fCloses = (line.match(/<\/>/g) || []).length;
  fragOpen += fOpens;
  fragClose += fCloses;
});

console.log(`div opens: ${divOpen}, div closes: ${divClose}`);
console.log(`frag opens: ${fragOpen}, frag closes: ${fragClose}`);

