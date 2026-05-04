import React from 'react';
import { convert, getSEOUrlPath } from '../lib/units';
import { useTranslation } from 'react-i18next';
import { categorySeoContent } from '../lib/seoContent';
import { customSeoData } from '../lib/customSeoData';
import { Link } from 'react-router-dom';

export function SeoContent({ 
  unitFrom, unitTo, category, categories
}: {
  unitFrom: string, unitTo: string, category: string, categories: any[]
}) {
  const { t } = useTranslation();
  const cat = categories.find(c => c.id === category);
  const fUnit = cat?.units.find((u: any) => u.id === unitFrom);
  const tUnit = cat?.units.find((u: any) => u.id === unitTo);

  if (!fUnit || !tUnit || fUnit.id === tUnit.id) return null;

  const urlPath = getSEOUrlPath(unitFrom, unitTo);
  const customContent = customSeoData[urlPath];

  if (customContent) {
    return (
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400">
        <div dangerouslySetInnerHTML={{ __html: customContent.content }} />
        
        {cat && cat.units.length > 2 && (
          <div className="mt-10 pt-8 border-t border-neutral-100 dark:border-neutral-800">
            <h2 className="mt-0">{t("seoRelated", "Related Converters")}</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <li>
                <Link to={`/${getSEOUrlPath(unitTo, unitFrom)}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                  {t(`units.${tUnit.id}`, tUnit.name)} to {t(`units.${fUnit.id}`, fUnit.name)}
                </Link>
              </li>
              {cat.units
                .filter((u: any) => u.id !== unitFrom && u.id !== unitTo)
                .slice(0, 5)
                .map((u: any) => (
                  <li key={u.id}>
                    <Link to={`/${getSEOUrlPath(unitFrom, u.id)}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                      {t(`units.${fUnit.id}`, fUnit.name)} to {t(`units.${u.id}`, u.name)}
                    </Link>
                  </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const convFactor = convert(1, unitFrom, unitTo, category);
  const formatNum = (num: number) => {
    if (Number.isNaN(num)) return "0";
    const str = Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(6)).toString();
    const parts = str.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const commonValues = [1, 2, 3, 4, 5, 10, 20, 50, 100, 500, 1000];
  
  const fUnitName = String(t(`units.${fUnit.id}`, fUnit.name));
  const tUnitName = String(t(`units.${tUnit.id}`, tUnit.name));
  const catName = cat ? String(t(`categories.${cat.id}`, cat.name)).toLowerCase() : 'measurement';

  const catSeoHtml = categorySeoContent[category];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400">
      
      {catSeoHtml && (
        <div 
          className="mb-8 pb-8 border-b border-neutral-100 dark:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: catSeoHtml }} 
        />
      )}

      <h2>{t("seoHowTo", "How to Convert {{fromUnit}} to {{toUnit}}", { fromUnit: fUnitName, toUnit: tUnitName })}</h2>
      <p>
        The formula for converting {fUnitName.toLowerCase()} to {tUnitName.toLowerCase()} is:
      </p>
      <p className="font-mono bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg text-center my-4">
        {tUnitName.toLowerCase()} = {fUnitName.toLowerCase()} × {formatNum(convFactor)}
      </p>
      <p>
        {t("seoFormulaDesc1", "To manually convert {{fromUnit}} to {{toUnit}}, multiply the value in {{fromUnit}} by", { fromUnit: fUnitName, toUnit: tUnitName })} {" "}
        <strong>{formatNum(convFactor)}</strong>. 
        {t("seoFormulaDesc2", "For example, to convert 5 {{fromUnit}} to {{toUnit}}:", { fromUnit: fUnitName, toUnit: tUnitName })}<br/>
        5 {fUnit.symbol} × {formatNum(convFactor)} = {formatNum(5 * convFactor)} {tUnit.symbol}
      </p>
      <p>
        {fUnit.description || t("seoDescription", "Converting {{fromUnit}} to {{toUnit}} is a common {{category}} conversion.", { fromUnit: fUnitName, toUnit: tUnitName, category: catName })}
      </p>

      <h2>{t("seoTable", "{{fromUnit}} to {{toUnit}} Conversion Table", { fromUnit: fUnitName, toUnit: tUnitName })}</h2>
      <div className="not-prose overflow-x-auto my-6 border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-sm mx-auto shadow-sm">
        <table className="w-full text-sm text-center">
          <thead className="bg-neutral-50 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
            <tr>
              <th className="px-4 py-3">{fUnitName} ({fUnit.symbol})</th>
              <th className="px-4 py-3">{tUnitName} ({tUnit.symbol})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
            {commonValues.map(val => (
              <tr key={val} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                <td className="px-4 py-2 font-medium bg-white dark:bg-[#111111]">{val} {fUnit.symbol}</td>
                <td className="px-4 py-2 text-neutral-600 dark:text-neutral-300 bg-white/50 dark:bg-neutral-900/50">{formatNum(convert(val, unitFrom, unitTo, category))} {tUnit.symbol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{t("seoCommonConvs", "Common {{fromUnit}} to {{toUnit}} Conversions", { fromUnit: fUnitName, toUnit: tUnitName })}</h2>
      <ul className="grid grid-cols-2 gap-2">
        {[50, 60, 70, 80, 90, 100].map(val => (
          <li key={val}>
            <Link to={`/${getSEOUrlPath(unitFrom, unitTo)}?val=${val}`} className="text-primary-600 dark:text-primary-400 hover:underline">
              {val} {fUnit.symbol} to {tUnit.symbol}
            </Link>
          </li>
        ))}
      </ul>

      <h2>{t("seoFaq", "Frequently Asked Questions")}</h2>
      <div className="space-y-4 mt-6">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {t("seoFaq1Q", "How many {{toUnit}} are in 1 {{fromUnit}}?", { toUnit: tUnitName, fromUnit: fUnitName })}
          </h3>
          <p className="mt-1">
            {t("seoFaq1A", "1 {{fromUnit}} equals exactly {{result}} {{toUnit}}.", { result: formatNum(convFactor), toUnit: tUnitName, fromUnit: fUnitName })}
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {t("seoFaq2Q", "Is 1 {{fromUnit}} more than 1 {{toUnit}}?", { fromUnit: fUnitName, toUnit: tUnitName })}
          </h3>
          <p className="mt-1">
            {convFactor > 1 
              ? `Yes, 1 ${fUnitName} is ${formatNum(convFactor)} times more than 1 ${tUnitName}.` 
              : `No, 1 ${fUnitName} is less than 1 ${tUnitName}.`
            }
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {t("seoFaq3Q", "How do you convert {{fromUnit}} to {{toUnit}} in your head?", { fromUnit: fUnitName, toUnit: tUnitName })}
          </h3>
          <p className="mt-1">
            {category === 'weight' && fUnit.id === 'kilogram' && tUnit.id === 'pound' 
              ? "A quick approximation is to double the kg value and add 10%. For example, 50 kg ≈ 50×2 + 5 = 105 lbs (actual: 110.23)." 
              : `To roughly calculate it in your head, you can multiply the ${fUnitName} value by approximately ${formatNum(Math.round(convFactor * 10) / 10)}.`}
          </p>
        </div>
      </div>

      <h2>{t("seoAbout", "About This Tool")}</h2>
      <p>
        Our free online {fUnitName} to {tUnitName} converter provides quick and precise measurements based on international standard definitions. It operates entirely within your browser for real-time speed, with support for offline conversions.
      </p>

      {cat && cat.units.length > 2 && (
        <>
          <h2>{t("seoRelated", "Related Converters")}</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <li>
              <Link to={`/${getSEOUrlPath(unitTo, unitFrom)}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                {t(`units.${tUnit.id}`, tUnit.name)} to {t(`units.${fUnit.id}`, fUnit.name)}
              </Link>
            </li>
            {cat.units
              .filter((u: any) => u.id !== unitFrom && u.id !== unitTo)
              .slice(0, 5)
              .map((u: any) => (
                <li key={u.id}>
                  <Link to={`/${getSEOUrlPath(unitFrom, u.id)}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                    {t(`units.${fUnit.id}`, fUnit.name)} to {t(`units.${u.id}`, u.name)}
                  </Link>
                </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
