import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer 
      className="mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 text-left">
        {/* Column 1: Calculators */}
        <nav aria-label="Category Converters" className="space-y-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-xs">Categories</h4>
          <ul className="space-y-2">
            <li><Link to="/length-converter" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Length Converter</Link></li>
            <li><Link to="/weight-converter" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Weight Converter</Link></li>
            <li><Link to="/temperature-converter" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Temperature Converter</Link></li>
            <li><Link to="/cooking-converter" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cooking/Baking Converter</Link></li>
            <li><Link to="/currency-converter" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Currency Converter</Link></li>
            <li><Link to="/time-zone-converter" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Time Zone Converter</Link></li>
            <li><Link to="/bmi-calculator" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">BMI Calculator</Link></li>
          </ul>
        </nav>

        {/* Column 2: Popular Conversions */}
        <nav aria-label="Popular Conversions" className="space-y-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-xs">Popular Conversions</h4>
          <ul className="space-y-2">
            <li><Link to="/kg-to-lbs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Kg to Lbs</Link></li>
            <li><Link to="/cm-to-inches" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">CM to Inches</Link></li>
            <li><Link to="/fahrenheit-to-celsius" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Fahrenheit to Celsius</Link></li>
            <li><Link to="/ounces-to-grams" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Ounces to Grams</Link></li>
            <li><Link to="/miles-to-km" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Miles to Km</Link></li>
            <li><Link to="/cups-to-ml" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cups to mL</Link></li>
            <li><Link to="/meters-to-feet" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Meters to Feet</Link></li>
          </ul>
        </nav>

        {/* Column 3: Tools & Resources */}
        <nav aria-label="Tools and Resources" className="space-y-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-xs">Tools & Resources</h4>
          <ul className="space-y-2">
            <li><Link to="/conversions" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">All Conversions Directory</Link></li>
            <li><Link to="/blog" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Measurement Blog</Link></li>
            <li><Link to="/api-docs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Free Conversion API</Link></li>
          </ul>
        </nav>

        {/* Column 4: Global Editions */}
        <nav aria-label="International Sites" className="space-y-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-xs">Global Editions</h4>
          <ul className="space-y-2">
            <li><a href="/es/" hrefLang="es" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Español (ES)</a></li>
            <li><a href="/fr/" hrefLang="fr" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Français (FR)</a></li>
            <li><a href="/de/" hrefLang="de" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Deutsch (DE)</a></li>
            <li><a href="/hi/" hrefLang="hi" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">हिन्दी (HI)</a></li>
            <li><a href="/pt/" hrefLang="pt" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Português (PT)</a></li>
            <li><a href="/zh/" hrefLang="zh" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">中文 (ZH)</a></li>
            <li><a href="/ja/" hrefLang="ja" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">日本語 (JA)</a></li>
          </ul>
        </nav>

        {/* Column 5: QuickConvert */}
        <nav aria-label="Corporate Information" className="space-y-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-xs">QuickConvert</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</Link></li>
            <li><Link to="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
          </ul>
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-xs text-neutral-500 leading-relaxed mb-2">
              🛡️ <strong className="text-neutral-700 dark:text-neutral-300">Strictly Local:</strong> Your conversion data never leaves your device. Built as a PWA for offline use.
            </p>
          </div>
        </nav>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 pb-4 flex flex-col items-center justify-center text-center text-xs text-neutral-500 gap-4">
        <p>
          &copy; {new Date().getFullYear()} QuickConvert. {t("footerText", "Built for fast, accurate conversions.")}
        </p>
        <div className="flex gap-4 mt-1 mb-2">
          <a href="https://in.pinterest.com/hypecuts619/quickconvertunits/" itemProp="sameAs" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#E60023] transition-colors" aria-label="Pinterest page">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.39-1.72-4.058-4.169-4.058-2.824 0-4.485 2.12-4.485 4.31 0 .856.329 1.77.739 2.271.081.099.092.185.068.286-.074.32-.245 1.002-.277 1.136-.043.18-.146.223-.336.134-1.25-.583-2.03-2.413-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.861-.838 1.938-1.25 2.597A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2" />
            </svg>
          </a>
          <a href="https://www.youtube.com/@Quickconvertunits" itemProp="sameAs" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#FF0000] transition-colors" aria-label="YouTube channel">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/></svg>
          </a>
        </div>
        <p className="leading-relaxed max-w-4xl">
          <strong>Disclaimer:</strong> While we strive to provide accurate information, QuickConvert makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability of the conversion calculators. Any reliance you place on such information is therefore strictly at your own risk.
        </p>
      </div>
    </footer>
  );
}
