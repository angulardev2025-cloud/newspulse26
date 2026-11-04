'use client';

import React, { useState, useMemo } from 'react';
import { NewsSource } from '../data/newsSources';
import LogoSVG from '../utility/logo';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernSourceGridProps {
  sources: NewsSource[];
}

const SourceCard = ({ source, onClick, index }: { source: NewsSource, onClick: () => void, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group relative bg-white dark:bg-stone-900 rounded-[2.5rem] p-7 border border-stone-200/80 dark:border-stone-800 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 flex flex-col justify-between min-h-[260px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl group-hover:scale-105 transition-transform duration-300 shrink-0">
          <LogoSVG name={source.kannadaName} logo={source.logo} />
        </div>
        <div className="flex flex-col items-end">
          <span className="px-3 py-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/50">
            {source.category}
          </span>
          <div className="mt-2 flex items-center gap-1 text-stone-400 dark:text-stone-500">
            <Sparkles className="w-3 h-3 text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Live Wire</span>
          </div>
        </div>
      </div>

      <div className="my-4">
        <h3 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">
          {source.name}
        </h3>
        <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-stone-100 leading-snug">
          {source.kannadaName}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {source.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800/60">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Experience</span>
          <span className="text-xs font-bold text-stone-900 dark:text-stone-200">Inshorts Reader</span>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-md group-hover:rotate-12">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
      
      {/* Accent Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-red-600/10 transition-colors" />
    </motion.div>
  );
};

export default function ModernSourceGrid({ sources }: ModernSourceGridProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSources = useMemo(() => {
    const list = sources.filter(s => s.id !== 'all');
    if (selectedCategory === 'All') return list;
    return list.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [sources, selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    sources.filter(s => s.id !== 'all').forEach(s => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [sources]);

  return (
    <div className="space-y-8 pb-12">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-b border-stone-200/60 dark:border-stone-800">
        <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-stone-400 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-red-500" />
          <span>Category</span>
        </div>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = cat === 'All' 
            ? sources.filter(s => s.id !== 'all').length 
            : sources.filter(s => s.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-300'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSources.map((source, index) => (
            <SourceCard 
              key={source.id} 
              source={source} 
              index={index}
              onClick={() => router.push(`/reader/${source.id}`).catch(() => {})}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
