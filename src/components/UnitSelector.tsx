import { useState, useMemo, useEffect, useRef, KeyboardEvent } from "react";
import { Plus, Search, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Unit {
  id: string;
  name: string;
  symbol: string;
}

interface UnitSelectorProps {
  value: string;
  onChange: (id: string) => void;
  units: Unit[];
  activeCategoryId: string;
}

// Top units for quick access per category
const TOP_UNITS: Record<string, string[]> = {
  length: ["meter", "foot", "inch", "centimeter", "mile", "kilometer"],
  mass: ["kilogram", "pound", "gram", "ounce"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
  volume: ["liter", "milliliter", "gallon_us", "fluid_ounce_us"],
  area: ["square_meter", "acre", "hectare", "square_foot"],
  time: ["second", "minute", "hour", "day"],
  data: ["byte", "kilobyte", "megabyte", "gigabyte"],
  speed: ["meter_per_second", "kilometer_per_hour", "mile_per_hour"],
  pressure: ["pascal", "bar", "psi", "atmosphere"],
  energy: ["joule", "calorie", "kilocalorie", "watt_hour"],
};

export function UnitSelector({ value, onChange, units, activeCategoryId }: UnitSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeUnit = units.find((u) => u.id === value) || units[0];

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const topUnitIds = TOP_UNITS[activeCategoryId] || [];
  const popularUnits = units.filter((u) => topUnitIds.includes(u.id));
  
  const filteredUnits = useMemo(() => {
    if (!search.trim()) return units;
    const query = search.toLowerCase().trim();
    
    // Normalize query for common plurals and variations
    const normalized = query
      .replace(/feet/g, 'foot')
      .replace(/inches/g, 'inch')
      .replace(/\blbs?\b/g, 'pound');
      
    // Strip trailing 's' if it makes sense to avoid missing singulars
    const qSingular = (normalized.length > 3 && normalized.endsWith('s') && !['us', 'ss', 'is'].some(suffix => normalized.endsWith(suffix))) 
      ? normalized.slice(0, -1) 
      : normalized;

    const results = units.filter((u) => {
      const searchStr = `${u.name} ${u.symbol} ${u.id}`.toLowerCase();
      return searchStr.includes(normalized) || searchStr.includes(qSingular);
    });

    // Sort exact matches and startsWith matches to the top
    return results.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aSym = a.symbol.toLowerCase();
      const bSym = b.symbol.toLowerCase();
      
      const aExact = aName === qSingular || aSym === query ? 1 : 0;
      const bExact = bName === qSingular || bSym === query ? 1 : 0;
      
      if (aExact !== bExact) return bExact - aExact;
      
      const aStart = aName.startsWith(qSingular) || aSym.startsWith(query) ? 1 : 0;
      const bStart = bName.startsWith(qSingular) || bSym.startsWith(query) ? 1 : 0;
      
      return bStart - aStart;
    });
  }, [units, search]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredUnits]);

  // Handle arrow key navigation scrolling
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex, isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (filteredUnits.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredUnits.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredUnits.length) % filteredUnits.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredUnits[selectedIndex];
      if (selected) {
        onChange(selected.id);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full relative flex items-center justify-between bg-transparent font-medium text-neutral-600 dark:text-neutral-300 focus:outline-none pb-2 text-base cursor-pointer transition-colors uppercase tracking-wide truncate pr-8"
      >
        <span className="truncate">{activeUnit.name} ({activeUnit.symbol})</span>
        <ChevronDown className="absolute right-0 top-1 w-4 h-4 text-neutral-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:right-auto w-full md:max-w-md bg-white dark:bg-neutral-900 shadow-2xl rounded-t-3xl md:rounded-2xl z-[101] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[80vh]"
            >
              {/* Mobile drag handle indicator */}
              <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-12 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
              </div>
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-neutral-400" />
                <input
                  aria-label="Search units"
                  ref= {inputRef}
                  type="text"
                  placeholder="Search units..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-none focus:outline-none text-neutral-900 dark:text-white"
                />
                <button aria-label="Close" onClick={() => setIsOpen(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 flex-1" ref={scrollContainerRef}>
                {!search.trim() && popularUnits.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">Popular Units</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {popularUnits.map((u) => (
                        <button
                          key={"pop-" + u.id}
                          onClick={() => { onChange(u.id); setIsOpen(false); }}
                          className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${value === u.id ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}`}
                        >
                          {u.name} <span className="text-neutral-400 ml-1">({u.symbol})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">All Units</h3>
                  <div className="flex flex-col">
                    {filteredUnits.length === 0 ? (
                      <p className="text-sm text-neutral-500 text-center py-4">No units found.</p>
                    ) : (
                      filteredUnits.map((u, idx) => (
                        <button
                          key={u.id}
                          data-index={idx}
                          onClick={() => { onChange(u.id); setIsOpen(false); }}
                          className={`text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between ${
                            value === u.id 
                              ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' 
                              : selectedIndex === idx
                                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <span>{u.name}</span>
                          <span className={`font-mono ${value === u.id ? 'text-blue-500/70' : 'text-neutral-400'}`}>{u.symbol}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
