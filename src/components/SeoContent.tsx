import React from 'react';
import { convert, getSEOUrlPath } from '../lib/units';
import { useTranslation } from 'react-i18next';
import { categorySeoContent } from '../lib/seoContent';
import { customSeoData } from '../lib/customSeoData';
import seoSnippetsRaw from '../lib/seoSnippets.json';
import { Link } from 'react-router-dom';

const seoSnippets: Record<string, any> = seoSnippetsRaw;

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
    <article className="prose prose-neutral dark:prose-invert max-w-none mb-10 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400">
      
      {catSeoHtml && (
        <div 
          className="mb-8 pb-8 border-b border-neutral-100 dark:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: catSeoHtml }} 
        />
      )}

      {/* AI Summary / Quick Answer */}
      <section className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 mb-10">
        <h2 className="mt-0 text-xl font-bold">{t("seoQuickAnswer", "Quick Conversion: {{fromUnit}} to {{toUnit}}", { fromUnit: fUnitName, toUnit: tUnitName })}</h2>
        <p className="text-2xl font-mono text-primary-600 dark:text-primary-400 my-4">
          1 {fUnit.symbol} = {formatNum(convFactor)} {tUnit.symbol}
        </p>
        <p className="mb-0 text-sm">
          To convert <strong>{fUnitName.toLowerCase()}</strong> to <strong>{tUnitName.toLowerCase()}</strong>, multiply by <strong>{formatNum(convFactor)}</strong>. This is the standard multiplier for {catName} conversions between these two units.
        </p>
      </section>

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
        <section aria-labelledby="quick-fact-title">
          <div className="bg-primary-50/50 dark:bg-primary-900/10 p-6 rounded-2xl border border-primary-100 dark:border-primary-900/30 my-8">
            <h3 id="quick-fact-title" className="flex items-center gap-2 mt-0 mb-4 text-primary-900 dark:text-primary-100">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Quick Fact
            </h3>
            <p className="mb-4 text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
              {seoSnippets[urlPath].quick_explanation}
            </p>
            <p className="mb-0 text-sm italic text-neutral-600 dark:text-neutral-400">
              💡 {seoSnippets[urlPath].real_world_example}
            </p>
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

      {cat && cat.units.length > 2 && (
        <section>
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
        </section>
      )}
    </article>
  );

}
