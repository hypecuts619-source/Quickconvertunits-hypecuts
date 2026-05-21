import { Link } from "react-router-dom";
import { getSEOUrlPath } from "../lib/units";
import { useTranslation } from "react-i18next";

const topConversions = [
  { fromId: "centimeter", toId: "inch", fromName: "cm", toName: "inches", vol: "2.1M" },
  { fromId: "kilogram", toId: "pound", fromName: "kg", toName: "lbs", vol: "1.8M" },
  { fromId: "celsius", toId: "fahrenheit", fromName: "Celsius", toName: "Fahrenheit", vol: "1.5M" },
  { fromId: "kilometer", toId: "mile", fromName: "km", toName: "miles", vol: "1.2M" },
  { fromId: "gram", toId: "ounce", fromName: "grams", toName: "ounces", vol: "1.0M" },
  { fromId: "meter", toId: "foot", fromName: "meters", toName: "feet", vol: "850K" },
  { fromId: "pound", toId: "kilogram", fromName: "lbs", toName: "kg", vol: "750K" },
  { fromId: "millimeter", toId: "inch", fromName: "mm", toName: "inches", vol: "600K" },
  { fromId: "milliliter", toId: "cup_us", fromName: "ml", toName: "cups", vol: "550K" },
  { fromId: "inch", toId: "centimeter", fromName: "inches", toName: "cm", vol: "500K" },
];

export const TopConvertersSidebar = () => {
  const { i18n } = useTranslation();
  const langPrefix = i18n.language !== "en" && i18n.language ? `/${i18n.language}` : "";

  return (
    <div className="w-full lg:w-[320px] shrink-0 sticky top-24 self-start">
      <div className="bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Most Searched</h3>
        </div>
        
        <div className="space-y-1">
          {topConversions.map((conv, idx) => (
            <Link
              key={idx}
              to={`${langPrefix}/${getSEOUrlPath(conv.fromId, conv.toId)}`}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <span className="font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {conv.fromName} to {conv.toName}
                </span>
              </div>
              <div className="text-xs font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                {conv.vol}/mo
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed text-center">
            Based on global monthly search volume for unit conversion terms.
          </p>
        </div>
      </div>
    </div>
  );
};
