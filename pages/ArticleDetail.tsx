import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Share2, Check, 
  AlertTriangle, ShieldAlert, Sparkles, BookOpen, 
  Backpack, AlertOctagon, HeartHandshake, ArrowRight 
} from 'lucide-react';
import { getArticleBySlug, SURVIVAL_ARTICLES } from '../data/articles';
import { getLang } from '../utils/i18n';
import { FamilyStockpileModal } from '../components/FamilyStockpileModal';
import { EmergencyBeaconModal } from '../components/EmergencyBeaconModal';
import { CommunityMutualAidModal } from '../components/CommunityMutualAidModal';
import { DisasterFieldGuideModal } from '../components/DisasterFieldGuideModal';

export const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const lang = getLang();
  const isEn = lang === 'en';

  const [copied, setCopied] = useState(false);

  // Modals state for interactive tool CTAs
  const [showStockpileModal, setShowStockpileModal] = useState(false);
  const [showBeaconModal, setShowBeaconModal] = useState(false);
  const [showMutualAidModal, setShowMutualAidModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const article = getArticleBySlug(slug || '');

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto pt-20 pb-28 px-4 text-center">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {isEn ? 'Article Not Found' : '文章未找到或已更新'}
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            {isEn ? 'The survival protocol you requested does not exist.' : '该防灾文章已被整合或链接有误。'}
          </p>
          <Link
            to="/articles"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            {isEn ? 'Back to Survival Library' : '返回防灾知识库列表'}
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const openRelatedTool = () => {
    if (article.relatedTool === 'stockpile') setShowStockpileModal(true);
    else if (article.relatedTool === 'beacon') setShowBeaconModal(true);
    else if (article.relatedTool === 'mutualaid') setShowMutualAidModal(true);
    else if (article.relatedTool === 'fieldguide') setShowGuideModal(true);
  };

  // Other related articles
  const otherArticles = SURVIVAL_ARTICLES.filter(a => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto pt-14 sm:pt-16 pb-28 px-4 sm:px-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link
          to="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          {isEn ? 'Survival Knowledge Base' : '返回防灾文库'}
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-xl shadow-sm transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600 dark:text-green-400">{isEn ? 'Link Copied!' : '已复制链接'}</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-gray-500" />
              <span>{isEn ? 'Share Protocol' : '分享此自救指南'}</span>
            </>
          )}
        </button>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800">
            {isEn ? article.categoryLabelEn : article.categoryLabel}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
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

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
          {isEn ? article.titleEn : article.title}
        </h1>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
          💡 <strong>{isEn ? 'Executive Summary: ' : '核心摘要：'}</strong>
          {isEn ? article.summaryEn : article.summary}
        </div>
      </div>

      {/* Embedded Action Banner: Top CTA */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
            {article.relatedTool === 'stockpile' && <Backpack className="w-6 h-6" />}
            {article.relatedTool === 'beacon' && <AlertOctagon className="w-6 h-6" />}
            {article.relatedTool === 'mutualaid' && <HeartHandshake className="w-6 h-6" />}
            {article.relatedTool === 'fieldguide' && <BookOpen className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-red-100">
              {isEn ? 'Interactive Survival Tool' : '配套离线实用工具'}
            </div>
            <div className="text-sm font-bold mt-0.5">
              {isEn ? article.toolCtaTextEn : article.toolCtaText}
            </div>
          </div>
        </div>
        <button
          onClick={openRelatedTool}
          className="w-full sm:w-auto px-4 py-2 bg-white text-red-600 hover:bg-red-50 font-black text-xs rounded-xl shadow-md transition whitespace-nowrap active:scale-95"
        >
          {isEn ? 'Open Tool Now' : '立即启动'}
        </button>
      </div>

      {/* Article Body Content */}
      <div className="space-y-8">
        {article.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
              {isEn ? section.titleEn : section.title}
            </h2>

            <div className="space-y-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
              {(isEn ? section.contentEn : section.content).map((paragraph, pIdx) => (
                <p key={pIdx}>
                  {paragraph}
                </p>
              ))}
            </div>

            {section.alert && (
              <div className={`p-4 rounded-xl border my-4 text-xs sm:text-sm font-semibold flex items-start gap-2.5 ${
                section.alert.type === 'danger'
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
                  : section.alert.type === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              }`}>
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  {isEn ? section.alert.textEn : section.alert.text}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA Box */}
      <div className="mt-12 p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {isEn ? 'Practice Preparedness Before Crisis Arrives' : '有备无患 · 临危不乱'}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          {isEn
            ? 'Sparks Beacon works 100% offline. Save this application to your mobile home screen to access calculators, SOS beacons, and rosters during cellular outages.'
            : '星火应急信标支持完全离线运行。请将本站添加到手机主屏幕，断网断电或基站倒塌时随时调用应急工具与备灾清单。'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={openRelatedTool}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            {isEn ? article.toolCtaTextEn : article.toolCtaText}
          </button>
          <Link
            to="/articles"
            className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl shadow-sm hover:bg-gray-100 transition text-center"
          >
            {isEn ? 'View More Survival Guides' : '浏览更多防灾手册'}
          </Link>
        </div>
      </div>

      {/* Related Articles List */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">
          {isEn ? 'Recommended Survival Protocols' : '推荐相关自救法则'}
        </h4>
        <div className="space-y-3">
          {otherArticles.map((rel) => (
            <Link
              key={rel.slug}
              to={`/articles/${rel.slug}`}
              className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-800 transition flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                  {isEn ? rel.categoryLabelEn : rel.categoryLabel}
                </span>
                <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors mt-0.5">
                  {isEn ? rel.titleEn : rel.title}
                </h5>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Survival Tool Modals */}
      <FamilyStockpileModal
        isOpen={showStockpileModal}
        onClose={() => setShowStockpileModal(false)}
      />
      <EmergencyBeaconModal
        isOpen={showBeaconModal}
        onClose={() => setShowBeaconModal(false)}
      />
      <CommunityMutualAidModal
        isOpen={showMutualAidModal}
        onClose={() => setShowMutualAidModal(false)}
      />
      <DisasterFieldGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
};
