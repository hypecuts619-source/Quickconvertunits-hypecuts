import React, { useState } from 'react';
import { Code, Check, Copy } from 'lucide-react';

interface Props {
  category: string;
  fromUnitId: string;
  toUnitId: string;
}

export function EmbedWidget({ category, fromUnitId, toUnitId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedUrl = `https://quickconvertunits.com/?category=${category}&from=${fromUnitId}&to=${toUnitId}&embed=true`;

  const embedCode = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="450" 
  style="border:1px solid #eee; border-radius:12px;" 
  title="${category} Converter"
></iframe>
<p style="text-align:center; font-size:12px; margin-top:8px;">
  Powered by <a href="https://quickconvertunits.com/" target="_blank" rel="noopener">QuickConvertUnits.com</a>
</p>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 mb-12">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 mx-auto text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-sm"
        >
          <Code className="w-4 h-4" />
          Embed this calculator on your site
        </button>
      ) : (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-[#111111] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Embed Calculator</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Close
            </button>
          </div>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Copy and paste this HTML code into your website or blog to let your visitors use this calculator directly!
          </p>

          <div className="relative group">
            <pre className="p-4 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300 rounded-xl text-sm font-mono overflow-x-auto border border-neutral-200/50 dark:border-neutral-800/50">
              <code>{embedCode}</code>
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-neutral-500" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
