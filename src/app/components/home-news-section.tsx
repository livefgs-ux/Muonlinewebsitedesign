import { motion } from 'motion/react';
import { Newspaper, Calendar, User, ArrowRight, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useNews } from '../contexts/NewsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NewsModal } from './ui/news-modal';
import { useState } from 'react';

interface HomeNewsSectionProps {
  onNavigate: (section: string) => void;
}

export function HomeNewsSection({ onNavigate }: HomeNewsSectionProps) {
  const { news } = useNews();
  const { t, language } = useLanguage();
  const [selectedNews, setSelectedNews] = useState<typeof news[0] | null>(null);

  // Filter news for home page and get latest 3
  const homeNews = news
    .filter(item => item.publishTo?.includes('home'))
    .slice(0, 3);

  if (homeNews.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto relative z-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Newspaper className="w-8 h-8 text-yellow-500" />
            <h2 className="text-4xl md:text-5xl text-white">
              {t('news.latestNews')}
            </h2>
          </div>
          <p className="text-gray-400 text-lg">
            {t('news.subtitle')}
          </p>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {homeNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group h-full backdrop-blur-lg bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => setSelectedNews(item)}
              >
                {/* Image */}
                {item.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    {/* Darker gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 z-10" />
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl text-white mb-3 group-hover:text-yellow-500 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {item.content}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{item.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.date).toLocaleDateString(language)}</span>
                      </div>
                    </div>
                    {item.views !== undefined && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.views}</span>
                      </div>
                    )}
                  </div>

                  {/* Read More */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNews(item);
                    }}
                    variant="outline"
                    className="w-full border-yellow-500/30 bg-yellow-500/5 text-yellow-500 hover:bg-yellow-500/10 group/btn"
                  >
                    {t('news.readMore')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => onNavigate('news')}
            className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-8 py-4 text-lg shadow-lg shadow-yellow-500/30"
          >
            <Newspaper className="w-5 h-5 mr-2" />
            {t('news.viewAllNews')}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
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

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/5 rounded-full filter blur-3xl" />
    </section>
  );
}