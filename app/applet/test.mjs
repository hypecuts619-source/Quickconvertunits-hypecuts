import fs from 'fs';
const code = fs.readFileSync('src/App.tsx', 'utf8');
let parenLevels = [];
for (let i = 0; i < code.length; i++) {
  if (code[i] === '(') parenLevels.push(i);
  if (code[i] === ')') parenLevels.pop();
}
console.log('Unclosed parens indices:', parenLevels);
if (parenLevels.length > 0) {
  for (let i of parenLevels) {
    console.log(code.substring(i - 20, i + 20));
  }
}
