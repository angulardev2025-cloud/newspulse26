'use client';

import React, { useEffect, useState } from 'react';
import { NewsSource } from '../data/newsSources';
import { WordPressPost } from '../data/newsTypes';
import LogoSVG from '../utility/logo';
import Image from 'next/image';
import { Clock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { dateFormat } from '../utility/dateFormat';
import { useRouter } from 'next/router';
import { motion } from 'motion/react';

interface SourceLatest {
  sourceId: string;
  latestPost: WordPressPost | null;
}

interface ModernSourceGridProps {
  sources: NewsSource[];
}

const SourceCard = ({ source, latest, onClick }: { source: NewsSource, latest: WordPressPost | null, onClick: () => void }) => {
  const [imgError, setImgError] = useState(false);
  const featuredMedia = latest?._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="group relative flex flex-col sm:flex-row bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden cursor-pointer hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-500"
    >
      {/* Image Section */}
      <div className="relative w-full sm:w-1/3 h-48 sm:h-auto bg-stone-100 dark:bg-stone-800 overflow-hidden">
        {featuredMedia && !imgError ? (
          <Image
            src={featuredMedia}
            alt={latest?.title.rendered || source.kannadaName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-stone-800">
            <LogoSVG name={source.kannadaName} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
        <div className="absolute top-4 left-4 sm:hidden">
          <LogoSVG name={source.kannadaName} />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="hidden sm:block">
            <LogoSVG name={source.kannadaName} />
          </div>
          <span className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500">
            {source.category}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-2">
            {source.kannadaName}
          </h3>
          
          {latest ? (
            <>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                {latest.title.rendered}
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-tight">
                <Clock className="w-3 h-3" />
                <span>{dateFormat(latest.date)}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-500 italic">Connecting to live feed...</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest group-hover:text-red-600 transition-colors">
            Go to Reader
          </span>
          <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ModernSourceGrid({ sources }: ModernSourceGridProps) {
  const [data, setData] = useState<SourceLatest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('/api/sources-latest');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  const getSourceData = (id: string) => data.find(d => d.sourceId === id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        <p className="text-stone-500 font-medium animate-pulse">Initializing Modern View...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-stone-500">
        <AlertCircle className="w-10 h-10 text-stone-300" />
        <p>Failed to load real-time headlines. Please try classic view.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
      {sources.filter(s => s.id !== 'all').map((source) => (
        <SourceCard 
          key={source.id} 
          source={source} 
          latest={getSourceData(source.id)?.latestPost || null}
          onClick={() => router.push(`/reader/${source.id}`)}
        />
      ))}
    </div>
  );
}
