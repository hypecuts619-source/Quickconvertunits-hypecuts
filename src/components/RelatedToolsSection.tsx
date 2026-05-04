import React from 'react';
import { Unit, getSEOUrlPath } from '../lib/units';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function RelatedToolsSection({
  categoryName,
  category,
  activeFromUnit,
  activeToUnit,
  units,
}: {
  categoryName: string;
  category: string;
  activeFromUnit: Unit;
  activeToUnit: Unit;
  units: Unit[];
}) {
  const { t } = useTranslation();

  if (!activeFromUnit || !activeToUnit || !units || units.length < 3 || category === 'time_zone') return null;

  // Pick up to 6 related conversions that are NOT the current one
  const relatedUrls: { url: string; label: string }[] = [];
  
  // To avoid showing everything, pick a few popular ones from the same category
  // Just shuffle and pick
  const topUnitsToUse = units.slice(0, 5); // mostly top ones are at start of array
  
  for (const fromU of topUnitsToUse) {
    for (const toU of topUnitsToUse) {
      if (fromU.id !== toU.id && !(fromU.id === activeFromUnit.id && toU.id === activeToUnit.id)) {
        if (relatedUrls.length < 6) {
          const urlStr = getSEOUrlPath(fromU.id, toU.id);
          relatedUrls.push({
            url: `/${urlStr}`,
            label: `${t(`units.${fromU.id}`, fromU.name)} to ${t(`units.${toU.id}`, toU.name)}`
          });
        }
      }
    }
  }

  if (relatedUrls.length === 0) return null;

  return (
    <div className="mt-8 bg-white dark:bg-[#111111] rounded-[2rem] p-6 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">
        Related {categoryName} Converters
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {relatedUrls.map((link, idx) => (
          <Link
            key={idx}
            to={link.url}
            className="flex items-center p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-primary-200 dark:hover:border-primary-900 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors group"
          >
            <span className="text-primary-600 dark:text-primary-400 group-hover:underline font-medium">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
