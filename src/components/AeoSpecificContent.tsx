import React from 'react';
import { formatNumber } from "../lib/units";

interface AeoSpecificContentProps {
  fromUnitId: string;
  toUnitId: string;
}

export const aeoSupportedPairs = [
  'gram-to-ounce', 'ounce-to-gram',
  'meter-to-foot', 'foot-to-meter',
  'pound-to-kilogram', 'kilogram-to-pound',
  'inch-to-centimeter', 'centimeter-to-inch',
  'teaspoon_us-to-us_fluid_ounce', 'us_fluid_ounce-to-teaspoon_us'
];

export function AeoSpecificContent({ fromUnitId, toUnitId }: AeoSpecificContentProps) {
  const pair = `${fromUnitId}-to-${toUnitId}`;

  switch (pair) {
    case 'gram-to-ounce':
      return <GramToOunce />;
    case 'ounce-to-gram':
      return <OunceToGram />;
    case 'meter-to-foot':
      return <MeterToFoot />;
    case 'foot-to-meter':
      return <FootToMeter />;
    case 'pound-to-kilogram':
      return <PoundToKilogram />;
    case 'kilogram-to-pound':
      return <KilogramToPound />;
    case 'inch-to-centimeter':
      return <InchToCentimeter />;
    case 'centimeter-to-inch':
      return <CentimeterToInch />;
    case 'teaspoon_us-to-us_fluid_ounce':
      return <TeaspoonToFluidOunce />;
    case 'us_fluid_ounce-to-teaspoon_us':
      return <FluidOunceToTeaspoon />;
    default:
      return null;
  }
}

