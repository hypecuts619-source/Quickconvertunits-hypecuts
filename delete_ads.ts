import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Ad in Below Result Ad
content = content.replace(/\{\/\* AD: Below Result Ad \*\/}[\s\S]*?\{\!isEmbed && \([\s\S]*?<AdSlot[\s\S]*?\/>\n\s*\)\}\n/, '');

// Ad in Native In-Content Ad
content = content.replace(/\{\/\* AD: In-Content Ad \*\/}[\s\S]*?<AdSlot[\s\S]*?\/>\n/, '');

// Ads in Right Sidebar
content = content.replace(/\{\/\* AD: Right Sidebar Sticky 1 \*\/}[\s\S]*?<AdSlot[\s\S]*?\/>\n/, '');
content = content.replace(/\{\/\* AD: Right Sidebar Sticky 2 \*\/}[\s\S]*?<AdSlot[\s\S]*?\/>\n/, '');

// Mobile sticky ad
content = content.replace(/\{\/\* AD: Mobile Sticky Bottom Ad \*\/}[\s\S]*?\{\!isEmbed && \([\s\S]*?<div className="fixed bottom-[^>]*>\n\s*<AdSlot[\s\S]*?\/>\n\s*<\/div>\n\s*\)\}\n/, '');

// Now remove the AdSlot component 
const adSlotStart = content.indexOf('const AdSlot = ({');
const endMarker = '  </span>\n          <span className="text-[10px] opacity-70 mt-1">Configure in src/App.tsx</span>\n        </div>\n      )}\n    </div>\n  );\n};';

if (adSlotStart !== -1) {
    const nextCodeStart = content.indexOf('const ShareModal = ({', adSlotStart); // Find the next component or similar to bound it
    const adSlotEnd = content.indexOf(endMarker, adSlotStart);
    if (adSlotEnd !== -1) {
        content = content.substring(0, adSlotStart) + content.substring(adSlotEnd + endMarker.length);
    }
}

content = content.replace(/(\n\s*)*\/\/\s+Set to true to display real Google AdSense ads[\s\S]*?const \[useRealAds\] = useState\(false\);/, '');

fs.writeFileSync('src/App.tsx', content);
console.log('Ads removed from src/App.tsx');
