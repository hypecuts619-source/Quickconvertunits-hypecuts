import React from 'react';
import { convert, getSEOUrlPath, generateLattice } from '../lib/units';
import { useTranslation } from 'react-i18next';
import { categorySeoContent } from '../lib/seoContent';
import { customSeoData } from '../lib/customSeoData';
import seoSnippetsRaw from '../lib/seoSnippets.json';
import geoPassagesRaw from '../lib/geoPassages.json';
import regulatoryStandardsRaw from '../lib/regulatoryStandards.json';
import { Link, useLocation } from 'react-router-dom';

const seoSnippets: Record<string, any> = seoSnippetsRaw;
const geoPassages: Record<string, any> = geoPassagesRaw;
const regulatoryStandards: Record<string, any> = regulatoryStandardsRaw;

function getComparativeStatement(from: string, to: string, category: string): string {
  const comparisons: Record<string, Record<string, string>> = {
    pressure: {
      'pascal-bar': ' A pascal is 100,000x smaller than a bar—bars are used for atmospheric pressure, pascals for scientific precision.',
      'bar-pascal': ' A bar is 100,000x larger than a pascal—one bar equals approximately standard atmospheric pressure at sea level.'
    },
    weight: {
      'gram-cup': ' For water and similar densities, 240g equals 1 cup. For flour, 1 cup ≈ 125g.',
      'cup-gram': ' One US cup equals 240 grams for water; ingredient density changes this value.'
    }
  };
  
  const key = `${from.toLowerCase().slice(0,4)}...${to.toLowerCase().slice(0,4)}`;
  // Wait, let's just use exact match or slice? The snippet used slice(0,4). Let's fix snippet:
  const exactKey = `${from.toLowerCase()}-${to.toLowerCase()}`;
  if (category === 'pressure' && exactKey === 'pascal-bar') return comparisons.pressure['pascal-bar'];
  if (category === 'pressure' && exactKey === 'bar-pascal') return comparisons.pressure['bar-pascal'];
  if (category === 'weight' && exactKey === 'gram-cup') return comparisons.weight['gram-cup'];
  if (category === 'weight' && exactKey === 'cup-gram') return comparisons.weight['cup-gram'];
  
  return '';
}

