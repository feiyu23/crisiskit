import React, { useState, useEffect } from 'react';
import { Moon, Sun, BatteryCharging } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'survival';

export const ThemeToggle: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('crisiskit_theme');
    if (saved === 'survival' || saved === 'dark' || saved === 'light') {
      return saved;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'survival') {
      root.classList.add('dark', 'survival-mode');
      localStorage.setItem('crisiskit_theme', 'survival');
    } else if (mode === 'dark') {
      root.classList.remove('survival-mode');
      root.classList.add('dark');
      localStorage.setItem('crisiskit_theme', 'dark');
    } else {
      root.classList.remove('dark', 'survival-mode');
      localStorage.setItem('crisiskit_theme', 'light');
    }
  }, [mode]);

  const cycleMode = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('survival');
    else setMode('light');
  };

  return (
    <button
      onClick={cycleMode}
      title={
        mode === 'survival'
          ? '已开启极限省电纯黑模式，点击切回明亮模式'
          : mode === 'dark'
          ? '点击开启极限省电生存模式 (OLED纯黑)'
          : '点击切换为暗色模式'
      }
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm transition ${
        mode === 'survival'
          ? 'bg-black border border-green-500 text-green-400 ring-1 ring-green-500/50'
          : 'bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {mode === 'survival' ? (
        <>
          <BatteryCharging className="w-3.5 h-3.5 text-green-400 animate-pulse" />
          <span>省电生存</span>
        </>
      ) : mode === 'dark' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span>暗色</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>明亮</span>
        </>
      )}
    </button>
  );
};
