import React from 'react';
import categoryHubsData from '../lib/categoryHubs.json';
import { Link } from 'react-router-dom';

const categoryHubs = categoryHubsData as Record<string, {
  hub_title: string;
  authority_intro: string;
  category_logic: string;
  semantic_bridges: string[];
  common_pitfalls: string[];
}>;

export function CategoryHubContent({ category }: { category: string }) {
  const hub = categoryHubs[category];
  if (!hub) return null;

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none mt-12 border-t border-neutral-100 dark:border-neutral-800 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
            Authority Overview
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 font-light">
            {hub.authority_intro}
          </p>
          
          <h3 className="text-xl font-semibold mt-10 mb-4">Core Mathematical Logic</h3>
          <div className="bg-neutral-50 dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <p className="mb-0 text-neutral-700 dark:text-neutral-300 italic">
              {hub.category_logic}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </span>
            Common Pitfalls
          </h2>
          <div className="space-y-4">
            {hub.common_pitfalls.map((pitfall, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="shrink-0 w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500">
                  {idx + 1}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-0">
                  {pitfall}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mt-10 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </span>
            Semantic Bridges
          </h3>
          <div className="space-y-3">
            {hub.semantic_bridges.map((bridge, idx) => (
              <div key={idx} className="text-sm py-2 px-4 border-l-2 border-primary-500 bg-primary-500/5 text-neutral-600 dark:text-neutral-400">
                {bridge}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16 text-center">
          <p className="text-xs text-neutral-400 uppercase tracking-[0.2em] font-bold mb-4">Discovery Lattice</p>
          <div className="h-px w-24 bg-primary-500 mx-auto mb-8 opacity-30" />
      </div>
    </div>
  );
}
