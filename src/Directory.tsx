import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { categories, getSEOUrlPath } from './lib/units';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function Directory() {
  const { category, pair } = useParams();

  // Route: /conversions/:category/:pair
  if (category && pair) {
    const catData = categories.find(c => c.id === category);
    if (!catData) return <div>Category not found</div>;
    
    // Attempt to extract units from pair string (e.g. meter-to-foot)
    const [fromStr, toStr] = pair.split('-to-');
    const fromUnit = catData.units.find(u => u.name.toLowerCase() === fromStr || getSEOUrlPath(u.id, catData.units[0].id).includes(fromStr));
    const toUnit = catData.units.find(u => u.name.toLowerCase() === toStr || getSEOUrlPath(catData.units[0].id, u.id).includes(toStr));
    
    // Provide a default if parsing is tricky, or we can just iterate by numbers
    const validPair = pair;
    
    const range = Array.from({ length: 200 }, (_, i) => i + 1);

    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 p-8 max-w-5xl mx-auto">
        <Helmet>
          <title>{`${validPair.replace(/-/g, ' ')} Conversions Directory | QuickConvert`}</title>
          <meta name="description" content={`List of common ${validPair.replace(/-/g, ' ')} conversions.`} />
        </Helmet>
        
        <div className="mb-8">
          <Link to={`/conversions/${category}`} className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to {catData.name} Conversions
          </Link>
          <h1 className="text-3xl font-bold mt-4 capitalize">{validPair.replace(/-/g, ' ')}</h1>
          <p className="text-neutral-500 mt-2">Browse the most popular conversion values.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {range.map(num => (
            <Link 
              key={num} 
              to={`/convert-${num}-${validPair}`}
              className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-center transition-colors text-sm font-medium"
            >
              {num} {fromStr || 'units'} to {toStr || 'units'}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Route: /conversions/:category
  if (category) {
    const catData = categories.find(c => c.id === category);
    if (!catData) return <div>Category not found</div>;

    const pairs = [];
    for (const from of catData.units) {
      for (const to of catData.units) {
        if (from.id !== to.id) {
          pairs.push({
            from, to,
            path: getSEOUrlPath(from.id, to.id)
          });
        }
      }
    }

    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 p-8 max-w-5xl mx-auto">
        <Helmet>
          <title>{`${catData.name} Conversions Directory | QuickConvert`}</title>
          <meta name="description" content={`Comprehensive list of all ${catData.name.toLowerCase()} conversion pairs.`} />
        </Helmet>
        
        <div className="mb-8">
          <Link to={`/conversions`} className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to All Categories
          </Link>
          <h1 className="text-3xl font-bold mt-4">{catData.name} Conversions</h1>
          <p className="text-neutral-500 mt-2">Select a conversion pair to see values.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pairs.map((pair, idx) => (
            <Link 
              key={idx}
              to={`/conversions/${category}/${pair.path}`}
              className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="font-medium">{pair.from.name} to {pair.to.name}</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Route: /conversions
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 p-8 max-w-5xl mx-auto">
      <Helmet>
        <title>All Unit Conversions Directory Sitemap | QuickConvert</title>
        <meta name="description" content="View all conversion categories and tools available on QuickConvert." />
      </Helmet>

      <div className="mb-8">
        <Link to={`/`} className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Calculator
        </Link>
        <h1 className="text-3xl font-bold mt-4">Conversions Directory</h1>
        <p className="text-neutral-500 mt-2">Select a category below to browse specific conversion tables and tools.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((c) => (
          <Link 
            key={c.id}
            to={`/conversions/${c.id}`}
            className="group block p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-primary-500/30 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all"
          >
            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">{c.name}</h2>
            <p className="text-sm text-neutral-500 line-clamp-2">{c.units.map(u => u.name).slice(0, 5).join(', ')}...</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
