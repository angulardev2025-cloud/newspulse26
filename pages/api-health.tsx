import React, { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { 
  newsSources, 
  NewsSource, 
  extractDomainBadge 
} from '@/components/data/newsSources';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { useTheme } from '@/lib/context/ThemeContext';
import { useBookmarks } from '@/lib/context/BookmarkContext';
import { 
  Activity, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  ExternalLink, 
  Play, 
  Pause, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Globe, 
  Server, 
  Code, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Link2
} from 'lucide-react';

export interface ApiTestResult {
  sourceId: string;
  sourceName: string;
  kannadaName: string;
  endpoint: string;
  proxyUrl: string;
  category: string;
  status: 'idle' | 'testing' | 'success' | 'error';
  statusCode?: number;
  statusText?: string;
  responseTimeMs?: number;
  itemCount?: number;
  sampleTitle?: string;
  errorMessage?: string;
  details?: string;
  timestamp?: string;
  dataSource?: string;
}

export default function ApiHealthPage() {
  const router = useRouter();
  const { darkMode, setDarkMode } = useTheme();
  const { savedCount, setSavedModalOpen } = useBookmarks();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'classic' | 'modern'>('classic');

  // Filter sources to test (exclude composite "all")
  const testableSources = React.useMemo(() => {
    return newsSources.filter(s => s.id !== 'all' && s.endpoint);
  }, []);

  const [testResults, setTestResults] = useState<Record<string, ApiTestResult>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error' | 'pending'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  // Initialize test result records
  useEffect(() => {
    setMounted(true);
    const initialMap: Record<string, ApiTestResult> = {};
    testableSources.forEach((source) => {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(source.endpoint)}`;
      initialMap[source.id] = {
        sourceId: source.id,
        sourceName: source.name,
        kannadaName: source.kannadaName,
        endpoint: source.endpoint,
        proxyUrl,
        category: source.category,
        status: 'idle',
      };
    });
    setTestResults(initialMap);
  }, [testableSources]);

  // Test single endpoint function
  const testSingleEndpoint = useCallback(async (source: NewsSource): Promise<ApiTestResult> => {
    const startTime = performance.now();
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(source.endpoint)}`;
    const nowIso = new Date().toISOString();

    try {
      const res = await axios.get('/api/posts', {
        params: {
          source: source.id,
          page: 1,
          refresh: 'true',
        },
        timeout: 12000,
      });

      const endTime = performance.now();
      const responseTimeMs = Math.round(endTime - startTime);
      const posts = Array.isArray(res.data) ? res.data : [];
      const dataSource = (res.headers['x-data-source'] as string) || 'Live-API';

      if (posts.length > 0) {
        const firstPost = posts[0];
        const sampleTitle = firstPost.title?.rendered || firstPost.title || 'Live post fetched';

        return {
          sourceId: source.id,
          sourceName: source.name,
          kannadaName: source.kannadaName,
          endpoint: source.endpoint,
          proxyUrl,
          category: source.category,
          status: 'success',
          statusCode: 200,
          statusText: 'OK',
          responseTimeMs,
          itemCount: posts.length,
          sampleTitle,
          timestamp: nowIso,
          dataSource,
        };
      } else {
        return {
          sourceId: source.id,
          sourceName: source.name,
          kannadaName: source.kannadaName,
          endpoint: source.endpoint,
          proxyUrl,
          category: source.category,
          status: 'error',
          statusCode: 404,
          statusText: 'No Stories Returned',
          responseTimeMs,
          itemCount: 0,
          errorMessage: `API endpoint returned 0 stories for ${source.name}.`,
          timestamp: nowIso,
          dataSource,
        };
      }
    } catch (err: any) {
      const endTime = performance.now();
      const responseTimeMs = Math.round(endTime - startTime);
      const responseData = err.response?.data;
      const statusCode = responseData?.status || err.response?.status || (err.code === 'ECONNABORTED' ? 504 : 500);
      const statusText = responseData?.statusText || err.response?.statusText || (statusCode === 404 ? 'Not Found' : statusCode === 403 ? 'Forbidden' : statusCode === 401 ? 'Unauthorized' : statusCode === 502 ? 'Bad Gateway' : statusCode === 504 ? 'Timeout' : 'API Error');
      const errorMessage = responseData?.message || responseData?.error || err.message || `HTTP ${statusCode} fetch error`;
      const details = responseData?.details || (responseData ? JSON.stringify(responseData, null, 2) : err.stack || err.message);

      return {
        sourceId: source.id,
        sourceName: source.name,
        kannadaName: source.kannadaName,
        endpoint: source.endpoint,
        proxyUrl,
        category: source.category,
        status: 'error',
        statusCode,
        statusText,
        responseTimeMs,
        itemCount: 0,
        errorMessage,
        details,
        timestamp: nowIso,
      };
    }
  }, []);

  // Sequential runner with 3-second gap
  const runSequentialTest = useCallback(async (startIndex = 0) => {
    setIsRunning(true);
    
    for (let i = startIndex; i < testableSources.length; i++) {
      if (!isRunningRef.current) break;

      const source = testableSources[i];
      setCurrentIndex(i);

      // Mark current as testing
      setTestResults(prev => ({
        ...prev,
        [source.id]: {
          ...prev[source.id],
          status: 'testing',
        }
      }));

      // Perform test
      const result = await testSingleEndpoint(source);

      // Update result
      setTestResults(prev => ({
        ...prev,
        [source.id]: result,
      }));

      // If not last item and still running, wait 3 seconds with countdown ticker
      if (i < testableSources.length - 1 && isRunningRef.current) {
        setCountdown(3);
        for (let sec = 3; sec > 0; sec--) {
          if (!isRunningRef.current) break;
          setCountdown(sec);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        setCountdown(0);
      }
    }

    setIsRunning(false);
    setCurrentIndex(-1);
  }, [testableSources, testSingleEndpoint]);

  // Start automatic testing on page load
  useEffect(() => {
    if (mounted && testableSources.length > 0) {
      const timer = setTimeout(() => {
        runSequentialTest(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mounted, testableSources, runSequentialTest]);

  // Individual manual test
  const handleTestSingle = async (source: NewsSource) => {
    setTestResults(prev => ({
      ...prev,
      [source.id]: {
        ...prev[source.id],
        status: 'testing',
      }
    }));
    const result = await testSingleEndpoint(source);
    setTestResults(prev => ({
      ...prev,
      [source.id]: result,
    }));
  };

  // Control button handlers
  const handleStartFullTest = () => {
    // Reset all to idle
    const resetMap: Record<string, ApiTestResult> = {};
    testableSources.forEach(s => {
      resetMap[s.id] = {
        sourceId: s.id,
        sourceName: s.name,
        kannadaName: s.kannadaName,
        endpoint: s.endpoint,
        proxyUrl: `https://api.allorigins.win/raw?url=${encodeURIComponent(s.endpoint)}`,
        category: s.category,
        status: 'idle',
      };
    });
    setTestResults(resetMap);
    isRunningRef.current = true;
    runSequentialTest(0);
  };

  const handleTogglePause = () => {
    if (isRunning) {
      isRunningRef.current = false;
      setIsRunning(false);
    } else {
      const nextIdx = currentIndexRef.current >= 0 ? currentIndexRef.current : 0;
      isRunningRef.current = true;
      runSequentialTest(nextIdx);
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyFullReport = () => {
    const report = {
      summary: {
        total: testableSources.length,
        passed: Object.values(testResults).filter(r => r.status === 'success').length,
        failed: Object.values(testResults).filter(r => r.status === 'error').length,
        pending: Object.values(testResults).filter(r => r.status === 'idle' || r.status === 'testing').length,
        generatedAt: new Date().toISOString(),
      },
      results: Object.values(testResults),
    };
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  // Compute Health Statistics
  const resultsList = Object.values(testResults);
  const totalCount = testableSources.length;
  const successCount = resultsList.filter(r => r.status === 'success').length;
  const errorCount = resultsList.filter(r => r.status === 'error').length;
  const pendingCount = resultsList.filter(r => r.status === 'idle' || r.status === 'testing').length;
  const completedCount = successCount + errorCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const validLatencies = resultsList.filter(r => typeof r.responseTimeMs === 'number').map(r => r.responseTimeMs as number);
  const avgLatency = validLatencies.length > 0 
    ? Math.round(validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length) 
    : 0;

  // Filter items for display
  const filteredSources = testableSources.filter(source => {
    const res = testResults[source.id];
    const query = searchQuery.toLowerCase().trim();

    const matchesQuery = !query || (
      source.name.toLowerCase().includes(query) ||
      source.kannadaName.toLowerCase().includes(query) ||
      source.endpoint.toLowerCase().includes(query) ||
      source.category.toLowerCase().includes(query)
    );

    if (!matchesQuery) return false;

    if (statusFilter === 'success') return res?.status === 'success';
    if (statusFilter === 'error') return res?.status === 'error';
    if (statusFilter === 'pending') return res?.status === 'idle' || res?.status === 'testing';

    return true;
  });

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>API Diagnostics & Health Table — NewsPulse</title>
        <meta name="description" content="Live endpoint response codes, absolute URLs, proxy URLs, and error logs for 25+ Coastal & Kannada publisher APIs." />
      </Head>

      <div className="min-h-screen bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-500">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          savedCount={savedCount}
          onOpenSaved={() => setSavedModalOpen(true)}
          viewMode={viewMode}
          setViewMode={setViewMode}
          breadcrumbs={[
            { label: 'Wire', href: '/' },
            { label: 'API Health Table', isCurrent: true },
          ]}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header Dashboard Banner */}
          <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-6 sm:p-10 border border-stone-200/80 dark:border-stone-800 shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Activity className="w-64 h-64 text-red-600" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-wider mb-3 border border-red-200/60 dark:border-red-900/40">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>Publisher Endpoint Health Dashboard</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-stone-900 dark:text-stone-100">
                  API Response & Proxy Monitor
                </h1>
                <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base max-w-2xl mt-2 font-medium">
                  Sequential 1-by-1 endpoint diagnostics with a <strong>3-second throttle delay</strong> to bypass 403 Forbidden blocks and test proxy fallbacks across all 25+ Coastal & Kannada publisher APIs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleStartFullTest}
                  disabled={isRunning}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 active:scale-95"
                >
                  <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Testing Endpoints...' : 'Run Full Test'}</span>
                </button>

                <button
                  onClick={handleTogglePause}
                  className="px-5 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border border-stone-200 dark:border-stone-700 flex items-center gap-2"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 text-amber-500" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-green-500" />
                      <span>Resume</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyFullReport}
                  className="px-5 py-3 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                >
                  {copiedReport ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedReport ? 'Report Copied!' : 'Export JSON Report'}</span>
                </button>
              </div>
            </div>

            {/* Health Meter Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-stone-100 dark:border-stone-800">
              <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total APIs</span>
                <div className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100 mt-1">
                  {totalCount}
                </div>
                <span className="text-[11px] text-stone-500 font-medium">Publisher Endpoints</span>
              </div>

              <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">200 OK Passed</span>
                <div className="text-2xl font-black font-mono text-green-600 dark:text-green-400 mt-1">
                  {successCount}
                </div>
                <span className="text-[11px] text-green-600/80 dark:text-green-400/80 font-medium">Operational APIs</span>
              </div>

              <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">Error / Down</span>
                <div className="text-2xl font-black font-mono text-red-600 dark:text-red-400 mt-1">
                  {errorCount}
                </div>
                <span className="text-[11px] text-red-600/80 dark:text-red-400/80 font-medium">Failed or 403 blocked</span>
              </div>

              <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Avg Latency</span>
                <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
                  {avgLatency > 0 ? `${avgLatency} ms` : '—'}
                </div>
                <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-medium">Response speed</span>
              </div>
            </div>

            {/* Sequential Progress & 3-second Ticker */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-400 mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${isRunning ? 'text-red-600 animate-pulse' : 'text-stone-400'}`} />
                  <span>Sequential Progress: {completedCount} of {totalCount} completed ({progressPercent}%)</span>
                </div>
                {isRunning && countdown > 0 && (
                  <span className="text-red-600 dark:text-red-400 font-mono font-bold bg-red-50 dark:bg-red-950/60 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/40">
                    ⏱ Next API hit in {countdown}s (3s delay gap)
                  </span>
                )}
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by publisher, domain, URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600/50 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
              {(['all', 'success', 'error', 'pending'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    statusFilter === filter
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-md'
                      : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                  }`}
                >
                  {filter === 'all' && `All (${testableSources.length})`}
                  {filter === 'success' && `200 OK (${successCount})`}
                  {filter === 'error' && `Errors (${errorCount})`}
                  {filter === 'pending' && `Pending (${pendingCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Card View (Visible on screens smaller than lg) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden mb-8">
            {filteredSources.map((source) => {
              const result = testResults[source.id] || {
                sourceId: source.id,
                sourceName: source.name,
                kannadaName: source.kannadaName,
                endpoint: source.endpoint,
                proxyUrl: `https://api.allorigins.win/raw?url=${encodeURIComponent(source.endpoint)}`,
                category: source.category,
                status: 'idle',
              };

              const isCurrentlyTesting = currentIndex === testableSources.findIndex(s => s.id === source.id) && isRunning;
              const isExpanded = expandedId === source.id;
              const domainBadge = extractDomainBadge(source.endpoint);

              return (
                <div
                  key={source.id}
                  className={`bg-white dark:bg-stone-900 p-5 rounded-3xl border shadow-lg transition-all ${
                    isCurrentlyTesting 
                      ? 'border-red-500 shadow-red-500/10 ring-2 ring-red-500/20' 
                      : 'border-stone-200/80 dark:border-stone-800'
                  }`}
                >
                  {/* Card Header: Publisher & Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">
                          {source.kannadaName}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                          {domainBadge}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                        {source.name} · <span className="text-red-600 font-bold">{source.category}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleTestSingle(source)}
                      disabled={result.status === 'testing'}
                      className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-red-600 hover:text-white text-stone-700 dark:text-stone-300 transition-all active:scale-95 disabled:opacity-40 shrink-0"
                      title="Test this API now"
                    >
                      <RefreshCw className={`w-4 h-4 ${result.status === 'testing' ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    {result.status === 'testing' ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-900/40 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Testing endpoint...</span>
                      </div>
                    ) : result.status === 'success' ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-black font-mono text-xs border border-green-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>200 OK</span>
                        {result.responseTimeMs && <span className="text-stone-400 font-normal">({result.responseTimeMs} ms)</span>}
                      </div>
                    ) : result.status === 'error' ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-black font-mono text-xs border border-red-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{result.statusCode ? `${result.statusCode} ${result.statusText || ''}` : 'Error'}</span>
                        {result.responseTimeMs && <span className="text-stone-400 font-normal">({result.responseTimeMs} ms)</span>}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 font-bold font-mono text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>

                  {/* Column 2: Direct API URL */}
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      Column 2: Absolute Direct API URL
                    </span>
                    <div className="flex items-center gap-2 p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200/80 dark:border-stone-800 font-mono text-[11px]">
                      <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="text-stone-700 dark:text-stone-300 truncate flex-1" title={source.endpoint}>
                        {source.endpoint}
                      </span>
                      <button
                        onClick={() => handleCopyText(source.endpoint, `direct-${source.id}`)}
                        className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded text-stone-500 shrink-0"
                        title="Copy direct API URL"
                      >
                        {copiedKey === `direct-${source.id}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={source.endpoint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:text-red-600 shrink-0 text-stone-500"
                        title="Open direct URL in new browser tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Column 3: Proxy URL */}
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      Column 3: AllOrigins Proxy URL
                    </span>
                    <div className="flex items-center gap-2 p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200/80 dark:border-stone-800 font-mono text-[11px]">
                      <Server className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-stone-700 dark:text-stone-300 truncate flex-1" title={result.proxyUrl}>
                        {result.proxyUrl}
                      </span>
                      <button
                        onClick={() => handleCopyText(result.proxyUrl, `proxy-${source.id}`)}
                        className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded text-stone-500 shrink-0"
                        title="Copy proxy URL"
                      >
                        {copiedKey === `proxy-${source.id}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={result.proxyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:text-red-600 shrink-0 text-stone-500"
                        title="Open proxy URL in new browser tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Response Data & Log */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                    {result.status === 'success' ? (
                      <div>
                        <span className="text-[11px] font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{result.itemCount} stories fetched successfully</span>
                        </span>
                        {result.sampleTitle && (
                          <p className="text-stone-600 dark:text-stone-300 font-serif text-xs mt-1 line-clamp-1">
                            &ldquo;{result.sampleTitle}&rdquo;
                          </p>
                        )}
                      </div>
                    ) : result.status === 'error' ? (
                      <div>
                        <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 font-mono text-[11px] font-bold">
                          {result.errorMessage || 'Failed to fetch from endpoint.'}
                        </div>
                        {result.details && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : source.id)}
                            className="text-[11px] text-red-600 dark:text-red-400 font-bold underline flex items-center gap-1 mt-2"
                          >
                            <Code className="w-3 h-3" />
                            <span>{isExpanded ? 'Hide Raw Stack Log' : 'View Raw Diagnostic Log'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-stone-400 text-xs italic">Awaiting sequential test...</span>
                    )}
                  </div>

                  {/* Mobile Collapsible Raw Log */}
                  {isExpanded && result.details && (
                    <div className="mt-3 p-3 bg-stone-950 text-stone-100 rounded-2xl border border-red-900/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-red-400">Diagnostic Payload</span>
                        <button
                          onClick={() => handleCopyText(result.details || '', `log-${source.id}`)}
                          className="px-2 py-1 bg-stone-800 hover:bg-stone-700 rounded text-[10px] font-mono font-bold flex items-center gap-1"
                        >
                          {copiedKey === `log-${source.id}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy Log</span>
                        </button>
                      </div>
                      <pre className="font-mono text-[10px] text-red-200 overflow-x-auto whitespace-pre-wrap max-h-48">
                        {result.details}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Full 5-Column Table View (Visible on lg screens) */}
          <div className="hidden lg:block bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200/80 dark:border-stone-800 shadow-xl overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    <th className="py-4 px-6 min-w-[220px]">Col 1: Publisher Info</th>
                    <th className="py-4 px-6 min-w-[260px]">Col 2: Absolute Direct API URL</th>
                    <th className="py-4 px-6 min-w-[260px]">Col 3: AllOrigins Proxy URL</th>
                    <th className="py-4 px-6 min-w-[160px]">Col 4: Status Code</th>
                    <th className="py-4 px-6 min-w-[280px]">Col 5: Response Data & Error Log</th>
                    <th className="py-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 text-xs">
                  {filteredSources.map((source) => {
                    const result = testResults[source.id] || {
                      sourceId: source.id,
                      sourceName: source.name,
                      kannadaName: source.kannadaName,
                      endpoint: source.endpoint,
                      proxyUrl: `https://api.allorigins.win/raw?url=${encodeURIComponent(source.endpoint)}`,
                      category: source.category,
                      status: 'idle',
                    };

                    const isCurrentlyTesting = currentIndex === testableSources.findIndex(s => s.id === source.id) && isRunning;
                    const isExpanded = expandedId === source.id;
                    const domainBadge = extractDomainBadge(source.endpoint);

                    return (
                      <React.Fragment key={source.id}>
                        <tr className={`transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/40 ${
                          isCurrentlyTesting ? 'bg-red-50/70 dark:bg-red-950/30' : ''
                        }`}>
                          {/* Column 1: Publisher Name */}
                          <td className="py-4 px-6 align-top">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-red-600 text-xs shrink-0 border border-stone-200 dark:border-stone-700">
                                {source.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold font-serif text-stone-900 dark:text-stone-100 text-sm">
                                    {source.kannadaName}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                                    {domainBadge}
                                  </span>
                                </div>
                                <div className="text-stone-500 dark:text-stone-400 text-xs font-medium">
                                  {source.name} · <span className="text-red-600">{source.category}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Absolute Direct API URL */}
                          <td className="py-4 px-6 align-top">
                            <div className="flex items-center gap-2 p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200/80 dark:border-stone-800 font-mono text-[11px]">
                              <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="text-stone-700 dark:text-stone-300 truncate max-w-[180px]" title={source.endpoint}>
                                {source.endpoint}
                              </span>
                              <button
                                onClick={() => handleCopyText(source.endpoint, `direct-${source.id}`)}
                                className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded text-stone-500 shrink-0 transition-colors"
                                title="Copy absolute direct API URL"
                              >
                                {copiedKey === `direct-${source.id}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <a
                                href={source.endpoint}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 hover:text-red-600 shrink-0 text-stone-500"
                                title="Open absolute direct URL in new tab"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>

                          {/* Column 3: Proxy URL */}
                          <td className="py-4 px-6 align-top">
                            <div className="flex items-center gap-2 p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200/80 dark:border-stone-800 font-mono text-[11px]">
                              <Server className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="text-stone-700 dark:text-stone-300 truncate max-w-[180px]" title={result.proxyUrl}>
                                {result.proxyUrl}
                              </span>
                              <button
                                onClick={() => handleCopyText(result.proxyUrl, `proxy-${source.id}`)}
                                className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded text-stone-500 shrink-0 transition-colors"
                                title="Copy proxy URL to clipboard"
                              >
                                {copiedKey === `proxy-${source.id}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <a
                                href={result.proxyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 hover:text-red-600 shrink-0 text-stone-500"
                                title="Open proxy URL in new tab"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>

                          {/* Column 4: Response Status Code */}
                          <td className="py-4 px-6 align-top">
                            {result.status === 'testing' ? (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-900/40 animate-pulse">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Testing...</span>
                              </div>
                            ) : result.status === 'success' ? (
                              <div className="flex flex-col gap-1">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-black font-mono border border-green-500/20 w-max">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>200 OK</span>
                                </div>
                                {result.responseTimeMs && (
                                  <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-stone-400" />
                                    <span>{result.responseTimeMs} ms</span>
                                  </span>
                                )}
                              </div>
                            ) : result.status === 'error' ? (
                              <div className="flex flex-col gap-1">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-black font-mono border border-red-500/20 w-max">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>{result.statusCode ? `${result.statusCode} ${result.statusText || ''}` : 'Error'}</span>
                                </div>
                                {result.responseTimeMs && (
                                  <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-stone-400" />
                                    <span>{result.responseTimeMs} ms</span>
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 font-bold font-mono">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pending</span>
                              </span>
                            )}
                          </td>

                          {/* Column 5: Response Data & Error Log */}
                          <td className="py-4 px-6 align-top">
                            {result.status === 'success' ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>{result.itemCount} stories fetched successfully</span>
                                </span>
                                {result.sampleTitle && (
                                  <p className="text-stone-600 dark:text-stone-300 font-serif line-clamp-1 text-xs">
                                    &ldquo;{result.sampleTitle}&rdquo;
                                  </p>
                                )}
                              </div>
                            ) : result.status === 'error' ? (
                              <div className="flex flex-col gap-1">
                                <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 font-mono text-[11px] font-bold">
                                  {result.errorMessage || 'Failed to fetch from endpoint.'}
                                </div>
                                {result.details && (
                                  <button
                                    onClick={() => setExpandedId(isExpanded ? null : source.id)}
                                    className="text-[10px] text-red-600 dark:text-red-400 font-bold underline text-left flex items-center gap-1 mt-1 hover:text-red-700"
                                  >
                                    <Code className="w-3 h-3" />
                                    <span>{isExpanded ? 'Hide Raw Stack Log' : 'View Raw Diagnostic Log'}</span>
                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-stone-400 italic">Awaiting sequential test...</span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="py-4 px-4 text-right align-top">
                            <button
                              onClick={() => handleTestSingle(source)}
                              disabled={result.status === 'testing'}
                              className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-red-600 hover:text-white text-stone-700 dark:text-stone-300 transition-all active:scale-95 disabled:opacity-40"
                              title="Test this API now"
                            >
                              <RefreshCw className={`w-4 h-4 ${result.status === 'testing' ? 'animate-spin' : ''}`} />
                            </button>
                          </td>
                        </tr>

                        {/* Collapsible Error Log Row */}
                        {isExpanded && result.details && (
                          <tr className="bg-stone-900 text-stone-100">
                            <td colSpan={6} className="p-6">
                              <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                <span className="font-mono text-xs font-bold text-red-400 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                  <span>Raw Diagnostic Error Stack for {source.name} ({result.statusCode})</span>
                                </span>
                                <button
                                  onClick={() => handleCopyText(result.details || '', `log-${source.id}`)}
                                  className="px-3 py-1 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                                >
                                  {copiedKey === `log-${source.id}` ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>Copy Log Payload</span>
                                </button>
                              </div>
                              <pre className="font-mono text-[11px] text-red-200 bg-stone-950 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap max-h-60 border border-red-900/40">
                                {result.details}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
