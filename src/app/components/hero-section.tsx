import { Download, Play, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import heroImage from 'figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
          <img
            src={heroImage}
            alt="MU Online Elf Warrior"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </div>

      {/* Animated Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-500 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content - Positioned to the left */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-left"
        >
          <div className="flex items-start gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <span className="px-4 py-1 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full text-yellow-500 text-sm">
              Season 19-2-3 - Épico
            </span>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl mb-6 text-white tracking-tight">
            MeuMU <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">Online</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-6">
            Entre na lenda. Domine os reinos. Torne-se imortal.
          </p>

          <p className="text-lg text-gray-400 mb-8">
            Experiência completa com rates balanceados, eventos épicos diários e uma comunidade ativa. Junte-se a milhares de jogadores!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
            <Button
              onClick={() => onNavigate('downloads')}
              className="group relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-8 py-6 text-lg shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all"
            >
              <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Baixar Agora
              <div className="absolute inset-0 rounded-md bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <Button
              onClick={() => onNavigate('events')}
              variant="outline"
              className="border-2 border-yellow-500/50 bg-black/30 backdrop-blur-sm text-yellow-500 hover:bg-yellow-500/10 px-8 py-6 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Eventos
            </Button>
          </div>

          {/* Server Stats */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { label: 'Jogadores Online', value: '1,247' },
              { label: 'EXP Rate', value: '500x' },
              { label: 'Drop Rate', value: '70%' },
              { label: 'Uptime', value: '99.9%' },
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
  );
}