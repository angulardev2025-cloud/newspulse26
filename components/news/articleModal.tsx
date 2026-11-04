import React, { useState } from 'react';
import { NewsItem } from '../data/newsTypes';
import { dateFormat } from '../utility/dateFormat';
import { X, ExternalLink, Bookmark, Sparkles, Share2, Check } from 'lucide-react';

interface ArticleModalProps {
  article: NewsItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsItem) => void;
}

export default function ArticleModal({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: ArticleModalProps) {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const handleGenerateAiSummary = async () => {
    setLoadingAi(true);
    setTimeout(() => {
      setAiSummary(
        `AI Editorial Insight (TV9 Kannada): This report highlights key regional and national developments regarding "${article.name}". Key takeaways include significant public impact and strategic policy implications.`
      );
      setLoadingAi(false);
    }, 800);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(article.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 md:p-8 text-left transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar inside modal */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-sans tracking-wide">
            <span>{article.provider[0]?.name || "TV9 Kannada"}</span>
            <span aria-hidden="true">·</span>
            <span>{dateFormat(article.datePublished)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Article"}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Copy Link"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Title & Hero Image */}
        <div className="mt-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-tight">
            {article.name}
          </h2>

          <div className="mt-4 relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
            <img
              src="/assets/aistudio/image_a4df1d8f.png"
              alt={article.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Article Content / Description */}
        <div className="mt-6 space-y-4 font-serif text-stone-700 dark:text-stone-300 leading-relaxed text-base md:text-lg">
          <p className="font-sans text-stone-600 dark:text-stone-400 font-medium text-lg">
            {article.description}
          </p>
          <p>
            {article.content ||
              "ಪೂರ್ಣ ವರದಿ ಹಾಗೂ ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಮೂಲ ವೆಬ್‌ಸೈಟ್ ಅನ್ನು ವೀಕ್ಷಿಸಿ. ಟಿವಿ೯ ಕನ್ನಡದ ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಪ್ರಸಾರ."}
          </p>
        </div>

        {/* AI Insight Section */}
        <div className="mt-8 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Editorial AI Summary</span>
            </div>
            {!aiSummary && (
              <button
                onClick={handleGenerateAiSummary}
                disabled={loadingAi}
                className="px-3 py-1 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loadingAi ? 'Synthesizing...' : 'Generate Insight'}
              </button>
            )}
          </div>
          {loadingAi && (
            <p className="text-sm text-stone-500 italic">Synthesizing key insights...</p>
          )}
          {aiSummary && (
            <p className="text-sm text-stone-700 dark:text-stone-300 font-sans leading-relaxed animate-fadeIn">
              {aiSummary}
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Source: {article.provider[0]?.name || "TV9 Kannada"}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <span>Read Original Article</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
