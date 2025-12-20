import { Download, Play, Sparkles, Crown, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { HomeNewsSection } from './home-news-section';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background já está em App.tsx - não duplicar! */}

        {/* Content - Positioned to the left */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl text-left"
          >
            <div className="flex items-start gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="px-4 py-1 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full text-yellow-500 text-sm">
                {t('hero.seasonBadge')}
              </span>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl mb-6 text-white tracking-tight">
              MeuMU <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">Online</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 mb-6">
              {t('hero.tagline')}
            </p>

            <p className="text-lg text-gray-400 mb-8">
              {t('hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <Button
                onClick={() => onNavigate('downloads')}
                className="group relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-8 py-6 text-lg shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                {t('hero.downloadNow')}
                <div className="absolute inset-0 rounded-md bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>

              <Button
                onClick={() => onNavigate('events')}
                variant="outline"
                className="border-2 border-yellow-500/50 bg-black/30 backdrop-blur-sm text-yellow-500 hover:bg-yellow-500/10 px-8 py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                {t('hero.viewEvents')}
              </Button>
            </div>

            {/* Server Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {[
                { label: t('hero.onlinePlayers'), value: '1,247' },
                { label: t('hero.expRate'), value: '500x' },
                { label: t('hero.dropRate'), value: '70%' },
                { label: t('hero.uptime'), value: '99.9%' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="backdrop-blur-md bg-white/5 border border-yellow-500/20 rounded-lg p-4 hover:bg-white/10 transition-all"
                >
                  <div className="text-2xl text-yellow-500">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-yellow-500/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-yellow-500 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Latest News Section - Positioned right after hero for immediate visibility */}
      <HomeNewsSection onNavigate={onNavigate} />
    </>
  );
}

export default HeroSection;