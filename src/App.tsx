import { useState, useEffect, useMemo, useRef, lazy, Suspense } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { getSuggestions, convert, categories, formatNumber, getSEOUrlPath, getUnitIdsFromPath, getParsedParamsFromPath, updateCurrencyRates } from "./lib/units";
import { categorySeoContent } from "./lib/seoContent";
import { customSeoData } from "./lib/customSeoData";
import categoryHubsData from "./lib/categoryHubs.json";
import { trackConversionEvent, trackFunnelStep, trackPageView, initGA, trackPWAInstall, trackNullState } from "./lib/analytics";
import { LanguageSelector } from "./components/LanguageSelector";
import { FormulaBlock } from "./components/FormulaBlock";
import { HomepageBlogHub } from "./components/HomepageBlogHub";
import { useTranslation } from "react-i18next";
import { POPULAR_CONVERSIONS, POPULAR, FORMULAS } from "./lib/constants";
import { Footer } from "./components/Footer";
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
  Code,
} from "lucide-react";
import { UnitSelector } from "./components/UnitSelector";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { DynamicContext } from "./components/DynamicContext";
import { EmbedWidget } from "./components/EmbedWidget";
import { RelatableComparison } from "./components/RelatableComparison";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "motion/react";

const ConversionChart = lazy(() => import("./components/ConversionChart"));
const HowToConvertSection = lazy(() => import("./components/HowToConvertSection"));
const RelatedToolsSection = lazy(() => import("./components/RelatedToolsSection"));
const SeoContent = lazy(() => import("./components/SeoContent").then(module => ({ default: module.SeoContent })));
const PopularConversions = lazy(() => import("./components/PopularConversions").then(module => ({ default: module.PopularConversions })));
const CategoryHubContent = lazy(() => import("./components/CategoryHubContent").then(module => ({ default: module.CategoryHubContent })));
const TimeZoneConverter = lazy(() => import("./components/TimeZoneConverter").then(module => ({ default: module.TimeZoneConverter })));
const BMICalculator = lazy(() => import("./components/BMICalculator").then(module => ({ default: module.BMICalculator })));



const SpecificConversionSEOComp = lazy(() => import("./components/SpecificConversionSEO").then(m => ({ default: m.SpecificConversionSEO })));
const CurrencyPairsTableComp = lazy(() => import("./components/CurrencyPairsTable").then(m => ({ default: m.CurrencyPairsTable })));
const QuickLinksSectionComp = lazy(() => import("./components/QuickLinksSection").then(m => ({ default: m.QuickLinksSection })));
const TrustSignalsComp = lazy(() => import("./components/TrustSignals").then(m => ({ default: m.TrustSignals })));
const HomepageInfoComp = lazy(() => import("./components/HomepageInfo"));

const categoryHubs = categoryHubsData as Record<string, {
  hub_title: string;
  authority_intro: string;
  category_logic: string;
  semantic_bridges: string[];
  common_pitfalls: string[];
}>;







interface HistoryItem {
  fv: string;
  fu: string;
  tv: string;
  tu: string;
  cat: string;
  timestamp: string;
}

const themes = ["blue", "rose", "emerald", "violet", "amber", "cyan", "fuchsia"];



function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Check if visitor is an AI crawler
    const userAgent = navigator.userAgent || '';
    const isAICrawler = /Googlebot|GPTBot|ChatGPT-User|Google-Extended|ClaudeBot|OAI-SearchBot|FacebookBot|TwitterBot/i.test(userAgent);
    
    if (isAICrawler) return;

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
      // Wait 15 seconds before showing the prompt
      setTimeout(() => {
        setIsPromptReady(true);
      }, 15000);
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
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-2 py-2 pr-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all whitespace-nowrap animate-in slide-in-from-bottom-5 fade-in duration-500">
      <button onClick={() => setIsPromptReady(false)} className="p-2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors" aria-label="Dismiss">
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleInstallClick}>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40">
          <Download className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex flex-col pr-2">
          <span className="text-sm font-semibold tracking-tight leading-tight">{t("installApp", "Install QuickConvert")}</span>
          <span className="text-[10px] text-neutral-500 leading-tight">Use offline anytime, anywhere</span>
        </div>
      </div>
      <button
        onClick={handleInstallClick}
        className="px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-full hover:bg-primary-700 transition-colors shadow-sm"
      >
        Install
      </button>
    </div>
  );
}



function parseInput(val: string): number {
  if (!val) return NaN;
  const numMatches = val.trim().match(/^(-?\d+)\s+?(\d+)\/(\d+)$/);
  if (numMatches) {
    const whole = parseFloat(numMatches[1]);
    const isNegative = whole < 0 || numMatches[1] === '-0';
    const num = parseFloat(numMatches[2]);
    const den = parseFloat(numMatches[3]);
    if (den === 0) return NaN;
    const fraction = num / den;
    return isNegative ? whole - fraction : whole + fraction;
  }
  const fracMatches = val.trim().match(/^(-?\d+)\/(\d+)$/);
  if (fracMatches) {
    const num = parseFloat(fracMatches[1]);
    const den = parseFloat(fracMatches[2]);
    if (den === 0) return NaN;
    return num / den;
  }
  return parseFloat(val);
}

// SEO functions have been moved to src/lib/units.ts

