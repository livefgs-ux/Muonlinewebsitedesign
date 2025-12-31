import { Download, Play, Sparkles, Crown, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { HomeNewsSection } from './home-news-section';
import { useEffect, useState } from 'react';
import { API_CONFIG, getApiUrl } from '../config/api';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

interface ServerStats {
  playersOnline: number;
  expRate: string;
  dropRate: string;
  uptime: string;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t } = useLanguage();
  
  // ✅ ESTADO PARA DADOS REAIS DO SERVIDOR
  const [serverStats, setServerStats] = useState<ServerStats>({
    playersOnline: 0,
    expRate: '500x',
    dropRate: '70%',
    uptime: '99.9%'
  });
  const [loading, setLoading] = useState(true);

  // ✅ CARREGAR DADOS REAIS DO BACKEND
  useEffect(() => {
    const loadServerStats = async () => {
      try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SERVER_STATUS));
        const data = await response.json();
        
        if (data.success) {
          setServerStats({
            playersOnline: data.data.playersOnline || 0,
            expRate: data.data.expRate || '500x',
            dropRate: data.data.dropRate || '70%',
            uptime: data.data.uptime || '99.9%'
          });
        }
      } catch (error) {
        console.error('Erro ao carregar stats do servidor:', error);
        // Manter valores padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    loadServerStats();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(loadServerStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ✅ V605: RESPONSIVIDADE CORRIGIDA */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background já está em App.tsx - não duplicar! */}

        {/* Content - Responsivo e centralizado */}
        <div className="relative z-20 w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-3xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            {/* ✅ Badge responsivo */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6 flex-wrap">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              <span className="px-3 sm:px-4 py-1 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full text-yellow-500 text-xs sm:text-sm">
                {t('hero.seasonBadge')}
              </span>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            </div>

            {/* ✅ Título responsivo */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 text-white tracking-tight leading-tight">
              MeuMU <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">Online</span>
            </h1>

            {/* ✅ Subtítulo responsivo */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 sm:mb-6">
              {t('hero.tagline')}
            </p>

            {/* ✅ Descrição responsiva */}
            <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8">
              {t('hero.description')}
            </p>

            {/* ✅ CTA Buttons - Responsivo */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button
                onClick={() => onNavigate('downloads')}
                className="group relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all w-full sm:w-auto"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-bounce" />
                {t('hero.downloadNow')}
                <div className="absolute inset-0 rounded-md bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              
              <Button
                onClick={() => onNavigate('dashboard')}
                className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all w-full sm:w-auto"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('hero.playerArea') || 'Área do Jogador'}
                <div className="absolute inset-0 rounded-md bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>

              <Button
                onClick={() => onNavigate('events')}
                variant="outline"
                className="border-2 border-yellow-500/50 bg-black/30 backdrop-blur-sm text-yellow-500 hover:bg-yellow-500/10 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('hero.viewEvents')}
              </Button>
            </div>

            {/* ✅ Server Stats - Grid Responsivo */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto lg:mx-0">
              {[
                { 
                  label: t('hero.onlinePlayers'), 
                  value: loading ? '...' : serverStats.playersOnline.toLocaleString('pt-BR')
                },
                { 
                  label: t('hero.expRate'), 
                  value: serverStats.expRate 
                },
                { 
                  label: t('hero.dropRate'), 
                  value: serverStats.dropRate 
                },
                { 
                  label: t('hero.uptime'), 
                  value: serverStats.uptime 
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="backdrop-blur-md bg-white/5 border border-yellow-500/20 rounded-lg p-3 sm:p-4 hover:bg-white/10 transition-all"
                >
                  <div className="text-xl sm:text-2xl text-yellow-500">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block"
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