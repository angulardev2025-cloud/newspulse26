'use client';

import React, { useState } from 'react';
import { ApiErrorInfo } from '@/components/data/newsTypes';
import { 
  AlertTriangle, 
  Copy, 
  Check, 
  RefreshCw, 
  X, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  ShieldAlert,
  ServerOff,
  FileQuestion,
  KeyRound,
  Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiErrorBannerProps {
  error: ApiErrorInfo | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  title?: string;
  compact?: boolean;
}

export default function ApiErrorBanner({
  error,
  onRetry,
  onDismiss,
  title,
  compact = false,
}: ApiErrorBannerProps) {
  const [copied, setCopied] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Normalize string error to ApiErrorInfo object
  const errorObj: ApiErrorInfo = typeof error === 'string'
    ? {
        status: 500,
        statusText: 'API Error',
        message: error,
        timestamp: new Date().toISOString(),
      }
    : error;

  const statusNum = typeof errorObj.status === 'number' ? errorObj.status : parseInt(String(errorObj.status), 10) || 500;

  // Helper to get status color and icon
  const getStatusBadgeConfig = (status: number) => {
    if (status === 401) {
      return {
        label: '401 Unauthorized',
        bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        icon: KeyRound,
        suggestion: 'API key or authentication token is missing or expired.',
      };
    }
    if (status === 403) {
      return {
        label: '403 Forbidden',
        bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        icon: Ban,
        suggestion: 'Access denied by publisher server or CORS/Cloudflare protection.',
      };
    }
    if (status === 404) {
      return {
        label: '404 Not Found',
        bg: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        icon: FileQuestion,
        suggestion: 'The API endpoint URL does not exist or has been moved by the publisher.',
      };
    }
    if (status === 429) {
      return {
        label: '429 Rate Limited',
        bg: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
        icon: ShieldAlert,
        suggestion: 'Too many requests sent in a short time. Please wait a moment before retrying.',
      };
    }
    if (status >= 500) {
      return {
        label: `${status} Server Error`,
        bg: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800',
        icon: ServerOff,
        suggestion: 'The remote news server experienced an internal error or crash.',
      };
    }
    return {
      label: `${status} Fetch Error`,
      bg: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700',
      icon: AlertTriangle,
      suggestion: 'Unable to complete API request. Verify internet connection.',
    };
  };

  const badgeConfig = getStatusBadgeConfig(statusNum);
  const StatusIcon = badgeConfig.icon;

  const copyPayload = JSON.stringify(
    {
      status: errorObj.status,
      statusText: errorObj.statusText || badgeConfig.label,
      endpoint: errorObj.endpoint || 'N/A',
      sourceId: errorObj.sourceId || 'N/A',
      sourceName: errorObj.sourceName || 'N/A',
      message: errorObj.message,
      suggestion: badgeConfig.suggestion,
      timestamp: errorObj.timestamp || new Date().toISOString(),
      details: errorObj.details || 'N/A',
    },
    null,
    2
  );

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(copyPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (compact) {
    return (
      <div className="w-full p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200 text-xs flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <StatusIcon className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <div className="truncate">
            <span className="font-mono font-bold mr-1.5 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/60 text-[10px]">
              {statusNum}
            </span>
            <span className="font-semibold">{errorObj.message}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-red-600 border border-stone-200 dark:border-stone-700 transition-colors"
            title="Copy API Error Details"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {onRetry && (
            <button
              onClick={onRetry}
              className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              title="Retry API Fetch"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full my-4 rounded-2xl border border-red-200 dark:border-red-900/60 bg-gradient-to-br from-red-50/90 via-stone-50 to-amber-50/50 dark:from-red-950/40 dark:via-stone-900 dark:to-stone-950 shadow-xl overflow-hidden text-stone-900 dark:text-stone-100"
    >
      {/* Top Banner Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-red-100 dark:border-red-900/30">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 shrink-0 border border-red-200 dark:border-red-900/50 shadow-inner">
            <StatusIcon className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] font-black tracking-wider uppercase border ${badgeConfig.bg}`}>
                {badgeConfig.label}
              </span>
              {errorObj.sourceName && (
                <span className="px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-bold">
                  {errorObj.sourceName}
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-serif font-black leading-snug text-stone-900 dark:text-stone-100">
              {title || 'API Feed Fetch Interrupted'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-sans mt-0.5 leading-relaxed">
              {errorObj.message}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-bold border border-stone-200 dark:border-stone-700 shadow-sm transition-all active:scale-95"
            title="Copy API Error details to clipboard for debugging"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400">Copied Log!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy Error</span>
              </>
            )}
          </button>

          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 uppercase tracking-wider"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry API</span>
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Fix & Endpoint Details */}
      <div className="px-4 sm:px-5 py-3 bg-stone-100/50 dark:bg-stone-900/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 dark:border-stone-800 font-mono text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-1.5 truncate">
          <Globe className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="font-bold shrink-0">Endpoint:</span>
          <span className="truncate text-stone-800 dark:text-stone-200">
            {errorObj.endpoint || 'Internal API Proxy (/api/posts)'}
          </span>
        </div>

        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline shrink-0"
        >
          <Terminal className="w-3 h-3" />
          <span>{showTechnicalDetails ? 'Hide Details' : 'View Payload Details'}</span>
          {showTechnicalDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Collapsible Technical Details Payload */}
      <AnimatePresence>
        {showTechnicalDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 bg-stone-950 text-stone-200 font-mono text-[11px] border-t border-stone-800 overflow-x-auto"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800 text-stone-400">
              <span className="font-bold text-red-400">Technical API Response Log</span>
              <span>{errorObj.timestamp || new Date().toISOString()}</span>
            </div>

            <div className="mb-2 text-stone-300">
              <span className="text-amber-400 font-bold">Suggested Fix: </span>
              {badgeConfig.suggestion}
            </div>

            <pre className="p-3 rounded-lg bg-stone-900 text-amber-200/90 overflow-x-auto border border-stone-800 text-[10px] leading-relaxed">
              {copyPayload}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
