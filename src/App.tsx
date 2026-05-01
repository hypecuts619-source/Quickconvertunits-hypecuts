import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { getSuggestions, convert, categories } from "./lib/units";
import { categorySeoContent } from "./lib/seoContent";
import { trackConversionEvent, trackFunnelStep } from "./lib/analytics";
import {
  ArrowRightLeft,
  Sun,
  Moon,
  Search,
  Settings,
  ChevronDown,
  Copy,
  Check,
  X,
  RefreshCw,
  Palette,
  Trash2,
  History,
  TrendingUp,
  Calculator,
  Grid,
  ArrowRight,
  Share2,
  Star,
  Table,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const POPULAR = [
  { label: "Kilometers → Miles", cat: "length", fu: "kilometer", tu: "mile" },
  { label: "Miles → Kilometers", cat: "length", fu: "mile", tu: "kilometer" },
  { label: "Kilograms → Pounds", cat: "weight", fu: "kilogram", tu: "pound" },
  { label: "Pounds → Kilograms", cat: "weight", fu: "pound", tu: "kilogram" },
  {
    label: "Celsius → Fahrenheit",
    cat: "temperature",
    fu: "celsius",
    tu: "fahrenheit",
  },
  {
    label: "Fahrenheit → Celsius",
    cat: "temperature",
    fu: "fahrenheit",
    tu: "celsius",
  },
  { label: "Meters → Feet", cat: "length", fu: "meter", tu: "foot" },
  { label: "Feet → Centimeters", cat: "length", fu: "foot", tu: "centimeter" },
  {
    label: "Inches → Centimeters",
    cat: "length",
    fu: "inch",
    tu: "centimeter",
  },
  { label: "Liters → Gallons", cat: "volume", fu: "liter", tu: "us_gallon" },
  {
    label: "Gigabytes → Megabytes",
    cat: "data",
    fu: "gigabyte",
    tu: "megabyte",
  },
];

const FORMULAS = [
  {
    title: "Celsius → Fahrenheit",
    code: "°F = (°C × 9/5) + 32",
    note: "Water boils at 100°C / 212°F",
    link: { cat: "temperature", from: "celsius", to: "fahrenheit" },
  },
  {
    title: "Fahrenheit → Celsius",
    code: "°C = (°F − 32) × 5/9",
    note: "Water freezes at 0°C / 32°F",
    link: { cat: "temperature", from: "fahrenheit", to: "celsius" },
  },
  {
    title: "Kilometers → Miles",
    code: "mi = km × 0.621371",
    note: "1 km ≈ 0.621 miles",
    link: { cat: "length", from: "kilometer", to: "mile" },
  },
  {
    title: "Miles → Kilometers",
    code: "km = mi × 1.60934",
    note: "1 mile ≈ 1.609 km",
    link: { cat: "length", from: "mile", to: "kilometer" },
  },
  {
    title: "Kilograms → Pounds",
    code: "lb = kg × 2.20462",
    note: "1 kg ≈ 2.205 pounds",
    link: { cat: "mass", from: "kilogram", to: "pound" },
  },
  {
    title: "Meters → Feet",
    code: "ft = m × 3.28084",
    note: "1 meter ≈ 3.281 feet",
    link: { cat: "length", from: "meter", to: "foot" },
  },
  {
    title: "Hectares → Acres",
    code: "ac = ha × 2.47105",
    note: "1 hectare ≈ 2.471 acres",
    link: { cat: "area", from: "hectare", to: "acre" },
  },
  {
    title: "Liters → US Gallons",
    code: "gal = L × 0.264172",
    note: "1 liter ≈ 0.264 gallons",
    link: { cat: "volume", from: "liter", to: "us_gallon" },
  },
];

interface HistoryItem {
  fv: string;
  fu: string;
  tv: string;
  tu: string;
  cat: string;
  timestamp: string;
}
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const themes = ["blue", "rose", "emerald", "violet", "amber"];

const AdSlot = ({
  widthClass,
  heightClass,
  className,
  text,
  mobileText,
  adSlotId = "1234567890", // Placeholder AdSense slot ID
}: {
  widthClass: string;
  heightClass: string;
  className?: string;
  text: string;
  mobileText?: string;
  adSlotId?: string;
}) => {
  // Set to true to display real Google AdSense ads.
  // Make sure to add the AdSense script tag to index.html and update data-ad-client
  const [useRealAds] = useState(false);

  useEffect(() => {
    if (useRealAds) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error", err);
      }
    }
  }, [useRealAds]);

  return (
    <div className={`flex flex-col items-center overflow-hidden max-w-full ${className || ""}`}>
      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 font-medium">
        Advertisement
      </span>
      {useRealAds ? (
        <div className={`overflow-hidden flex justify-center ${widthClass} ${heightClass}`}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "100%" }}
            data-ad-client="ca-pub-0000000000000000" // Replace with your AdSense Publisher ID
            data-ad-slot={adSlotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      ) : (
        <div
          className={`flex flex-col text-center px-4 items-center justify-center bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-400 dark:text-neutral-600 text-xs font-medium border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden max-w-full ${widthClass} ${heightClass}`}
        >
          <span className="hidden md:inline">{text}</span>
          <span className="md:hidden">{mobileText || text}</span>
          <span className="text-[10px] opacity-70 mt-1">Configure in src/App.tsx</span>
        </div>
      )}
    </div>
  );
};

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#111111] border-t border-neutral-200 dark:border-neutral-800 z-[60] flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] text-center md:text-left">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        We use cookies to personalize content and ads, and to analyze our
        traffic. By using our site, you consent to our{" "}
        <Link
          to="/privacy-policy"
          className="underline hover:text-primary-600 dark:hover:text-primary-400"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <button
        onClick={() => {
          localStorage.setItem("cookie-consent", "true");
          setIsVisible(false);
        }}
        className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors whitespace-nowrap w-full md:w-auto"
      >
        Accept & close
      </button>
    </div>
  );
}

function PwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPromptReady, setIsPromptReady] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsPromptReady(true);
    });

    window.addEventListener('appinstalled', () => {
      // Clear prompt
      setIsPromptReady(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsPromptReady(false);
  };

  if (!isPromptReady) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-80 p-4 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 z-[60] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] text-center md:text-left flex flex-col items-center md:items-start transition-all">
      <div className="flex items-center gap-3 mb-3 shrink-0">
         <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
           <Download className="w-5 h-5 text-primary-600 dark:text-primary-400" />
         </div>
         <div>
           <h4 className="font-semibold text-neutral-900 dark:text-white text-sm">Install QuickConvert</h4>
           <p className="text-xs text-neutral-500 dark:text-neutral-400">Use offline anywhere</p>
         </div>
      </div>
      <div className="flex w-full gap-2">
        <button
          onClick={() => setIsPromptReady(false)}
          className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          Later
        </button>
        <button
          onClick={handleInstallClick}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Install App
        </button>
      </div>
    </div>
  );
}

function ConversionChart({
  categoryId,
  valFrom,
  unitFrom,
  theme,
}: {
  categoryId: string;
  valFrom: string;
  unitFrom: string;
  theme: string;
}) {
  if (categoryId !== "energy" && categoryId !== "data_storage") return null;
  const numVal = parseFloat(valFrom);
  if (isNaN(numVal) || numVal <= 0) return null; // Log scale requires positive values

  const activeCat = categories.find((c) => c.id === categoryId);
  if (!activeCat) return null;

  const data = activeCat.units.map((u) => {
    let rawVal = convert(numVal, unitFrom, u.id, categoryId);
    return {
      name: u.symbol,
      fullName: u.name,
      value: rawVal,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const formatted =
        val >= 1000 || val < 0.01 ? val.toExponential(4) : val.toPrecision(4);
      return (
        <div className="bg-white dark:bg-neutral-800 p-3 shadow-lg rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            {payload[0].payload.fullName}
          </p>
          <p className="text-primary-600 dark:text-primary-400 mt-1">
            {formatted} {label}
          </p>
        </div>
      );
    }
    return null;
  };

  // Try to use CSS variable for fill color if supported by Recharts, or fallback
  const getThemeColor = () => {
    switch (theme) {
      case "rose":
        return "#e11d48";
      case "emerald":
        return "#10b981";
      case "violet":
        return "#8b5cf6";
      case "amber":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-neutral-800 py-6 px-4 md:px-6 rounded-3xl shadow-xl shadow-neutral-200/50 dark:shadow-none border border-neutral-100 dark:border-neutral-700 w-full h-[350px]">
      <h3 className="text-center font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
        Equivalent {activeCat.name} (Logarithmic Scale)
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            dy={10}
            interval="preserveStartEnd"
            tickFormatter={(val) =>
              val.length > 6 ? val.substring(0, 5) + ".." : val
            }
          />
          <YAxis scale="log" domain={["auto", "auto"]} hide />
          <Tooltip
            cursor={{ fill: "rgba(156, 163, 175, 0.1)" }}
            content={<CustomTooltip />}
          />
          <Bar
            dataKey="value"
            fill={getThemeColor()}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function App() {
  const { conversion } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("dark-mode") === "true",
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme-color") || "blue",
  );
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Initialize state from URL params if present
  const [category, setCategory] = useState(() => {
    if (conversion) {
      const parts = conversion.split("-to-");
      if (parts.length === 2) {
        for (const cat of categories) {
          if (cat.units.some(u => u.id === parts[0].toLowerCase()) && cat.units.some(u => u.id === parts[1].toLowerCase())) {
            return cat.id;
          }
        }
      }
    }
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || categories[0].id;
  });
  const [unitFrom, setUnitFrom] = useState(() => {
    if (conversion) {
      const parts = conversion.split("-to-");
      if (parts.length === 2) {
        return parts[0].toLowerCase();
      }
    }
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category") || categories[0].id;
    const activeCat = categories.find((c) => c.id === cat) || categories[0];
    return params.get("from") || activeCat.units[0].id;
  });
  const [unitTo, setUnitTo] = useState(() => {
    if (conversion) {
      const parts = conversion.split("-to-");
      if (parts.length === 2) {
        return parts[1].toLowerCase();
      }
    }
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category") || categories[0].id;
    const activeCat = categories.find((c) => c.id === cat) || categories[0];
    return params.get("to") || activeCat.units[1].id;
  });

  const [valFrom, setValFrom] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const val = params.get("val");
    return val !== null ? val : "1";
  });
  const [valTo, setValTo] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ratesUpdated, setRatesUpdated] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showBulk, setShowBulk] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [compareUnits, setCompareUnits] = useState<string[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("qcu_hist") || "[]");
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<
    { cat: string; fu: string; tu: string; label: string }[]
  >(() => {
    try {
      return JSON.parse(localStorage.getItem("qcu_favs") || "[]");
    } catch {
      return [];
    }
  });

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dark-mode", darkMode.toString());
  }, [darkMode]);

  // Set theme color
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme-color", theme);
  }, [theme]);

  const handleRefreshRates = async () => {
    setIsRefreshing(true);
    try {
      const { updateCurrencyRates } = await import("./lib/units");
      const success = await updateCurrencyRates();
      if (success) {
        setRatesUpdated((prev) => prev + 1);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch currency rates and track funnel step
  useEffect(() => {
    trackFunnelStep(`category_selected_${category}`);
    if (category === "currency") {
      handleRefreshRates();
    }
  }, [category]);

  // Handle conversion forward
  useEffect(() => {
    if (valFrom === "") {
      setValTo("");
      return;
    }
    const num = parseFloat(valFrom);
    if (!isNaN(num)) {
      const res = convert(num, unitFrom, unitTo, category);
      // Format nicely to avoid floating point issues like 0.30000000000000004
      setValTo(
        Number.isInteger(res)
          ? res.toString()
          : parseFloat(res.toFixed(6)).toString(),
      );
    }
  }, [valFrom, unitFrom, unitTo, category, ratesUpdated]);

  useEffect(() => {
    if (valFrom && valTo && valFrom !== "0" && valTo !== "0") {
      const timer = setTimeout(() => {
        const catObj = categories.find((c) => c.id === category);
        const fObj = catObj?.units.find((u) => u.id === unitFrom);
        const tObj = catObj?.units.find((u) => u.id === unitTo);
        if (!catObj || !fObj || !tObj) return;

        const newEntry = {
          fv: valFrom,
          fu: fObj.symbol,
          tv: parseFloat(valTo).toFixed(4), // store shortened to fit
          tu: tObj.symbol,
          cat: catObj.name,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        trackConversionEvent(category, unitFrom, unitTo, valFrom);

        setHistoryItems((prev) => {
          const filtered = prev.filter(
            (h) =>
              !(
                h.fu === newEntry.fu &&
                h.tu === newEntry.tu &&
                h.cat === newEntry.cat
              ),
          );
          const updated = [newEntry, ...filtered].slice(0, 15);
          localStorage.setItem("qcu_hist", JSON.stringify(updated));
          return updated;
        });
      }, 1500); // 1.5s after they stop typing
      return () => clearTimeout(timer);
    }
  }, [valFrom, valTo, unitFrom, unitTo, category]);

  // Handle reverse conversion
  const handleValToChange = (v: string) => {
    setValTo(v);
    if (v === "") {
      setValFrom("");
      return;
    }
    const num = parseFloat(v);
    if (!isNaN(num)) {
      const res = convert(num, unitTo, unitFrom, category);
      setValFrom(
        Number.isInteger(res)
          ? res.toString()
          : parseFloat(res.toFixed(6)).toString(),
      );
    }
  };

  const handleSwap = () => {
    const tempUnit = unitFrom;
    setUnitFrom(unitTo);
    setUnitTo(tempUnit);

    // We also swap values conceptually, but let forward conversion auto-calculate based on valFrom
  };

  const handleCopy = () => {
    if (valTo) {
      navigator.clipboard.writeText(valTo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (valFrom && valTo) {
      const activeCat = categories.find((c) => c.id === category);
      const fUnit = activeCat?.units.find((u) => u.id === unitFrom);
      const tUnit = activeCat?.units.find((u) => u.id === unitTo);

      const textToShare = `${valFrom} ${fUnit?.symbol} = ${valTo} ${tUnit?.symbol}. Convert instantly with QuickConvertUnits!`;

      if (navigator.share) {
        navigator
          .share({
            title: "QuickConvertUnits Result",
            text: textToShare,
            url: window.location.href,
          })
          .catch((error) => console.log("Error sharing:", error));
      } else {
        navigator.clipboard.writeText(textToShare + " " + window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleClear = () => {
    setValFrom("");
    setValTo("");
  };

  const handleCategoryChange = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      setCategory(cat.id);
      setUnitFrom(cat.units[0].id);
      setUnitTo(cat.units[1].id);
    }
  };

  const suggestions = useMemo(() => getSuggestions(searchQuery), [searchQuery]);

  const selectSuggestion = (sug: any) => {
    handleCategoryChange(sug.categoryId);
    setUnitFrom(sug.fromId);
    setUnitTo(sug.toId);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  // Keyboard shortcuts (Ctrl+K to search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeCategory = categories.find((c) => c.id === category)!;
  const activeFromUnit = activeCategory.units.find((u) => u.id === unitFrom);
  const activeToUnit = activeCategory.units.find((u) => u.id === unitTo);

  const isFavorited = useMemo(() => {
    return favorites.some(
      (f) => f.cat === category && f.fu === unitFrom && f.tu === unitTo,
    );
  }, [favorites, category, unitFrom, unitTo]);

  const toggleFavorite = () => {
    setFavorites((prev) => {
      let updated;
      if (isFavorited) {
        updated = prev.filter(
          (f) => !(f.cat === category && f.fu === unitFrom && f.tu === unitTo),
        );
      } else {
        const label = `${activeFromUnit?.name} → ${activeToUnit?.name}`;
        updated = [{ cat: category, fu: unitFrom, tu: unitTo, label }, ...prev];
      }
      localStorage.setItem("qcu_favs", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (activeFromUnit && activeToUnit) {
      const isHomepage = location.pathname === "/" && !location.search.includes("category=");
      const isCategoryPage = location.pathname === "/" && location.search.includes("category=");
      const isSpecificConverter = location.pathname !== "/";

      let titleStr = "";
      let metaDescStr = "";
      let canonicalUrlStr = "";
      let ogTitleStr = "";

      if (isHomepage) {
         titleStr = "Quick Unit Converter | Free Online Tool";
         metaDescStr = "Instantly convert units like meters to feet, kg to lbs, or cups to grams. Fast, accurate, no ads interrupting. Try now—no sign-up needed.";
         canonicalUrlStr = "https://quickconvertunits.com/";
         ogTitleStr = titleStr;
      } else if (isCategoryPage) {
         const catName = activeCategory.name;
         const topUnits = `${activeCategory.units[0].name}s to ${activeCategory.units[1].name}s, ${activeCategory.units[2]?.name || ''}s`.replace(/ss/g, 's').replace(/, s/g, '');
         const allTopUnits = activeCategory.units.slice(0, 5).map(u => u.name.toLowerCase() + (u.name.endsWith('s') ? '' : 's')).join(", ");
         titleStr = `${catName} Converter: ${topUnits} & More`;
         metaDescStr = `Free ${catName.toLowerCase()} unit converter for ${allTopUnits}. Precise calculations with real-time results. Convert now in seconds.`;
         canonicalUrlStr = `https://quickconvertunits.com/?category=${category}`;
         ogTitleStr = titleStr;
      } else {
         const valPrefix = valFrom && valFrom !== "1" && valFrom !== "0" ? `${valFrom} ` : "";
         titleStr = `${activeFromUnit.symbol.toUpperCase()} to ${activeToUnit.symbol.toUpperCase()} Converter | ${valPrefix}${activeFromUnit.name} to ${activeToUnit.name} Fast`;
         metaDescStr = `Convert ${activeFromUnit.name.toLowerCase()} to ${activeToUnit.name.toLowerCase()} instantly and accurately. Enter value, select units—get results to 10 decimals. Perfect for cooking, fitness, shipping.`;
         canonicalUrlStr = `https://quickconvertunits.com/${unitFrom}-to-${unitTo}`;
         ogTitleStr = `${valPrefix}${activeFromUnit.name} to ${activeToUnit.name} Conversion Calculator - QuickConvert`;
         
         // Only navigate cleanly if we are already on a converter page OR if it's the first time landing on a specific URL
         // This syncs the URL with the values e.g. adding ?val= without redirecting homepage visitors.
         navigate(`/${unitFrom}-to-${unitTo}${valFrom && valFrom !== "1" ? `?val=${valFrom}` : ""}`, { replace: true });
      }

      document.title = titleStr;

      // SEO Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", metaDescStr);

      // SEO Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalUrlStr);

      // SEO Open Graph / Twitter
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute("content", ogTitleStr);

      // SEO Structured Data (JSON-LD)
      let script = document.querySelector("#seo-schema");
      if (!script) {
        script = document.createElement("script");
        script.id = "seo-schema";
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      const schema = [
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: `${titleStr} - QuickConvert`,
          applicationCategory: "UtilityApplications",
          operatingSystem: "All",
          description: `Instantly convert ${valFrom || "1"} ${activeFromUnit.name} to ${activeToUnit.name}.`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@context": "https://schema.org",
          "@type": "Action",
          name: `Converting ${activeFromUnit.name} to ${activeToUnit.name}`,
          fromUnit: activeFromUnit.name,
          toUnit: activeToUnit.name,
          value: valFrom || "1"
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `How do I convert ${activeFromUnit.name} to ${activeToUnit.name}?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `To convert ${activeFromUnit.name} to ${activeToUnit.name}, multiply or divide the value depending on the conversion factor. Our free calculator handles this automatically.`,
              },
            },
            {
              "@type": "Question",
              name: `What is a ${activeFromUnit.name}?`,
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  activeFromUnit.description ||
                  `A ${activeFromUnit.name} is a unit of ${activeCategory.name.toLowerCase()}.`,
              },
            },
          ],
        },
      ];
      script.textContent = JSON.stringify(schema);
    }
  }, [
    category,
    unitFrom,
    unitTo,
    activeFromUnit,
    activeToUnit,
    activeCategory,
    valFrom,
  ]);

  useEffect(() => {
    setCompareUnits((prev) => {
      const activeCat = categories.find((c) => c.id === category);
      if (!activeCat) return prev;
      const valid = prev.filter(p => activeCat.units.some(u => u.id === p));
      if (valid.length < 2) {
         return Array.from(new Set([unitFrom, unitTo, ...valid]));
      }
      return valid;
    });
  }, [category, unitFrom, unitTo]);

  return (
    <div
      className={`min-h-screen text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-200 relative overflow-hidden`}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/5 dark:bg-primary-500/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[60%] rounded-full bg-primary-500/5 dark:bg-primary-500/10 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a 
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary-600 dark:text-primary-500 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <img
              src="/favicon.svg"
              alt="QuickConvert Logo"
              className="w-6 h-6"
            />
            <span>QuickConvert</span>
          </a>

          <div className="flex items-center gap-4 flex-1 justify-end">
            {/* Desktop Search */}
            <div className="relative hidden md:block max-w-sm w-full">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="e.g. meters to feet"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  className="w-full pl-9 pr-14 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 text-sm transition-shadow"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                  <span className="text-[10px] font-medium text-neutral-400 px-1.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50">⌘K</span>
                </div>
              </div>
              <AnimatePresence>
                {isSearchFocused && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-11 left-0 right-0 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden"
                  >
                    {suggestions.map((sug, i) => (
                      <button
                        key={i}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                        onClick={() => selectSuggestion(sug)}
                      >
                        {sug.text}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                onBlur={() => setTimeout(() => setShowThemeMenu(false), 200)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <Palette className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute right-0 top-12 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-neutral-100 dark:border-neutral-800 overflow-hidden z-50 flex p-1.5 gap-1"
                  >
                    {themes.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${theme === t ? "border-primary-500 scale-110" : "border-transparent hover:scale-105"}`}
                        style={{
                          backgroundColor:
                            t === "blue"
                              ? "#3b82f6"
                              : t === "rose"
                                ? "#f43f5e"
                                : t === "emerald"
                                  ? "#10b981"
                                  : t === "violet"
                                    ? "#8b5cf6"
                                    : t === "amber"
                                      ? "#f59e0b"
                                      : "#3b82f6",
                        }}
                        aria-label={`Select ${t} theme`}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 relative z-10">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search conversions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
          />
        </div>
        <AnimatePresence>
          {isSearchFocused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute top-14 left-4 right-4 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden z-20"
            >
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                  onClick={() => selectSuggestion(sug)}
                >
                  {sug.text}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Layout containing Ad zones */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col lg:flex-row gap-8 pb-24 md:pb-12 relative z-10">
        {/* Left Column (Main App + Content) */}
        <div className="flex-1 max-w-3xl mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-neutral-900 dark:text-white">
              Convert {activeFromUnit?.name} to {activeToUnit?.name}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg font-light">
              Fast, accurate, and completely free {category.replace("_", " ")} conversion tool.
            </p>
          </div>

          {/* Categories (Horizontal Scroll on Mobile) */}
          <div className="flex overflow-x-auto no-scrollbar gap-3 mb-12 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center items-center">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryChange(c.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50 flex-shrink-0 ${
                  category === c.id
                    ? "bg-primary-500 text-white shadow-md transform scale-105 border border-primary-600 dark:border-primary-400"
                    : "bg-white dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#222] border border-neutral-200/80 dark:border-neutral-800/80 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Converter Card */}
          <motion.div
            layout
            className="bg-white dark:bg-[#111111] p-6 md:p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 relative z-10 overflow-hidden"
          >
            {/* Subtle light effect for dark mode inside card */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] pointer-events-none hidden dark:block" />

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center relative">
              {/* FROM */}
              <div className="flex-1 w-full bg-neutral-50/50 dark:bg-[#161616] rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/10 dark:focus-within:ring-primary-400/10 transition-all relative group">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-3 block">
                  From
                </label>
                <div className="relative">
                  <select
                    value={unitFrom}
                    onChange={(e) => setUnitFrom(e.target.value)}
                    className="w-full appearance-none bg-transparent font-medium text-neutral-600 dark:text-neutral-300 focus:outline-none pb-2 text-base cursor-pointer transition-colors uppercase tracking-wide truncate pr-8"
                  >
                    {activeCategory.units.map((u) => (
                      <option
                        key={u.id}
                        value={u.id}
                        className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800"
                      >
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
                <div className="relative flex items-center mt-3">
                  <input
                    type="text"
                    value={valFrom}
                    onChange={(e) => {
                      const v = e.target.value.replace(/,/g, ".");
                      if (v !== "" && !/^-?\d*\.?\d*$/.test(v)) {
                         const toast = document.getElementById('error-toast');
                         if(toast) {
                           toast.textContent = "Invalid: use only numbers (e.g., 10.5)";
                           toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                           setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none'), 3000);
                         }
                         return;
                      }
                      setValFrom(v);
                    }}
                    autoFocus
                    className="w-full bg-transparent text-4xl md:text-5xl lg:text-6xl font-light focus:outline-none text-neutral-900 dark:text-white pr-10 tracking-tight"
                    placeholder="0"
                    inputMode="decimal"
                  />
                  {valFrom && (
                    <button
                      onClick={handleClear}
                      className="absolute right-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors opacity-0 group-focus-within:opacity-100 hover:opacity-100 focus:opacity-100 p-2"
                      aria-label="Clear value"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* SWAP BUTTON */}
              <button
                onClick={handleSwap}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1e1e1e] text-neutral-500 dark:text-neutral-400 p-3 md:p-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-[#252525] hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 group"
                aria-label="Swap units"
              >
                <ArrowRightLeft className="w-5 h-5 pointer-events-none group-hover:rotate-180 transition-transform duration-500" />
              </button>

              {/* TO */}
              <div className="flex-1 w-full bg-neutral-50/50 dark:bg-[#161616] rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/10 dark:focus-within:ring-primary-400/10 transition-all relative group">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-3 block">
                  To
                </label>
                <div className="relative">
                  <select
                    value={unitTo}
                    onChange={(e) => setUnitTo(e.target.value)}
                    className="w-full appearance-none bg-transparent font-medium text-neutral-600 dark:text-neutral-300 focus:outline-none pb-2 text-base cursor-pointer transition-colors uppercase tracking-wide truncate pr-8"
                  >
                    {activeCategory.units.map((u) => (
                      <option
                        key={u.id}
                        value={u.id}
                        className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800"
                      >
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
                <div className="relative flex items-center mt-3">
                  <input
                    type="text"
                    value={valTo}
                    onChange={(e) => {
                      const v = e.target.value.replace(/,/g, ".");
                      if (v !== "" && !/^-?\d*\.?\d*$/.test(v)) {
                         const toast = document.getElementById('error-toast');
                         if(toast) {
                           toast.textContent = "Invalid: use only numbers (e.g., 10.5)";
                           toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                           setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none'), 3000);
                         }
                         return;
                      }
                      handleValToChange(v);
                    }}
                    className="w-full bg-transparent text-4xl md:text-5xl lg:text-6xl font-light focus:outline-none text-neutral-900 dark:text-white pr-10 tracking-tight"
                    placeholder="0"
                    inputMode="decimal"
                  />
                  {valTo && (
                    <button
                      onClick={handleCopy}
                      className="absolute right-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-2"
                      aria-label="Copy result"
                    >
                      {copied ? (
                        <Check className="w-6 h-6 text-green-500" />
                      ) : (
                        <Copy className="w-6 h-6 opacity-0 group-focus-within:opacity-100 hover:opacity-100 focus:opacity-100" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Info text */}
            <div className="mt-6 flex flex-col items-center justify-center gap-2 text-sm text-neutral-400 dark:text-neutral-500">
              {valFrom && valTo && (
                <p>
                  1 {activeFromUnit?.symbol} ={" "}
                  {parseFloat(
                    convert(1, unitFrom, unitTo, category).toFixed(6),
                  )}{" "}
                  {activeToUnit?.symbol}
                </p>
              )}
              {category === "currency" && (
                <button
                  onClick={handleRefreshRates}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Updating rates..." : "Fetch Real-Time Rates"}
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Copy className="w-4 h-4" />{" "}
                {copied ? "Copied!" : "Copy Result"}
              </button>
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isFavorited ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"}`}
              >
                <Star
                  className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
                />{" "}
                {isFavorited ? "Saved" : "Save"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button
                onClick={() => setShowBulk(!showBulk)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${showBulk ? "bg-primary-500/10 text-primary-600 dark:text-primary-400" : "bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"}`}
              >
                <Grid className="w-4 h-4" />{" "}
                {showBulk ? "Hide Bulk Convert" : "Bulk Convert"}
              </button>
              <button
                onClick={() => setShowCompare(!showCompare)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${showCompare ? "bg-primary-500/10 text-primary-600 dark:text-primary-400" : "bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"}`}
              >
                <Table className="w-4 h-4" />{" "}
                {showCompare ? "Hide Compare" : "Compare"}
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </div>

            <AnimatePresence>
              {showBulk && valFrom && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-neutral-50 dark:bg-[#161616] border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Grid className="w-5 h-5 text-primary-500" />
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">
                        Bulk Conversion
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                      Converting{" "}
                      <strong className="text-neutral-800 dark:text-neutral-200">
                        {valFrom} {activeFromUnit?.name}
                      </strong>{" "}
                      to all {activeCategory.name.toLowerCase()} units.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {activeCategory.units.map((u) => {
                        if (u.id === unitFrom) return null;
                        return (
                          <div
                            key={u.id}
                            className="bg-white dark:bg-[#1a1a1a] rounded-xl p-3 border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm shadow-neutral-200/20 dark:shadow-none hover:border-primary-200 dark:hover:border-primary-900/40 transition-colors cursor-pointer group"
                            onClick={() => setUnitTo(u.id)}
                          >
                            <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mb-1 group-hover:text-primary-500 transition-colors">
                              {u.name}
                            </div>
                            <div className="text-sm font-semibold font-mono text-neutral-800 dark:text-neutral-200 break-all">
                              {parseFloat(
                                convert(
                                  parseFloat(valFrom),
                                  unitFrom,
                                  u.id,
                                  category,
                                ).toFixed(6),
                              )}{" "}
                              {u.symbol}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showCompare && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-neutral-50 dark:bg-[#161616] border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Table className="w-5 h-5 text-primary-500" />
                        <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">
                          Compare Units Side-by-Side
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                      Select multiple units below to see how they compare to each other.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {activeCategory.units.map((u) => {
                        const isSelected = compareUnits.includes(u.id);
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              setCompareUnits((prev) =>
                                isSelected
                                  ? prev.filter((id) => id !== u.id)
                                  : [...prev, u.id],
                              );
                            }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${isSelected ? "bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20" : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-primary-500"}`}
                          >
                            {u.name}
                          </button>
                        );
                      })}
                    </div>

                    {compareUnits.length > 0 && (
                      <div className="overflow-x-auto border-x border-t border-neutral-200 dark:border-neutral-700 rounded-xl scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600 pb-2">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-neutral-100/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-300 font-medium border-b border-neutral-200 dark:border-neutral-700">
                            <tr>
                              <th className="p-3 border-r border-neutral-200 dark:border-neutral-700 font-medium w-32 sticky left-0 z-10 bg-neutral-100/90 dark:bg-neutral-800/90 backdrop-blur-sm">
                                1 Unit
                              </th>
                              {compareUnits.map((cu) => {
                                const unitInfo = activeCategory.units.find(
                                  (u) => u.id === cu,
                                );
                                return (
                                  <th
                                    key={cu}
                                    className="p-3 font-medium whitespace-nowrap min-w-[120px]"
                                  >
                                    {unitInfo?.name}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700 bg-white dark:bg-[#111]">
                            {compareUnits.map((rowUnit) => {
                              const rUnitInfo = activeCategory.units.find(
                                (u) => u.id === rowUnit,
                              );
                              return (
                                <tr
                                  key={rowUnit}
                                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors"
                                >
                                  <td className="p-3 border-r border-neutral-200 dark:border-neutral-700 font-medium whitespace-nowrap text-neutral-800 dark:text-neutral-200 sticky left-0 z-10 bg-white dark:bg-[#111]">
                                    {rUnitInfo?.name}
                                  </td>
                                  {compareUnits.map((colUnit) => {
                                    if (rowUnit === colUnit) {
                                      return (
                                        <td
                                          key={colUnit}
                                          className="p-3 text-neutral-400 dark:text-neutral-500 italic"
                                        >
                                          1
                                        </td>
                                      );
                                    }
                                    const rawVal = convert(
                                      1,
                                      rowUnit,
                                      colUnit,
                                      category,
                                    );
                                    const displayVal = Number.isInteger(rawVal)
                                      ? rawVal.toString()
                                      : parseFloat(
                                          rawVal.toPrecision(6),
                                        ).toString();
                                    return (
                                      <td
                                        key={colUnit}
                                        className="p-3 font-mono text-neutral-600 dark:text-neutral-400"
                                      >
                                        {displayVal}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Conversion Chart for Specific Categories */}
          <ConversionChart
            categoryId={category}
            valFrom={valFrom}
            unitFrom={unitFrom}
            theme={theme}
          />

          {/* AD: Below Result Ad */}
          <AdSlot
            className="mt-8"
            widthClass="w-full max-w-[728px]"
            heightClass="h-[100px]"
            text="Below Result Ad"
            mobileText="Below Result Ad"
          />

          {/* Trust Signals / User Reviews */}
          <div className="mt-16 mb-12 px-4 md:px-0">
            <div className="flex flex-col items-center text-center mb-8">
              <h3 className="text-3xl font-semibold tracking-tight mb-3">Trusted by Professionals</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg">Join thousands of users relying on our fast, accurate conversions everyday.</p>
              <div className="flex items-center justify-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />)}
              </div>
            </div>
            {/* Horizontal scrolling reviews container */}
            <div className="w-[100vw] relative left-[50%] -translate-x-1/2 overflow-hidden pb-8 pt-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
              <div className="flex gap-6 w-max animate-scroll-x hover:[animation-play-state:paused]">
                {[...[
                  { quote: "The fastest converter I've ever used. The live validation saves me so much time trying to figure out if I typed the right unit.", name: "Sarah K.", role: "Architect", rating: 5 },
                  { quote: "Finally, a converter that actually works offline on my phone. The PWA is a lifesaver when I'm out on a construction site with no signal.", name: "Mike T.", role: "Civil Engineer", rating: 5 },
                  { quote: "No confusing ads covering the buttons, straight to the point. The compare feature is exactly what I needed for my physics homework.", name: "Emily R.", role: "Student", rating: 5 },
                  { quote: "It’s so accurate and simple. I use it constantly for recipes when converting volumes and weights from global cooking sites.", name: "James L.", role: "Chef", rating: 5 },
                  { quote: "I love that when I share the URL with colleagues, it keeps the exact units we're talking about. Extremely useful for quick engineering chats.", name: "David P.", role: "Mechanical Engineer", rating: 5 },
                  { quote: "The dark mode is beautiful and doesn't hurt my eyes during late-night study sessions. A fantastic little conversion tool.", name: "Alicia C.", role: "Undergraduate", rating: 5 },
                  { quote: "It remembers what I used last so I don't have to keep selecting 'Kilometers to Miles' every single time I open the app.", name: "Robert J.", role: "Logistics Manager", rating: 5 },
                  { quote: "No fluff, just works. Extremely responsive and the UI is incredibly intuitive. The best unit converter I've found so far.", name: "Maria V.", role: "UX Designer", rating: 5 }
                ], ...[
                  { quote: "The fastest converter I've ever used. The live validation saves me so much time trying to figure out if I typed the right unit.", name: "Sarah K.", role: "Architect", rating: 5 },
                  { quote: "Finally, a converter that actually works offline on my phone. The PWA is a lifesaver when I'm out on a construction site with no signal.", name: "Mike T.", role: "Civil Engineer", rating: 5 },
                  { quote: "No confusing ads covering the buttons, straight to the point. The compare feature is exactly what I needed for my physics homework.", name: "Emily R.", role: "Student", rating: 5 },
                  { quote: "It’s so accurate and simple. I use it constantly for recipes when converting volumes and weights from global cooking sites.", name: "James L.", role: "Chef", rating: 5 },
                  { quote: "I love that when I share the URL with colleagues, it keeps the exact units we're talking about. Extremely useful for quick engineering chats.", name: "David P.", role: "Mechanical Engineer", rating: 5 },
                  { quote: "The dark mode is beautiful and doesn't hurt my eyes during late-night study sessions. A fantastic little conversion tool.", name: "Alicia C.", role: "Undergraduate", rating: 5 },
                  { quote: "It remembers what I used last so I don't have to keep selecting 'Kilometers to Miles' every single time I open the app.", name: "Robert J.", role: "Logistics Manager", rating: 5 },
                  { quote: "No fluff, just works. Extremely responsive and the UI is incredibly intuitive. The best unit converter I've found so far.", name: "Maria V.", role: "UX Designer", rating: 5 }
                ]].map((review, i) => (
                  <div key={i} className="shrink-0 w-[85vw] md:w-[350px] flex flex-col p-8 rounded-3xl bg-white dark:bg-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-neutral-100 dark:border-neutral-800 dark:shadow-none h-auto transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed font-light mb-6 flex-grow">"{review.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold uppercase text-sm border-2 border-white dark:border-neutral-800 shadow-sm">{review.name.charAt(0)}</div>
                      <div>
                        <div className="font-semibold text-sm text-neutral-900 dark:text-white leading-tight mb-0.5">{review.name}</div>
                        <div className="text-xs text-neutral-500 font-medium">{review.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <style>{`
              @keyframes bounce-short {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              .animate-bounce-short {
                animation: bounce-short 2s ease-in-out infinite;
              }
              @keyframes scroll-x {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-50% - 12px)); }
              }
              .animate-scroll-x {
                animation: scroll-x 40s linear infinite;
              }
            `}</style>
          </div>

          {/* SEO Content Sections with Popular & History */}
          <section className="mt-16 text-neutral-800 dark:text-neutral-200">
            {/* Popular & History Panels */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Favorites & Popular */}
              <div className="bg-white dark:bg-[#111111] rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-lg tracking-tight">
                    Saved & Popular
                  </h3>
                </div>
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {favorites.map((f, i) => (
                    <button
                      key={`fav-${i}`}
                      onClick={() => {
                        handleCategoryChange(f.cat);
                        setTimeout(() => {
                          setUnitFrom(f.fu);
                          setUnitTo(f.tu);
                          setValFrom("1");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }, 0);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors group text-left w-full border border-amber-100/50 dark:border-amber-900/20"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
                          {f.label}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:text-amber-600 transition-colors group-hover:translate-x-1" />
                    </button>
                  ))}
                  {favorites.length > 0 && (
                    <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-2" />
                  )}
                  {POPULAR.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        handleCategoryChange(p.cat);
                        setTimeout(() => {
                          setUnitFrom(p.fu);
                          setUnitTo(p.tu);
                          setValFrom("1");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }, 0);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors group text-left w-full"
                    >
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {p.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 transition-colors group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* History */}
              <div className="bg-white dark:bg-[#111111] rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary-500" />
                    <h3 className="font-semibold text-lg tracking-tight">
                      History
                    </h3>
                  </div>
                  {historyItems.length > 0 && (
                    <button
                      onClick={() => {
                        setHistoryItems([]);
                        localStorage.removeItem("qcu_hist");
                      }}
                      className="text-xs font-semibold text-neutral-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {historyItems.length === 0 ? (
                  <div className="h-[200px] flex flex-col items-center justify-center text-center">
                    <History className="w-12 h-12 text-neutral-200 dark:text-neutral-800 mb-3" />
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm font-light">
                      Your recent conversions
                      <br />
                      will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                    {historyItems.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors group cursor-pointer"
                        onClick={() => {
                          handleCategoryChange(
                            categories.find((c) => c.name === h.cat)?.id || "",
                          );
                          setTimeout(() => {
                            // we do not store accurate full id's since h.fu is the symbol.
                            // But actually we need to find the unit by symbol.
                            const catId = categories.find(
                              (c) => c.name === h.cat,
                            )?.id;
                            if (catId) {
                              const actualFu = categories
                                .find((c) => c.id === catId)
                                ?.units.find((u) => u.symbol === h.fu)?.id;
                              const actualTu = categories
                                .find((c) => c.id === catId)
                                ?.units.find((u) => u.symbol === h.tu)?.id;
                              if (actualFu) setUnitFrom(actualFu);
                              if (actualTu) setUnitTo(actualTu);
                              setValFrom(h.fv);
                            }
                          }, 0);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200">
                            {h.fv.length > 5
                              ? h.fv.substring(0, 5) + ".."
                              : h.fv}{" "}
                            {h.fu}
                          </span>
                          <ArrowRight className="w-3 h-3 text-neutral-400" />
                          <span className="text-sm font-mono font-semibold text-primary-600 dark:text-primary-400">
                            {h.tv.length > 5
                              ? h.tv.substring(0, 5) + ".."
                              : h.tv}{" "}
                            {h.tu}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-neutral-400">
                            {h.timestamp}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistoryItems((prev) => {
                                const updated = prev.filter(
                                  (_, idx) => idx !== i,
                                );
                                localStorage.setItem(
                                  "qcu_hist",
                                  JSON.stringify(updated),
                                );
                                return updated;
                              });
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AD: In-Content Ad */}
            <AdSlot
              className="my-10"
              widthClass="w-full max-w-[728px]"
              heightClass="h-[100px]"
              text="Native In-Content Ad"
              mobileText="Native In-Content Ad"
            />

            {/* Formulas Section */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-6 h-6 text-primary-500" />
                <h3 className="text-2xl font-semibold tracking-tight">
                  Quick Reference Formulas
                </h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FORMULAS.map((f, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800"
                  >
                    <div
                      className="font-semibold text-sm mb-3 tracking-tight text-neutral-800 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4 hover:decoration-primary-500 inline-block"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        handleCategoryChange(f.link.cat);
                        setTimeout(() => {
                          setUnitFrom(f.link.from);
                          setUnitTo(f.link.to);
                          setValFrom("1");
                        }, 0);
                      }}
                      title={`Go to ${f.title} converter`}
                    >
                      {f.title}
                    </div>
                    <div
                      className="bg-neutral-50 dark:bg-neutral-800/50 p-2.5 rounded-lg text-primary-600 dark:text-primary-400 font-mono text-sm font-medium mb-2 w-full truncate cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          f.code.split(" = ")[1] || f.code,
                        )
                      }
                      title="Click to copy right side of equation"
                    >
                      {f.code}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {f.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 tracking-tight">
              How to convert {activeFromUnit?.name} to {activeToUnit?.name}
            </h2>
            <p className="mb-6 leading-relaxed font-light text-neutral-600 dark:text-neutral-400">
              Our {activeCategory.name.toLowerCase()} converter makes it easy to
              convert between {activeFromUnit?.name.toLowerCase()} and{" "}
              {activeToUnit?.name.toLowerCase()}. Simply enter the value you
              want to convert in the input fields above, and the calculator will
              automatically update with the correct result.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-10">
              {activeFromUnit?.description && (
                <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none">
                  <h3 className="font-semibold text-lg mb-3 tracking-tight">
                    About {activeFromUnit.name}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-light">
                    {activeFromUnit.description}
                  </p>
                </div>
              )}
              {activeToUnit?.description &&
                activeToUnit.id !== activeFromUnit?.id && (
                  <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none">
                    <h3 className="font-semibold text-lg mb-3 tracking-tight">
                      About {activeToUnit.name}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-light">
                      {activeToUnit.description}
                    </p>
                  </div>
                )}
            </div>

            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none mb-10">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                Related {activeFromUnit?.name} Conversions
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {activeCategory.units.map((u) => {
                  if (u.id === unitFrom || u.id === unitTo) return null;
                  return (
                    <Link
                      key={`rel-${u.id}`}
                      to={`/?category=${category}&from=${unitFrom}&to=${u.id}`}
                      onClick={() => {
                        setUnitTo(u.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="block text-left p-3 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl transition-colors border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800 group"
                    >
                      <span className="font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {activeFromUnit?.name} to {u.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {categorySeoContent[activeCategory.id] && (
              <div 
                className="prose prose-neutral dark:prose-invert max-w-none mb-10
                           prose-headings:font-semibold prose-headings:tracking-tight 
                           prose-h2:text-2xl prose-h3:text-lg prose-p:font-light 
                           prose-p:leading-relaxed prose-p:text-neutral-600 
                           dark:prose-p:text-neutral-400"
                dangerouslySetInnerHTML={{ __html: categorySeoContent[activeCategory.id] }} 
              />
            )}

            <h3 className="text-xl font-semibold mb-3 tracking-tight">
              Understanding {activeFromUnit?.name} to {activeToUnit?.name} Conversions
            </h3>
            <p className="mb-4 leading-relaxed font-light text-neutral-600 dark:text-neutral-400">
              Converting <strong>{activeFromUnit?.name}</strong> to <strong>{activeToUnit?.name}</strong> is simple with our tool. 
              {activeFromUnit?.description ? ` ${activeFromUnit.description}` : ""}
              {activeToUnit?.description ? ` ${activeToUnit.description}` : ""}
            </p>
            <p className="mb-8 leading-relaxed font-light text-neutral-600 dark:text-neutral-400">
              Our <em>{activeCategory.name.toLowerCase()} calculator</em> supports a wide range of units including {activeCategory.units.slice(0, 4).map((u) => u.name.toLowerCase()).join(", ")} and more. QuickConvert provides fast, responsive calculations designed for mobile and desktop users.
              Want to learn more about the fascinating world of measurements? Check
              out our{" "}
              <Link
                to="/blog"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                measurement blog series
              </Link>{" "}
              for detailed guides and tips.
            </p>

            <h3 className="text-xl font-semibold mb-4 tracking-tight mt-10">
              Conversion Table: {activeFromUnit?.name} to {activeToUnit?.name}
            </h3>
            <div className="overflow-x-auto mb-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">{activeFromUnit?.name}</th>
                    <th className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">{activeToUnit?.name}</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600 dark:text-neutral-400 font-light">
                  {[1, 5, 10, 25, 50, 100, 500, 1000].map(val => (
                    <tr key={val} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/20">
                      <td className="py-3 px-4">{val} {activeFromUnit?.symbol}</td>
                      <td className="py-3 px-4">{convert(val, unitFrom, unitTo, category).toLocaleString(undefined, { maximumFractionDigits: 4 })} {activeToUnit?.symbol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mb-4 tracking-tight">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-lg mb-2 text-neutral-900 dark:text-white">
                  How do I convert {activeFromUnit?.name} to{" "}
                  {activeToUnit?.name}?
                </h4>
                <p className="font-light text-neutral-600 dark:text-neutral-400 text-sm">
                  To convert {activeFromUnit?.name} to {activeToUnit?.name}, you
                  simply multiply or divide the given value based on the
                  respective standard multiplier. Our tool handles this complex
                  math behind the scenes for an instant and accurate result.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-lg mb-2 text-neutral-900 dark:text-white">
                  What is a {activeFromUnit?.name}?
                </h4>
                <p className="font-light text-neutral-600 dark:text-neutral-400 text-sm">
                  {activeFromUnit?.description ||
                    `A ${activeFromUnit?.name} is a standardized unit of ${activeCategory.name.toLowerCase()} used commonly across various applications.`}
                </p>
              </div>
            </div>
          </section>

          {/* SEO Optional Content area placeholder */}
          <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <p className="mb-1">
                &copy; {new Date().getFullYear()} QuickConvert. Built for fast,
                reliable unit conversions.
              </p>
              <p className="opacity-80 font-medium">🛡️ Strictly Local: Your conversion data never leaves your device.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2">
              <Link
                to="/about"
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/blog"
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/terms"
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy-policy"
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Ads Desktop) */}
        <aside className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* AD: Right Sidebar Sticky 1 */}
            <AdSlot
              widthClass="w-[300px]"
              heightClass="h-[600px]"
              text="Sticky Sidebar Ad 1 (300x600)"
            />
            {/* AD: Right Sidebar Sticky 2 */}
            <AdSlot
              widthClass="w-[300px]"
              heightClass="h-[300px]"
              text="Sticky Sidebar Ad 2 (300x250)"
            />
          </div>
        </aside>
      </div>

      {/* AD: Mobile Sticky Bottom Ad */}
      <div className="fixed bottom-0 left-0 right-0 z-[40] bg-white dark:bg-[#111111] border-t border-neutral-200 dark:border-neutral-800 p-2 md:hidden flex justify-center pb-[env(safe-area-inset-bottom)]">
        <AdSlot
          widthClass="w-[320px]"
          heightClass="h-[50px]"
          text="Sticky Bottom Ad (320x50)"
          mobileText="Sticky Bottom Ad (320x50)"
        />
      </div>

      <CookieConsent />
      <PwaPrompt />
      
      {/* Error Toast */}
      <div id="error-toast" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-red-500 text-white rounded-full font-medium text-sm shadow-xl opacity-0 translate-y-4 pointer-events-none transition-all duration-300">
        Error message
      </div>
    </div>
  );
}
