import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const POPULAR_CONVERSIONS = [
  { from: 'time_zone', to: 'time_zone', label: 'Time Zone Converter', cat: 'time_zone' },
  { from: 'kilogram', to: 'pound', label: 'KG to LBS', cat: 'weight' },
  { from: 'pound', to: 'kilogram', label: 'LBS to KG', cat: 'weight' },
  { from: 'meter', to: 'foot', label: 'Meters to Feet', cat: 'length' },
  { from: 'foot', to: 'meter', label: 'Feet to Meters', cat: 'length' },
  { from: 'celsius', to: 'fahrenheit', label: 'Celsius to Fahrenheit', cat: 'temperature' },
  { from: 'fahrenheit', to: 'celsius', label: 'Fahrenheit to Celsius', cat: 'temperature' },
  { from: 'kilometer', to: 'mile', label: 'KM to Miles', cat: 'length' },
  { from: 'mile', to: 'kilometer', label: 'Miles to KM', cat: 'length' },
  { from: 'gram', to: 'ounce', label: 'Grams to Ounces', cat: 'weight' },
  { from: 'ounce', to: 'gram', label: 'Ounces to Grams', cat: 'weight' },
  { from: 'liter', to: 'us_gallon', label: 'Liters to Gallons', cat: 'volume' },
  { from: 'us_gallon', to: 'liter', label: 'Gallons to Liters', cat: 'volume' },
  { from: 'inch', to: 'centimeter', label: 'Inches to CM', cat: 'length' },
  { from: 'centimeter', to: 'inch', label: 'CM to Inches', cat: 'length' },
  { from: 'kilometer_per_hour', to: 'mile_per_hour', label: 'KMPH to MPH', cat: 'speed' },
  { from: 'mile_per_hour', to: 'kilometer_per_hour', label: 'MPH to KMPH', cat: 'speed' },
  { from: 'square_meter', to: 'square_foot', label: 'Sq Meters to Sq Feet', cat: 'area' },
  { from: 'square_foot', to: 'square_meter', label: 'Sq Feet to Sq Meters', cat: 'area' },
  { from: 'usd', to: 'eur', label: 'USD to EUR', cat: 'currency' },
  { from: 'eur', to: 'usd', label: 'EUR to USD', cat: 'currency' },
  { from: 'horsepower', to: 'kilowatt', label: 'HP to kW', cat: 'power' },
  { from: 'degree', to: 'radian', label: 'Degrees to Radians', cat: 'angle' },
  { from: 'km_per_liter', to: 'miles_per_gallon', label: 'km/L to MPG', cat: 'fuel' },
];

export function PopularConversions({ onSelect }: { onSelect: (cat: string, from: string, to: string) => void }) {
  const { t } = useTranslation();
  
  return (
    <div className="mb-12 mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{t("popular", "Popular Conversions")}</h2>
        <p className="text-neutral-500 mt-2 font-light">{t("popularSubtitle", "Quickly access our most frequently used tools.")}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {POPULAR_CONVERSIONS.map((conv, i) => (
          <a
            key={i}
            href={conv.cat === 'time_zone' ? '/time-zone-converter' : `/?category=${conv.cat}&from=${conv.from}&to=${conv.to}`}
            onClick={(e) => {
              e.preventDefault();
              onSelect(conv.cat, conv.from, conv.to);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800 hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {conv.cat === 'time_zone' ? (
                t(`units.time_zone_converter`, 'Time Zone Converter')
              ) : (
                <>{t(`units.${conv.from}`, conv.label.split(' to ')[0])} {t("to", "to")} {t(`units.${conv.to}`, conv.label.split(' to ')[1])}</>
              )}
            </span>
            <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
          </a>
        ))}
      </div>
    </div>
  );
}
