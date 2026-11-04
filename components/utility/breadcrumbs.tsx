import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium">
      <Link 
        href="/" 
        className="flex items-center gap-1 hover:text-red-600 dark:hover:text-red-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 shrink-0" />
          {item.href && !item.isCurrent ? (
            <Link 
              href={item.href} 
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors truncate max-w-[120px] sm:max-w-xs"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-stone-900 dark:text-stone-100 font-semibold truncate max-w-[140px] sm:max-w-xs">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
