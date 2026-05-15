import fs from 'fs';
const code = fs.readFileSync('src/App.tsx', 'utf8');
let pd = 0;
let cd = 0;
for (let i = 0; i < code.length; i++) {
  if (code[i] === '(') pd++;
  else if (code[i] === ')') pd--;
  if (code[i] === '{') cd++;
  else if (code[i] === '}') cd--;
}
console.log('pd: ', pd);
console.log('cd: ', cd);
