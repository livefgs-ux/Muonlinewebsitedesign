import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  Newspaper,
  Calendar,
  User,
  ArrowRight,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NewsModal } from './ui/news-modal';
import { useState } from 'react';

export function NewsSection() {
  const { news } = useNews();
  const { t, language } = useLanguage();
  const [selectedNews, setSelectedNews] = useState<typeof news[0] | null>(null);

  // Filter news for news section
  const newsItems = news.filter(item => item.publishTo?.includes('news'));

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto relative z-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper className="w-12 h-12 text-gold" />
            <h1 className="text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-gold">
              {t('news.title')}
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('news.subtitle')}
          </p>
        </motion.div>

        {/* News Grid */}
        <div className="space-y-8">
          {newsItems.map((newsItem, index) => (
            <motion.div
              key={newsItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-dialog overflow-hidden group cursor-pointer"
                onClick={() => setSelectedNews(newsItem)}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Image */}
                  {newsItem.imageUrl ? (
                    <div className="md:col-span-1 relative overflow-hidden">
                      <img
                        src={newsItem.imageUrl}
                        alt={newsItem.title}
                        className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Darker overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                    </div>
                  ) : (
                    <div className="md:col-span-1 bg-gradient-to-br from-gold/10 to-ethereal/10 flex items-center justify-center">
                      <ImageIcon className="w-24 h-24 text-gold/30" />
                    </div>
                  )}

                  {/* Content */}
                  <div className={`${newsItem.imageUrl ? 'md:col-span-2' : 'md:col-span-3'} p-6`}>
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-ethereal">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm text-ethereal">
                          {new Date(newsItem.date).toLocaleDateString(language, {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gold">
                        <User className="w-4 h-4" />
                        <span className="text-sm text-gold">{t('news.by')} {newsItem.author}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl text-gold mb-4 group-hover:text-yellow-300 transition-colors">
                      {newsItem.title}
                    </h2>

                    {/* Content Preview - Limited to 3 lines */}
                    <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">{newsItem.content}</p>

                    {/* Links Preview */}
                    {newsItem.links && newsItem.links.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gold/20">
                        {newsItem.links.slice(0, 2).map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-4 py-2 bg-ethereal/10 hover:bg-ethereal/20 border border-ethereal/30 rounded-lg text-ethereal hover:text-white transition-all group/link"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span className="text-sm text-ethereal group-hover/link:text-white">{link.title}</span>
                            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                          </a>
                        ))}
                        {newsItem.links.length > 2 && (
                          <span className="text-sm text-gray-400 px-4 py-2">
                            +{newsItem.links.length - 2} {t('news.moreLinks')}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Read More Button */}
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNews(newsItem);
                      }}
                      className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black group-hover:shadow-lg group-hover:shadow-gold/50 transition-all"
                    >
                      {t('news.readMore')}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="max-w-7xl mx-auto mt-12 text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-ethereal to-sky-600 hover:from-sky-600 hover:to-ethereal text-white px-12"
          >
            {t('news.loadMore')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* News Modal */}
      {selectedNews && (
        <NewsModal
          isOpen={!!selectedNews}
          onClose={() => setSelectedNews(null)}
          news={selectedNews}
          language={language}
          t={t}
        />
      )}
    </div>
  );
}

export default NewsSection;