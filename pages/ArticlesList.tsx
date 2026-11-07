import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Search, ArrowRight, ArrowLeft, Clock, 
  Calendar, ShieldCheck, Sparkles, Filter, Backpack, 
  Radio, HeartHandshake, AlertTriangle 
} from 'lucide-react';
import { SURVIVAL_ARTICLES, SurvivalArticle } from '../data/articles';
import { getLang } from '../utils/i18n';

export const ArticlesList: React.FC = () => {
  const lang = getLang();
  const isEn = lang === 'en';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: isEn ? 'All Articles' : '全部干货' },
    { id: 'stockpile', label: isEn ? '🎒 Stockpile' : '🎒 备灾储备' },
    { id: 'blackout', label: isEn ? '📡 Beacon' : '📡 离线信标' },
    { id: 'earthquake', label: isEn ? '🌋 Earthquake' : '🌋 地震自救' },
    { id: 'volcano', label: isEn ? '🌋 Volcano' : '🌋 火山防护' },
    { id: 'hypothermia', label: isEn ? '❄️ Hypothermia' : '❄️ 防失温' },
    { id: 'mutualaid', label: isEn ? '🤝 Mutual Aid' : '🤝 社区互助' }
  ];

  const filteredArticles = SURVIVAL_ARTICLES.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesQuery = 
      article.title.toLowerCase().includes(query) ||
      article.titleEn.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.summaryEn.toLowerCase().includes(query) ||
      article.seoKeywords.some(k => k.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-4xl mx-auto pt-14 sm:pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Home Link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
          {isEn ? 'Back to Sparks Beacon' : '返回星火应急信标主页'}
        </Link>
        <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
          {isEn ? '100% Offline Accessible' : '支持离线完整阅读'}
        </span>
      </div>

      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-bold mb-3 shadow-sm">
          <BookOpen className="w-4 h-4 text-red-600 dark:text-red-400" />
          {isEn ? 'Sparks Beacon Survival & Preparedness Field Library' : '星火极境防灾与家庭备灾知识库'}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          {isEn 
            ? 'Actionable Survival Science for Extreme Crises' 
            : '极端灾害生存常识与国家民防储备标准'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? 'Evidence-based protocols for Earthquakes, Volcanic Ash, Floods, Blizzards, Power Outages, and Civil Defence Stockpiles. Each guide integrates directly with offline survival tools.'
            : '依据国际救援实践与北欧/德国权威民防标准编制。全面覆盖 72h 家庭物资测算、断电声光信标、地震被困敲击、火山防尘护眼与湿冷防失温生死法则。'}
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search survival guides, stockpiles, protocols...' : '搜索备灾清单、断网求救、地震逃生、火山灰、防失温...'}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <p className="text-gray-500 text-sm mb-3">
            {isEn ? 'No survival articles matched your search query.' : '没有找到匹配的防灾文章。'}
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow"
          >
            {isEn ? 'Show All Guides' : '重置搜索查看全部'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/articles/${article.slug}`}
              className="block group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-red-300 dark:hover:border-red-800 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="inline-block text-[11px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800 w-fit">
                  {isEn ? article.categoryLabelEn : article.categoryLabel}
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date}
                  </span>
                </div>
              </div>

              <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-2">
                {isEn ? article.titleEn : article.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
                {isEn ? article.summaryEn : article.summary}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/60 text-xs">
                <span className="text-gray-400 font-medium">
                  {article.author}
                </span>
                <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {isEn ? 'Read Full Protocol' : '阅读完整生死法则'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Offline PWA Tips Footer */}
      <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border border-red-200 dark:border-red-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              {isEn ? 'Save this site to home screen for 100% offline access' : '建议“添加到主屏幕”以便完全离线使用'}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {isEn 
                ? 'All guides and calculators remain fully accessible during total communication blackouts.' 
                : '断网断电、通信基站倒塌时，已缓存的知识库与全部计算器工具依然可直接运行。'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
