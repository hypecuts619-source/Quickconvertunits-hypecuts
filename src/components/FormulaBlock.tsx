import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface FormulaBlockProps {
  valFrom: string;
  fromSymbol: string;
  factor: number | string;
  valTo: string;
  toSymbol: string;
  category: string;
  fromUnitId: string;
  toUnitId: string;
}

export function FormulaBlock({
  valFrom,
  fromSymbol,
  factor,
  valTo,
  toSymbol,
  category,
  fromUnitId,
  toUnitId,
}: FormulaBlockProps) {
  const [copied, setCopied] = useState(false);

  // Generate formula representation
  let formulaDisplay = "";
  let plainTextFormula = "";

  if (category === "temperature") {
    if (fromUnitId === "celsius" && toUnitId === "fahrenheit") {
      formulaDisplay = `(${valFrom} \\times \\frac{9}{5}) + 32`;
      plainTextFormula = `(${valFrom} × 9/5) + 32 = ${valTo} ${toSymbol}`;
    } else if (fromUnitId === "fahrenheit" && toUnitId === "celsius") {
      formulaDisplay = `(${valFrom} - 32) \\times \\frac{5}{9}`;
      plainTextFormula = `(${valFrom} - 32) × 5/9 = ${valTo} ${toSymbol}`;
    } else if (fromUnitId === "celsius" && toUnitId === "kelvin") {
      formulaDisplay = `${valFrom} + 273.15`;
      plainTextFormula = `${valFrom} + 273.15 = ${valTo} ${toSymbol}`;
    } else if (fromUnitId === "kelvin" && toUnitId === "celsius") {
      formulaDisplay = `${valFrom} - 273.15`;
      plainTextFormula = `${valFrom} - 273.15 = ${valTo} ${toSymbol}`;
    } else {
      formulaDisplay = `\\text{Specific conversion formula}`;
      plainTextFormula = `${valFrom} ${fromSymbol} -> ${valTo} ${toSymbol}`;
    }
  } else {
    formulaDisplay = `${valFrom} \\text{ ${fromSymbol}} \\times ${factor}`;
    plainTextFormula = `${valFrom} ${fromSymbol} × ${factor} = ${valTo} ${toSymbol}`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(plainTextFormula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 group">
      <div className="bg-neutral-50 dark:bg-[#161616] py-8 px-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 font-serif overflow-hidden flex items-center justify-center min-h-[120px]">
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-neutral-300 dark:border-neutral-700 rounded-tl-2xl pointer-events-none opacity-50"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-neutral-300 dark:border-neutral-700 rounded-tr-2xl pointer-events-none opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-neutral-300 dark:border-neutral-700 rounded-bl-2xl pointer-events-none opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-neutral-300 dark:border-neutral-700 rounded-br-2xl pointer-events-none opacity-50"></div>

        <div className="flex flex-col md:flex-row items-center gap-4 text-xl md:text-2xl text-neutral-800 dark:text-neutral-200 tracking-wide">
          <div className="flex items-center gap-3 italic">
            <span>{category === "temperature" ? formulaDisplay : `${valFrom} ${fromSymbol} × ${factor}`}</span>
          </div>
          <div className="text-neutral-400 dark:text-neutral-600 not-italic">=</div>
          <div className="font-semibold text-primary-600 dark:text-primary-400 not-italic flex items-baseline gap-2">
            <span>{valTo}</span>
            <span className="text-lg text-neutral-500 dark:text-neutral-400 font-normal">{toSymbol}</span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-sans not-italic"
          aria-label="Copy formula"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Formula"}</span>
        </button>
      </div>
    </div>
  );
}
