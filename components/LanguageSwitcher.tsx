import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { getLang, setLang, Language } from '../utils/i18n';

export const LanguageSwitcher: React.FC = () => {
  const [lang, setLangState] = useState<Language>(getLang());

  useEffect(() => {
    const handleLangChange = () => {
      setLangState(getLang());
    };
    window.addEventListener('crisiskit_lang_change', handleLangChange);
    return () => {
      window.removeEventListener('crisiskit_lang_change', handleLangChange);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLang(newLang);
    window.location.reload();
  };

  return (
    <div className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-lg text-xs shadow-sm">
      <Globe className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
      <select
        value={lang}
        onChange={handleChange}
        className="bg-transparent text-gray-700 dark:text-gray-200 font-semibold focus:outline-none cursor-pointer"
      >
        <option value="en">English</option>
        <option value="zh-TW">繁體中文</option>
        <option value="zh-CN">简体中文</option>
      </select>
    </div>
  );
};
