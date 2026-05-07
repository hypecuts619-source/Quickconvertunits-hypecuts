import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getSEOUrlPath } from '../lib/units';
import { POPULAR_CONVERSIONS } from '../lib/constants';

export function PopularConversions({ onSelect }: { onSelect: (cat: string, from: string, to: string) => void }) {
  const { t } = useTranslation();
  
  return (
    <div className="mb-12 mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{t("popular", "Popular Conversions")}</h2>
        <p className="text-neutral-500 mt-2 font-light">{t("popularSubtitle", "Quickly access our most frequently used tools.")}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {POPULAR_CONVERSIONS.map((conv, i) => {
          const seoUrl = conv.cat === 'time_zone' ? '/time-zone-converter' : `/${getSEOUrlPath(conv.from, conv.to)}`;
          
          return (
            <Link
              key={i}
              to={seoUrl}
              onClick={(e) => {
                // If we want smooth scrolling, we can do it, but let React Router handle nav natively
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800 hover:border-primary-500 hover:shadow-md transition-all group"
            >
              <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {conv.cat === 'time_zone' ? (
                  t(`units.time_zone_converter`, 'Time Zone Converter')
                ) : conv.label.includes(' to ') ? (
                  <>{t(`units.${conv.from}`, conv.label.split(' to ')[0])} {t("to", "to")} {t(`units.${conv.to}`, conv.label.split(' to ')[1])}</>
                ) : (
                  t(`units.${conv.cat}`, conv.label)
                )}
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
