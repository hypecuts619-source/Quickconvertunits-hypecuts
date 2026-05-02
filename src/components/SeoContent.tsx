import React from 'react';
import { convert } from '../lib/units';
import { useTranslation } from 'react-i18next';
import { categorySeoContent } from '../lib/seoContent';

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

  const convFactor = convert(1, unitFrom, unitTo, category);
  const formatNum = (num: number) => {
    if (Number.isNaN(num)) return "0";
    const str = Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(6)).toString();
    const parts = str.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const commonValues = [1, 2, 3, 4, 5, 10, 20, 50, 100, 500, 1000];
  
  const fUnitName = t(`units.${fUnit.id}`, fUnit.name);
  const tUnitName = t(`units.${tUnit.id}`, tUnit.name);
  const catName = cat ? String(t(`categories.${cat.id}`, cat.name)).toLowerCase() : 'measurement';

  const catSeoHtml = categorySeoContent[category];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400">
      <h2>{t("seoTitle", "{{fromUnit}} to {{toUnit}} Converter", { fromUnit: fUnitName, toUnit: tUnitName })}</h2>
      <p>{fUnit.description || t("seoDescription", "Instantly convert {{fromUnit}} ({{fromSymbol}}) to {{toUnit}} ({{toSymbol}}) with our high-precision online calculator.", { fromUnit: fUnitName, fromSymbol: fUnit.symbol, toUnit: tUnitName, toSymbol: tUnit.symbol })} {tUnit.description ? ` ${tUnit.description}` : ""}</p>
      
      {catSeoHtml && (
        <div 
          className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: catSeoHtml }} 
        />
      )}

      <h3 className="mt-8">{t("seoHowTo", "How to Convert {{fromUnit}} to {{toUnit}}", { fromUnit: fUnitName, toUnit: tUnitName })}</h3>
      <p>
        {t("seoFormulaDesc1", "To manually convert {{fromUnit}} to {{toUnit}}, multiply the value in {{fromUnit}} by", { fromUnit: fUnitName, toUnit: tUnitName })} {" "}
        <strong>{formatNum(convFactor)}</strong>. 
        {t("seoFormulaDesc2", "For example, 5 {{fromSymbol}} would be exactly {{result}} {{toSymbol}}. Memorizing this formula and performing manual math is slow and prone to errors. Our real-time calculator handles this for you instantly.", { fromSymbol: fUnit.symbol, result: formatNum(5 * convFactor), toSymbol: tUnit.symbol })}
      </p>

      <h3>{t("seoTable", "{{fromUnit}} to {{toUnit}} Conversion Table", { fromUnit: fUnitName, toUnit: tUnitName })}</h3>
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

      <h3>{t("seoFaq", "Frequently Asked Questions")}</h3>
      <h4>{t("seoFaq1Q", "How many {{toUnit}} are in 1 {{fromUnit}}?", { toUnit: tUnitName, fromUnit: fUnitName })}</h4>
      <p>{t("seoFaq1A", "There are exactly {{result}} {{toUnit}} in 1 {{fromUnit}}.", { result: formatNum(convFactor), toUnit: tUnitName, fromUnit: fUnitName })}</p>
      
      <h4>{t("seoFaq2Q", "How do you convert {{fromUnit}} to {{toUnit}}?", { fromUnit: fUnitName, toUnit: tUnitName })}</h4>
      <p>{t("seoFaq2A", "Simply multiply your value in {{fromUnit}} by {{factor}} to get the equivalent in {{toUnit}}. Our converter does this instantly for you.", { fromUnit: fUnitName, factor: formatNum(convFactor), toUnit: tUnitName })}</p>

      <h4>{t("seoFaq3Q", "What is {{unit}}?", { unit: fUnitName })}</h4>
      <p>{fUnit.description || t("seoUnitDesc", "{{unit}} is a unit of measurement used for {{category}}.", { unit: fUnitName, category: catName })} {t("seoAbbreviation", "Its abbreviation is", { symbol: fUnit.symbol })} <strong>{fUnit.symbol}</strong>.</p>

      <h4>{t("seoFaq4Q", "What is {{unit}}?", { unit: tUnitName })}</h4>
      <p>{tUnit.description || t("seoUnitDesc", "{{unit}} is a unit of measurement used for {{category}}.", { unit: tUnitName, category: catName })} {t("seoAbbreviation", "Its abbreviation is", { symbol: tUnit.symbol })} <strong>{tUnit.symbol}</strong>.</p>
      
      <h4>{t("seoFaq5Q", "Is 10 {{fromSymbol}} more than 10 {{toSymbol}}?", { fromSymbol: fUnit.symbol, toSymbol: tUnit.symbol })}</h4>
      <p>{t("seoFaq5A1", "By comparing them, 10 {{fromSymbol}} equals {{result}} {{toSymbol}}.", { fromSymbol: fUnit.symbol, result: formatNum(10 * convFactor), toSymbol: tUnit.symbol })} {convFactor > 1 ? t("seoMoreThan", "So 10 {{fromSymbol}} is more than 10 {{toSymbol}}.", { fromSymbol: fUnit.symbol, toSymbol: tUnit.symbol }) : t("seoLessThan", "So 10 {{fromSymbol}} is less than 10 {{toSymbol}}.", { fromSymbol: fUnit.symbol, toSymbol: tUnit.symbol })}</p>
    </div>
  );
}
