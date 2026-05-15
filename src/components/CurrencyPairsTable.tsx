import { Link } from "react-router-dom";
import { convert } from "../lib/units";

export const CurrencyPairsTable = () => {
    const commonPairs = [
      { from: 'usd', to: 'eur' },
      { from: 'eur', to: 'usd' },
      { from: 'gbp', to: 'usd' },
      { from: 'usd', to: 'jpy' },
      { from: 'aud', to: 'usd' },
      { from: 'usd', to: 'cad' },
      { from: 'eur', to: 'gbp' },
      { from: 'usd', to: 'chf' },
      { from: 'usd', to: 'hkd' },
      { from: 'usd', to: 'inr' },
    ];
  
    return (
      <div className="mt-12 bg-white dark:bg-[#111111] rounded-3xl p-8 border border-neutral-100 dark:border-neutral-800 shadow-sm text-left">
        <h3 className="text-xl font-semibold mb-6 tracking-tight">Popular Currency Exchange Rates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {commonPairs.map(pair => (
            <Link 
              key={`${pair.from}-${pair.to}`}
              to={`/${pair.from}-to-${pair.to}`}
              className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
            >
              <div className="text-[10px] uppercase font-bold text-neutral-400 group-hover:text-primary-500 transition-colors mb-1">
                {pair.from} / {pair.to}
              </div>
              <div className="font-mono text-sm font-semibold">
                1 {pair.from.toUpperCase()} = {convert(1, pair.from, pair.to, 'currency').toFixed(4)} {pair.to.toUpperCase()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
};
