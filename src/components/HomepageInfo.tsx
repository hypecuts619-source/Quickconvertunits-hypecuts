import { Link } from 'react-router-dom';

export default function HomepageInfo() {
  return (
    <div className="mt-16 bg-white dark:bg-[#111111] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-neutral-100 dark:border-neutral-800 prose prose-neutral dark:prose-invert max-w-none">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Why Use QuickConvert Units?</h2>
      <p className="font-light text-neutral-600 dark:text-neutral-400">Our free online unit converter provides instant, accurate conversions across 14 measurement categories. Whether you're converting kilograms to pounds for international shipping, Celsius to Fahrenheit for travel weather, or cups to milliliters for cooking recipes, QuickConvert delivers precise results in real-time.</p>
      
      <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-tight">Most Popular Conversions</h2>
      <p className="font-light text-neutral-600 dark:text-neutral-400">Millions of people search for unit conversions every day:</p>
      <ul className="font-light text-neutral-600 dark:text-neutral-400">
        <li><strong>Weight conversions</strong>: Convert kg to lbs, pounds to kilograms, grams to ounces</li>
        <li><strong>Temperature conversions</strong>: Celsius to Fahrenheit, Fahrenheit to Celsius, Kelvin conversions</li>
        <li><strong>Length conversions</strong>: Miles to kilometers, feet to meters, inches to centimeters</li>
        <li><strong>Volume conversions</strong>: Liters to gallons, cups to ml, tablespoons to teaspoons</li>
        <li><strong>Cooking conversions</strong>: Recipe measurements for baking and cooking</li>
      </ul>
      
      <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-tight">How to Use QuickConvert</h2>
      <ol className="font-light text-neutral-600 dark:text-neutral-400 space-y-1">
        <li>Select your measurement category (length, weight, temperature, etc.)</li>
        <li>Choose the units you want to convert from and to</li>
        <li>Enter your value</li>
        <li>Get instant, accurate results with formulas and explanations</li>
      </ol>
      <p className="font-light text-neutral-600 dark:text-neutral-400">All conversions are free, work offline, and provide real-time calculations without page reloads.</p>
      
      <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight">Conversion Categories</h2>
      
      <h3 className="text-xl font-medium mt-6 mb-2">Length & Distance</h3>
      <p className="font-light text-neutral-600 dark:text-neutral-400">Convert units like meters, feet, kilometers, miles, inches, and smaller scientific units. Essential for travel, DIY projects, and reading international specifications.</p>
      <div className="flex flex-wrap gap-2 text-sm mt-3">
        <Link to="/meters-to-feet" className="text-primary-600 dark:text-primary-400 hover:underline">Meters to Feet</Link> | 
        <Link to="/feet-to-meters" className="text-primary-600 dark:text-primary-400 hover:underline">Feet to Meters</Link> | 
        <Link to="/km-to-miles" className="text-primary-600 dark:text-primary-400 hover:underline">Kilometers to Miles</Link> | 
        <Link to="/miles-to-km" className="text-primary-600 dark:text-primary-400 hover:underline">Miles to Kilometers</Link> | 
        <Link to="/inches-to-cm" className="text-primary-600 dark:text-primary-400 hover:underline">Inches to CM</Link> | 
        <Link to="/cm-to-inches" className="text-primary-600 dark:text-primary-400 hover:underline">CM to Inches</Link>
      </div>
      
      <h3 className="text-xl font-medium mt-8 mb-2">Weight & Mass</h3>
      <p className="font-light text-neutral-600 dark:text-neutral-400">Easily calculate kg to lbs, completely removing the headache from checking baggage allowances. Support for ounces, grams, and stone makes cooking and health tracking much easier.</p>
      <div className="flex flex-wrap gap-2 text-sm mt-3">
        <Link to="/kg-to-lbs" className="text-primary-600 dark:text-primary-400 hover:underline">Kg to Lbs</Link> | 
        <Link to="/lbs-to-kg" className="text-primary-600 dark:text-primary-400 hover:underline">Lbs to Kg</Link> | 
        <Link to="/grams-to-ounces" className="text-primary-600 dark:text-primary-400 hover:underline">Grams to Ounces</Link> | 
        <Link to="/ounces-to-grams" className="text-primary-600 dark:text-primary-400 hover:underline">Ounces to Grams</Link>
      </div>
      
      <h3 className="text-xl font-medium mt-8 mb-2">Temperature</h3>
      <p className="font-light text-neutral-600 dark:text-neutral-400">Cross-reference Celsius and Fahrenheit effortlessly. Whether you are traveling abroad or working on scientific tasks with Kelvin, our tool handles offset formulas properly.</p>
      <div className="flex flex-wrap gap-2 text-sm mt-3">
        <Link to="/celsius-to-fahrenheit" className="text-primary-600 dark:text-primary-400 hover:underline">Celsius to Fahrenheit</Link> | 
        <Link to="/fahrenheit-to-celsius" className="text-primary-600 dark:text-primary-400 hover:underline">Fahrenheit to Celsius</Link> | 
        <Link to="/celsius-to-kelvin" className="text-primary-600 dark:text-primary-400 hover:underline">Celsius to Kelvin</Link>
      </div>
      
      <h3 className="text-xl font-medium mt-8 mb-2">Volume</h3>
      <p className="font-light text-neutral-600 dark:text-neutral-400">Convert cups to milliliters or gallons to liters instantly. Highly useful for adjusting global cooking recipes or checking fluid container volumes.</p>
    </div>
  );
}
