import React from 'react';
import { ArrowRight } from 'lucide-react';

export const POPULAR_CONVERSIONS = [
  { from: 'kilogram', to: 'pound', label: 'KG to LBS', cat: 'mass' },
  { from: 'pound', to: 'kilogram', label: 'LBS to KG', cat: 'mass' },
  { from: 'meter', to: 'foot', label: 'Meters to Feet', cat: 'length' },
  { from: 'foot', to: 'meter', label: 'Feet to Meters', cat: 'length' },
  { from: 'celsius', to: 'fahrenheit', label: 'Celsius to Fahrenheit', cat: 'temperature' },
  { from: 'fahrenheit', to: 'celsius', label: 'Fahrenheit to Celsius', cat: 'temperature' },
  { from: 'kilometer', to: 'mile', label: 'KM to Miles', cat: 'length' },
  { from: 'mile', to: 'kilometer', label: 'Miles to KM', cat: 'length' },
  { from: 'gram', to: 'ounce', label: 'Grams to Ounces', cat: 'mass' },
  { from: 'ounce', to: 'gram', label: 'Ounces to Grams', cat: 'mass' },
  { from: 'liter', to: 'gallon_us', label: 'Liters to Gallons', cat: 'volume' },
  { from: 'inch', to: 'centimeter', label: 'Inches to CM', cat: 'length' }
];

export function PopularConversions({ onSelect }: { onSelect: (cat: string, from: string, to: string) => void }) {
  return (
    <div className="mb-12 mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Popular Conversions</h2>
        <p className="text-neutral-500 mt-2 font-light">Quickly access our most frequently used tools.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {POPULAR_CONVERSIONS.map((conv, i) => (
          <a
            key={i}
            href={`/?category=${conv.cat}&from=${conv.from}&to=${conv.to}`}
            onClick={(e) => {
              e.preventDefault();
              onSelect(conv.cat, conv.from, conv.to);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800 hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{conv.label}</span>
            <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
          </a>
        ))}
      </div>
    </div>
  );
}
