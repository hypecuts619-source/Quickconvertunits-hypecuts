import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="relative flex items-center">
      <Globe className="w-4 h-4 text-neutral-500 absolute left-2 pointer-events-none" />
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className="appearance-none bg-transparent pl-8 pr-6 py-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white focus:outline-none cursor-pointer rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="fr">Français</option>
        <option value="hi">हिन्दी</option>
        <option value="zh">中文</option>
        <option value="ar">العربية</option>
      </select>
      <div className="absolute right-2 pointer-events-none text-neutral-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  );
}
