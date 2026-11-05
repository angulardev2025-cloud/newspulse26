import Image from 'next/image';
import { NewsItem } from '../data/newsTypes';
import { dateFormat } from '../utility/dateFormat';
import { calculateReadingTime } from '@/lib/utility/readingTime';
import { BookOpen } from 'lucide-react';

function Article({ news, onSelectArticle }: { news: NewsItem[], onSelectArticle: (article: NewsItem) => void }) {
  return (
    <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {news.map((article, index) => {
        const readingTime = calculateReadingTime(article.content, article.description, article.name);
        return (
          <div
            key={index}
            onClick={() => onSelectArticle(article)}
            className="group flex flex-col rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-4 cursor-pointer hover:border-red-500 bg-white dark:bg-stone-900 transition-all hover:shadow-lg"
          >
            <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 bg-stone-100 dark:bg-stone-800">
              {article.image?.thumbnail?.contentUrl ? (
                <Image 
                  src={article.image.thumbnail.contentUrl} 
                  alt={article.name} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-red-800 text-white font-serif font-bold text-xl">
                  {article.provider[0]?.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              {/* Reading Time Badge on Image */}
              <div className="absolute bottom-2 right-2 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/75 backdrop-blur-sm text-white text-[10px] font-mono font-medium rounded-md border border-white/20 shadow-sm">
                  <BookOpen className="w-2.5 h-2.5 text-amber-400" />
                  <span>{readingTime.text}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
              <span className="font-medium truncate max-w-[65%]">{article.provider[0]?.name}</span>
              <span className="font-mono text-[10px] text-stone-400">{dateFormat(article.datePublished)}</span>
            </div>
            <h3 className="font-bold text-sm leading-snug line-clamp-2 text-stone-900 dark:text-stone-100 group-hover:text-red-600 transition-colors">
              {article.name}
            </h3>
          </div>
        );
      })}
    </article>
  );
}

export default Article;