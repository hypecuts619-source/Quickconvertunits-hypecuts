import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Code, Link as LinkIcon, Database, Zap } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function ApiDocs() {
  const { lang } = useParams();
  const currentLang = lang || 'en';
  const getLangPrefix = (l: string) => l === 'en' ? '' : `/${l}`;
  const supportedLangs = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ar', 'pt', 'ru', 'ja', 'it'];
  const canonicalUrl = `https://quickconvertunits.com${getLangPrefix(currentLang)}/api-docs`;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-sans">
      <Helmet>
        <title>Unit Conversion API | Free Developer API by QuickConvert</title>
        <meta name="description" content="Free REST API for unit conversions. Convert weight, length, temperature, and more instantly with our fast, highly rate-limited JSON API." />
        <link rel="canonical" href={canonicalUrl} />
        {supportedLangs.map(l => (
          <link 
            key={l}
            rel="alternate" 
            hrefLang={l} 
            href={`https://quickconvertunits.com${getLangPrefix(l)}/api-docs`} 
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://quickconvertunits.com/api-docs" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Code className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Free Conversion API</h1>
          </div>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            A fast, reliable, and free REST API for unit conversions. Build powerful tools instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <Zap className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Powered by edge workers running worldwide with ultra-low latency.</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <Database className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">No API Key</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Start building immediately. No registration or auth required.</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <LinkIcon className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Attribution Required</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Free to use, just provide a link back to QuickConvert in your app.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-10 border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            Endpoint
          </h2>
          
          <div className="bg-neutral-900 text-neutral-100 p-4 rounded-xl mb-8 flex items-center font-mono text-sm overflow-x-auto">
            <span className="text-blue-400 font-bold mr-4">GET</span>
            https://quickconvertunits.com/api/v1/convert
          </div>

          <h3 className="text-xl font-bold mb-4">Query Parameters</h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="py-3 px-4 font-semibold text-neutral-600 dark:text-neutral-400">Parameter</th>
                  <th className="py-3 px-4 font-semibold text-neutral-600 dark:text-neutral-400">Type</th>
                  <th className="py-3 px-4 font-semibold text-neutral-600 dark:text-neutral-400">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <td className="py-3 px-4 font-mono text-sm font-bold">value</td>
                  <td className="py-3 px-4 text-sm">Number</td>
                  <td className="py-3 px-4 text-sm">The numeric value to convert (default: 1)</td>
                </tr>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <td className="py-3 px-4 font-mono text-sm font-bold">from</td>
                  <td className="py-3 px-4 text-sm">String</td>
                  <td className="py-3 px-4 text-sm">The ID of the unit to convert from (e.g., kg, lbs, meters)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-sm font-bold">to</td>
                  <td className="py-3 px-4 text-sm">String</td>
                  <td className="py-3 px-4 text-sm">The ID of the unit to convert to (e.g., lbs, kg, feet)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold mb-4">Example Request</h3>
          <div className="bg-neutral-900 text-neutral-100 p-4 rounded-xl mb-6 font-mono text-sm overflow-x-auto">
            curl "https://quickconvertunits.com/api/v1/convert?value=100&from=kg&to=lbs"
          </div>

          <h3 className="text-xl font-bold mb-4">Response</h3>
          <div className="bg-neutral-900 text-green-400 p-4 rounded-xl mb-8 font-mono text-sm overflow-x-auto whitespace-pre">
{`{
  "value": 100,
  "from": "kg",
  "to": "lbs",
  "result": 220.462262,
  "timestamp": "2026-05-08T14:00:00Z",
  "attribution": "Powered by QuickConvert API - https://quickconvertunits.com"
}`}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Usage Limits & Attribution</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              The API is strictly rate-limited for fair use (1000 requests/IP/hour). For commercial applications
              or higher limits, contact us. You must provide a clear "Powered by QuickConvert" link back to our site in any tools using this API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
