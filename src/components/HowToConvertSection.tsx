import React from 'react';
import { Unit, convert } from '../lib/units';
import { useTranslation } from 'react-i18next';

export default function HowToConvertSection({
  category,
  activeFromUnit,
  activeToUnit,
}: {
  category: string;
  activeFromUnit: Unit;
  activeToUnit: Unit;
}) {
  const { t } = useTranslation();

  if (!activeFromUnit || !activeToUnit || category === 'time_zone') return null;

  const fName = t(`units.${activeFromUnit.id}`, activeFromUnit.name);
  const tName = t(`units.${activeToUnit.id}`, activeToUnit.name);
  const fSymbol = activeFromUnit.symbol;
  const tSymbol = activeToUnit.symbol;

  let formulaStr = '';
  // Avoid confusing formulas for temperature
  if (category === 'temperature') {
    if (activeFromUnit.id === 'celsius' && activeToUnit.id === 'fahrenheit') {
      formulaStr = '°F = (°C × 9/5) + 32';
    } else if (activeFromUnit.id === 'fahrenheit' && activeToUnit.id === 'celsius') {
      formulaStr = '°C = (°F - 32) × 5/9';
    } else if (activeFromUnit.id === 'celsius' && activeToUnit.id === 'kelvin') {
      formulaStr = 'K = °C + 273.15';
    } else if (activeFromUnit.id === 'kelvin' && activeToUnit.id === 'celsius') {
      formulaStr = '°C = K - 273.15';
    } else if (activeFromUnit.id === 'fahrenheit' && activeToUnit.id === 'kelvin') {
      formulaStr = 'K = (°F - 32) × 5/9 + 273.15';
    } else if (activeFromUnit.id === 'kelvin' && activeToUnit.id === 'fahrenheit') {
      formulaStr = '°F = (K - 273.15) × 9/5 + 32';
    }
  } else if (category === 'angle' && activeFromUnit.id === 'gradian' && activeToUnit.id === 'radian') {
    formulaStr = 'rad = grad × π/200';
  } else if (activeFromUnit.factor && activeToUnit.factor) {
    const ratio = activeFromUnit.factor / activeToUnit.factor;
    const roundedRatio = ratio >= 1000 || ratio < 0.01 ? ratio.toExponential(4) : ratio.toPrecision(6);
    formulaStr = `${tSymbol} = ${fSymbol} × ${roundedRatio}`;
  }

  let values = [1, 5, 10, 50, 100, 500, 1000];
  if (activeFromUnit.id === 'meter' && activeToUnit.id === 'kilometer') {
    values = [1, 5, 10, 50, 100, 320, 500, 1000];
  }

  return (
    <div className="mt-8 bg-white dark:bg-[#111111] rounded-[2rem] p-6 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800">
      <div className="grid md:grid-cols-2 gap-10">
        
        {/* Quick Reference Table */}
        <section>
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">
            Quick Reference: {fName} to {tName}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white">
                <tr>
                  <th className="px-6 py-4 font-medium">{fName} ({fSymbol})</th>
                  <th className="px-6 py-4 font-medium">{tName} ({tSymbol})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-[#151515]">
                {values.map((v) => {
                  const res = convert(v, activeFromUnit.id, activeToUnit.id, category);
                  const formatted = res >= 1000 || res < 0.001 ? res.toExponential(6) : parseFloat(res.toPrecision(6)).toString();
                  return (
                    <tr key={v} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-3">{v}</td>
                      <td className="px-6 py-3 font-medium text-neutral-900 dark:text-neutral-300">{formatted}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to Convert */}
        <section className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">
            How to Convert {fName} to {tName}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            Converting {fName.toLowerCase()} to {tName.toLowerCase()} is simple. 
            Just enter your value in the conversion calculator above. Alternatively, 
            you can calculate it manually using the specific conversion formula below.
          </p>
          
          {activeFromUnit.id === 'meter' && activeToUnit.id === 'kilometer' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">Common Conversion Examples</h3>
              <ul className="list-disc pl-5 text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>320 meters = 0.32 km</li>
                <li>1000 meters = 1 km</li>
                <li>50 meters = 0.05 km</li>
              </ul>
            </div>
          )}

          {formulaStr && (
            <div className="bg-primary-50 dark:bg-primary-500/10 p-6 rounded-2xl border border-primary-100 dark:border-primary-500/20">
              <h3 className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-2">Math Formula</h3>
              <p className="font-mono text-xl text-neutral-900 dark:text-white font-medium">
                {formulaStr}
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