export function SeoContent({ 
  unitFrom, unitTo, category, categories
}: {
  unitFrom: string, unitTo: string, category: string, categories: any[]
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const cat = categories.find(c => c.id === category);
  const fUnit = cat?.units.find((u: any) => u.id === unitFrom);
  const tUnit = cat?.units.find((u: any) => u.id === unitTo);

  if (!fUnit || !tUnit || fUnit.id === tUnit.id) return null;

  const urlPath = getSEOUrlPath(unitFrom, unitTo);
  const customContent = customSeoData[urlPath];

  if (customContent) {
    const lattice = generateLattice(unitFrom, unitTo, category);

    return (
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400">
        <div dangerouslySetInnerHTML={{ __html: customContent.content }} />
        
        {lattice.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800">
            <h2 className="mt-0 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.803a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              {t("seoRelated", "Discovery Lattice: Related Converters")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 not-prose">
              {lattice.map((item, idx) => (
                <Link 
                  key={`${item.fromId}-${item.toId}-${idx}`}
                  to={`/${getSEOUrlPath(item.fromId, item.toId)}`} 
                  className="group flex flex-items gap-3 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-primary-500 dark:hover:border-primary-500/50 hover:shadow-md transition-all"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary-400 group-hover:scale-125 transition-transform"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.text}
                    </span>
                    {item.categoryId !== category && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 mt-1">Cross-Category Bridge</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
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

  const lattice = generateLattice(unitFrom, unitTo, category);
  const isCategoryHub = unitFrom === unitTo || (unitFrom === cat?.units[0]?.id && unitTo === cat?.units[1]?.id && location.pathname.endsWith('-converter'));

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none mb-10 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400">
      
      {!isCategoryHub && catSeoHtml && (
        <div 
          className="mb-8 pb-8 border-b border-neutral-100 dark:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: catSeoHtml }} 
        />
      )}

      {/* AI Summary / Quick Answer */}
      {!isCategoryHub && (
        <section className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 mb-10"
                 itemScope itemType="https://schema.org/HowToStep">
          <h2 className="mt-0 text-xl font-bold">
            {t("seoQuickAnswer", "How do you convert {{fromUnit}} to {{toUnit}}?", { 
              fromUnit: fUnitName, 
              toUnit: tUnitName 
            })}
          </h2>
          
          <p className="aeo-context text-sm mb-2">
            For context, 1 bar is roughly average atmospheric pressure at sea level, 
            while 1 pascal is a microscopic fraction of it.
          </p>

          <p className="text-2xl font-mono text-primary-600 dark:text-primary-400 my-4">
            1 {fUnit.symbol} = {formatNum(convFactor)} {tUnit.symbol}
          </p>
          
          <p className="mb-0 text-sm">
            To convert <strong>{fUnitName.toLowerCase()}</strong> to <strong>{tUnitName.toLowerCase()}</strong>, 
            multiply by <strong>{formatNum(convFactor)}</strong>. 
            This {catName} conversion follows {regulatoryStandards[category]?.standard_reference?.split(' ')[2] || 'ISO'} {new Date().getFullYear()} standards.
            {getComparativeStatement(fUnitName, tUnitName, category)}
          </p>
        </section>
      )}

      {/* GEO Optimized Passage */}
      {geoPassages[urlPath] && (
        <section className="my-12 p-8 bg-primary-50/30 dark:bg-primary-900/5 rounded-3xl border-2 border-primary-100/50 dark:border-primary-900/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24 text-primary-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16L9.01703 16C7.91246 16 7.01703 16.8954 7.01703 18L7.01703 21M14.017 21L17.017 21C18.1216 21 19.017 20.1046 19.017 19L19.017 5C19.017 3.89543 18.1216 3 17.017 3L7.01703 3C5.91246 3 5.01703 3.89543 5.01703 5L5.01703 19C5.01703 20.1046 5.91246 21 7.01703 21L14.017 21ZM14.017 21L14.017 12L10.017 12L10.017 21"></path></svg>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-[10px] font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              Generative Engine Optimized (Answer Capsule)
            </div>
            
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4 leading-tight">
              {geoPassages[urlPath].conversational_heading}
            </h2>
            
            <div className="text-lg text-neutral-800 dark:text-neutral-200 font-medium mb-6 leading-relaxed">
              {geoPassages[urlPath].quotable_answer}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pt-8 border-t border-primary-100 dark:border-primary-900/20">
              <div className="bg-white dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 italic">Island Test Citation Passage</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-0">
                  {geoPassages[urlPath].quotable_answer.split('. ').slice(0, 2).join('. ') + '.'}
                </p>
              </div>
              
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 italic">AI Fact Sheet (2026)</h3>
                <dl className="grid grid-cols-1 gap-3">
                  {Object.entries(geoPassages[urlPath].ai_fact_sheet).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <dt className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">{key}</dt>
                      <dd className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Regulatory Freshness Block */}
      {regulatoryStandards[category] && (
        <section className="my-12 p-6 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold m-0 text-neutral-900 dark:text-white">Regulatory & Engineering Standards</h2>
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-amber-600 dark:text-amber-400 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                {regulatoryStandards[category].freshness_stamp}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Regulatory Benchmark</h3>
                <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                  {regulatoryStandards[category].regulatory_benchmark}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Legal Metrology Warning</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                  {regulatoryStandards[category].legal_metrology_warning}
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-neutral-950 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-inner">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                2026 Quantity Model Note
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-loose">
                {regulatoryStandards[category].quantity_model_note}
              </p>
            </div>
          </div>
        </section>
      )}


      <section>
        <h2>{t("seoHowTo", "How to Convert {{fromUnit}} to {{toUnit}}", { fromUnit: fUnitName, toUnit: tUnitName })}</h2>
        <p>
          The formula for converting {fUnitName.toLowerCase()} to {tUnitName.toLowerCase()} is:
        </p>
        <div className="font-mono bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-center my-4 border border-neutral-200 dark:border-neutral-700">
          <span className="text-neutral-500 uppercase text-xs block mb-1">Conversion Formula</span>
          <span className="text-lg">[{tUnitName.toLowerCase()}] = [{fUnitName.toLowerCase()}] × {formatNum(convFactor)}</span>
        </div>
        <p>
          {t("seoFormulaDesc1", "To manually convert {{fromUnit}} to {{toUnit}}, multiply the value in {{fromUnit}} by", { fromUnit: fUnitName, toUnit: tUnitName })} {" "}
          <strong>{formatNum(convFactor)}</strong>. 
          {t("seoFormulaDesc2", "For example, to convert 5 {{fromUnit}} to {{toUnit}}:", { fromUnit: fUnitName, toUnit: tUnitName })}<br/>
          <code className="bg-neutral-50 dark:bg-neutral-900 px-2 py-1 rounded">5 {fUnit.symbol} × {formatNum(convFactor)} = {formatNum(5 * convFactor)} {tUnit.symbol}</code>
        </p>
      </section>
      
      <section>
        <h2>Step-by-Step {fUnitName} to {tUnitName} Guide</h2>
        <p>Converting between {fUnitName.toLowerCase()} and {tUnitName.toLowerCase()} is straightforward when you understand the exact mathematical relationship. Here is the best way to calculate the result:</p>
        <ol className="list-decimal pl-5 space-y-2 mt-4 ml-4">
          <li><strong>Identify the exact conversion factor:</strong> 1 {fUnitName.toLowerCase()} is exactly {formatNum(convFactor)} {tUnitName.toLowerCase()}.</li>
          <li><strong>Determine your starting measurement:</strong> For instance, let's say you need to convert 10 {fUnitName.toLowerCase()}.</li>
          <li><strong>Apply the mathematical formula:</strong> Multiply your starting value by the conversion factor.</li>
          <li><strong>Calculate the final result:</strong> 10 × {formatNum(convFactor)} = {formatNum(10 * convFactor)} {tUnit.symbol}.</li>
        </ol>
      </section>

      <p className="mt-4">
        {fUnit.description || t("seoDescription", "Converting {{fromUnit}} to {{toUnit}} is a common {{category}} conversion.", { fromUnit: fUnitName, toUnit: tUnitName, category: catName })}
      </p>

      <section>
        <h2>{t("seoTable", "{{fromUnit}} to {{toUnit}} Conversion Table", { fromUnit: fUnitName, toUnit: tUnitName })}</h2>
        <p>A quick reference table covering standard {catName} conversions from {fUnitName.toLowerCase()} to {tUnitName.toLowerCase()}:</p>
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
                  <td className="px-4 py-2 font-medium bg-white dark:bg-[#111111]">
                    <Link to={`/${getSEOUrlPath(unitFrom, unitTo)}?val=${val}`} className="hover:underline">
                      {val} {fUnit.symbol}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-neutral-600 dark:text-neutral-300 bg-white/50 dark:bg-neutral-900/50">{formatNum(convert(val, unitFrom, unitTo, category))} {tUnit.symbol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Fractional Values: {fUnitName} to {tUnitName}</h2>
        <p>In many practical, everyday scenarios, you might need to convert fractions or decimals of a {fUnitName.toLowerCase()}. Here are the most common fractional conversions, perfect for precise measurements in cooking, engineering, or scientific applications:</p>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 my-6">
          {[0.1, 0.25, 0.5, 0.75].map(val => (
            <li key={val} className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg text-sm text-center">
              <Link to={`/${getSEOUrlPath(unitFrom, unitTo)}?val=${val}`} className="text-primary-600 dark:text-primary-400 hover:underline block font-semibold mb-1">
                {val} {fUnit.symbol}
              </Link>
              <span className="text-neutral-500 dark:text-neutral-400 text-xs font-mono">= {formatNum(val * convFactor)} {tUnit.symbol}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Historical Origins and Context</h2>
        <p>The origins of the <strong>{fUnitName}</strong> and the <strong>{tUnitName}</strong> trace back to the pressing need for standardized <em>{catName}</em> tracking in commerce, agriculture, engineering, and science. In early civilizations, physical artifacts, local agreements, or natural phenomena were used to define local units. Over time, groups like the International System of Units (SI) standardized the conversion factors you rely on today.</p>
        <p>While the {fUnitName.toLowerCase()} may be rooted in older traditional systems or regional standards, it maintains a permanent, precise mathematical relationship with the {tUnitName.toLowerCase()}. Knowing the history helps appreciate why accurate, digital unit converters have become indispensable computing tools today.</p>
      </section>

      <section>
        <h2>Real-World Examples: When to Use {fUnitName} vs {tUnitName}</h2>
        <p>{fUnitName} and {tUnitName} are utilized differently globally depending on the specific contextual application, geographical location, and industry norms:</p>
        <ul className="list-disc pl-5 space-y-2 mt-4 ml-4">
          <li><strong>Daily Life & Home:</strong> Depending on where you live (regions adopting the metric system versus those using the US customary / imperial system), you might use {fUnitName} for everyday measurements while someone in another country natively uses {tUnitName}.</li>
          <li><strong>Science and Engineering:</strong> Professionals heavily favor standard metric units. When drafting architecture, writing code, or communicating blueprints across borders, converting {fUnitName} to {tUnitName} ensures absolute precision and avoids critical errors.</li>
          <li><strong>Trade and Commerce:</strong> Packaging manufactured goods often requires strict dual labeling, prominently displaying both {fUnit.symbol} and {tUnit.symbol} to satisfy rigorous international shipping laws and retail regulations.</li>
        </ul>
      </section>

      {seoSnippets[urlPath] && (
        <section aria-labelledby="expert-insights-title" className="my-12">
          <h2 id="expert-insights-title" className="text-2xl font-bold mb-6 tracking-tight text-neutral-900 dark:text-white">Expert Insights & Context</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Explanation */}
            <div className="bg-neutral-50 dark:bg-neutral-900/40 p-5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 flex flex-col h-full hover:border-primary-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Definition</span>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                {seoSnippets[urlPath].quick_explanation}
              </p>
            </div>

            {/* Formula Context */}
            {seoSnippets[urlPath].formula_context && (
              <div className="bg-neutral-50 dark:bg-neutral-900/40 p-5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 flex flex-col h-full hover:border-primary-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Why?</span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {seoSnippets[urlPath].formula_context}
                </p>
              </div>
            )}

            {/* Real World Example */}
            <div className="bg-neutral-50 dark:bg-neutral-900/40 p-5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 flex flex-col h-full hover:border-primary-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2.5 2.5 0 002.5-2.5V4a2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Scale</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                "{seoSnippets[urlPath].real_world_example}"
              </p>
            </div>

            {/* Pro Tip */}
            {seoSnippets[urlPath].pro_tip && (
              <div className="bg-primary-50/50 dark:bg-primary-900/10 p-5 rounded-2xl border border-primary-200/50 dark:border-primary-800/30 flex flex-col h-full hover:shadow-lg hover:shadow-primary-500/5 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                    <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400">Pro Tip</span>
                </div>
                <p className="text-sm text-primary-900 dark:text-primary-100 font-semibold leading-relaxed">
                  {seoSnippets[urlPath].pro_tip}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <section>
        <h2>{t("seoFaq", "Frequently Asked Questions")}</h2>
        <div className="space-y-6 mt-6">
          {seoSnippets[urlPath]?.faq_schema_qa?.map((faq: any, i: number) => (
            <div key={`snippet-faq-${i}`}>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                {faq.question}
              </h3>
              <p className="mt-1">
                {faq.answer}
              </p>
            </div>
          ))}

          <div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              {t("seoFaq1Q", "How many {{toUnit}} are in 1 {{fromUnit}}?", { toUnit: tUnitName, fromUnit: fUnitName })}
            </h3>
            <p className="mt-1">
              {t("seoFaq1A", "1 {{fromUnit}} equals exactly {{result}} {{toUnit}}.", { result: formatNum(convFactor), toUnit: tUnitName, fromUnit: fUnitName })}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
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
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              {t("seoFaq3Q", "How do you convert {{fromUnit}} to {{toUnit}} in your head?", { fromUnit: fUnitName, toUnit: tUnitName })}
            </h3>
            <p className="mt-1">
              {category === 'weight' && fUnit.id === 'kilogram' && tUnit.id === 'pound' 
                ? "A quick approximation is to double the kg value and add 10%. For example, 50 kg ≈ 50×2 + 5 = 105 lbs (actual: 110.23)." 
                : `To roughly calculate it in your head, you can multiply the ${fUnitName} value by approximately ${formatNum(Math.round(convFactor * 10) / 10)}.`}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>{t("seoAbout", "About This Tool")}</h2>
        <p>
          Our free online {fUnitName} to {tUnitName} converter provides quick and precise measurements based on international standard definitions. It operates entirely within your browser for real-time speed, with support for offline conversions.
        </p>
      </section>

      {lattice.length > 0 && (
        <section className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800">
          <h2 className="mt-0 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.803a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            Discovery Lattice: Related Converters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 not-prose">
            {lattice.map((item, idx) => (
              <Link 
                key={`${item.fromId}-${item.toId}-${idx}`}
                to={`/${getSEOUrlPath(item.fromId, item.toId)}`} 
                className="group flex items-start gap-3 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-primary-500 dark:hover:border-primary-500/50 hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 group-hover:scale-125 transition-transform"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.text}
                  </span>
                  {item.categoryId !== category && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 mt-1">Cross-Category Bridge</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
