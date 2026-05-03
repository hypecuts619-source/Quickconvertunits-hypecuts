const fs = require('fs');
let text = fs.readFileSync('server.ts', 'utf-8');
text = text.replace(/<\/div>\\n      <\/noscript>\\n    `;\\n\\n      \/\/ Replace the placeholder static content with our custom SEO block/g, '</div>\\n      </noscript>\\n    `;\\n\\n      // Replace the placeholder static content with our custom SEO block');
text = text.replace(/<\/div>\\n      <\/noscript>\\n    `;\\n\\n    template = template\.replace\(/g, '</div>\\n      </noscript>\\n    `;\\n\\n    template = template.replace(');
console.log(text.includes('</div>\\n      </noscript>\\n    `;\\n\\n'));
fs.writeFileSync('server.ts', text, 'utf-8');
