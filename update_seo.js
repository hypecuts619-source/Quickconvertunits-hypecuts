const fs = require('fs');

const file = 'src/lib/customSeoData.ts';
let code = fs.readFileSync(file, 'utf8');

const replacements = {
  "kg-to-lbs": {
    "title": "Kilograms to Pounds (kg to lbs) - Free Converter | QuickConvert",
    "description": "Convert kg to lbs instantly. 1 kilogram = 2.20462 pounds. Free calculator with conversion table, formula, and examples. Accurate and fast.",
    "content": `
      <h2>The Definitive Kilogram to Pound (kg to lbs) Conversion Guide</h2>
      <p>Converting kilograms (kg) to pounds (lbs) is one of the most common daily mathematical calculations worldwide. Whether you're tracking luggage limits at the airport, evaluating powerlifting requirements, or sending an international package, mastering this conversion is essential. Our calculator provides instant, precise numbers, but understanding the core math helps in a pinch.</p>
      
      <h2>Step-by-Step Mathematical Formula</h2>
      <p>If you don't have access to an online calculator, the exact mathematical conversion formula relies on a fixed international standard:</p>
      <div class="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 my-6 font-mono text-center shadow-inner">
        Pounds (lbs) = Kilograms (kg) × 2.20462
      </div>
      <p>For example, if you weigh exactly 70 kilograms:</p>
      <ul>
        <li>Take the base value: 70</li>
        <li>Multiply by the constant: 70 × 2.20462</li>
        <li>Result: 154.3234 pounds</li>
      </ul>
      <p>Conversely, to convert pounds back to kilograms, you would divide your pound value by 2.20462.</p>

      <h2>Quick Reference Conversion Table</h2>
      <p>For those who need immediate answers without mental math, here is a standardized conversion table mapping the most common kilogram increments to their pound equivalents:</p>
      <div class="overflow-x-auto my-6">
        <table class="min-w-full border border-neutral-200 dark:border-neutral-700 text-sm text-left">
          <thead class="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
            <tr>
              <th class="p-4 border-b border-neutral-200 dark:border-neutral-700">Kilograms (kg)</th>
              <th class="p-4 border-b border-neutral-200 dark:border-neutral-700">Pounds (lbs)</th>
              <th class="p-4 border-b border-neutral-200 dark:border-neutral-700">Common Application</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">1 kg</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">2.20 lbs</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">A typical bag of sugar or flour.</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">5 kg</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">11.02 lbs</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">A medium-sized house cat.</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">10 kg</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">22.05 lbs</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">Standard hand luggage limit for budget airlines.</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">20 kg</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">44.09 lbs</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">Olympic weightlifting barbell; standard checked bag limit.</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">50 kg</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">110.23 lbs</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">An average young adult human weight.</td></tr>
            <tr><td class="p-4 font-medium">100 kg</td><td class="p-4">220.46 lbs</td><td class="p-4">A heavy-duty gym bench max load.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>The Fascinating History of the Kilogram and Pound</h2>
      <p>The pound trace its heritage back to the Roman Empire. The Latin term "libra pondo" meant "a pound by weight," which is exactly why the modern abbreviation remains "lb". Throughout medieval Europe, merchants utilized widely varying definitions of a pound, causing immense frustration in trade.</p>
      <p>The kilogram, on the other hand, was born out of the French Revolution's desire to create a rational, universal system. Originally defined by the mass of one liter of pure water, it provided an elegant base-10 structure. It took centuries, but in 1959, the United States, United Kingdom, and Canada signed the historic International Yard and Pound Agreement. This treaty legally anchored the pound to the exact metric value of 0.45359237 kilograms, forever tying the two systems together mathematically.</p>

      <h2>Frequently Asked Questions</h2>
      <h3>How do I naturally calculate kilograms to pounds in my head?</h3>
      <p>The fastest mental math trick is to simply multiply the kilograms by 2, and then add 10% to that answer. For example, to convert 40 kg: Double it to get 80. Then add 10% of 80 (which is 8). The total is 88 lbs. (The precise mathematical answer is 88.18 lbs, so this trick is incredibly accurate!)</p>
      
      <h3>Is it better to weigh myself in kilograms or pounds?</h3>
      <p>It purely depends on where you live. The vast majority of the world utilizes kilograms for medical data, health tracking, and sports. However, the United States and the United Kingdom predominantly rely on pounds (and occasionally stones in the UK) for body weight. Technically, both are measuring the exact same mass.</p>
      
      <h3>How many pounds make up exactly 1 kilo?</h3>
      <p>One exact kilogram equates to 2.2046226218 pounds. Usually, this is truncated to 2.2 lbs or 2.205 lbs for standard domestic uses like cooking or gym plates.</p>
      
      <h3>Why are olympic lifting weights measured in kilos instead of lbs?</h3>
      <p>The International Weightlifting Federation (IWF), which dictates the rules for Olympic and international competition, employs the metric system. Therefore, standardized lifting equipment globally relies on kilograms (e.g., a 20kg barbell and 25kg red plates) to maintain fairness across competitive international borders.</p>
    `
  },
  "cm-to-inches": {
    "title": "Centimeters to Inches (cm to in) - Length Converter | QuickConvert",
    "description": "Convert cm to inches easily. 1 inch = 2.54 centimeters exactly. Accurate calculator for screen sizes, blueprints, and sewing patterns.",
    "content": `
      <h2>The Complete Centimeter to Inch Conversion Guide</h2>
      <p>Switching between the metric centimeter (cm) and the imperial inch (in) is a frequent necessity for engineers, digital designers, and anyone engaging in cross-border commerce. Understanding how these two distinct measurement systems interlock ensures that you can confidently buy clothing online or accurately cut formatting lumber.</p>
      
      <h2>The Exact Mathematical Formula</h2>
      <p>In 1959, the International Yard and Pound agreement standardized exactly how long an inch is relative to the metric system. The formula is unwavering and precise:</p>
      <div class="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 my-6 font-mono text-center shadow-inner">
        Inches (in) = Centimeters (cm) ÷ 2.54<br><br>
        Centimeters (cm) = Inches (in) × 2.54
      </div>
      <p>For example, if you measure a laptop screen at 38 centimeters wide:</p>
      <ul>
        <li>Take your cm value: 38</li>
        <li>Divide by the constant: 38 ÷ 2.54</li>
        <li>Result: 14.96 inches (typically marketed as a 15-inch screen).</li>
      </ul>

      <h2>Quick Reference Conversion Table</h2>
      <p>For sewing, woodworking, or screen resolutions, an exact reference table saves immense time:</p>
      <div class="overflow-x-auto my-6">
        <table class="min-w-full border border-neutral-200 dark:border-neutral-700 text-sm text-left">
          <thead class="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
            <tr>
              <th class="p-4 border-b border-neutral-200 dark:border-neutral-700">Centimeters (cm)</th>
              <th class="p-4 border-b border-neutral-200 dark:border-neutral-700">Inches (in)</th>
              <th class="p-4 border-b border-neutral-200 dark:border-neutral-700">Fractional Inch Equivalent</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">1 cm</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">0.3937 in</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">~ 3/8 inch</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">5 cm</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">1.9685 in</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">~ 2 inches</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">10 cm</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">3.9370 in</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">~ 4 inches</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">30 cm</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">11.811 in</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">~ 12 inches (or 1 foot)</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">50 cm</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">19.685 in</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">~ 19 11/16 inches</td></tr>
            <tr><td class="p-4 font-medium">100 cm (1 meter)</td><td class="p-4">39.370 in</td><td class="p-4">~ 39 3/8 inches</td></tr>
          </tbody>
        </table>
      </div>

      <h2>The History of the Measure</h2>
      <p>The "inch" historically varied depending on who was ruling the land, often defined as the width of a human thumb. King Edward II of England famously decreed in the 14th century that an inch was exactly the length of "three grains of barley, dry and round, placed end to end."</p>
      <p>Centimeters derived from the rigorous metric system founded during the French Revolution, based entirely on base-10 mathematics and referencing the circumference of the Earth. Today, while the inch remains supreme in American manufacturing, virtually every single engineering spec sheet requires metric references to comply with global standards.</p>

      <h2>Frequently Asked Questions</h2>
      <h3>How many centimeters constitute exactly one inch?</h3>
      <p>There are exactly 2.54 centimeters inside a single inch. This is a fixed, absolute number.</p>
      
      <h3>How can I mentally convert centimeters to inches without a calculator?</h3>
      <p>An easy estimation tool is to remember that 10 centimeters equals roughly 4 inches. If you have 30 centimeters, multiply by 4 and drop a zero (3 × 4 = 12 inches).</p>
      
      <h3>Why are TV screens and phone displays measured in inches globally?</h3>
      <p>Due to the overwhelming early market dominance of American technology companies in the 20th century, the "inch" became the entrenched marketing standard for diagonal screen size for consumer electronics, even in countries that exclusively use the metric system.</p>
      
      <h3>What is a centimeter compared to a millimeter?</h3>
      <p>Because the metric system is base-10, one centimeter is exactly equal to 10 millimeters. On a typical ruler, the centimeter is the numbered line, and the millimeters are the 10 tiny tick marks in between.</p>
    `
  },
  "fahrenheit-to-celsius": {
    "title": "Fahrenheit to Celsius (°F to °C) - Temperature Converter | QuickConvert",
    "description": "Convert Fahrenheit to Celsius accurately. Standard formula: (°F - 32) × 5/9 = °C. Essential for weather, cooking, and science.",
    "content": `
      <h2>The Comprehensive Fahrenheit to Celsius Conversion Guide</h2>
      <p>A staggering majority of the world reads temperature in Celsius (°C), while the United States stubbornly retains the traditional Fahrenheit (°F) scale. This creates immense confusion when baking European recipes, reading international weather forecasts, or engaging with scientific literature. Here is how to conquer the conversion.</p>
      
      <h2>The Exact Mathematical Formula</h2>
      <p>Converting temperatures is slightly more complicated than converting length or weight because the two scales do not share the same starting point (zero). Their "zeros" mean entirely different thermal states.</p>
      <div class="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 my-6 font-mono text-center shadow-inner">
        Celsius (°C) = (Fahrenheit (°F) - 32) × 5/9
      </div>
      <p>For example, if the weather forecast predicts a sweltering 95°F day:</p>
      <ul>
        <li>First, subtract the 32-degree offset: 95 - 32 = 63</li>
        <li>Next, multiply by the fraction 5/9: 63 × 5/9</li>
        <li>Result: 35°C</li>
      </ul>

      <h2>Quick Reference Temperature Table</h2>
      <p>Here are crucial temperature milestones you will frequently encounter when cooking or traveling abroad:</p>
      <div class="overflow-x-auto my-6">
        <table class="min-w-full border border-neutral-200 dark:border-neutral-700 text-sm text-left">
          <thead class="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
            <tr>
              <th class="p-4 border-b border-neutral-200 dark:border-neutral-700">Fahrenheit (°F)</th>
              <th class="p-4 border-b border-neutral-200 dark:border-neutral-700">Celsius (°C)</th>
              <th class="p-4 border-b border-neutral-200 dark:border-neutral-700">Significance</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">-40 °F</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">-40 °C</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">The scales overlap perfectly here!</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">32 °F</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">0 °C</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">The freezing point of water.</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">68 °F</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">20 °C</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">Standard "room temperature".</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">98.6 °F</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">37 °C</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">Normal human body temperature.</td></tr>
            <tr><td class="p-4 border-b border-neutral-200 dark:border-neutral-800 font-medium">212 °F</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">100 °C</td><td class="p-4 border-b border-neutral-200 dark:border-neutral-800">The boiling point of water.</td></tr>
            <tr><td class="p-4 font-medium">350 °F</td><td class="p-4">175 °C</td><td class="p-4">Standard oven baking temperature.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>The Bitter Feud: Fahrenheit and Celsius History</h2>
      <p>Invented in 1724 by physicist Daniel Gabriel Fahrenheit, the Fahrenheit scale set its 0-degree mark at the temperature of a specific ice, water, and ammonium chloride brine. He set the human body temperature at roughly 96 degrees. The British Empire rapidly embraced it, and it embedded itself deeply into colonial America.</p>
      <p>Decades later, in 1742, Swedish astronomer Anders Celsius developed a far more logical scale prioritizing the fundamental phase changes of water: 0 degrees for freezing, and 100 degrees for boiling. Because it clicked perfectly with base-10 mathematics and the emerging metric system, the global scientific community universally adopted Celsius.</p>

      <h2>Frequently Asked Questions</h2>
      <h3>What is an easy mental trick to convert Fahrenheit to Celsius?</h3>
      <p>To roughly estimate the Celsius temperature from a Fahrenheit weather report: Subtract 30 from the Fahrenheit number, and then divide the result in half. For example, 70°F minus 30 is 40. Half of 40 is 20°C. (The exact answer is 21.1°C, making this trick remarkably helpful for travelers).</p>
      
      <h3>Why hasn't the US switched to Celsius for weather?</h3>
      <p>The primary argument is societal inertia and human comfort. Many Americans argue that Fahrenheit provides a more granular 0 to 100 scale for describing natural human weather environments (where 0 is terribly cold and 100 is terribly hot), whereas Celsius feels heavily compressed (ranging roughly from -17°C to 38°C for human weather).</p>
      
      <h3>Is Centigrade the exact same thing as Celsius?</h3>
      <p>Yes. The scale was originally called "centigrade" (meaning hundred steps) because it had exactly 100 degrees between freezing and boiling. In 1948, the international scientific community officially renamed it "Celsius" to honor its inventor.</p>
      
      <h3>At what temperature are Fahrenheit and Celsius completely equal?</h3>
      <p>Both scales hit the exact same number at minus 40 degrees (-40°). If it's -40° outside, it doesn't matter which scale you're using; it's dangerously cold!</p>
    `
  }
};

let contentToUpdate = "";
const targetKeys = ["kg-to-lbs", "cm-to-inches", "fahrenheit-to-celsius"];

for (const key of targetKeys) {
  // Regex to find the key block in customSeoData
  const regex = new RegExp(`"${key}":\\s*\\{[\\s\\S]*?\\}\\s*(?=(,|\\n\\s*"[a-zA-Z0-9-]+"|\\n\\}))`);
  const replacementStr = `"${key}": {
    title: ${JSON.stringify(replacements[key].title)},
    description: ${JSON.stringify(replacements[key].description)},
    content: \`${replacements[key].content}\`
  }`;
  if (code.match(regex)) {
    code = code.replace(regex, replacementStr);
    contentToUpdate += key + ", ";
  }
}

fs.writeFileSync(file, code);
console.log("Updated specific SEO payloads for: " + contentToUpdate);
