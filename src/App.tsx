import { useState, useEffect, useMemo, useRef, lazy, Suspense } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { getSuggestions, convert, categories, formatNumber, getSEOUrlPath, getUnitIdsFromPath, updateCurrencyRates } from "./lib/units";
import { categorySeoContent } from "./lib/seoContent";
import { customSeoData } from "./lib/customSeoData";
import { trackConversionEvent, trackFunnelStep, trackPageView } from "./lib/analytics";
import { SeoContent } from "./components/SeoContent";
import { LanguageSelector } from "./components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { PopularConversions, POPULAR_CONVERSIONS } from "./components/PopularConversions";
import { TimeZoneConverter } from "./components/TimeZoneConverter";
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
import { UnitSelector } from "./components/UnitSelector";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "motion/react";

const ConversionChart = lazy(() => import("./components/ConversionChart"));

const POPULAR = [
  { label: "kg to lbs", cat: "weight", fu: "kilogram", tu: "pound" },
  { label: "inches to cm", cat: "length", fu: "inch", tu: "centimeter" },
  { label: "Time Zone Converter", cat: "time_zone", fu: "time_zone", tu: "time_zone" },
  { label: "cm to inches", cat: "length", fu: "centimeter", tu: "inch" },
  { label: "lbs to kg", cat: "weight", fu: "pound", tu: "kilogram" },
  { label: "feet to meters", cat: "length", fu: "foot", tu: "meter" },
  { label: "miles to km", cat: "length", fu: "mile", tu: "kilometer" },
  { label: "mm to inches", cat: "length", fu: "millimeter", tu: "inch" },
  { label: "Celsius to Fahrenheit", cat: "temperature", fu: "celsius", tu: "fahrenheit" },
  { label: "Fahrenheit to Celsius", cat: "temperature", fu: "fahrenheit", tu: "celsius" },
  { label: "Liters to Gallons", cat: "volume", fu: "liter", tu: "us_gallon" },
  { label: "km/h to mph", cat: "speed", fu: "kilometer_per_hour", tu: "mile_per_hour" },
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
    link: { cat: "weight", from: "kilogram", to: "pound" },
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

  const extractPx = (cls: string) => {
    const match = cls.match(/\[(\d+px)\]/);
    return match ? match[1] : undefined;
  };
  
  const minHeight = extractPx(heightClass);
  const minWidth = extractPx(widthClass);

  return (
    <div className={`flex flex-col items-center overflow-hidden max-w-full ${className || ""}`} style={{ minHeight }}>
      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 font-medium">
        Advertisement
      </span>
      {useRealAds ? (
        <div className={`overflow-hidden flex justify-center ${widthClass} ${heightClass}`} style={{ minHeight, minWidth }}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "100%", minHeight, minWidth }}
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
  const { t } = useTranslation();

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
           <h4 className="font-semibold text-neutral-900 dark:text-white text-sm">{t("installApp", "Install QuickConvert")}</h4>
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



// SEO functions have been moved to src/lib/units.ts

export default function App() {
  const { t, i18n } = useTranslation();
  const { conversion } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track analytics
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  // Sync state with URL params
  useEffect(() => {
    if (conversion) {
      if (conversion === "time-zone-converter") {
        setCategory("time_zone");
        return;
      }
      if (conversion.endsWith("-converter")) {
        const potentialCat = conversion.replace("-converter", "").replace(/-/g, "_");
        const foundCat = categories.find(c => c.id === potentialCat);
        if (foundCat) {
          setCategory(foundCat.id);
          setUnitFrom(foundCat.units[0]?.id || "");
          setUnitTo(foundCat.units[1]?.id || foundCat.units[0]?.id || "");
          return;
        }
      }
      const parts = getUnitIdsFromPath(conversion);
      if (parts.length === 2) {
        for (const cat of categories) {
          const u1 = cat.units.find(u => u.id === parts[0].toLowerCase());
          const u2 = cat.units.find(u => u.id === parts[1].toLowerCase());
          if (u1 && u2) {
            setCategory(cat.id);
            setUnitFrom(u1.id);
            setUnitTo(u2.id);
            return;
          }
        }
      }
    }
  }, [conversion]);

  // RTL Support check
  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n, i18n.language]);

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
      if (conversion === "time-zone-converter") return "time_zone";
      if (conversion.endsWith("-converter")) {
        const potentialCat = conversion.replace("-converter", "").replace(/-/g, "_");
        if (categories.some(c => c.id === potentialCat)) {
          return potentialCat;
        }
      }
      const parts = getUnitIdsFromPath(conversion);
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
      if (conversion.endsWith("-converter") && conversion !== "time-zone-converter") {
         const potentialCat = conversion.replace("-converter", "").replace(/-/g, "_");
         const acat = categories.find(c => c.id === potentialCat);
         if (acat) return acat.units[0]?.id || "";
      }
      const parts = getUnitIdsFromPath(conversion);
      if (parts.length === 2) {
        return parts[0].toLowerCase();
      }
    }
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category") || categories[0].id;
    const activeCat = categories.find((c) => c.id === cat) || categories[0];
    return params.get("from") || activeCat.units[0]?.id || "";
  });
  const [unitTo, setUnitTo] = useState(() => {
    if (conversion) {
      if (conversion.endsWith("-converter") && conversion !== "time-zone-converter") {
         const potentialCat = conversion.replace("-converter", "").replace(/-/g, "_");
         const acat = categories.find(c => c.id === potentialCat);
         if (acat) return acat.units[1]?.id || acat.units[0]?.id || "";
      }
      const parts = getUnitIdsFromPath(conversion);
      if (parts.length === 2) {
        return parts[1].toLowerCase();
      }
    }
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category") || categories[0].id;
    const activeCat = categories.find((c) => c.id === cat) || categories[0];
    return params.get("to") || activeCat.units[1]?.id || activeCat.units[0]?.id || "";
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

  // Offline status indicator
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleRefreshRates = async () => {
    setIsRefreshing(true);
    try {
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
    if (valFrom === "" || valFrom === "-" || valFrom === ".") {
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
    } else {
      setValTo("");
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
          // Remove exact duplicates (same from-unit, to-unit, and from-value)
          const filtered = prev.filter(
            (h) =>
              !(
                h.fu === newEntry.fu &&
                h.tu === newEntry.tu &&
                h.fv === newEntry.fv
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
    if (v === "" || v === "-" || v === ".") {
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
    } else {
      setValFrom("");
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
      
      const toast = document.getElementById('error-toast');
      if (toast) {
        // Simple visual improvement
        toast.textContent = "✅ " + t("copied", "Result copied to clipboard!");
        toast.className = "fixed bottom-5 left-1/2 -translate-x-1/2 z-50 py-3 px-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full shadow-lg text-sm font-medium transition-all duration-300";
        setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none'), 2500);
      }
      
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
      if (cat.id === 'time_zone') {
        navigate('/time-zone-converter');
      } else {
        navigate(`/${cat.id.replace(/_/g, '-')}-converter`);
      }
      setCategory(cat.id);
      if (cat.id === 'time_zone') {
        setUnitFrom('time_zone');
        setUnitTo('time_zone');
      } else {
        setUnitFrom(cat.units[0]?.id || "");
        setUnitTo(cat.units[1]?.id || cat.units[0]?.id || "");
      }
    }
  };

  useEffect(() => {
    if (category !== 'time_zone') {
      const input = document.getElementById("main-converter-input");
      if (input) {
        // We use a tiny timeout to ensure the DOM is ready after category transition
        setTimeout(() => input.focus(), 50);
      }
    }
  }, [category, unitFrom, unitTo]);

  const suggestions = useMemo(() => getSuggestions(searchQuery), [searchQuery]);

  const selectSuggestion = (sug: any) => {
    handleCategoryChange(sug.categoryId);
    setUnitFrom(sug.fromId);
    setUnitTo(sug.toId);
    setSearchQuery("");
    setIsSearchFocused(false);
    navigate(`/${getSEOUrlPath(sug.fromId, sug.toId)}`);
  };

  // Keyboard shortcuts (Ctrl+K to search, Shift+S to swap, Shift+C to copy)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input fields (unless it's cmd/ctrl + combination)
      const isInputFocused = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';

      if (e.key === "Escape") {
        setValFrom("");
        setValTo("");
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "/")) {
        e.preventDefault();
        const desktopSearch = document.getElementById("desktop-search-input") as HTMLInputElement;
        const mobileSearch = document.getElementById("mobile-search-input") as HTMLInputElement;
        if (window.innerWidth >= 768) {
          desktopSearch?.focus();
        } else {
          mobileSearch?.focus();
        }
      }
      
      if (!isInputFocused && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSwap();
      }
      
      if (!isInputFocused && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSwap, handleCopy]);

  const activeCategory = categories.find((c) => c.id === category) || categories[0];
  const activeFromUnit = activeCategory.units.find((u) => u.id === unitFrom) || activeCategory.units[0];
  const activeToUnit = activeCategory.units.find((u) => u.id === unitTo) || activeCategory.units[1] || activeCategory.units[0];

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

  // Removed manual SEO useEffect

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

  // --- Lift SEO State --- //
  const isHomepage = location.pathname === "/" && !location.search.includes("val=");
  const isCategoryPage = location.pathname.endsWith("-converter") && !location.pathname.includes("-to-") && location.pathname !== "/time-zone-converter";
  const isSpecificConverter = location.pathname !== "/" && !isCategoryPage;

  let titleStr = "";
  let metaDescStr = "";
  let canonicalUrlStr = "";
  let ogTitleStr = "";
  let schema: any[] = [];

  const getFAQsFromHtml = (html: string) => {
    const faqs: { question: string; answer: string }[] = [];
    const h3Regex = /<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/gs;
    let match;
    while ((match = h3Regex.exec(html)) !== null) {
      faqs.push({
        question: match[1].replace(/<[^>]+>/g, '').trim(),
        answer: match[2].replace(/<[^>]+>/g, '').trim(),
      });
    }
    return faqs;
  };

  if (category === 'time_zone') {
    titleStr = 'Time Zone Converter: Convert UTC, EST, PST, CET | QuickConvert';
    metaDescStr = 'Instantly convert between time zones to schedule global meetings easily. Supports UTC, EST, PST, standard and daylight time conversions.';
    canonicalUrlStr = "https://quickconvertunits.com/time-zone-converter";
    ogTitleStr = titleStr;
    schema = [{
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: titleStr,
      url: canonicalUrlStr,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description: metaDescStr,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    }];
  } else if (activeFromUnit && activeToUnit) {
    let customFAQs: { question: string; answer: string }[] = [];
    const pluralFrom = activeFromUnit.name.endsWith('s') ? activeFromUnit.name : `${activeFromUnit.name}s`;
    const pluralTo = activeToUnit.name.endsWith('s') ? activeToUnit.name : `${activeToUnit.name}s`;
    
    if (isHomepage) {
      titleStr = "Quick Unit Converter | Free Online Translation Tool for Measurements";
      metaDescStr = "Instantly convert units like meters to feet, kg to lbs, or cups to grams. Fast, accurate, no ads interrupting. Try now—no sign-up needed.";
      canonicalUrlStr = "https://quickconvertunits.com/";
      ogTitleStr = titleStr;
      customFAQs = [
        { question: "Is this unit converter free?", answer: "Yes, QuickConvert is 100% free to use. There are no registration requirements and no limits on the number of conversions you can perform." },
        { question: "How accurate are the results?", answer: "Our calculator uses industry-standard conversion factors and provides results accurate up to 6 decimal places for most measurements." },
        { question: "Does it work on mobile devices?", answer: "Yes, the website is fully responsive and works perfectly on smartphones, tablets, and desktop computers." },
        { question: "Do I need an internet connection?", answer: "Once the page is loaded, the core conversion engine works offline in your browser, making it extremely fast and accessible anywhere." }
      ];
    } else if (isCategoryPage) {
      const catName = activeCategory.name;
      const topUnits = `${activeCategory.units[0].name}s to ${activeCategory.units[1].name}s, ${activeCategory.units[2]?.name || ''}s`.replace(/ss/g, 's').replace(/, s/g, '');
      const allTopUnits = activeCategory.units.slice(0, 5).map(u => u.name.toLowerCase() + (u.name.endsWith('s') ? '' : 's')).join(", ");
      
      let seoSnippet = "";
      const content = categorySeoContent[category] || "";
      customFAQs = getFAQsFromHtml(content);

      const pMatch = content.match(/<p>(.*?)<\/p>/);
      if (pMatch) {
        seoSnippet = pMatch[1].replace(/<[^>]+>/g, ' ').trim();
        if (seoSnippet.length > 130) {
          seoSnippet = seoSnippet.substring(0, 127) + "...";
        }
      }

      titleStr = `${catName} Conversion Calculator: ${topUnits} | QuickConvert`;
      
      const specificDescriptions: Record<string, string> = {
        "length": "Convert length and distance measurements from meters, feet, kilometers, and miles. Real-time formatting with high precision.",
        "weight": "Convert weight and mass units instantly. Easily calculate pounds to kilograms, ounces to grams, and stone.",
        "temperature": "Convert temperatures between Celsius, Fahrenheit, and Kelvin. Precise scientific and everyday weather conversions using official scaling formulas.",
        "currency": "Live currency converter for USD, EUR, GBP, INR, and more. Global exchange rates updated frequently.",
        "time_zone": "Time zone converter for UTC, EST, PST, CET. Schedule global meetings and convert standard and daylight time accurately."
      };
      
      metaDescStr = specificDescriptions[category] || `Free ${catName.toLowerCase()} unit converter for ${allTopUnits}. ${seoSnippet || "Precise calculations with real-time results. Convert measurements instantly."}`;
      
      canonicalUrlStr = `https://quickconvertunits.com/${category.replace(/_/g, '-')}-converter`;
      ogTitleStr = titleStr;
    } else {
      const valPrefix = valFrom && valFrom !== "1" && valFrom !== "0" ? `${valFrom} ` : "";
      const symbolToPath = getSEOUrlPath(unitFrom, unitTo);
      const customSeo = customSeoData[symbolToPath];

      if (customSeo) {
        titleStr = customSeo.title;
        metaDescStr = customSeo.description;
        customFAQs = getFAQsFromHtml(customSeo.content);
      } else {
        const symFrom = activeFromUnit.symbol;
        const symTo = activeToUnit.symbol;
        
        titleStr = `${valPrefix}${pluralFrom} to ${pluralTo} (${symFrom} to ${symTo}) Converter - Free Tool`;
        metaDescStr = `Convert ${valPrefix}${pluralFrom.toLowerCase()} to ${pluralTo.toLowerCase()} instantly. 1 ${symFrom} = ${convert(1, unitFrom, unitTo, category).toPrecision(6)} ${symTo}. Free calculator with conversion table, formula, and examples. Fast and accurate.`;
      }
      canonicalUrlStr = `https://quickconvertunits.com/${getSEOUrlPath(unitFrom, unitTo)}`;
      ogTitleStr = titleStr;
    }


    schema = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isSpecificConverter ? `${pluralFrom} to ${pluralTo} Converter` : `${titleStr}`,
        url: canonicalUrlStr,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        description: metaDescStr,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }
    ];

    if (isSpecificConverter && activeFromUnit && activeToUnit && category !== 'time_zone') {
      schema.push({
        "@context": "https://schema.org",
        "@type": "Action",
        name: `Converting ${activeFromUnit.name} to ${activeToUnit.name}`,
        fromUnit: activeFromUnit.name,
        toUnit: activeToUnit.name,
        value: valFrom || "1"
      });
    }

    if (customFAQs.length > 0) {
      schema.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: customFAQs.map(faq => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      });
    } else if (isSpecificConverter && activeFromUnit && activeToUnit && category !== 'time_zone') {
      const conversionFactor = convert(1, unitFrom, unitTo, category);
      // ... (rest of the system generated FAQs if needed, but let's keep it simple and clean)
      // I will keep the generated ones as fallback
      const formatNum = (num: number) => {
        if (Number.isNaN(num)) return "0";
        const str = Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(6)).toString();
        const parts = str.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
      };
      
      const fUnitName = t(`units.${activeFromUnit.id}`, activeFromUnit.name);
      const tUnitName = t(`units.${activeToUnit.id}`, activeToUnit.name);

      schema.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: t("seoFaq1Q", "How many {{toUnit}} are in 1 {{fromUnit}}?", { toUnit: tUnitName, fromUnit: fUnitName }),
            acceptedAnswer: {
              "@type": "Answer",
              text: t("seoFaq1A", "1 {{fromUnit}} equals exactly {{result}} {{toUnit}}.", { result: formatNum(conversionFactor), toUnit: tUnitName, fromUnit: fUnitName })
            }
          },
          {
            "@type": "Question",
            name: t("seoFaq2Q", "Is 1 {{fromUnit}} more than 1 {{toUnit}}?", { fromUnit: fUnitName, toUnit: tUnitName }),
            acceptedAnswer: {
              "@type": "Answer",
              text: conversionFactor > 1 
                ? `Yes, 1 ${fUnitName} is ${formatNum(conversionFactor)} times more than 1 ${tUnitName}.` 
                : `No, 1 ${fUnitName} is less than 1 ${tUnitName}.`
            }
          }
        ]
      });
    }

  }

  // Handle auto-routing logic that was in useEffect safely
  useEffect(() => {
    if (category === 'time_zone' && location.pathname !== '/time-zone-converter') {
      navigate('/time-zone-converter', { replace: true });
    } else if (category !== 'time_zone' && activeFromUnit && activeToUnit) {
      const targetPath = `/${getSEOUrlPath(unitFrom, unitTo)}${valFrom && valFrom !== "1" ? `?val=${valFrom}` : ""}`;
      const currentFullPath = location.pathname + location.search;
      
      if (isHomepage) {
         const defaultFrom = activeCategory.units[0]?.id;
         const defaultTo = activeCategory.units[1]?.id || defaultFrom;
         if ((unitFrom !== defaultFrom || unitTo !== defaultTo) && currentFullPath !== targetPath) {
           navigate(targetPath);
         }
      } else if (isCategoryPage) {
         const defaultFrom = activeCategory.units[0]?.id;
         const defaultTo = activeCategory.units[1]?.id || defaultFrom;
         if ((unitFrom !== defaultFrom || unitTo !== defaultTo) && currentFullPath !== targetPath) {
           navigate(targetPath, { replace: true });
         }
      } else {
         if (currentFullPath !== targetPath) {
           navigate(targetPath, { replace: true });
         }
      }
    }
  }, [category, unitFrom, unitTo, valFrom]); // Minimal dependencies to just handle routing

  return (
    <div
      className={`min-h-screen text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-200 relative overflow-hidden`}
    >
      <Helmet>
        <title>{titleStr}</title>
        <meta name="description" content={metaDescStr} />
        <link rel="canonical" href={canonicalUrlStr} />
        <meta property="og:title" content={ogTitleStr} />
        <meta property="og:description" content={metaDescStr} />
        <meta property="og:url" content={canonicalUrlStr} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitleStr} />
        <meta name="twitter:description" content={metaDescStr} />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      {/* Offline Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500 text-amber-950 px-4 py-2 text-sm font-medium text-center flex items-center justify-center gap-2 overflow-hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20"/><path d="M8.53 8.53C5.52 9.57 2 12 2 12l2 2.67c2.5-1.57 5-2.5 7.5-2.62M16.74 16.74c1.9-.37 3.9-.99 5.26-1.4L20 12c-1.4 1-3.1 1.77-5 2.15M13 13h.01M22 6s-4-3-10-3c-2.4 0-4.6.6-6.6 1.7"/></svg>
            {t("offlineMode", "You're currently offline. Core conversions still work locally!")}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/5 dark:bg-primary-500/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[60%] rounded-full bg-primary-500/5 dark:bg-primary-500/10 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
          <a 
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 font-bold text-lg sm:text-xl tracking-tight text-primary-600 dark:text-primary-500 hover:opacity-80 transition-opacity focus:outline-none min-w-0 shrink"
          >
            <img
              src="/favicon.svg"
              alt="QuickConvert Logo"
              className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
            />
            <span className="truncate">{t("appName", "QuickConvert")}</span>
          </a>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-1 justify-end shrink-0">
            {/* Desktop Search */}
            <div className="relative hidden md:block max-w-sm w-full">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="desktop-search-input"
                  aria-label={t("searchPlaceholder", "Search top conversions")}
                  type="text"
                  placeholder={t("searchPlaceholder", "Search for units (⌘K)")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && suggestions.length > 0) {
                      selectSuggestion(suggestions[0]);
                    }
                  }}
                  className="w-full pl-9 pr-14 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 text-sm transition-shadow"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                  <span className="text-[10px] font-medium text-neutral-400 px-1.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50">⌘K</span>
                </div>
              </div>
              {isSearchFocused && (suggestions.length > 0 || (!searchQuery && favorites.length > 0) || (searchQuery && suggestions.length === 0)) && (
                <div className="absolute top-11 left-0 right-0 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden z-50">
                  {!searchQuery && favorites.length > 0 && (
                    <div className="px-4 py-2 text-xs font-semibold text-neutral-500 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700">
                      Saved Conversions
                    </div>
                  )}
                  {!searchQuery && favorites.map((fav, i) => {
                    const cat = categories.find(c => c.id === fav.cat);
                    const fUnit = cat?.units.find(u => u.id === fav.fu);
                    const tUnit = cat?.units.find(u => u.id === fav.tu);
                    if (!fUnit || !tUnit) return null;
                    return (
                      <button
                        key={`fav-${i}`}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors flex items-center justify-between group"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectSuggestion({
                            categoryId: fav.cat,
                            fromId: fav.fu,
                            toId: fav.tu,
                          });
                        }}
                      >
                        <span>{fUnit.name} to {tUnit.name}</span>
                        <Star className="w-3 h-3 text-amber-500 fill-current opacity-50 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                  {searchQuery && suggestions.map((sug, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectSuggestion(sug);
                      }}
                    >
                      {sug.text}
                    </button>
                  ))}
                  {searchQuery && suggestions.length === 0 && (
                    <div className="px-4 py-3 text-center text-sm text-neutral-500">
                      No matches found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                aria-label="Toggle theme menu"
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
                        aria-label={`Select ${t} theme`}
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
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="hidden sm:block border-l border-neutral-200 dark:border-neutral-700 h-6 mx-2"></div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 relative z-[100]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="mobile-search-input"
            aria-label={t("searchPlaceholder", "Search categories")}
            type="text"
            placeholder={t("searchPlaceholder", "Search conversions...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && suggestions.length > 0) {
                selectSuggestion(suggestions[0]);
              }
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
          />
        </div>
        <AnimatePresence>
          {isSearchFocused && (suggestions.length > 0 || (!searchQuery && favorites.length > 0) || (searchQuery && suggestions.length === 0)) && (
            <div className="absolute top-14 left-0 right-0 bg-white dark:bg-neutral-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-neutral-100 dark:border-neutral-800 overflow-hidden z-[110] mx-4">
              {!searchQuery && favorites.length > 0 && (
                <div className="px-4 py-2 text-xs font-semibold text-neutral-500 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700">
                  Saved Conversions
                </div>
              )}
              {!searchQuery && favorites.map((fav, i) => {
                const cat = categories.find(c => c.id === fav.cat);
                const fUnit = cat?.units.find(u => u.id === fav.fu);
                const tUnit = cat?.units.find(u => u.id === fav.tu);
                if (!fUnit || !tUnit) return null;
                return (
                  <button
                    key={`mobile-fav-${i}`}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors flex items-center justify-between group border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectSuggestion({
                        categoryId: fav.cat,
                        fromId: fav.fu,
                        toId: fav.tu,
                      });
                    }}
                  >
                    <span>{fUnit.name} to {tUnit.name}</span>
                    <Star className="w-3 h-3 text-amber-500 fill-current opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
              {searchQuery && suggestions.map((sug, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectSuggestion(sug);
                  }}
                >
                  {sug.text}
                </button>
              ))}
              {searchQuery && suggestions.length === 0 && (
                <div className="px-4 py-4 text-center text-sm text-neutral-500">
                  No matches found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Layout containing Ad zones */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col lg:flex-row gap-8 pb-24 md:pb-12 relative z-10">
        {/* Left Column (Main App + Content) */}
        <div className="flex-1 max-w-3xl mx-auto w-full">
          <Breadcrumbs 
            category={{id: category, name: activeCategory.name}} 
            unitFrom={{name: activeFromUnit?.name || ''}} 
            unitTo={{name: activeToUnit?.name || ''}} 
            isSpecificConverter={isSpecificConverter} 
          />
          <div className="text-center mb-10">
            {category === 'time_zone' ? (
              <h1 className="flex items-center justify-center flex-wrap gap-2 md:gap-4 text-2xl md:text-5xl font-semibold tracking-tight mb-4 text-neutral-900 dark:text-white">
                Time Zone Converter
              </h1>
            ) : (
              <h1 className="flex items-center justify-center flex-wrap gap-2 md:gap-4 text-2xl md:text-5xl font-semibold tracking-tight mb-4 text-neutral-900 dark:text-white">
                {(activeFromUnit?.name || '').endsWith('s') ? activeFromUnit?.name : `${activeFromUnit?.name}s`} to {(activeToUnit?.name || '').endsWith('s') ? activeToUnit?.name : `${activeToUnit?.name}s`} Converter
                <button
                  onClick={toggleFavorite}
                  className={`flex-shrink-0 flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-full transition-colors ${
                    isFavorited
                      ? "bg-amber-100 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/30"
                      : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 dark:bg-[#1a1a1a] dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  }`}
                  title={isFavorited ? "Saved to Favorites" : "Save this conversion"}
                >
                  <Star className={`w-4 h-4 md:w-6 md:h-6 ${isFavorited ? "fill-current" : ""}`} />
                </button>
              </h1>
            )}
            <p className="text-neutral-500 dark:text-neutral-400 text-lg font-light">
              Fast, accurate, and completely free {category.replace("_", " ")} conversion tool.
            </p>
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto md:flex-wrap no-scrollbar gap-3 mb-12 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center items-center">
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
                {t(`categories.${c.id}`, c.name)}
              </button>
            ))}
          </div>

          {/* Converter Card */}
          {category === 'time_zone' ? (
            <TimeZoneConverter />
          ) : (
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
                  {t("from", "From")}
                </label>
                <div className="relative">
                  <UnitSelector
                    value={unitFrom}
                    onChange={setUnitFrom}
                    units={activeCategory.units}
                    activeCategoryId={category}
                  />
                </div>
                <div className="relative flex items-center mt-3">
                  <input
                    id="main-converter-input"
                    aria-label={`From value in ${activeFromUnit?.name || 'unit'}`}
                    type="text"
                    value={valFrom}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const v = raw.replace(/,/g, ".");
                      
                      if (v === "" || /^-?\d*\.?\d*$/.test(v)) {
                        setValFrom(v);
                        return;
                      }

                      const match = v.match(/^-?\d*\.?\d+/);
                      if (match && v.startsWith(match[0])) {
                        // Allow typing suffix by stripping it
                        setValFrom(match[0]);
                        return;
                      }
                      
                      // Try to find any number in the string (e.g. pasted '100 miles')
                      const anyMatch = v.match(/-?\d*\.?\d+/);
                      if (anyMatch) {
                        setValFrom(anyMatch[0]);
                        return;
                      }

                      // Failed regex - figure out why
                      const toast = document.getElementById('error-toast');
                      if (toast) {
                        if (/[a-zA-Z]/.test(v)) {
                          toast.textContent = "❌ Try selecting units from the dropdown (kg, lbs, meters...)";
                        } else {
                          toast.textContent = "❌ Enter a valid number (e.g., 10.5)";
                        }
                        toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                        setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none'), 3000);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    autoFocus
                    className="w-full bg-transparent text-4xl md:text-5xl lg:text-6xl font-light focus:outline-none text-neutral-900 dark:text-white pr-20 tracking-tight"
                    placeholder="0"
                    inputMode="decimal"
                  />
                  <div className="absolute right-0 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 hover:opacity-100 focus:opacity-100 transition-opacity">
                    {valFrom && valFrom !== "0" && (
                      <button
                        onClick={() => {
                          setValFrom("");
                          setValTo("");
                        }}
                        className="p-2 text-neutral-300 hover:text-neutral-500 transition-colors"
                        title="Clear input"
                        aria-label="Clear input"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    )}
                    {(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition ? (
                      <button
                        onClick={() => {
                          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                          if (!SpeechRecognition) return;
                          const recognition = new SpeechRecognition();
                          recognition.continuous = false;
                          recognition.interimResults = false;
                          recognition.lang = 'en-US';
                          
                          recognition.onstart = () => {
                            const toast = document.getElementById('error-toast');
                            if (toast) {
                              toast.textContent = "🎙️ Listening... Say a number";
                              toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                            }
                          };
                          
                          recognition.onresult = (event: any) => {
                            const transcript = event.results[0][0].transcript;
                            // Extract first number found in speech
                            const match = transcript.match(/-?\d*\.?\d+/);
                            if (match) {
                              setValFrom(match[0]);
                            }
                            const toast = document.getElementById('error-toast');
                            if (toast) toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
                          };
                          
                          recognition.onerror = () => {
                            const toast = document.getElementById('error-toast');
                            if (toast) toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
                          };
                          
                          recognition.start();
                        }}
                        className="p-2 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-primary-50/50 dark:bg-primary-900/20 rounded-lg"
                        title="Dictate number"
                        aria-label="Voice input"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>
                      </button>
                    ) : null}
                    {valFrom && (
                      <button
                        onClick={handleClear}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-2"
                        aria-label="Clear value"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
                {valFrom.startsWith("-") && category !== "temperature" && (
                  <p className="text-amber-500 dark:text-amber-400 text-xs mt-3 flex items-center gap-1 font-medium bg-amber-50 dark:bg-amber-500/10 p-2 rounded-lg py-1.5 border border-amber-200 dark:border-amber-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {activeCategory?.name} conversions typically use positive values.
                  </p>
                )}
              </div>

              {/* SWAP BUTTON */}
              <button
                onClick={handleSwap}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1e1e1e] text-neutral-500 dark:text-neutral-400 p-3 md:p-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-[#252525] hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 group"
                aria-label={t("swap", "Swap units")}
              >
                <ArrowRightLeft className="w-5 h-5 pointer-events-none group-hover:rotate-180 transition-transform duration-500" />
              </button>

              {/* TO */}
              <div className="flex-1 w-full bg-neutral-50/50 dark:bg-[#161616] rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/10 dark:focus-within:ring-primary-400/10 transition-all relative group">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-3 block">
                  {t("to", "To")}
                </label>
                <div className="relative">
                  <UnitSelector
                    value={unitTo}
                    onChange={setUnitTo}
                    units={activeCategory.units}
                    activeCategoryId={category}
                  />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <motion.div
                    key={valTo}
                    initial={{ scale: 0.98, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 min-w-0"
                  >
                  <input
                    aria-label={`To value in ${activeToUnit?.name || 'unit'}`}
                    type="text"
                    value={valTo}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const v = raw.replace(/,/g, ".");
                      
                      if (v === "" || /^-?\d*\.?\d*$/.test(v)) {
                         handleValToChange(v);
                         return;
                      }

                      const match = v.match(/^-?\d*\.?\d+/);
                      if (match && v.startsWith(match[0])) {
                         handleValToChange(match[0]);
                         return;
                      }
                      
                      const anyMatch = v.match(/-?\d*\.?\d+/);
                      if (anyMatch) {
                         handleValToChange(anyMatch[0]);
                         return;
                      }

                      // Failed regex
                      const toast = document.getElementById('error-toast');
                      if (toast) {
                        if (/[a-zA-Z]/.test(v)) {
                          toast.textContent = "❌ Try selecting units from the dropdown (kg, lbs, meters...)";
                        } else {
                          toast.textContent = "❌ Enter a valid number (e.g., 10.5)";
                        }
                        toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                        setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none'), 3000);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    className="w-full bg-transparent text-4xl md:text-5xl lg:text-6xl font-light focus:outline-none text-neutral-900 dark:text-white truncate tracking-tight"
                    placeholder="0"
                    inputMode="decimal"
                  />
                  </motion.div>
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
                  aria-label="Refresh exchange rates"
                  onClick={handleRefreshRates}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? t("updatingRates", "Updating rates...") : t("refreshRates", "Fetch Real-Time Rates")}
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Copy className="w-4 h-4" />{" "}
                {copied ? t("copied", "Copied!") : t("copyResult", "Copy Result")}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Share2 className="w-4 h-4" /> {t("share", "Share")}
              </button>
              <button
                onClick={() => setShowBulk(!showBulk)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${showBulk ? "bg-primary-500/10 text-primary-600 dark:text-primary-400" : "bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"}`}
              >
                <Grid className="w-4 h-4" />{" "}
                {showBulk ? t("hideBulkConvert", "Hide Bulk Convert") : t("bulkConvert", "Bulk Convert")}
              </button>
              <button
                onClick={() => setShowCompare(!showCompare)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${showCompare ? "bg-primary-500/10 text-primary-600 dark:text-primary-400" : "bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"}`}
              >
                <Table className="w-4 h-4" />{" "}
                {showCompare ? t("hideCompare", "Hide Compare") : t("compare", "Compare")}
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> {t("reset", "Reset")}
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
                        {t("bulkConversion", "Bulk Conversion")}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                      {t("converting", "Converting")}{" "}
                      <strong className="text-neutral-800 dark:text-neutral-200">
                        {valFrom} {activeFromUnit?.name && t(`units.${activeFromUnit.name}`, activeFromUnit.name)}
                      </strong>{" "}
                      {t("toAllUnits", "to all {{category}} units", { category: t(`categories.${activeCategory.id}`, activeCategory.name).toLowerCase() })}
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
                              {formatNumber(
                                convert(
                                  parseFloat(valFrom),
                                  unitFrom,
                                  u.id,
                                  category,
                                )
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
          )}

          {/* Frequently Asked Questions */}
          {category !== 'time_zone' && activeFromUnit && activeToUnit && (
          <div className="mt-8 bg-white dark:bg-[#111111] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-neutral-100 dark:border-neutral-800">
            <h3 className="text-2xl font-semibold tracking-tight mb-6">Frequently Asked Questions</h3>
            <div className="space-y-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2 mt-0">
                  {category === "temperature" ? `What is 1 ${activeFromUnit.name} in ${activeToUnit.name}?` : `How many ${activeToUnit.name} are in 1 ${activeFromUnit.name}?`}
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-0">
                  {category === "temperature" 
                    ? `1 degree ${activeFromUnit.name} is equivalent to ${parseFloat(convert(1, unitFrom, unitTo, category).toFixed(6))} degrees ${activeToUnit.name}.`
                    : `There are ${parseFloat(convert(1, unitFrom, unitTo, category).toFixed(6))} ${activeToUnit.name} in 1 ${activeFromUnit.name}.`
                  }
                </p>
              </div>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2 mt-0">
                  How do I convert {activeFromUnit.name} to {activeToUnit.name}?
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-0">
                  {category === "temperature"
                    ? `To convert ${activeFromUnit.name} to ${activeToUnit.name}, you use a specific temperature formula involving an offset. Our free online calculator handles this complex conversion automatically.`
                    : `To convert ${activeFromUnit.name} to ${activeToUnit.name}, you multiply the value by ${parseFloat(convert(1, unitFrom, unitTo, category).toFixed(6))}. Our free online calculator handles this mathematical conversion automatically.`
                  }
                </p>
              </div>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2 mt-0">
                  What is a {activeFromUnit.name}?
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-0">
                  {activeFromUnit.description || `A ${activeFromUnit.name} is a typical unit of ${activeCategory.name.toLowerCase()}.`}
                </p>
              </div>
            </div>
          </div>
          )}

          {/* Conversion Chart for Specific Categories */}
          <Suspense fallback={<div className="mt-8 h-[350px] flex items-center justify-center bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-700">Loading chart...</div>}>
            <ConversionChart
              categoryId={category}
              valFrom={valFrom}
              unitFrom={unitFrom}
              theme={theme}
            />
          </Suspense>

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
                      {t("history", "History")}
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
                      {t("clearHistory", "Clear")}
                    </button>
                  )}
                </div>

                {historyItems.length === 0 ? (
                  <div className="h-[200px] flex flex-col items-center justify-center text-center">
                    <History className="w-12 h-12 text-neutral-200 dark:text-neutral-800 mb-3" />
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm font-light">
                      {t("noHistory", "Your recent conversions will appear here.")}
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
                            aria-label={`Remove history item ${h.label}`}
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

            <SeoContent 
              unitFrom={unitFrom} 
              unitTo={unitTo} 
              category={category} 
              categories={categories} 
            />
            
            <PopularConversions 
              onSelect={(cat, from, to) => {
                handleCategoryChange(cat);
                setTimeout(() => {
                  setUnitFrom(from);
                  setUnitTo(to);
                  setValFrom("1");
                }, 10);
              }} 
            />

            {isHomepage && (
              <div className="mt-16 bg-white dark:bg-[#111111] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-neutral-100 dark:border-neutral-800 prose prose-neutral dark:prose-invert max-w-none">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight">Why Use QuickConvert Units?</h2>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Our free online unit converter provides instant, accurate conversions across 14 measurement categories. Whether you're converting kilograms to pounds for international shipping, Celsius to Fahrenheit for travel weather, or cups to milliliters for cooking recipes, QuickConvert delivers precise results in real-time.</p>
                
                <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-tight">Most Popular Conversions</h2>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Millions of people search for unit conversions every day:</p>
                <ul className="font-light text-neutral-600 dark:text-neutral-400">
                  <li><strong>Weight conversions</strong>: Convert kg to lbs, pounds to kilograms, grams to ounces</li>
                  <li><strong>Temperature conversions</strong>: Celsius to Fahrenheit, Fahrenheit to Celsius, Kelvin conversions</li>
                  <li><strong>Length conversions</strong>: Miles to kilometers, feet to meters, inches to centimeters</li>
                  <li><strong>Volume conversions</strong>: Liters to gallons, cups to ml, tablespoons to teaspoons</li>
                  <li><strong>Cooking conversions</strong>: Recipe measurements for baking and cooking</li>
                </ul>
                
                <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-tight">How to Use QuickConvert</h2>
                <ol className="font-light text-neutral-600 dark:text-neutral-400 space-y-1">
                  <li>Select your measurement category (length, weight, temperature, etc.)</li>
                  <li>Choose the units you want to convert from and to</li>
                  <li>Enter your value</li>
                  <li>Get instant, accurate results with formulas and explanations</li>
                </ol>
                <p className="font-light text-neutral-600 dark:text-neutral-400">All conversions are free, work offline, and provide real-time calculations without page reloads.</p>
                
                <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight">Conversion Categories</h2>
                
                <h3 className="text-xl font-medium mt-6 mb-2">Length & Distance</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Convert units like meters, feet, kilometers, miles, inches, and smaller scientific units. Essential for travel, DIY projects, and reading international specifications.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/meters-to-feet" className="text-primary-600 dark:text-primary-400 hover:underline">Meters to Feet</Link> | 
                  <Link to="/feet-to-meters" className="text-primary-600 dark:text-primary-400 hover:underline">Feet to Meters</Link> | 
                  <Link to="/km-to-miles" className="text-primary-600 dark:text-primary-400 hover:underline">Kilometers to Miles</Link> | 
                  <Link to="/miles-to-km" className="text-primary-600 dark:text-primary-400 hover:underline">Miles to Kilometers</Link> | 
                  <Link to="/inches-to-cm" className="text-primary-600 dark:text-primary-400 hover:underline">Inches to CM</Link> | 
                  <Link to="/cm-to-inches" className="text-primary-600 dark:text-primary-400 hover:underline">CM to Inches</Link>
                </div>
                
                <h3 className="text-xl font-medium mt-8 mb-2">Weight & Mass</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Easily calculate kg to lbs, completely removing the headache from checking baggage allowances. Support for ounces, grams, and stone makes cooking and health tracking much easier.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/kg-to-lbs" className="text-primary-600 dark:text-primary-400 hover:underline">Kg to Lbs</Link> | 
                  <Link to="/lbs-to-kg" className="text-primary-600 dark:text-primary-400 hover:underline">Lbs to Kg</Link> | 
                  <Link to="/grams-to-ounces" className="text-primary-600 dark:text-primary-400 hover:underline">Grams to Ounces</Link> | 
                  <Link to="/ounces-to-grams" className="text-primary-600 dark:text-primary-400 hover:underline">Ounces to Grams</Link>
                </div>
                
                <h3 className="text-xl font-medium mt-8 mb-2">Temperature</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Cross-reference Celsius and Fahrenheit effortlessly. Whether you are traveling abroad or working on scientific tasks with Kelvin, our tool handles offset formulas properly.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/celsius-to-fahrenheit" className="text-primary-600 dark:text-primary-400 hover:underline">Celsius to Fahrenheit</Link> | 
                  <Link to="/fahrenheit-to-celsius" className="text-primary-600 dark:text-primary-400 hover:underline">Fahrenheit to Celsius</Link> | 
                  <Link to="/celsius-to-kelvin" className="text-primary-600 dark:text-primary-400 hover:underline">Celsius to Kelvin</Link>
                </div>
                
                <h3 className="text-xl font-medium mt-8 mb-2">Volume</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Convert cups to milliliters or gallons to liters instantly. Highly useful for adjusting global cooking recipes or checking fluid container volumes.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/liters-to-gallons" className="text-primary-600 dark:text-primary-400 hover:underline">Liters to Gallons</Link> | 
                  <Link to="/gallons-to-liters" className="text-primary-600 dark:text-primary-400 hover:underline">Gallons to Liters</Link> | 
                  <Link to="/cups-to-ml" className="text-primary-600 dark:text-primary-400 hover:underline">Cups to ML</Link> | 
                  <Link to="/ml-to-cups" className="text-primary-600 dark:text-primary-400 hover:underline">ML to Cups</Link>
                </div>

                <h3 className="text-xl font-medium mt-8 mb-2">Speed</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Check the speed limit accurately by converting kilometers per hour to miles per hour. Includes meters per second and knots for aviation or maritime use.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/mph-to-kph" className="text-primary-600 dark:text-primary-400 hover:underline">MPH to KPH</Link> | 
                  <Link to="/kph-to-mph" className="text-primary-600 dark:text-primary-400 hover:underline">KPH to MPH</Link> | 
                  <Link to="/knots-to-mph" className="text-primary-600 dark:text-primary-400 hover:underline">Knots to MPH</Link>
                </div>
                
                <h3 className="text-xl font-medium mt-8 mb-2">Area</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Quickly measure land and property sizes by switching between acres, hectares, square meters, and square feet. Invaluable for real estate and surveying.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/acres-to-square-meters" className="text-primary-600 dark:text-primary-400 hover:underline">Acres to Square Meters</Link> | 
                  <Link to="/square-feet-to-square-meters" className="text-primary-600 dark:text-primary-400 hover:underline">Square Feet to Square Meters</Link> | 
                  <Link to="/hectares-to-acres" className="text-primary-600 dark:text-primary-400 hover:underline">Hectares to Acres</Link>
                </div>

                <h3 className="text-xl font-medium mt-8 mb-2">Time</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Convert between seconds, minutes, hours, days, and larger timeframes. Track durations logically across different time scales.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/hours-to-minutes" className="text-primary-600 dark:text-primary-400 hover:underline">Hours to Minutes</Link> | 
                  <Link to="/minutes-to-seconds" className="text-primary-600 dark:text-primary-400 hover:underline">Minutes to Seconds</Link> | 
                  <Link to="/days-to-hours" className="text-primary-600 dark:text-primary-400 hover:underline">Days to Hours</Link>
                </div>
                
                <h3 className="text-xl font-medium mt-8 mb-2">Data Storage</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Compare bytes, megabytes, gigabytes, and terabytes to know exactly how much file storage is necessary for your electronic devices.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/mb-to-gb" className="text-primary-600 dark:text-primary-400 hover:underline">MB to GB</Link> | 
                  <Link to="/gb-to-tb" className="text-primary-600 dark:text-primary-400 hover:underline">GB to TB</Link> | 
                  <Link to="/bits-to-bytes" className="text-primary-600 dark:text-primary-400 hover:underline">Bits to Bytes</Link>
                </div>
                
                <h3 className="text-xl font-medium mt-8 mb-2">Fuel Economy</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Measure your vehicle's efficiency by comparing miles per gallon (MPG) to liters per 100 kilometers. Helps you budget travel costs globally.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/mpg-to-kml" className="text-primary-600 dark:text-primary-400 hover:underline">MPG to KM/L</Link> | 
                  <Link to="/kml-to-mpg" className="text-primary-600 dark:text-primary-400 hover:underline">KM/L to MPG</Link>
                </div>

                <h3 className="text-xl font-medium mt-8 mb-2">Energy</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Determine energy values between Joules, calories, and kilowatt-hours. Perfect for utility bill math and physics problems.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/joules-to-calories" className="text-primary-600 dark:text-primary-400 hover:underline">Joules to Calories</Link> | 
                  <Link to="/calories-to-joules" className="text-primary-600 dark:text-primary-400 hover:underline">Calories to Joules</Link> | 
                  <Link to="/kwh-to-joules" className="text-primary-600 dark:text-primary-400 hover:underline">kWh to Joules</Link>
                </div>

                <h3 className="text-xl font-medium mt-8 mb-2">Pressure</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Check tire pressure or atmospheric specs by converting bar to PSI, pascal, and atmospheres. Crucial for engineering and daily maintenance.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/bar-to-psi" className="text-primary-600 dark:text-primary-400 hover:underline">Bar to PSI</Link> | 
                  <Link to="/psi-to-bar" className="text-primary-600 dark:text-primary-400 hover:underline">PSI to Bar</Link> | 
                  <Link to="/atmospheres-to-psi" className="text-primary-600 dark:text-primary-400 hover:underline">Atmospheres to PSI</Link>
                </div>

                <h3 className="text-xl font-medium mt-8 mb-2">Angle</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Switch between degrees and radians instantly. Very helpful for mathematics, geometry, and engineering graphics calculations.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/degrees-to-radians" className="text-primary-600 dark:text-primary-400 hover:underline">Degrees to Radians</Link> | 
                  <Link to="/radians-to-degrees" className="text-primary-600 dark:text-primary-400 hover:underline">Radians to Degrees</Link>
                </div>

                <h3 className="text-xl font-medium mt-8 mb-2">Currency</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Translate value between major world fiat currencies like USD, EUR, and GBP. Uses realistic exchange rate estimations for budgeting trips and international purchases.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/usd-to-eur" className="text-primary-600 dark:text-primary-400 hover:underline">USD to EUR</Link> | 
                  <Link to="/eur-to-usd" className="text-primary-600 dark:text-primary-400 hover:underline">EUR to USD</Link> | 
                  <Link to="/usd-to-gbp" className="text-primary-600 dark:text-primary-400 hover:underline">USD to GBP</Link> | 
                  <Link to="/usd-to-inr" className="text-primary-600 dark:text-primary-400 hover:underline">USD to INR</Link>
                </div>
                
                <h3 className="text-xl font-medium mt-8 mb-2">Time Zone</h3>
                <p className="font-light text-neutral-600 dark:text-neutral-400">Sync global meetings appropriately. Translate local time into UTC, EST, PST, or CET directly considering standard daylight factors.</p>
                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <Link to="/time-zone-converter" className="text-primary-600 dark:text-primary-400 hover:underline">Time Zone Converter</Link> | 
                  <Link to="/est-to-utc" className="text-primary-600 dark:text-primary-400 hover:underline">EST to UTC</Link> | 
                  <Link to="/pst-to-est" className="text-primary-600 dark:text-primary-400 hover:underline">PST to EST</Link>
                </div>

                <h2 className="mb-4 mt-12 text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Is this unit converter free?</h3>
                    <p className="font-light text-neutral-600 dark:text-neutral-400">Yes, QuickConvert is 100% free to use. There are no registration requirements and no limits on the number of conversions you can perform.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">How accurate are the results?</h3>
                    <p className="font-light text-neutral-600 dark:text-neutral-400">Our calculator uses industry-standard conversion factors and provides results accurate up to 6 decimal places for most measurements.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Does it work on mobile devices?</h3>
                    <p className="font-light text-neutral-600 dark:text-neutral-400">Yes, the website is fully responsive and works perfectly on smartphones, tablets, and desktop computers.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Do I need an internet connection?</h3>
                    <p className="font-light text-neutral-600 dark:text-neutral-400">Once the page is loaded, the core conversion engine works offline in your browser, making it extremely fast and accessible anywhere.</p>
                  </div>
                </div>
              </div>
            )}

          </section>

          {/* SEO Optional Content area placeholder */}
          <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-center md:text-left">
            <div className="flex-1 space-y-3">
              <div>
                <p className="mb-1 font-medium text-neutral-900 dark:text-neutral-200">
                  &copy; {new Date().getFullYear()} QuickConvert. {t("footerText", "Built for fast, accurate conversions.")}
                </p>
                <p className="opacity-80 font-medium">🛡️ Strictly Local: Your conversion data never leaves your device.</p>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed max-w-3xl">
                <strong>Disclaimer:</strong> While we strive to provide accurate information, QuickConvert makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability of the conversion calculators. Any reliance you place on such information is therefore strictly at your own risk.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2 shrink-0">
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
            {/* Quick Reference Table */}
            <div className="bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800 rounded-2xl p-5 shadow-sm overflow-hidden">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                {t("popular", "Popular Conversions")}
              </h3>
              <div className="flex flex-col gap-1">
                {POPULAR_CONVERSIONS.slice(0, 12).map((conv, i) => (
                  <a
                    key={i}
                    href={conv.cat === 'time_zone' ? '/time-zone-converter' : `/?category=${conv.cat}&from=${conv.from}&to=${conv.to}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategoryChange(conv.cat);
                      setTimeout(() => {
                        setUnitFrom(conv.from);
                        setUnitTo(conv.to);
                        setValFrom("1");
                      }, 10);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-neutral-50 dark:bg-neutral-800/20 dark:hover:bg-neutral-800/50 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 group transition-colors"
                  >
                    <span>
                      {conv.cat === 'time_zone' ? (
                        t(`units.time_zone_converter`, 'Time Zone Converter')
                      ) : (
                        <>{t(`units.${conv.from}`, conv.label.split(' to ')[0])} {t("to", "to")} {t(`units.${conv.to}`, conv.label.split(' to ')[1])}</>
                      )}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

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
