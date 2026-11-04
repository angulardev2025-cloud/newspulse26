'use client';

import React from 'react';
import { NewsSource } from '../data/newsSources';
import LogoSVG from '../utility/logo';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

interface ModernSourceGridProps {
  sources: NewsSource[];
}

const SourceCard = ({ source, onClick, index }: { source: NewsSource, onClick: () => void, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 border border-stone-100 dark:border-stone-800 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 flex flex-col gap-6"
    >
      <div className="flex items-start justify-between">
        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-3xl group-hover:scale-110 transition-transform duration-500">
          <LogoSVG name={source.kannadaName} />
        </div>
        <div className="flex flex-col items-end">
          <span className="px-4 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/50">
            {source.category}
          </span>
          <div className="mt-2 flex items-center gap-1 text-stone-400 dark:text-stone-600">
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Premium Wire</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2 group-hover:text-red-600 transition-colors">
          {source.name}
        </h3>
        <h2 className="text-2xl md:text-3xl font-serif font-black text-stone-900 dark:text-stone-100 leading-tight">
          {source.kannadaName}
        </h2>
        <p className="mt-3 text-sm text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {source.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-stone-50 dark:border-stone-800/50">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Experience</span>
          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">Inshorts Style</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg group-hover:rotate-12">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
      
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-red-600/10 transition-colors" />
    </motion.div>
  );
};

export default function ModernSourceGrid({ sources }: ModernSourceGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
      {sources.filter(s => s.id !== 'all').map((source, index) => (
        <SourceCard 
          key={source.id} 
          source={source} 
          index={index}
          onClick={() => router.push(`/reader/${source.id}`)}
        />
      ))}
    </div>
  );
}
