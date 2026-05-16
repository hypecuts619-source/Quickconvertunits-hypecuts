import { Link } from "react-router-dom";
import { convert, getSEOUrlPath } from "../lib/units";
import { formatNumber } from "../lib/units";
import { AeoSpecificContent, aeoSupportedPairs } from "./AeoSpecificContent";

export const SpecificConversionSEO = ({ fromUnit, toUnit, category }: { fromUnit: any; toUnit: any; category: string }) => {
  const pairStr = `${fromUnit.id}-to-${toUnit.id}`;
  if (aeoSupportedPairs.includes(pairStr)) {
    return <AeoSpecificContent fromUnitId={fromUnit.id} toUnitId={toUnit.id} />;
  }

  let nums = [1, 2, 3, 4, 5, 10, 25, 50, 100, 200, 250, 500, 1000];
  if (category === 'currency') nums = [1, 5, 10, 20, 50, 100, 250, 500, 1000, 5000, 10000];

  let formulaStr = "";
  if (category !== 'temperature' && category !== 'time_zone' && category !== 'bmi') {
    formulaStr = `1 ${fromUnit.symbol} = ${convert(1, fromUnit.id, toUnit.id, category)} ${toUnit.symbol}`;
  }

  return (
    <div className="mt-8 mb-12">
      {formulaStr && (
        <div className="bg-primary-50 dark:bg-primary-900/10 rounded-2xl p-6 border border-primary-100 dark:border-primary-900/30 mb-8 w-full block text-left">
          <h3 className="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">Conversion Formula</h3>
          <p className="font-mono text-lg md:text-xl text-primary-800 dark:text-primary-200 font-bold bg-white dark:bg-neutral-900 p-3 rounded-xl border border-primary-200 dark:border-primary-800/50 inline-block overflow-x-auto max-w-full">
            {formulaStr}
          </p>
          <p className="text-primary-700 dark:text-primary-300 mt-3 text-sm flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center text-xs font-bold mt-0.5">i</span>
            <span>Multiply the value in {fromUnit.name} by the conversion factor to get the result in {toUnit.name}.</span>
          </p>
        </div>
      )}

      <h3 className="text-xl font-semibold tracking-tight mb-4 text-left">Common {fromUnit.name} to {toUnit.name} Conversions</h3>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] shadow-sm">
        <table className="w-full text-left min-w-[300px]">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">{fromUnit.name} ({fromUnit.symbol})</th>
              <th className="py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">{toUnit.name} ({toUnit.symbol})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            {nums.map(n => {
              const res = convert(n, fromUnit.id, toUnit.id, category);
              const resStr = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(6)).toString();
              return (
                <tr key={n} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <Link to={`/convert-${n}-${getSEOUrlPath(fromUnit.id, toUnit.id)}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                      {n} {fromUnit.symbol}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-800 dark:text-neutral-200">
                    {resStr} {toUnit.symbol}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-left">
        <h4 className="font-semibold mb-2">How to calculate manually?</h4>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          The conversion from {fromUnit.name} to {toUnit.name} is a simple multiplication. 
          To find out how many {toUnit.name} in {fromUnit.name}, you just multiply by the factor {formatNumber(convert(1, fromUnit.id, toUnit.id, category))}.
        </p>
      </div>
    </div>
  );
};
