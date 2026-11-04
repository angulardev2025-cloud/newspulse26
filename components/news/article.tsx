import React, { useState } from 'react';
import { NewsItem } from '../data/newsTypes';
import { dateFormat } from '../utility/dateFormat';
import { Bookmark } from 'lucide-react';

interface ArticleProps {
  news: NewsItem[];
  onSelectArticle: (article: NewsItem) => void;
  savedArticles: NewsItem[];
  onToggleBookmark: (article: NewsItem) => void;
}

export default function Article({
  news,
  onSelectArticle,
  savedArticles,
  onToggleBookmark,
}: ArticleProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!news || news.length === 0) return null;

  const imageUrl = '/assets/aistudio/image_a4df1d8f.png';

  return (
    <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6 pb-12 w-full">
      {news.map((article, index) => {
        const isSaved = savedArticles.some((s) => s.name === article.name);

        return (
          <div
            key={index}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            className={`group relative flex flex-col bg-white dark:bg-stone-800/60 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer ${
              hoverIndex === index ? '-translate-y-1' : ''
            }`}
            onClick={() => onSelectArticle(article)}
          >
            {/* Image Thumbnail */}
            <div className="relative w-full h-48 bg-stone-100 dark:bg-stone-900 overflow-hidden">
              <img
                src={imageUrl}
                alt={article.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Bookmark quick button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(article);
                }}
                className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-colors ${
                  isSaved
                    ? 'bg-amber-500 text-white'
                    : 'bg-black/40 text-white hover:bg-black/60'
                }`}
                title={isSaved ? "Saved" : "Save Article"}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex flex-col flex-1 p-5 text-left">
              {/* Zero-Pill Metadata */}
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2 font-sans">
                <span>{article.provider[0]?.name || "TV9 Kannada"}</span>
                <span aria-hidden="true">·</span>
                <span>{dateFormat(article.datePublished)}</span>
              </div>

              {/* Title */}
              <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                {article.name}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed font-sans">
                {article.description}
              </p>
            </div>
          </div>
        );
      })}
    </article>
  );
}