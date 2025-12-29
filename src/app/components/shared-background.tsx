import { motion } from 'motion/react';
import { memo, useEffect, useState } from 'react';

/**
 * 🎨 SharedBackground - Epic Mu Online Background
 * 
 * ✅ Background Image do Mu Online (DINÂMICO via AdminCP)
 * ✅ Efeitos de partículas e névoa
 * ✅ Presente em TODAS as páginas
 * ⚡ OTIMIZADO para performance
 * 🎨 V563: Background customizável via Site Editor
 * 
 * ⚠️ NUNCA REMOVER ESTE COMPONENTE! ⚠️
 */

// Background padrão (fallback se não houver customização)
const DEFAULT_BACKGROUND = 'https://i.postimg.cc/1XHKxhv1/8393fd9b_a4f8_4ab5_a5c2_dafceeb7e666.png';

export const SharedBackground = memo(function SharedBackground() {
  const [backgroundUrl, setBackgroundUrl] = useState<string>(DEFAULT_BACKGROUND);

  useEffect(() => {
    // 1. Verificar localStorage primeiro (prioridade imediata)
    const localBg = localStorage.getItem('admin_customBackground');
    if (localBg) {
      setBackgroundUrl(localBg);
      return;
    }

    // 2. Buscar configuração do banco de dados
    const fetchBackground = async () => {
      try {
        const response = await fetch('/api/admin/site-editor/background');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.backgroundUrl) {
            setBackgroundUrl(data.backgroundUrl);
          }
        }
      } catch (error) {
        console.log('ℹ️ Usando background padrão');
      }
    };

    fetchBackground();
  }, []);

  return (
    <>
      {/* ========================================
          BACKGROUND ÉPICO - IMAGEM DO MU ONLINE
          ======================================== */}
      
      <div className="fixed inset-0 z-0">
        {/* Imagem de fundo do Mu Online */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            willChange: 'transform',
          }}
        />
        
        {/* Overlay escuro para melhor contraste com conteúdo */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Gradientes sutis para profundidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
        
        {/* Brilho sutil nas bordas */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 via-transparent to-amber-900/10" />
      </div>

      {/* ========================================
          PARTÍCULAS MÁGICAS FLUTUANTES - REDUZIDAS
          ======================================== */}
      
      {/* Partículas Verdes Animadas */}
      <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`m-green-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.9), transparent)',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.7)',
              left: `${Math.random() * 45}%`,
              willChange: 'transform, opacity',
            }}
            initial={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1130,
              opacity: 0,
            }}
            animate={{
              y: -100,
              opacity: [0, 0.8, 0.8, 0],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      
      {/* Partículas Laranjas/Fogo Animadas */}
      <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`m-orange-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 5 + 2 + 'px',
              height: Math.random() * 5 + 2 + 'px',
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(245, 158, 11, 0.9), transparent)'
                : 'radial-gradient(circle, rgba(239, 68, 68, 0.9), transparent)',
              boxShadow: i % 2 === 0 
                ? '0 0 15px rgba(245, 158, 11, 0.7)'
                : '0 0 15px rgba(239, 68, 68, 0.7)',
              left: `${Math.random() * 45 + 55}%`,
              willChange: 'transform, opacity',
            }}
            initial={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1130,
              opacity: 0,
            }}
            animate={{
              y: -120,
              opacity: [0, 0.9, 0.9, 0],
              x: [0, Math.random() * 80 - 40],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
      
      {/* Faíscas Douradas */}
      <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              background: 'radial-gradient(circle, rgba(251, 191, 36, 1), transparent)',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.9)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              willChange: 'opacity',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </>
  );
});