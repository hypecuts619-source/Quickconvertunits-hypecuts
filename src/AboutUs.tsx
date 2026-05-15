import { ArrowLeft, CheckCircle2, Shield, Users, Zap } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function AboutUs() {
  const { lang } = useParams();
  const currentLang = lang || 'en';
  const getLangPrefix = (l: string) => l === 'en' ? '' : `/${l}`;
  const supportedLangs = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ar', 'pt', 'ru', 'ja', 'it'];
  const canonicalUrl = `https://quickconvertunits.com${getLangPrefix(currentLang)}/about`;

  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 font-sans p-6 md:p-12">
      <Helmet>
        <title>About QuickConvert | Our Mission and Team</title>
        <meta name="description" content="Learn about QuickConvert, our mission to provide the internet's fastest unit conversion platform, and the independent team behind the project." />
        <link rel="canonical" href={canonicalUrl} />
        {supportedLangs.map(l => (
          <link 
            key={l}
            rel="alternate" 
            hrefLang={l} 
            href={`https://quickconvertunits.com${getLangPrefix(l)}/about`} 
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://quickconvertunits.com/about" />
      </Helmet>
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#111111] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 p-8 md:p-16">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium text-sm transition-colors mb-10 text-neutral-800 dark:text-neutral-200">
          <ArrowLeft className="w-4 h-4" /> Back to Converter
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 text-neutral-900 dark:text-white tracking-tight">About QuickConvert</h1>
        
        <div className="space-y-12 text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px] md:text-base font-light">
          <p className="text-xl leading-normal font-medium text-neutral-800 dark:text-neutral-200">
            QuickConvert (<strong className="font-semibold text-primary-600 dark:text-primary-400">quickconvertunits.com</strong>) is an independent engineering project dedicated to providing the internet's fastest, most accurate, and accessible unit conversion platform.
          </p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Our Mission</h2>
            <p className="mb-4">
              QuickConvertUnits was built to provide lightning-fast, local-first math conversions for travelers and students without the bloat of traditional ad-heavy calculators. We noticed that existing standard calculators on the web were increasingly becoming bloated with autoplay videos, sluggish load times, and invasive tracking scripts. Our goal was simple: build a mathematically precise tool that works instantly, even offline, and respects the user's intelligence.
            </p>
            <p>
              Developed by an independent web engineering team based in India, our project focuses on global utility. We are deeply committed to ensuring that everyday mathematical tools are accessible to anyone, anywhere in the world, regardless of their device's processing power or internet connection speed.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 my-10">
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800/80">
              <Zap className="w-6 h-6 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Speed First Design</h3>
              <p className="text-sm">We engineered our core conversion engine to run entirely client-side. This means 99% of our calculations happen locally on your device in milliseconds without waiting for server responses.</p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800/80">
              <Shield className="w-6 h-6 text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Privacy & Security</h3>
              <p className="text-sm">Your data is your business. We do not track, store, or analyze the specific numerical values you input into the calculators. No accounts or registrations are required.</p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800/80">
              <CheckCircle2 className="w-6 h-6 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Mathematical Precision</h3>
              <p className="text-sm">Our formulas map to definitions established by the International System of Units (SI) and the National Institute of Standards and Technology (NIST) to ensure exact scaling parameters.</p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800/80">
              <Users className="w-6 h-6 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Built for Everyone</h3>
              <p className="text-sm">Whether you are a baker converting grams to cups, an engineer dealing in Pascals to Bar, or a traveler checking the local currency exchange rates, we built interfaces specific to your workflow.</p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Editorial & Data Guidelines</h2>
            <p className="mb-4">
              Providing accurate conversions requires stringent data policies. Our editorial process for writing articles and guides involves rigorous fact-checking against academic and mathematical records. Every unit conversion is cross-referenced to ensure international applicability.
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong className="font-medium text-neutral-900 dark:text-neutral-200">Currency Data:</strong> Live foreign exchange rates are pulled dynamically via verified, institutional financial APIs (like the European Central Bank standard) ensuring mid-market accuracy.</li>
              <li><strong className="font-medium text-neutral-900 dark:text-neutral-200">Historical & Contextual Data:</strong> Content regarding the origin of Imperial and Metric measurements is researched from primary historical documentation.</li>
              <li><strong className="font-medium text-neutral-900 dark:text-neutral-200">Adherence to Standards:</strong> We utilize exact fractional multipliers for imperial conversions where appropriate to eliminate floating-point arithmetic errors on long chains of conversion.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Our Story</h2>
            <p>
              The project was started after we grew endlessly frustrated with existing unit converters that were bogged down by intrusive splash pages, hidden paywalls, and confusing navigation. QuickConvert was born out of a desire for a clean, distraction-free environment that prioritizes user experience above all else. Today, we support thousands of rapid calculations globally per day, empowering a community of professionals and enthusiasts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">Our Team</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-800/30">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Stephen Sebastian</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium text-sm mb-2">IT Head</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Leading the technical architecture and ensuring our local-first rendering engine delivers instantaneous, precise calculations.</p>
              </div>
              <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-800/30">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Rojin Jacob</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium text-sm mb-2">Content & Marketing Head</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Driving our editorial strategy and guaranteeing that our math guides remain accessible, globally relevant, and strictly accurate.</p>
              </div>
            </div>
          </section>

          <footer className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-sm flex flex-col md:flex-row gap-4 justify-between items-center">
            <span className="font-medium">Need to get in touch? We typically respond within 48 hours.</span>
            <Link to="/contact" className="px-6 py-2.5 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors">
              Contact Support
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
