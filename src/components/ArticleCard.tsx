import React from 'react';
import type { WikiArticle } from '../services/wikiApi';
import { Share2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArticleCardProps {
    article: WikiArticle;
    lang: 'ko' | 'en';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, lang }) => {
    const hasImage = !!article.thumbnail;
    const bgImage = article.thumbnail?.source;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.extract,
                    url: article.content_urls.mobile.page,
                });
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            alert(lang === 'ko' ? '공유하기가 지원되지 않는 환경입니다.' : 'Sharing is not supported in this environment.');
        }
    };

    return (
        <div className="relative w-full h-[100dvh] flex items-center md:items-end justify-center overflow-hidden bg-black text-white snap-start shrink-0">
            {/* Background Layer */}
            {hasImage ? (
                <div className="absolute inset-0 z-0">
                    <img
                        src={bgImage}
                        alt={article.title}
                        className="w-full h-full object-cover opacity-50 blur-md scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/90" />
                </div>
            ) : (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-gray-950" />
            )}

            {/* Main Content Layer - Glass Panel */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className="relative z-10 w-full max-w-lg p-6 pb-24 md:pb-12"
            >
                <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden group shadow-2xl">
                    {/* Neon Accent Glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-purple/30 blur-[60px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-neon-blue/20 blur-[60px] rounded-full pointer-events-none" />

                    <div className="mb-5 rounded-2xl overflow-hidden h-52 w-full shadow-lg border border-white/5 bg-black/50 relative group-hover:scale-[1.02] transition-transform duration-500">
                        {hasImage ? (
                            <img src={article.thumbnail?.source} alt={article.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-gray-500 gap-3">
                                <div className="p-4 rounded-full bg-white/5">
                                    <span className="text-4xl font-serif font-black opacity-30 text-white">W</span>
                                </div>
                                <span className="text-xs font-medium uppercase tracking-wider opacity-50">
                                    {lang === 'ko' ? '이미지 없음' : 'No Image Available'}
                                </span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold mb-3 tracking-tight text-white drop-shadow-md">
                        {article.title}
                    </h2>

                    <p className="text-gray-200 line-clamp-5 leading-relaxed text-base mb-6 font-light">
                        {article.extract}
                    </p>

                    <div className="flex gap-3">
                        <a
                            href={article.content_urls.mobile.page}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium backdrop-blur-md border border-white/5 active:scale-95 group/btn"
                        >
                            <ExternalLink size={18} className="text-neon-blue group-hover/btn:scale-110 transition-transform" />
                            <span>{lang === 'ko' ? '위키백과 읽기' : 'Read on Wikipedia'}</span>
                        </a>
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center px-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-md border border-white/5 active:scale-95 group/share"
                        >
                            <Share2 size={20} className="text-neon-green group-hover/share:rotate-12 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
