import { Link } from "react-router-dom";
import { getSEOUrlPath } from "../lib/units";

export const QuickLinksSection = ({ fromUnit, toUnit, category, baseVal }: { fromUnit: any; toUnit: any; category: string; baseVal: string }) => {
    // Top units in this category (limited to 5 for SEO speed)
    const topUnits = {
      length: ['meter', 'kilometer', 'foot', 'mile', 'inch'],
      weight: ['kilogram', 'pound', 'gram', 'ounce', 'metric_ton'],
      temperature: ['celsius', 'fahrenheit', 'kelvin'],
      area: ['square_meter', 'hectare', 'acre', 'square_foot'],
      volume: ['liter', 'milliliter', 'gallon', 'cup', 'cubic_meter'],
      time: ['second', 'minute', 'hour', 'day', 'week'],
      digital_storage: ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'],
      speed: ['meter_per_second', 'kilometer_per_hour', 'mile_per_hour', 'knot'],
      currency: ['usd', 'eur', 'gbp', 'inr', 'jpy'],
      power: ['watt', 'kilowat', 'horsepower', 'megawatt'],
      frequency: ['hertz', 'kilohertz', 'megahertz', 'gigahertz'],
      energy: ['joule', 'kilojoule', 'calorie', 'kilocalorie', 'kilowatt_hour']
    }[category] || [];
  
    return (
      <div className="mt-12 mb-8 text-left">
        <h3 className="text-xl font-semibold mb-6 tracking-tight">More {category.replace(/_/g, ' ')} conversions</h3>
        <div className="flex flex-wrap gap-2">
          {topUnits.map(u => {
            if (u === fromUnit.id) return null;
            return (
              <Link 
                key={u}
                to={`/${getSEOUrlPath(fromUnit.id, u)}${baseVal && baseVal !== "1" ? `?val=${baseVal}` : ""}`}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-sm hover:border-primary-500 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
              >
                {fromUnit.name} to {u.replace(/_/g, ' ')}
              </Link>
            );
          })}
          {topUnits.map(u => {
             if (u === toUnit.id) return null;
             return (
               <Link 
                 key={u}
                 to={`/${getSEOUrlPath(u, toUnit.id)}${baseVal && baseVal !== "1" ? `?val=${baseVal}` : ""}`}
                 className="px-4 py-2 rounded-xl bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-sm hover:border-primary-500 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
               >
                 {u.replace(/_/g, ' ')} to {toUnit.name}
               </Link>
             );
           })}
        </div>
      </div>
    );
};
