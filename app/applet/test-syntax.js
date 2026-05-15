import fs from 'fs';
import ts from 'typescript';
const code = fs.readFileSync('src/App.tsx', 'utf8');
const result = ts.createSourceFile('App.tsx', code, ts.ScriptTarget.Latest, true);
console.log("If there's an error, it will show up here:");
const diagnostics = result.parseDiagnostics;
if (diagnostics && diagnostics.length > 0) {
  diagnostics.forEach(d => {
    if (d.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(d.file, d.start);
      let message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
      console.log(`Line ${line + 1}, Pos ${character + 1}: ${message}`);
    }
  });
} else {
  console.log("No syntax errors found by createSourceFile!");
}