function GramToOunce() {
  return (
    <div className="prose dark:prose-invert max-w-none mt-12 aeo-content text-left">
      <h3 className="text-2xl font-bold tracking-tight mb-4">How many Ounces are in a Gram?</h3>
      <p className="text-lg">
        <strong>There is exactly 0.035274 ounces in one gram.</strong>
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">The Formula & Explanation</h3>
      <p>
        To convert grams to ounces, use the scaling factor of <strong>0.035274</strong>. 
        Because an ounce is much larger than a gram, you must multiply your total grams by 
        this factor (or divide by 28.3495) to find the equivalent weight in ounces. 
        For example, 100 grams × 0.035274 = 3.5274 ounces.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3">Gram to Ounce Quick-Reference</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 my-4 not-prose">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm">Grams (g)</th>
              <th className="px-4 py-3 font-semibold text-sm">Ounces (oz)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr><td className="px-4 py-3 font-mono">1 g</td><td className="px-4 py-3 font-mono">0.035 oz</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">5 g</td><td className="px-4 py-3 font-mono">0.176 oz</td></tr>
            <tr><td className="px-4 py-3 font-mono">10 g</td><td className="px-4 py-3 font-mono">0.353 oz</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">50 g</td><td className="px-4 py-3 font-mono">1.764 oz</td></tr>
            <tr><td className="px-4 py-3 font-mono">100 g</td><td className="px-4 py-3 font-mono">3.527 oz</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OunceToGram() {
  return (
    <div className="prose dark:prose-invert max-w-none mt-12 aeo-content text-left">
      <h3 className="text-2xl font-bold tracking-tight mb-4">How many Grams are in an Ounce?</h3>
      <p className="text-lg">
        <strong>There are exactly 28.3495 grams in one ounce.</strong>
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">The Formula & Explanation</h3>
      <p>
        To convert ounces to grams, multiply the weight by <strong>28.3495</strong> (the exact Metric scale factor). 
        Since grams are a much smaller unit of mass than an ounce, the resulting number will always be larger. 
        For example, step-by-step logic dictates that 5 ounces × 28.3495 = 141.7475 grams.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3">Ounce to Gram Quick-Reference</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 my-4 not-prose">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm">Ounces (oz)</th>
              <th className="px-4 py-3 font-semibold text-sm">Grams (g)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr><td className="px-4 py-3 font-mono">1 oz</td><td className="px-4 py-3 font-mono">28.35 g</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">5 oz</td><td className="px-4 py-3 font-mono">141.75 g</td></tr>
            <tr><td className="px-4 py-3 font-mono">10 oz</td><td className="px-4 py-3 font-mono">283.50 g</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">50 oz</td><td className="px-4 py-3 font-mono">1417.48 g</td></tr>
            <tr><td className="px-4 py-3 font-mono">100 oz</td><td className="px-4 py-3 font-mono">2834.95 g</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MeterToFoot() {
  return (
    <div className="prose dark:prose-invert max-w-none mt-12 aeo-content text-left">
      <h3 className="text-2xl font-bold tracking-tight mb-4">How many Feet are in a Meter?</h3>
      <p className="text-lg">
        <strong>There are exactly 3.28084 feet in one meter.</strong>
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">The Formula & Explanation</h3>
      <p>
        To convert meters to feet, multiply your length measurement by <strong>3.28084</strong>. 
        Because a meter is longer than a foot, your final value in feet will always safely exceed the 
        amount in meters. For example, applying the factor to a 10-meter measurement results in 
        10 × 3.28084 = 32.8084 feet.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3">Meter to Foot Quick-Reference</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 my-4 not-prose">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm">Meters (m)</th>
              <th className="px-4 py-3 font-semibold text-sm">Feet (ft)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr><td className="px-4 py-3 font-mono">1 m</td><td className="px-4 py-3 font-mono">3.28 ft</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">5 m</td><td className="px-4 py-3 font-mono">16.40 ft</td></tr>
            <tr><td className="px-4 py-3 font-mono">10 m</td><td className="px-4 py-3 font-mono">32.81 ft</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">50 m</td><td className="px-4 py-3 font-mono">164.04 ft</td></tr>
            <tr><td className="px-4 py-3 font-mono">100 m</td><td className="px-4 py-3 font-mono">328.08 ft</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FootToMeter() {
  return (
    <div className="prose dark:prose-invert max-w-none mt-12 aeo-content text-left">
      <h3 className="text-2xl font-bold tracking-tight mb-4">How many Meters are in a Foot?</h3>
      <p className="text-lg">
        <strong>There is exactly 0.3048 meters in one foot.</strong>
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">The Formula & Explanation</h3>
      <p>
        To perform a precision conversion from feet to meters, multiply the length by <strong>0.3048</strong>. 
        The international yard and pound agreement strictly defined the foot as representing 0.3048 meters. 
        This step-by-step translation means that 50 feet would be mathematically calculated as 
        50 × 0.3048 = 15.24 meters.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3">Foot to Meter Quick-Reference</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 my-4 not-prose">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm">Feet (ft)</th>
              <th className="px-4 py-3 font-semibold text-sm">Meters (m)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr><td className="px-4 py-3 font-mono">1 ft</td><td className="px-4 py-3 font-mono">0.305 m</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">5 ft</td><td className="px-4 py-3 font-mono">1.524 m</td></tr>
            <tr><td className="px-4 py-3 font-mono">10 ft</td><td className="px-4 py-3 font-mono">3.048 m</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">50 ft</td><td className="px-4 py-3 font-mono">15.240 m</td></tr>
            <tr><td className="px-4 py-3 font-mono">100 ft</td><td className="px-4 py-3 font-mono">30.480 m</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PoundToKilogram() {
  return (
    <div className="prose dark:prose-invert max-w-none mt-12 aeo-content text-left">
      <h3 className="text-2xl font-bold tracking-tight mb-4">How many Kilograms are in a Pound?</h3>
      <p className="text-lg">
        <strong>There is approximately 0.453592 kilograms in one pound.</strong>
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">The Formula & Explanation</h3>
      <p>
        To convert pounds (lbs) to kilograms (kg), multiply the weight by <strong>0.453592</strong>. 
        This is because the pound is legally defined as exactly 0.45359237 kilograms. Conversely, 
        you can also divide the pound value by 2.20462. Under step-by-step logic, if you have 10 pounds, 
        you calculate 10 × 0.453592 to yield 4.53592 kilograms.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3">Pound to Kilogram Quick-Reference</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 my-4 not-prose">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm">Pounds (lbs)</th>
              <th className="px-4 py-3 font-semibold text-sm">Kilograms (kg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr><td className="px-4 py-3 font-mono">1 lb</td><td className="px-4 py-3 font-mono">0.454 kg</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">5 lbs</td><td className="px-4 py-3 font-mono">2.268 kg</td></tr>
            <tr><td className="px-4 py-3 font-mono">10 lbs</td><td className="px-4 py-3 font-mono">4.536 kg</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">50 lbs</td><td className="px-4 py-3 font-mono">22.680 kg</td></tr>
            <tr><td className="px-4 py-3 font-mono">100 lbs</td><td className="px-4 py-3 font-mono">45.359 kg</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KilogramToPound() {
  return (
    <div className="prose dark:prose-invert max-w-none mt-12 aeo-content text-left">
      <h3 className="text-2xl font-bold tracking-tight mb-4">How many Pounds are in a Kilogram?</h3>
      <p className="text-lg">
        <strong>There are roughly 2.20462 pounds in one kilogram.</strong>
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">The Formula & Explanation</h3>
      <p>
        To calculate kilograms to pounds, multiply the amount in kilograms by the precise mathematical factor of <strong>2.20462</strong>. 
        Since a kilogram holds significantly more mass than a pound, the output format correctly scales up. 
        For example, 50 kilograms × 2.20462 evaluates strictly to 110.231 pounds.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3">Kilogram to Pound Quick-Reference</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 my-4 not-prose">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm">Kilograms (kg)</th>
              <th className="px-4 py-3 font-semibold text-sm">Pounds (lbs)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr><td className="px-4 py-3 font-mono">1 kg</td><td className="px-4 py-3 font-mono">2.20 lbs</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">5 kg</td><td className="px-4 py-3 font-mono">11.02 lbs</td></tr>
            <tr><td className="px-4 py-3 font-mono">10 kg</td><td className="px-4 py-3 font-mono">22.05 lbs</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">50 kg</td><td className="px-4 py-3 font-mono">110.23 lbs</td></tr>
            <tr><td className="px-4 py-3 font-mono">100 kg</td><td className="px-4 py-3 font-mono">220.46 lbs</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InchToCentimeter() {
  return (
    <div className="prose dark:prose-invert max-w-none mt-12 aeo-content text-left">
      <h3 className="text-2xl font-bold tracking-tight mb-4">How many Centimeters are in an Inch?</h3>
      <p className="text-lg">
        <strong>There are exactly 2.54 centimeters in one inch.</strong>
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">The Formula & Explanation</h3>
      <p>
        To convert your inch measurement to centimeters, uniformly multiply by <strong>2.54</strong>. 
        This is an absolute and precise definition used by international standards. 
        Because you are translating a larger Imperial unit to a smaller Metric unit, utilizing this 
        multiplication (e.g., 10 inches × 2.54 = 25.4 cm) strictly scales the number upward.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3">Inch to Centimeter Quick-Reference</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 my-4 not-prose">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm">Inches (in)</th>
              <th className="px-4 py-3 font-semibold text-sm">Centimeters (cm)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr><td className="px-4 py-3 font-mono">1 in</td><td className="px-4 py-3 font-mono">2.54 cm</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">5 in</td><td className="px-4 py-3 font-mono">12.70 cm</td></tr>
            <tr><td className="px-4 py-3 font-mono">10 in</td><td className="px-4 py-3 font-mono">25.40 cm</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">50 in</td><td className="px-4 py-3 font-mono">127.00 cm</td></tr>
            <tr><td className="px-4 py-3 font-mono">100 in</td><td className="px-4 py-3 font-mono">254.00 cm</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CentimeterToInch() {
  return (
    <div className="prose dark:prose-invert max-w-none mt-12 aeo-content text-left">
      <h3 className="text-2xl font-bold tracking-tight mb-4">How many Inches are in a Centimeter?</h3>
      <p className="text-lg">
        <strong>There is approximately 0.393701 inches in one centimeter.</strong>
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">The Formula & Explanation</h3>
      <p>
        To execute a centimeter to inch calculation, simply divide by 2.54, which acts equivalently 
        to multiplying by <strong>0.393701</strong>. Given that one centimeter makes up a little less than 
        half an inch, your final answer inherently reduces in scope. Through these mathematics, 
        a standard piece tracking 50 centimeters effectively converts to 19.685 inches.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3">Centimeter to Inch Quick-Reference</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 my-4 not-prose">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm">Centimeters (cm)</th>
              <th className="px-4 py-3 font-semibold text-sm">Inches (in)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr><td className="px-4 py-3 font-mono">1 cm</td><td className="px-4 py-3 font-mono">0.39 in</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">5 cm</td><td className="px-4 py-3 font-mono">1.97 in</td></tr>
            <tr><td className="px-4 py-3 font-mono">10 cm</td><td className="px-4 py-3 font-mono">3.94 in</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">50 cm</td><td className="px-4 py-3 font-mono">19.69 in</td></tr>
            <tr><td className="px-4 py-3 font-mono">100 cm</td><td className="px-4 py-3 font-mono">39.37 in</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeaspoonToFluidOunce() {
  return (
    <div className="prose dark:prose-invert max-w-none mt-12 aeo-content text-left">
      <h3 className="text-2xl font-bold tracking-tight mb-4">How many Fluid Ounces are in a Teaspoon?</h3>
      <p className="text-lg">
        <strong>There is exactly 0.166667 fluid ounces in one US teaspoon.</strong>
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">The Formula & Explanation</h3>
      <p>
        To properly translate a US Teaspoon measurement into US Fluid Ounces, you will multiply by a scaling 
        factor of <strong>0.166667</strong>, which represents an exact division by six. Therefore, 
        every 6 teaspoons accurately consolidates into 1 single fluid ounce. 
        For example: 24 teaspoons divided by 6 effectively outputs 4 fluid ounces.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3">Teaspoon to Fluid Ounce Quick-Reference</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 my-4 not-prose">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm">US Teaspoons (tsp)</th>
              <th className="px-4 py-3 font-semibold text-sm">US Fluid Ounces (fl oz)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr><td className="px-4 py-3 font-mono">1 tsp</td><td className="px-4 py-3 font-mono">0.167 fl oz</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">5 tsp</td><td className="px-4 py-3 font-mono">0.833 fl oz</td></tr>
            <tr><td className="px-4 py-3 font-mono">10 tsp</td><td className="px-4 py-3 font-mono">1.667 fl oz</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">50 tsp</td><td className="px-4 py-3 font-mono">8.333 fl oz</td></tr>
            <tr><td className="px-4 py-3 font-mono">100 tsp</td><td className="px-4 py-3 font-mono">16.667 fl oz</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FluidOunceToTeaspoon() {
  return (
    <div className="prose dark:prose-invert max-w-none mt-12 aeo-content text-left">
      <h3 className="text-2xl font-bold tracking-tight mb-4">How many Teaspoons are in a Fluid Ounce?</h3>
      <p className="text-lg">
        <strong>There are exactly 6 teaspoons in one US fluid ounce.</strong>
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">The Formula & Explanation</h3>
      <p>
        To convert US Fluid Ounces to US Teaspoons, you strictly multiply by the integer factor of <strong>6</strong>. 
        Because fluid ounces are a standard volumetric capacity in baking that encapsulate six individual teaspoons each, 
        your step-by-step math operates smoothly. Applying the factor, 5 fluid ounces multiplied by 6 directly 
        translates to 30 teaspoons.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3">Fluid Ounce to Teaspoon Quick-Reference</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 my-4 not-prose">
        <table className="min-w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm">US Fluid Ounces (fl oz)</th>
              <th className="px-4 py-3 font-semibold text-sm">US Teaspoons (tsp)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr><td className="px-4 py-3 font-mono">1 fl oz</td><td className="px-4 py-3 font-mono">6 tsp</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">5 fl oz</td><td className="px-4 py-3 font-mono">30 tsp</td></tr>
            <tr><td className="px-4 py-3 font-mono">10 fl oz</td><td className="px-4 py-3 font-mono">60 tsp</td></tr>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50"><td className="px-4 py-3 font-mono">50 fl oz</td><td className="px-4 py-3 font-mono">300 tsp</td></tr>
            <tr><td className="px-4 py-3 font-mono">100 fl oz</td><td className="px-4 py-3 font-mono">600 tsp</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
