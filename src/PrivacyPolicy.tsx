import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  const { lang } = useParams();
  const currentLang = lang || 'en';
  const getLangPrefix = (l: string) => l === 'en' ? '' : `/${l}`;
  const supportedLangs = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ar', 'pt', 'ru', 'ja', 'it'];
  const canonicalUrl = `https://quickconvertunits.com${getLangPrefix(currentLang)}/privacy-policy`;

  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 font-sans p-6 md:p-12">
      <Helmet>
        <title>Privacy Policy | QuickConvert</title>
        <meta name="description" content="Read the QuickConvert Privacy Policy to understand how we handle your data and respect your privacy while using our unit conversion tools." />
        <link rel="canonical" href={canonicalUrl} />
        {supportedLangs.map(l => (
          <link 
            key={l}
            rel="alternate" 
            hrefLang={l} 
            href={`https://quickconvertunits.com${getLangPrefix(l)}/privacy-policy`} 
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://quickconvertunits.com/privacy-policy" />
      </Helmet>
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#111111] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 p-8 md:p-16">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium text-sm transition-colors mb-10 text-neutral-800 dark:text-neutral-200">
          <ArrowLeft className="w-4 h-4" /> Back to Converter
        </Link>
        
        <h1 className="text-4xl font-semibold mb-8 text-neutral-900 dark:text-white tracking-tight">Privacy Policy</h1>
        
        <div className="space-y-8 text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm md:text-base font-light">
          <p>
            <strong className="font-medium text-neutral-900 dark:text-neutral-200">Last Updated: {new Date().toLocaleDateString()}</strong>
          </p>

          <p>
            Welcome to QuickConvert (<strong className="font-medium text-neutral-900 dark:text-neutral-200">quickconvertunits.com</strong>). Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and share information when you use our website.
          </p>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong className="font-medium text-neutral-900 dark:text-neutral-200">Usage Data:</strong> We may automatically collect information regarding your interaction with the site, including your IP address, browser type, operating system, and pages visited.</li>
              <li><strong className="font-medium text-neutral-900 dark:text-neutral-200">Cookies:</strong> We use cookies to enhance your browsing experience, serve personalized ads, and analyze our traffic.</li>
              <li><strong className="font-medium text-neutral-900 dark:text-neutral-200">Device Information:</strong> We may collect information about the device you use to access the website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-3">
              <li>Provide, operate, and maintain our website.</li>
              <li>Improve, personalize, and expand our website's functionality.</li>
              <li>Understand and analyze how you use our website.</li>
              <li>Display relevant advertisements (including via Google AdSense).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">3. Third-Party Services and Advertisers</h2>
            <p className="mb-3">
              We use third-party advertising companies to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
            <p className="mb-3">
              <strong className="font-medium text-neutral-900 dark:text-neutral-200">Google AdSense and DoubleClick Cookie:</strong> Google, as a third-party vendor, uses cookies to serve ads on quickconvertunits.com. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
            </p>
            <p>
              You may opt out of personalized advertising by visiting the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline transition-colors">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline transition-colors">www.aboutads.info</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">4. Log Files & Local Storage</h2>
            <p className="mb-3">
              Because QuickConvert features a local-first architecture built as a Progressive Web App (PWA), the vast majority of your calculation data never leaves your device. Numerical inputs, conversion histories, and local preferences are stored locally in your browser's LocalStorage and are completely private to you.
            </p>
            <p>
              Separate from your private calculating activities, we utilize Google Analytics 4 (GA4) to understand high-level traffic behavior (such as which conversion page is the most popular). This analytics tracking assigns an anonymous identifier and tracks aggregate page views but does not have access to your exact calculator inputs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">5. Data Security</h2>
            <p>
              We take appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. However, please be aware that no storage or transmission mechanism on the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">5. Children's Privacy</h2>
            <p>
              Our website does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">6. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us by visiting our website at <strong className="font-medium text-neutral-900 dark:text-neutral-200">quickconvertunits.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
