import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { Button } from './button';
import { useEffect } from 'react';

interface NewsLink {
  title: string;
  url: string;
}

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    imageUrl?: string;
    links?: NewsLink[];
  };
  language: string;
  t: (key: string) => string;
}

export function NewsModal({ isOpen, onClose, news, language, t }: NewsModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-obsidian via-black to-obsidian border-2 border-gold/40 rounded-2xl shadow-2xl shadow-gold/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-ethereal/5 rounded-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/80 hover:bg-black border border-gold/30 hover:border-gold rounded-lg transition-all group"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gold group-hover:text-yellow-300 transition-colors" />
            </button>

            {/* Content */}
            <div className="relative">
              {/* Image Header */}
              {news.imageUrl && (
                <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
                  
                  {/* Title overlay on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-gold drop-shadow-2xl">
                      {news.title}
                    </h2>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="p-8 md:p-10">
                {/* Title (if no image) */}
                {!news.imageUrl && (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-gold mb-6">
                    {news.title}
                  </h2>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gold/20">
                  <div className="flex items-center gap-2 text-ethereal">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm text-ethereal">
                      {new Date(news.date).toLocaleDateString(language, {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gold">
                    <User className="w-5 h-5" />
                    <span className="text-sm text-gold">{t('news.by')} {news.author}</span>
                  </div>
                </div>

                {/* Full Content */}
                <div className="prose prose-invert prose-gold max-w-none mb-8">
                  <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                    {news.content}
                  </p>
                </div>

                {/* Links */}
                {news.links && news.links.length > 0 && (
                  <div className="space-y-3 mb-6 pb-6 border-b border-gold/20">
                    <h3 className="text-xl text-gold mb-4 flex items-center gap-2">
                      <LinkIcon className="w-5 h-5" />
                      {t('news.relatedLinks')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {news.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-ethereal/10 to-ethereal/5 hover:from-ethereal/20 hover:to-ethereal/10 border border-ethereal/30 hover:border-ethereal/50 rounded-lg text-ethereal hover:text-white transition-all group/link"
                        >
                          <LinkIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm flex-1 truncate text-ethereal group-hover/link:text-white">{link.title}</span>
                          <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button at Bottom */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black px-8 py-3 shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-all"
                  >
                    {t('news.close')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-gold/30 rounded-br-2xl pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}