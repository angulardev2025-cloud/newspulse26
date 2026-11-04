import Image from 'next/image';
import { NewsItem } from '../data/newsTypes';
import { dateFormat } from '../utility/dateFormat';

function Article({ news, onSelectArticle }: { news: NewsItem[], onSelectArticle: (article: NewsItem) => void }) {
  return (
    <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {news.map((article, index) => (
        <div
          key={index}
          onClick={() => onSelectArticle(article)}
          className="flex flex-col rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 p-4 cursor-pointer hover:border-red-500 transition-all"
        >
          <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3 bg-stone-100">
            {article.image?.thumbnail?.contentUrl ? (
                <Image 
                  src={article.image.thumbnail.contentUrl} 
                  alt={article.name} 
                  fill
                  className="object-cover" 
                  referrerPolicy="no-referrer" 
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-red-800 text-white font-serif font-bold">
                    {article.provider[0]?.name.substring(0, 2).toUpperCase()}
                </div>
            )}
          </div>
          <p className="text-xs text-stone-500 mb-1">{article.provider[0]?.name}</p>
          <h3 className="font-bold text-sm leading-tight line-clamp-2">{article.name}</h3>
        </div>
      ))}
    </article>
  );
}

export default Article;