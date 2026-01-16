import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchRandomArticle } from '../services/wikiApi';
import type { WikiArticle } from '../services/wikiApi';
import { ArticleCard } from './ArticleCard';
import { Globe, RefreshCw } from 'lucide-react';

export const Feed: React.FC = () => {
    const [articles, setArticles] = useState<WikiArticle[]>([]);
    const [loading, setLoading] = useState(false);
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const observerTarget = useRef<HTMLDivElement>(null);

    // Ref to track loading state in effect without dependency issues or race conditions
    const loadingRef = useRef(false);

    const loadMore = useCallback(async (reset = false) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);

        try {
            // Fetch batch (increased to 5 for smoother scrolling)
            const promises = Array(5).fill(null).map(() => fetchRandomArticle(lang));
            const newArticles = await Promise.all(promises);

            setArticles(prev => {
                if (reset) return newArticles;

                // Filter duplicates
                const existingIds = new Set(prev.map(a => a.id));
                const unique = newArticles.filter(a => !existingIds.has(a.id));
                return [...prev, ...unique];
            });
        } catch (e) {
            console.error("Failed to load articles", e);
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [lang]);

    // Handle Language Switch
    const toggleLang = () => {
        const newLang = lang === 'ko' ? 'en' : 'ko';
        setLang(newLang);
        setArticles([]); // Clear current
        // Effect will trigger loadMore because observer will hit
    };

    // Initial Load & Effect on Lang change
    useEffect(() => {
        // If empty, load initial
        if (articles.length === 0) {
            loadMore(true);
        }
    }, [lang, loadMore]); // articles.length omitted to prevent loop, handled by observer

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loadingRef.current) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '400px' } // Load way before end
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loadMore, articles.length]); // Re-attach when list grows to ensure sentinel is correct

    return (
        <div className="relative h-screen w-full bg-black text-white font-sans">
            {/* Header / Controls */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <h1 className="text-2xl font-black tracking-tighter text-white pointer-events-auto drop-shadow-lg">
                    Wiki<span className="text-neon-pink">Tok</span>
                </h1>

                <button
                    onClick={toggleLang}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 pointer-events-auto hover:bg-white/20 transition active:scale-95"
                >
                    <Globe size={16} className="text-neon-blue" />
                    <span className="text-xs font-bold uppercase">{lang}</span>
                </button>
            </div>

            {/* Feed Container */}
            <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
                {articles.map((article, index) => (
                    <ArticleCard key={`${article.id}-${index}`} article={article} lang={lang} />
                ))}

                {/* Loading Sentinel */}
                <div ref={observerTarget} className="h-32 w-full snap-end flex items-center justify-center p-4">
                    {(loading || articles.length === 0) && (
                        <div className="flex flex-col items-center gap-2 opacity-70">
                            <RefreshCw className="animate-spin text-neon-pink" size={32} />
                            <span className="text-xs text-gray-400">{lang === 'ko' ? '지식을 불러오는 중...' : 'Loading knowledge...'}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
