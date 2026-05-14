import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { convert, categories } from '../lib/units';
import { useTranslation } from 'react-i18next';

interface RelatableComparisonProps {
  category: string;
  valTo: string;
  unitTo: string;
  unitFrom: string;
  valFrom: string;
}

const COMPARISONS = {
  length: [
    { name: 'credit card width', plural: 'credit cards', emoji: '💳', valueInBase: 0.0856 },
    { name: 'smartphone length', plural: 'smartphones', emoji: '📱', valueInBase: 0.15 },
    { name: 'standard ruler', plural: 'rulers', emoji: '📏', valueInBase: 0.3048 },
    { name: 'average human height', plural: 'average humans', emoji: '🧍', valueInBase: 1.7 },
    { name: 'car length', plural: 'cars', emoji: '🚗', valueInBase: 4.5 },
    { name: 'school bus length', plural: 'school buses', emoji: '🚌', valueInBase: 12 },
    { name: 'football field length', plural: 'football fields', emoji: '🏈', valueInBase: 109.7 },
    { name: 'Eiffel Tower height', plural: 'Eiffel Towers', emoji: '🗼', valueInBase: 330 },
    { name: 'Mount Everest height', plural: 'Mount Everests', emoji: '🏔️', valueInBase: 8848 },
  ],
  weight: [
    { name: 'paperclip', plural: 'paperclips', emoji: '📎', valueInBase: 0.001 },
    { name: 'AA battery', plural: 'AA batteries', emoji: '🔋', valueInBase: 0.023 },
    { name: 'apple', plural: 'apples', emoji: '🍎', valueInBase: 0.15 },
    { name: 'soccer ball', plural: 'soccer balls', emoji: '⚽', valueInBase: 0.43 },
    { name: 'liter of water', plural: 'liters of water', emoji: '💧', valueInBase: 1 },
    { name: 'domestic cat', plural: 'cats', emoji: '🐈', valueInBase: 4.5 },
    { name: 'golden retriever', plural: 'dogs', emoji: '🦮', valueInBase: 30 },
    { name: 'average adult human', plural: 'average adults', emoji: '🧍', valueInBase: 70 },
    { name: 'grand piano', plural: 'grand pianos', emoji: '🎹', valueInBase: 400 },
    { name: 'car', plural: 'cars', emoji: '🚗', valueInBase: 1500 },
    { name: 'African elephant', plural: 'elephants', emoji: '🐘', valueInBase: 6000 },
    { name: 'Boeing 747', plural: 'Boeing 747s', emoji: '✈️', valueInBase: 183500 },
  ],
  volume: [
    { name: 'teardrop', plural: 'teardrops', emoji: '💧', valueInBase: 0.00005 },
    { name: 'teaspoon', plural: 'teaspoons', emoji: '🥄', valueInBase: 0.0049 },
    { name: 'can of soda', plural: 'cans of soda', emoji: '🥤', valueInBase: 0.33 },
    { name: 'gallon of milk', plural: 'gallons of milk', emoji: '🥛', valueInBase: 3.785 },
    { name: 'bathtub', plural: 'bathtubs', emoji: '🛁', valueInBase: 150 },
    { name: 'hot tub', plural: 'hot tubs', emoji: '♨️', valueInBase: 1500 },
    { name: 'shipping container', plural: 'shipping containers', emoji: '📦', valueInBase: 33000 },
    { name: 'Olympic swimming pool', plural: 'Olympic swimming pools', emoji: '🏊‍♂️', valueInBase: 2500000 },
  ]
};

export function RelatableComparison({ category, valTo, unitTo, valFrom, unitFrom }: RelatableComparisonProps) {
  const { t } = useTranslation();

  const comparison = useMemo(() => {
    if (!COMPARISONS[category as keyof typeof COMPARISONS]) return null;
    
    const numValTo = parseFloat(valTo);
    if (isNaN(numValTo) || numValTo <= 0) return null;

    // Convert output value to base unit to compare uniformly
    let baseValue = numValTo;
    
    // Attempt to safely grab the base unit logic
    const catData = categories.find(c => c.id === category);
    if (!catData) return null;
    
    // We already have the value, why not convert it to the base unit directly from the "From" input?
    try {
      baseValue = convert(parseFloat(valFrom), unitFrom, catData.baseUnit, category);
    } catch(e) {
      return null;
    }

    const items = COMPARISONS[category as keyof typeof COMPARISONS];
    
    // Find an item where the multiplier is between 0.5 and 500
    // Try to find the closest fit (multiplier closest to 1, or just a manageable number)
    let bestItem = null;
    let bestMultiplier = 0;
    
    for (const item of items) {
      const multiplier = baseValue / item.valueInBase;
      if (multiplier >= 0.5 && multiplier <= 1000) {
        if (!bestItem || Math.abs(multiplier - 5) < Math.abs(bestMultiplier - 5)) { // Just a heuristic
          bestItem = item;
          bestMultiplier = multiplier;
        }
      }
    }
    
    if (!bestItem) return null;

    return {
      item: bestItem,
      multiplier: bestMultiplier
    };
  }, [category, valTo, unitTo, valFrom, unitFrom]);

  if (!comparison) return null;

  const { item, multiplier } = comparison;
  // Format multiplier
  let formattedMultiplier = "";
  if (multiplier >= 100) formattedMultiplier = Math.round(multiplier).toString();
  else if (multiplier >= 10) formattedMultiplier = multiplier.toFixed(1);
  else formattedMultiplier = multiplier.toFixed(2);
  
  // Clean up trailing zeros from decimals
  formattedMultiplier = parseFloat(formattedMultiplier).toString();

  const isPlural = parseFloat(formattedMultiplier) !== 1;
  const nameToUse = isPlural ? item.plural : item.name;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="mt-6 flex justify-center w-full"
      >
        <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/30 rounded-2xl p-4 flex items-center gap-4 text-left max-w-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-16 h-16 text-primary-500 scale-150 -translate-y-4 translate-x-4" />
          </div>
          
          <div className="w-12 h-12 bg-white dark:bg-[#1e1e1e] rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0 border border-primary-100 dark:border-neutral-800">
            {item.emoji}
          </div>
          
          <div className="flex-1 relative z-10">
            <div className="text-xs uppercase tracking-widest font-semibold text-primary-600 dark:text-primary-400 mb-0.5">
              {t("relatableScale", "To Put It In Perspective")}
            </div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
              That's about the {category === 'weight' ? 'weight' : category === 'length' ? 'length' : 'volume'} of <strong className="text-primary-600 dark:text-primary-400 text-base">{formattedMultiplier}</strong> {nameToUse}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
