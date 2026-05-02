import React from 'react';
import { convert } from '../lib/units';

export function SeoContent({ 
  unitFrom, unitTo, category, categories
}: {
  unitFrom: string, unitTo: string, category: string, categories: any[]
}) {
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
  
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400">
      <h2>{fUnit.name} to {tUnit.name} Converter</h2>
      <p>{fUnit.description || `Instantly convert ${fUnit.name} (${fUnit.symbol}) to ${tUnit.name} (${tUnit.symbol}) with our high-precision online calculator.`} {tUnit.description ? ` ${tUnit.description}` : ""}</p>
      
      <h3>How to Convert {fUnit.name} to {tUnit.name}</h3>
      <p>
        To manually convert {fUnit.name} to {tUnit.name}, multiply the value in {fUnit.name} by {" "}
        <strong>{formatNum(convFactor)}</strong>. 
        For example, 5 {fUnit.symbol} would be exactly {formatNum(5 * convFactor)} {tUnit.symbol}. Memorizing this formula and performing manual math is slow and prone to errors. Our real-time calculator handles this for you instantly.
      </p>

      <h3>{fUnit.name} to {tUnit.name} Conversion Table</h3>
      <div className="not-prose overflow-x-auto my-6 border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-sm mx-auto shadow-sm">
        <table className="w-full text-sm text-center">
          <thead className="bg-neutral-50 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
            <tr>
              <th className="px-4 py-3">{fUnit.name} ({fUnit.symbol})</th>
              <th className="px-4 py-3">{tUnit.name} ({tUnit.symbol})</th>
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

      <h3>Frequently Asked Questions</h3>
      <h4>How many {tUnit.name} are in 1 {fUnit.name}?</h4>
      <p>There are exactly {formatNum(convFactor)} {tUnit.name} in 1 {fUnit.name}.</p>
      
      <h4>How do you convert {fUnit.name} to {tUnit.name}?</h4>
      <p>Simply multiply your value in {fUnit.name} by {formatNum(convFactor)} to get the equivalent in {tUnit.name}. Our converter does this instantly for you.</p>

      <h4>What is {fUnit.name}?</h4>
      <p>{fUnit.description || `${fUnit.name} is a unit of measurement used for ${cat?.name.toLowerCase()}.`} Its abbreviation is <strong>{fUnit.symbol}</strong>.</p>

      <h4>What is {tUnit.name}?</h4>
      <p>{tUnit.description || `${tUnit.name} is a unit of measurement used for ${cat?.name.toLowerCase()}.`} Its abbreviation is <strong>{tUnit.symbol}</strong>.</p>
      
      <h4>Is 10 {fUnit.symbol} more than 10 {tUnit.symbol}?</h4>
      <p>By comparing them, 10 {fUnit.symbol} equals {formatNum(10 * convFactor)} {tUnit.symbol}. So {convFactor > 1 ? `10 ${fUnit.symbol} is more than 10 ${tUnit.symbol}.` : `10 ${fUnit.symbol} is less than 10 ${tUnit.symbol}.`}</p>
    </div>
  );
}