export default function App() {
  const { t, i18n } = useTranslation();
  const { conversion: paramConversion, lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Unified conversion path resolver to handle cases where :lang matches a single-segment conversion path
  const conversion = useMemo(() => {
    if (paramConversion) return paramConversion;
    if (!lang) return undefined;
    
    const isActuallyConversion = lang.includes("-to-") || lang.endsWith("-converter") || lang === "bmi-calculator";
    if (isActuallyConversion) return lang;
    
    return undefined;
  }, [paramConversion, lang]);

  const isEmbed = new URLSearchParams(location.search).get("embed") === "true";
  const isHomepage = (location.pathname === "/" || location.pathname === "/en" || location.pathname === "/en/") && !location.search.includes("val=");
  const isCategoryPage = location.pathname.endsWith("-converter") && !location.pathname.includes("-to-") && location.pathname !== "/time-zone-converter";
  const isSpecificConverter = location.pathname !== "/" && !isCategoryPage && location.pathname !== "/time-zone-converter" && location.pathname !== "/bmi-calculator";
  
  // Track analytics
  useEffect(() => {
    if (!isEmbed) {
      trackPageView(location.pathname + location.search);
    }
  }, [location, isEmbed]);

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
      const parsed = getParsedParamsFromPath(conversion);
      const parts = parsed.from && parsed.to ? [parsed.from, parsed.to] : getUnitIdsFromPath(conversion);
      if (parts.length === 2) {
        for (const cat of categories) {
          const u1 = cat.units.find(u => u.id === parts[0].toLowerCase());
          const u2 = cat.units.find(u => u.id === parts[1].toLowerCase());
          if (u1 && u2) {
            setCategory(cat.id);
            setUnitFrom(u1.id);
            setUnitTo(u2.id);
            if (parsed.val) setValFrom(parsed.val);
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
      if (conversion === "bmi-calculator") return "bmi";
      if (conversion.endsWith("-converter")) {
        const potentialCat = conversion.replace("-converter", "").replace(/-/g, "_");
        if (categories.some(c => c.id === potentialCat)) {
          return potentialCat;
        }
      }
      const parsed = getParsedParamsFromPath(conversion);
      const parts = parsed.from && parsed.to ? [parsed.from, parsed.to] : getUnitIdsFromPath(conversion);
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
      const parsed = getParsedParamsFromPath(conversion);
      const parts = parsed.from && parsed.to ? [parsed.from, parsed.to] : getUnitIdsFromPath(conversion);
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
      const parsed = getParsedParamsFromPath(conversion);
      const parts = parsed.from && parsed.to ? [parsed.from, parsed.to] : getUnitIdsFromPath(conversion);
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
    if (conversion) {
      const parsed = getParsedParamsFromPath(conversion);
      if (parsed.val !== null) return parsed.val;
    }
    const params = new URLSearchParams(window.location.search);
    const val = params.get("val");
    return val !== null ? val : "1";
  });

  // Analytics initialization and PWA tracking
  useEffect(() => {
    if (isEmbed) return;
    initGA();
    
    const handleBeforeInstallPrompt = (e: any) => {
      trackPWAInstall('prompt_shown');
      e.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          trackPWAInstall('install_accepted');
        } else {
          trackPWAInstall('install_dismissed');
        }
      });
    };

    const handleAppInstalled = () => {
      trackPWAInstall('installed_success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Track Page Views with Category/Units
  useEffect(() => {
    trackPageView(location.pathname + location.search, {
      category: category,
      from_unit: unitFrom,
      to_unit: unitTo
    });

    // Check for unit gaps in the current conversion path
    if (conversion && conversion !== 'time-zone-converter' && !conversion.includes('blog')) {
      const parsed = getParsedParamsFromPath(conversion);
      const parts = parsed.from && parsed.to ? [parsed.from, parsed.to] : getUnitIdsFromPath(conversion);
      
      if (parts.length === 2) {
        let foundInAnyCat = false;
        for (const cat of categories) {
          if (cat.units.some(u => u.id === parts[0].toLowerCase()) && cat.units.some(u => u.id === parts[1].toLowerCase())) {
            foundInAnyCat = true;
            break;
          }
        }
        if (!foundInAnyCat) {
          trackNullState(category || 'unknown', parts[0], parts[1]);
        }
      }
    }
  }, [location.pathname, location.search, category, unitFrom, unitTo, conversion]);
  
  const [valTo, setValTo] = useState(() => {
    const num = parseInput(valFrom);
    if (!isNaN(num) && category && unitFrom && unitTo) {
      const res = convert(num, unitFrom, unitTo, category);
      return Number.isInteger(res)
        ? res.toString()
        : parseFloat(res.toFixed(6)).toString();
    }
    return "";
  });

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
    const num = parseInput(valFrom);
    if (!isNaN(num)) {
      const res = convert(num, unitFrom, unitTo, category);
      // Format nicely to avoid floating point issues like 0.30000000000000004
      if (Math.abs(res) < 1e-6 || Math.abs(res) >= 1e12) {
        if (res === 0) setValTo("0");
        else setValTo(res.toExponential(6).replace(/\.?0+e/, 'e'));
      } else {
        setValTo(
          Number.isInteger(res)
            ? res.toString()
            : parseFloat(res.toFixed(8)).toString(),
        );
      }
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

        trackConversionEvent(category, unitFrom, unitTo, parseFloat(valFrom));

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
    const num = parseInput(v);
    if (!isNaN(num)) {
      const res = convert(num, unitTo, unitFrom, category);
      if (Math.abs(res) < 1e-6 || Math.abs(res) >= 1e12) {
        if (res === 0) setValFrom("0");
        else setValFrom(res.toExponential(6).replace(/\.?0+e/, 'e'));
      } else {
        setValFrom(
          Number.isInteger(res)
            ? res.toString()
            : parseFloat(res.toFixed(8)).toString(),
        );
      }
    } else {
      setValFrom("");
    }
  };

  const handleSwap = () => {
    const tempUnit = unitFrom;
    setUnitFrom(unitTo);
    setUnitTo(tempUnit);

    setValFrom(valTo);
  };

  const handleCopy = () => {
    if (valTo) {
      navigator.clipboard.writeText(valTo);
      setCopied(true);
      trackConversionEvent(category, unitFrom, unitTo);
      
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
      trackConversionEvent(category, unitFrom, unitTo);
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

  const isUSUser = () => {
    try {
      return navigator.language.includes('US') || Intl.DateTimeFormat().resolvedOptions().timeZone.includes('America/');
    } catch (e) {
      return false;
    }
  };

  const getDefaultUnits = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return { from: "", to: "" };
    if (cat.id === 'time_zone') return { from: 'time_zone', to: 'time_zone' };
    
    if (isUSUser()) {
      if (cat.id === 'length') return { from: 'foot', to: 'meter' };
      if (cat.id === 'weight') return { from: 'pound', to: 'kilogram' };
      if (cat.id === 'temperature') return { from: 'fahrenheit', to: 'celsius' };
      if (cat.id === 'volume') return { from: 'us_gallon', to: 'liter' };
      if (cat.id === 'cooking') return { from: 'us_cup', to: 'milliliter' };
    }
    return { from: cat.units[0]?.id || "", to: cat.units[1]?.id || cat.units[0]?.id || "" };
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
      const defaults = getDefaultUnits(cat.id);
      setUnitFrom(defaults.from);
      setUnitTo(defaults.to);
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
  let titleStr = "";
  let metaDescStr = "";
  let canonicalUrlStr = "";
  let ogTitleStr = "";
  let isNumericPath = location.pathname.startsWith('/convert-');
  
  const currentLang = i18n.language || 'en';
  const getLangPrefix = (l: string) => l === 'en' ? '' : `/${l}`;
  const supportedLangs = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ar', 'pt', 'ru', 'ja', 'it'];
  
  let schema: any[] = [
    {
      "@type": "Organization",
      "@id": "https://quickconvertunits.com/#organization",
      "name": "QuickConvert",
      "url": "https://quickconvertunits.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://quickconvertunits.com/favicon.svg"
      }
    }
  ];
  let activeCustomSeoContent = "";

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
    canonicalUrlStr = `https://quickconvertunits.com${getLangPrefix(currentLang)}/time-zone-converter`;
    ogTitleStr = titleStr;
    schema = [{
      "@type": "WebApplication",
      "@id": `${canonicalUrlStr}#software`,
      name: titleStr,
      url: canonicalUrlStr,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description: metaDescStr,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    }];
  } else if (category === 'bmi') {
    titleStr = 'BMI Calculator: Calculate Body Mass Index Online Free';
    metaDescStr = 'Free, fast, and easy-to-use BMI calculator. Check your Body Mass Index using metric or imperial units to see if you are at a healthy weight.';
    canonicalUrlStr = `https://quickconvertunits.com${getLangPrefix(currentLang)}/bmi-calculator`;
    ogTitleStr = titleStr;
    schema = [{
      "@type": "WebApplication",
      "@id": `${canonicalUrlStr}#software`,
      name: titleStr,
      url: canonicalUrlStr,
      applicationCategory: "HealthApplication",
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
      canonicalUrlStr = `https://quickconvertunits.com${getLangPrefix(currentLang)}/`;
      ogTitleStr = titleStr;
      customFAQs = [
        { question: "Is this unit converter free?", answer: "Yes, QuickConvert is 100% free to use. There are no registration requirements and no limits on the number of conversions you can perform." },
        { question: "How accurate are the results?", answer: "Our calculator uses industry-standard conversion factors and provides results accurate up to 6 decimal places for most measurements." },
        { question: "Does it work on mobile devices?", answer: "Yes, the website is fully responsive and works perfectly on smartphones, tablets, and desktop computers." },
        { question: "Do I need an internet connection?", answer: "Once the page is loaded, the core conversion engine works offline in your browser, making it extremely fast and accessible anywhere." }
      ];
    } else if (isCategoryPage) {
      const hub = categoryHubs[category];
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

      titleStr = hub ? `${hub.hub_title} | QuickConvert` : `Fast ${catName} Converter - Instant ${topUnits} [2026 Free]`;
      
      const specificDescriptions: Record<string, string> = {
        "length": "Convert length and distance measurements from meters, feet, kilometers, and miles. Real-time formatting with high precision.",
        "weight": "Convert weight and mass units instantly. Easily calculate pounds to kilograms, ounces to grams, and stone.",
        "temperature": "Convert temperatures between Celsius, Fahrenheit, and Kelvin. Precise scientific and everyday weather conversions using official scaling formulas.",
        "currency": "Live currency converter for USD, EUR, GBP, INR, and more. Global exchange rates updated frequently.",
        "time_zone": "Time zone converter for UTC, EST, PST, CET. Schedule global meetings and convert standard and daylight time accurately."
      };
      
      metaDescStr = hub ? hub.authority_intro : (specificDescriptions[category] || `Free ${catName.toLowerCase()} unit converter for ${allTopUnits}. ${seoSnippet || "Precise calculations with real-time results. Convert measurements instantly."}`);
      
      canonicalUrlStr = `https://quickconvertunits.com${getLangPrefix(currentLang)}/${category.replace(/_/g, '-')}-converter`;
      ogTitleStr = titleStr;
    } else {
      const valPrefix = valFrom && valFrom !== "1" && valFrom !== "0" ? `${valFrom} ` : "";
      const symbolToPath = getSEOUrlPath(unitFrom, unitTo);
      const customSeo = customSeoData[symbolToPath];

      if (customSeo && !isNumericPath) {
        titleStr = customSeo.title.replace("Converter", "Converter [2026 Free]");
        metaDescStr = customSeo.description;
        activeCustomSeoContent = customSeo.content;
        customFAQs = getFAQsFromHtml(customSeo.content);
      } else {
        const symFrom = activeFromUnit.symbol;
        const symTo = activeToUnit.symbol;
        
        if (isNumericPath && valFrom) {
          titleStr = `${valFrom} ${activeFromUnit.name} to ${activeToUnit.name} - Convert ${valFrom} ${pluralFrom} to ${pluralTo}`;
          const resultVal = convert(parseFloat(valFrom), unitFrom, unitTo, category);
          metaDescStr = `What is ${valFrom} ${activeFromUnit.name} in ${activeToUnit.name}? ${valFrom} ${symFrom} = ${formatNumber(resultVal)} ${symTo}. Detailed conversion steps and formula included.`;
        } else {
          titleStr = `Fast ${valPrefix}${pluralFrom} to ${pluralTo} Converter - Instant ${symFrom} to ${symTo} [2026 Free]`;
          metaDescStr = `Convert ${valPrefix}${pluralFrom.toLowerCase()} to ${pluralTo.toLowerCase()} instantly. 1 ${symFrom} = ${convert(1, unitFrom, unitTo, category).toPrecision(6)} ${symTo}. Offline capable, free calculator with conversion table, formula, and examples. Fast and accurate.`;
        }
      }
      
      // Handle canonical for value-based paths to allow indexing of specific value conversions if they are in the URL path
      if (isNumericPath && valFrom && valFrom !== "1") {
          canonicalUrlStr = `https://quickconvertunits.com${getLangPrefix(currentLang)}/convert-${valFrom}-${getSEOUrlPath(unitFrom, unitTo)}`;
      } else if (location.search.includes('val=') && valFrom && valFrom !== "1") {
          // If query param is used, we still canonicalize to the query param URL to avoid duplicate issues
          canonicalUrlStr = `https://quickconvertunits.com${getLangPrefix(currentLang)}/${getSEOUrlPath(unitFrom, unitTo)}?val=${valFrom}`;
      } else {
          canonicalUrlStr = `https://quickconvertunits.com${getLangPrefix(currentLang)}/${getSEOUrlPath(unitFrom, unitTo)}`;
      }
      ogTitleStr = titleStr;
    }


    schema = [
      {
        "@type": "SoftwareApplication",
        "@id": `${canonicalUrlStr}#software`,
        name: isSpecificConverter ? `${pluralFrom} to ${pluralTo} Converter` : `${titleStr}`,
        url: canonicalUrlStr,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Windows, macOS, Android, iOS",
        description: metaDescStr,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }
    ];

    if (isSpecificConverter && activeFromUnit && activeToUnit && category !== 'time_zone') {
      const schemaCitations = [
        {
          "@type": "CreativeWork",
          "name": "NIST Handbook 44 (2026 Edition)",
          "url": "https://www.nist.gov/publications/handbook-44-2026"
        },
        {
          "@type": "CreativeWork",
          "name": "IEC 62541-14:2026 Quantity Models",
          "url": "https://webstore.iec.ch/publication/62541-14-2026"
        }
      ];

      schema.push({
        "@type": "HowTo",
        "@id": `${canonicalUrlStr}#howto`,
        "name": `How to convert ${activeFromUnit.name} to ${activeToUnit.name}`,
        "sameAs": [
          `https://en.wikipedia.org/wiki/${activeFromUnit.name.replace(" ", "_")}_(unit)`,
          `https://en.wikipedia.org/wiki/${activeToUnit.name.replace(" ", "_")}_(unit)`
        ],
        "step": [
          {
            "@type": "HowToStep",
            "name": `Identify conversion factor`,
            "text": `Identify the conversion factor for ${activeFromUnit.name} to ${activeToUnit.name}.`,
            "citation": schemaCitations
          },
          {
            "@type": "HowToStep",
            "name": `Calculate`,
            "text": `Multiply your value in ${activeFromUnit.name} by the factor.`,
            "citation": schemaCitations
          },
          {
            "@type": "HowToStep",
            "name": `Result`,
            "text": "The result is your value in the target unit.",
            "citation": schemaCitations
          }
        ]
      });

      schema.push({
        "@type": "Action",
        "@id": `${canonicalUrlStr}#action`,
        name: `Converting ${activeFromUnit.name} to ${activeToUnit.name}`,
        fromUnit: activeFromUnit.name,
        toUnit: activeToUnit.name,
        value: valFrom || "1"
      });
    }

    const showSpecificFAQ = isSpecificConverter && category !== 'time_zone' && activeFromUnit && activeToUnit;
    let finalFAQs = [...customFAQs];
    
    if (showSpecificFAQ) {
      const resVal1 = convert(1, unitFrom, unitTo, category);
      const valTextStr = valFrom && valFrom !== "1" ? valFrom : "1";
      const numVal = parseFloat(valTextStr) || 1;
      const resValCurrent = convert(numVal, unitFrom, unitTo, category);
      
      const formulaText = `To calculate, you multiply the ${activeFromUnit.name} value by the conversion factor of ${formatNumber(resVal1)}.`;

      finalFAQs = [
        {
          question: numVal !== 1 ? `How do you convert ${valTextStr} ${activeFromUnit.symbol} to ${activeToUnit.symbol}?` : `How do I convert ${activeFromUnit.name} to ${activeToUnit.name}?`,
          answer: numVal !== 1 ? `To convert ${valTextStr} ${activeFromUnit.name} into ${activeToUnit.name}, you multiply ${valTextStr} by ${formatNumber(resVal1)}. The result of this calculation is ${formatNumber(resValCurrent)} ${activeToUnit.name}. Detailed step: ${valTextStr} × ${formatNumber(resVal1)} = ${formatNumber(resValCurrent)}.` : `Simply enter the value of ${activeFromUnit.name} into our online converter. The tool will calculate the result by multiplying your input by ${formatNumber(resVal1)}. 1 ${activeFromUnit.symbol} equals ${formatNumber(resVal1)} ${activeToUnit.symbol}.`
        },
        {
          question: `What is the formula for ${activeFromUnit.name} to ${activeToUnit.name}?`,
          answer: `The official formula is: [${activeToUnit.name}] = [${activeFromUnit.name}] × ${formatNumber(resVal1)}. This scientific conversion ensures absolute precision across all metric and imperial scales.`
        }
      ];

      // Add MathSolver for AI Search / Knowledge base
      schema.push({
        "@type": "MathSolver",
        "@id": `${canonicalUrlStr}#mathsolver`,
        "name": `${activeFromUnit.name} to ${activeToUnit.name} Calculation`,
        "url": canonicalUrlStr,
        "usageInfo": {
          "@type": "CreativeWork",
          "name": "QuickConvert Terms and Usage Information",
          "url": canonicalUrlStr
        },
        "inLanguage": "en",
        "learningResourceType": "Formula",
        "educationalAlignment": {
          "@type": "AlignmentObject",
          "educationalFramework": "Educational",
          "targetName": "Unit Conversion",
          "targetUrl": canonicalUrlStr
        },
        "potentialAction": {
          "@type": "SolveMathAction",
          "eduQuestionType": "Arithmetic",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${canonicalUrlStr}?val={value}`,
            "description": `Solve conversion from ${activeFromUnit.name} to ${activeToUnit.name}`
          }
        }
      });
    }

    if (finalFAQs.length > 0) {
      const schemaCitations = [
        {
          "@type": "CreativeWork",
          "name": "NIST Handbook 44 (2026 Edition)",
          "url": "https://www.nist.gov/publications/handbook-44-2026"
        },
        {
          "@type": "CreativeWork",
          "name": "IEC 62541-14:2026 Quantity Models",
          "url": "https://webstore.iec.ch/publication/62541-14-2026"
        }
      ];
      schema.push({
        "@type": "FAQPage",
        "@id": `${canonicalUrlStr}#faq`,
        mainEntity: finalFAQs.map(faq => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
            "citation": schemaCitations
          }
        }))
      });
    }

    if (isSpecificConverter && activeCategory && activeFromUnit && activeToUnit) {
      schema.push({
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrlStr}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://quickconvertunits.com/" },
          { "@type": "ListItem", "position": 2, "name": activeCategory.name, "item": `https://quickconvertunits.com/${activeCategory.id.replace(/_/g, '-')}-converter` },
          { "@type": "ListItem", "position": 3, "name": `${activeFromUnit.name} to ${activeToUnit.name}`, "item": canonicalUrlStr }
        ]
      });
    }
  }

  // Handle auto-routing logic that was in useEffect safely
  useEffect(() => {
    if (isEmbed) return; // Never auto-navigate when embedded in a widget

    if (category === 'time_zone' && location.pathname !== '/time-zone-converter') {
      navigate('/time-zone-converter', { replace: true });
    } else if (category !== 'time_zone' && activeFromUnit && activeToUnit) {
      // Use getSEOUrlPath logic to determine canonical path
      const seoPath = getSEOUrlPath(unitFrom, unitTo);
      const langPrefix = i18n.language !== "en" && i18n.language ? `/${i18n.language}` : "";
      
      const targetPath = `${langPrefix}/${seoPath}${valFrom && valFrom !== "1" ? `?val=${valFrom}` : ""}`;
      const currentFullPath = location.pathname + location.search;
      
      // IMPORTANT: Only navigate if the path is genuinely different.
      const parsed = getParsedParamsFromPath(conversion || "");
      const isAlreadyResolved = parsed.from === unitFrom && parsed.to === unitTo;

      // Fix redirects that affect SEO indexing
      if (isHomepage || isCategoryPage) {
          // Stable entry points should not auto-redirect on load
          return;
      }
      
      // Only redirect specific converter pages if they aren't on their canonical URL
      if (isSpecificConverter && currentFullPath !== targetPath && !isAlreadyResolved) {
          navigate(targetPath, { replace: true });
      }
    }
  }, [category, unitFrom, unitTo, valFrom, isEmbed, i18n.language]);

  return (
    <div
      className={`min-h-screen text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-200 relative overflow-hidden`}
    >
      <Helmet>
        <title>{titleStr}</title>
        <meta name="description" content={metaDescStr} />
        <link rel="canonical" href={canonicalUrlStr} />
        {supportedLangs.map(l => {
          let alternateUrl = "";
          const prefix = getLangPrefix(l);
          if (category === 'time_zone') {
            alternateUrl = `https://quickconvertunits.com${prefix}/time-zone-converter`;
          } else if (category === 'bmi') {
            alternateUrl = `https://quickconvertunits.com${prefix}/bmi-calculator`;
          } else if (isHomepage) {
            alternateUrl = `https://quickconvertunits.com${prefix}/`;
          } else if (isCategoryPage) {
            alternateUrl = `https://quickconvertunits.com${prefix}/${category.replace(/_/g, '-')}-converter`;
          } else {
            const path = getSEOUrlPath(unitFrom, unitTo);
            if (isNumericPath && valFrom && valFrom !== "1") {
               alternateUrl = `https://quickconvertunits.com${prefix}/convert-${valFrom}-${path}`;
            } else if (location.search.includes('val=') && valFrom && valFrom !== "1") {
               alternateUrl = `https://quickconvertunits.com${prefix}/${path}?val=${valFrom}`;
            } else {
               alternateUrl = `https://quickconvertunits.com${prefix}/${path}`;
            }
          }
          return <link key={l} rel="alternate" hrefLang={l} href={alternateUrl} />;
        })}
        <link rel="alternate" hrefLang="x-default" href={(() => {
          if (category === 'time_zone') return "https://quickconvertunits.com/time-zone-converter";
          if (category === 'bmi') return "https://quickconvertunits.com/bmi-calculator";
          if (isHomepage) return "https://quickconvertunits.com/";
          if (isCategoryPage) return `https://quickconvertunits.com/${category.replace(/_/g, '-')}-converter`;
          const path = getSEOUrlPath(unitFrom, unitTo);
          if (isNumericPath && valFrom && valFrom !== "1") return `https://quickconvertunits.com/convert-${valFrom}-${path}`;
          if (location.search.includes('val=') && valFrom && valFrom !== "1") return `https://quickconvertunits.com/${path}?val=${valFrom}`;
          return `https://quickconvertunits.com/${path}`;
        })()} />
        <meta property="og:title" content={ogTitleStr} />
        <meta property="og:description" content={metaDescStr} />
        <meta property="og:url" content={canonicalUrlStr} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitleStr} />
        <meta name="twitter:description" content={metaDescStr} />
        <script type="application/ld+json" data-rh="true">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": schema
          })}
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
      {!isEmbed && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/5 dark:bg-primary-500/10 blur-[120px]" />
          <div className="absolute top-[40%] right-[-10%] w-[40%] h-[60%] rounded-full bg-primary-500/5 dark:bg-primary-500/10 blur-[140px]" />
        </div>
      )}

      {/* Header */}
      {!isEmbed && (
        <>
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
                <Link to="/blog" className="hidden sm:block text-sm font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-500 transition-colors">
                  Guides & Blog
                </Link>
                
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
                      className="w-full pl-9 pr-14 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 text-base md:text-sm transition-shadow"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                      <span className="text-[10px] font-medium text-neutral-400 px-1.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50">⌘K</span>
                    </div>
                  </div>
                  {isSearchFocused && (
                    <div className="absolute top-11 left-0 right-0 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
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
                      {!searchQuery && (
                        <>
                          <div className="px-4 py-2 text-xs font-semibold text-neutral-500 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 border-t">
                            Top Searches
                          </div>
                          {POPULAR.slice(0, 5).map((p, i) => (
                            <button
                              key={`pop-${i}`}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors flex items-center justify-between group"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                selectSuggestion({
                                  categoryId: p.cat,
                                  fromId: p.fu,
                                  toId: p.tu,
                                });
                              }}
                            >
                              <span>{p.label}</span>
                              <TrendingUp className="w-3 h-3 text-primary-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </>
                      )}
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
                                          : t === "cyan"
                                            ? "#06b6d4"
                                            : t === "fuchsia"
                                              ? "#d946ef"
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
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-base md:text-sm"
              />
            </div>
            <AnimatePresence>
              {isSearchFocused && (
                <div className="absolute top-14 left-0 right-0 bg-white dark:bg-neutral-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-neutral-100 dark:border-neutral-800 overflow-hidden z-[110] mx-4 max-h-[60vh] overflow-y-auto">
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
                  {!searchQuery && (
                    <>
                      <div className="px-4 py-2 text-xs font-semibold text-neutral-500 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 border-t">
                        Top Searches
                      </div>
                      {POPULAR.slice(0, 5).map((p, i) => (
                        <button
                          key={`mobile-pop-${i}`}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors flex items-center justify-between group border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectSuggestion({
                              categoryId: p.cat,
                              fromId: p.fu,
                              toId: p.tu,
                            });
                          }}
                        >
                          <span>{p.label}</span>
                          <TrendingUp className="w-4 h-4 text-primary-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </>
                  )}
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
        </>
      )}

      {/* Main Layout containing Ad zones */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col lg:flex-row gap-8 pb-24 md:pb-12 relative z-10">
        {/* Left Column (Main App + Content) */}
        <div className="flex-1 max-w-3xl mx-auto w-full">
          {!isEmbed && (
            <Breadcrumbs 
              category={{id: category, name: activeCategory.name}} 
              unitFrom={{name: activeFromUnit?.name || ''}} 
              unitTo={{name: activeToUnit?.name || ''}} 
              isSpecificConverter={isSpecificConverter} 
            />
          )}
          {!isEmbed && (
            <div className="text-center mb-8">
              {category === 'time_zone' ? (
                <h1 className="flex items-center justify-center flex-wrap gap-2 md:gap-4 text-2xl md:text-4xl font-semibold tracking-tight mb-2 text-neutral-900 dark:text-white">
                  Time Zone Converter
                </h1>
              ) : category === 'bmi' ? (
                <h1 className="flex items-center justify-center flex-wrap gap-2 md:gap-4 text-2xl md:text-4xl font-semibold tracking-tight mb-2 text-neutral-900 dark:text-white">
                  BMI Calculator
                </h1>
              ) : location.pathname === "/" ? (
                <h1 className="flex items-center justify-center flex-wrap gap-2 md:gap-4 text-2xl md:text-4xl font-semibold tracking-tight mb-2 text-neutral-900 dark:text-white">
                  Quick & Accurate Unit Converter
                </h1>
              ) : (
                <h1 className="flex items-center justify-center flex-wrap gap-2 md:gap-4 text-2xl md:text-4xl font-semibold tracking-tight mb-2 text-neutral-900 dark:text-white">
                  {isCategoryPage && categoryHubs[category] ? (
                    <>{categoryHubs[category].hub_title}</>
                  ) : valFrom && valFrom !== "1" && valFrom !== "0" && !Number.isNaN(parseFloat(valFrom)) ? (
                    <>
                      {valFrom} {(parseFloat(valFrom) === 1 ? activeFromUnit?.name : ((activeFromUnit?.name || '').endsWith('s') ? activeFromUnit?.name : `${activeFromUnit?.name}s`))} to {(activeToUnit?.name || '').endsWith('s') ? activeToUnit?.name : `${activeToUnit?.name}s`}
                    </>
                  ) : (
                    <>
                      {(activeFromUnit?.name || '').endsWith('s') ? activeFromUnit?.name : `${activeFromUnit?.name}s`} to {(activeToUnit?.name || '').endsWith('s') ? activeToUnit?.name : `${activeToUnit?.name}s`} Converter
                    </>
                  )}
                  <button
                    onClick={toggleFavorite}
                    className={`flex-shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-colors ${
                      isFavorited
                        ? "bg-amber-100 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/30"
                        : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 dark:bg-[#1a1a1a] dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    }`}
                    title={isFavorited ? "Saved to Favorites" : "Save this conversion"}
                  >
                    <Star className={`w-4 h-4 md:w-5 md:h-5 ${isFavorited ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('embed-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 dark:bg-[#1a1a1a] dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 transition-colors"
                    title="Embed this calculator"
                  >
                    <Code className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </h1>
              )}
            </div>
          )}

          {/* Converter Card */}
          {category === 'time_zone' ? (
            <Suspense fallback={<div className="h-[400px] flex items-center justify-center bg-white dark:bg-[#111111] rounded-[2.5rem]">Loading converter...</div>}>
              <TimeZoneConverter />
            </Suspense>
          ) : category === 'bmi' ? (
            <Suspense fallback={<div className="h-[400px] flex items-center justify-center bg-white dark:bg-[#111111] rounded-[2.5rem]">Loading calculator...</div>}>
              <BMICalculator />
            </Suspense>
          ) : (
          <motion.div
            layout
            className={`bg-white dark:bg-[#111111] p-6 md:p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 relative z-10 overflow-hidden mb-8 ${isEmbed ? 'p-4 md:p-6' : ''}`}
          >
            {/* Subtle light effect for dark mode inside card */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] pointer-events-none hidden dark:block" />

            {isEmbed && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 font-bold text-lg text-primary-600 dark:text-primary-500">
                  <img src="/favicon.svg" alt="" className="w-5 h-5" />
                  <span>{activeFromUnit?.name} to {activeToUnit?.name}</span>
                </div>
              </div>
            )}

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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2">
                <button
                  onClick={handleSwap}
                  className="bg-white dark:bg-[#1e1e1e] text-neutral-500 dark:text-neutral-400 p-3 md:p-4 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-[#252525] hover:scale-110 active:scale-90 transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 group"
                  aria-label={t("swap", "Swap units")}
                >
                  <motion.div
                    whileTap={{ rotate: 180 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <ArrowRightLeft className="w-5 h-5 pointer-events-none group-hover:rotate-180 transition-transform duration-500" />
                  </motion.div>
                </button>
              </div>

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
              
              {(category === 'length' || category === 'weight' || category === 'volume') && valTo && valFrom && (
                <RelatableComparison category={category} valTo={valTo} unitTo={unitTo} valFrom={valFrom} unitFrom={unitFrom} />
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
            {isEmbed && (
              <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center">
                <a 
                  href="https://quickconvertunits.com/" 
                  target="_blank" 
                  rel="noopener"
                  className="text-xs text-neutral-400 hover:text-primary-500 transition-colors flex items-center gap-1"
                >
                  Powered by QuickConvert
                </a>
              </div>
            )}
          </motion.div>
          )}


          {/* SEO Content Article */}
          {!isEmbed && !isHomepage && category !== 'time_zone' && activeFromUnit && activeToUnit && valFrom !== "" && (
            <article className="mt-8 bg-white dark:bg-[#111111] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-neutral-100 dark:border-neutral-800">
              <header className="mb-8 overflow-hidden">
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Convert {valFrom} {activeFromUnit.name} to {activeToUnit.name}
                </h2>
                <p className="text-4xl md:text-5xl mt-6 mb-2 font-mono text-primary-600 dark:text-primary-400 break-words">
                  {valFrom} {activeFromUnit.symbol} = {valTo} {activeToUnit.symbol}
                </p>
              </header>

              <section className="prose prose-neutral dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4 mt-0 text-neutral-900 dark:text-neutral-100">How to calculate {valFrom} {activeFromUnit.name} to {activeToUnit.name}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  To convert {activeFromUnit.name} to {activeToUnit.name}, you simply apply the conversion factor.
                </p>
                <FormulaBlock
                  valFrom={valFrom}
                  fromSymbol={activeFromUnit.symbol}
                  factor={formatNumber(convert(1, unitFrom, unitTo, category))}
                  valTo={valTo}
                  toSymbol={activeToUnit.symbol}
                  category={category}
                  fromUnitId={unitFrom}
                  toUnitId={unitTo}
                />
              </section>

              <section className="mt-10 overflow-x-auto">
                <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Common {activeFromUnit.name} to {activeToUnit.name} Conversions</h3>
                <table className="w-full text-left border-collapse min-w-[300px]">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="py-3 px-4 font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider text-xs">{activeFromUnit.name.toUpperCase()}</th>
                      <th className="py-3 px-4 font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider text-xs">{activeToUnit.name.toUpperCase()}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {[1, 5, 10, 50, 100, 250, 500, 1000].map(val => (
                      <tr key={val} className="hover:bg-neutral-50 dark:hover:bg-[#161616] transition-colors">
                        <td className="py-3 px-4 font-mono">
                          <Link to={`/convert-${val}-${getSEOUrlPath(unitFrom, unitTo)}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                            {val} {activeFromUnit.symbol}
                          </Link>
                        </td>
                        <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300">
                          {parseFloat(convert(val, unitFrom, unitTo, category).toFixed(6))} {activeToUnit.symbol}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </article>
          )}


          {/* Categories */}
          {!isEmbed && (
            <div className="flex overflow-x-auto md:flex-wrap no-scrollbar gap-3 mt-8 mb-8 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center items-center text-center min-h-[60px]">
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
          )}

          {/* Embed Widget Option */}
          {!isEmbed && (
            <div id="embed-section">
              <EmbedWidget
                category={category}
                fromUnitId={unitFrom}
                toUnitId={unitTo}
              />
            </div>
          )}

          {/* Featured Result for Numeric Paths */}
          {!isEmbed && valFrom && valFrom !== "1" && valFrom !== "0" && !Number.isNaN(parseFloat(valFrom)) && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-8 rounded-[2.5rem] bg-primary-500 text-white shadow-[0_20px_50px_rgba(59,130,246,0.2)] dark:shadow-none text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-[60px]" />
                <p className="text-primary-100 text-sm font-semibold uppercase tracking-widest mb-2">Featured Result</p>
                <div className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                  {valFrom} {activeFromUnit.symbol} = {valTo} {activeToUnit.symbol}
                </div>
                <div className="text-primary-50/80 text-lg font-medium">
                  {valFrom} {activeFromUnit.name} is equal to exactly {valTo} {activeToUnit.name}
                </div>
                {category !== 'temperature' && (
                  <div className="mt-6 inline-block px-6 py-2 rounded-2xl bg-white/10 backdrop-blur-sm font-mono text-sm">
                    {valFrom} {activeFromUnit.symbol} × {formatNumber(convert(1, unitFrom, unitTo, category))} = {valTo} {activeToUnit.symbol}
                  </div>
                )}
              </motion.div>

              <div className="mb-12 p-8 rounded-3xl bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4 tracking-tight">How to Convert {valFrom} {activeFromUnit.name} to {activeToUnit.name}?</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none font-light text-neutral-600 dark:text-neutral-400">
                  <p>
                    To convert <strong>{valFrom} {activeFromUnit.name.toLowerCase()}</strong> to <strong>{activeToUnit.name.toLowerCase()}</strong>, we use the following conversion formula:
                  </p>
                  <FormulaBlock
                    valFrom={valFrom}
                    fromSymbol={activeFromUnit.symbol}
                    factor={formatNumber(convert(1, unitFrom, unitTo, category))}
                    valTo={valTo}
                    toSymbol={activeToUnit.symbol}
                    category={category}
                    fromUnitId={unitFrom}
                    toUnitId={unitTo}
                  />
                  <p>
                    By applying the conversion factor of <strong>{formatNumber(convert(1, unitFrom, unitTo, category))}</strong>, we find that {valFrom} {activeFromUnit.name.toLowerCase()} is exactly {valTo} {activeToUnit.name.toLowerCase()}. This calculation is critical for accuracy in science, engineering, and everyday measurements.
                  </p>
                </div>
              </div>
              
              <DynamicContext
                valFrom={valFrom}
                valTo={valTo}
                unitFrom={activeFromUnit}
                unitTo={activeToUnit}
                category={category}
              />
            </>
          )}

          {/* Conversion Chart for Specific Categories */}
          {!isEmbed && !isHomepage && (
            <Suspense fallback={<div className="mt-8 h-[350px] flex items-center justify-center bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-700">Loading chart...</div>}>
              <ConversionChart
                categoryId={category}
                valFrom={valFrom}
                unitFrom={unitFrom}
                theme={theme}
              />
            </Suspense>
          )}
          
          {!isEmbed && !isHomepage && category !== 'time_zone' && activeFromUnit && activeToUnit && (
            <Suspense fallback={null}>
              <HowToConvertSection
                category={category}
                activeFromUnit={activeFromUnit as any}
                activeToUnit={activeToUnit as any}
              />
            </Suspense>
          )}
          
          {!isEmbed && !isHomepage && category !== 'time_zone' && activeFromUnit && activeToUnit && (
            <Suspense fallback={null}>
              <RelatedToolsSection
                categoryName={categories.find(c => c.id === category)?.name || category}
                category={category}
                activeFromUnit={activeFromUnit as any}
                activeToUnit={activeToUnit as any}
                units={categories.find(c => c.id === category)?.units || []}
              />
            </Suspense>
          )}

          {!isHomepage && category !== 'time_zone' && activeFromUnit && activeToUnit && (
            <Suspense fallback={<div className="h-[200px]" />}>
              <QuickLinksSectionComp 
                fromUnit={activeFromUnit} 
                toUnit={activeToUnit} 
                category={category} 
                baseVal={valFrom}
              />
            </Suspense>
          )}

          {!isHomepage && isSpecificConverter && category !== 'time_zone' && activeFromUnit && activeToUnit && (
            <Suspense fallback={<div className="h-[400px]" />}>
              <SpecificConversionSEOComp
                fromUnit={activeFromUnit as any}
                toUnit={activeToUnit as any}
                category={category}
              />
            </Suspense>
          )}

          {!isHomepage && isCategoryPage && category === 'currency' && (
            <Suspense fallback={<div className="h-[300px]" />}>
              <CurrencyPairsTableComp />
            </Suspense>
          )}

          

          {/* Trust Signals / User Reviews */}
          {!isEmbed && (
            <Suspense fallback={<div className="mt-16 h-[500px]" />}>
              <TrustSignalsComp />
            </Suspense>
          )}

          {/* SEO Content Sections with Popular & History */}
          {!isEmbed && (
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
                            aria-label={`Remove history item ${h.fv} ${h.fu} to ${h.tv} ${h.tu}`}
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

            {isCategoryPage && (
              <Suspense fallback={null}>
                <CategoryHubContent category={category} />
              </Suspense>
            )}

            <Suspense fallback={null}>
              <SeoContent 
                unitFrom={unitFrom} 
                unitTo={unitTo} 
                category={category} 
                categories={categories} 
              />
            </Suspense>
            
            <Suspense fallback={null}>
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
            </Suspense>

            {isHomepage && (
              <Suspense fallback={null}>
                <HomepageBlogHub />
                <HomepageInfoComp />
              </Suspense>
            )}
          </section>
        )}

        {/* Dynamic Category SEO Content visible to users AND crawlers */}
        {!isEmbed && !isHomepage && isCategoryPage && categorySeoContent[category] && (
          <div 
            className="mt-16 bg-white dark:bg-[#111111] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-neutral-100 dark:border-neutral-800 prose prose-neutral dark:prose-invert max-w-none category-seo-content"
            dangerouslySetInnerHTML={{ __html: categorySeoContent[category] }}
          />
        )}

        {/* Dynamic Specific Conversion SEO Content visible to users AND crawlers */}
        {!isEmbed && !isHomepage && isSpecificConverter && activeCustomSeoContent && (
          <div 
            className="mt-16 bg-white dark:bg-[#111111] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-neutral-100 dark:border-neutral-800 prose prose-neutral dark:prose-invert max-w-none category-seo-content"
            dangerouslySetInnerHTML={{ __html: activeCustomSeoContent }}
          />
        )}

          {/* SEO Optimized Footer */}
          {!isEmbed && <Footer />}
        </div>

        {/* Right Column (Sidebar Ads Desktop) */}
      </div>
      
      {/* {!isEmbed && <CookieConsent />} */}
      {/* {!isEmbed && <PwaPrompt />} */}

      {/* Error Toast */}
      <div id="error-toast" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-red-500 text-white rounded-full font-medium text-sm shadow-xl opacity-0 translate-y-4 pointer-events-none transition-all duration-300">
        Error message
      </div>
    </div>
  );
}
