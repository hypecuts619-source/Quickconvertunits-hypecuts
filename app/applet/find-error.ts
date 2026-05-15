import { execSync } from 'child_process';
import fs from 'fs';

const orig = fs.readFileSync('src/App.tsx', 'utf8');
const lines = orig.split('\n');

for (let i = 2600; i > 2000; i -= 20) {
  const newLines = [...lines.slice(0, i), ...lines.slice(i + 20)];
  fs.writeFileSync('src/App.tsx', newLines.join('\n'));
  try {
    execSync('npx tsc --noEmit', { stdio: 'ignore' });
    console.log(`Success when removing ${i} to ${i+20}`);
    break;
  } catch(e) {
    // ignore
  }
}

fs.writeFileSync('src/App.tsx', orig);
console.log('done');
