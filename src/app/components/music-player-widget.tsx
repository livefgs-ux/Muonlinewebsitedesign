import React, { useState, memo, useCallback } from 'react';
import { Volume2, VolumeX, Volume1, Play, Pause, SkipForward, SkipBack, Music2, ChevronUp, ChevronDown } from 'lucide-react';
import { useMusicPlayer } from '../contexts/music-context';

interface MusicPlayerWidgetProps {
  currentSection?: string;
}

export const MusicPlayerWidget = memo(function MusicPlayerWidget({ currentSection = 'home' }: MusicPlayerWidgetProps) {
  const {
    isPlaying,
    currentTrack,
    volume,
    isMuted,
    togglePlay,
    setVolume,
    toggleMute,
    nextTrack,
    prevTrack,
  } = useMusicPlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const getVolumeIcon = useCallback(() => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  }, [isMuted, volume]);

  const VolumeIcon = getVolumeIcon();

  // Hide widget in AdminCP - MOVED AFTER all hooks are called
  if (currentSection === 'admincp' || !currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-30 pointer-events-none">
      {/* Widget compacto */}
      {!isExpanded && (
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setIsExpanded(true)}
            className="group relative glass-default glass-hover rounded-full p-4 shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105"
            title={`${currentTrack.title} - ${currentTrack.artist}`}
          >
            <Music2 className="w-6 h-6 text-gold" />
            
            {/* Indicador de música tocando */}
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
              </span>
            )}

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-obsidian border border-gold/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <p className="text-sm font-medium text-gold">{currentTrack.title}</p>
              <p className="text-xs text-ethereal">{currentTrack.artist}</p>
            </div>
          </button>

          {/* Controle de volume rápido */}
          <button
            onClick={toggleMute}
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
            className="absolute -top-14 right-0 bg-gradient-to-br from-obsidian/95 to-obsidian-light/95 backdrop-blur-md border border-gold/20 rounded-full p-3 shadow-xl hover:shadow-gold/20 transition-all duration-300"
            title={isMuted ? 'Ativar som' : 'Mutar'}
          >
            <VolumeIcon className={`w-5 h-5 ${isMuted ? 'text-gray-500' : 'text-ethereal'}`} />
          </button>

          {/* Slider de volume */}
          {showVolumeSlider && (
            <div
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="absolute -top-48 right-0 bg-gradient-to-br from-obsidian/95 to-obsidian-light/95 backdrop-blur-md border border-gold/20 rounded-lg p-4 shadow-xl"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-8 h-32 appearance-none bg-transparent cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                style={{
                  background: `linear-gradient(to top, rgb(212, 175, 55) 0%, rgb(212, 175, 55) ${(isMuted ? 0 : volume) * 100}%, rgba(90, 159, 212, 0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(90, 159, 212, 0.3) 100%)`
                }}
              />
              <p className="text-xs text-center text-ethereal mt-2">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </p>
            </div>
          )}
        </div>
      )}

      {/* Player expandido */}
      {isExpanded && (
        <div className="pointer-events-auto bg-gradient-to-br from-obsidian/95 to-obsidian-light/95 backdrop-blur-md border border-gold/30 rounded-2xl p-6 shadow-2xl w-80">{/* Adicionado pointer-events-auto */}
          {/* Header com botão de minimizar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music2 className="w-5 h-5 text-gold" />
              <h3 className="text-sm font-semibold text-gold">Player de Música</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gold/10 rounded-lg transition-colors"
              title="Minimizar"
            >
              <ChevronDown className="w-4 h-4 text-ethereal" />
            </button>
          </div>

          {/* Capa do álbum */}
          {currentTrack.cover && (
            <div className="mb-4 rounded-xl overflow-hidden border border-gold/20">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="w-full aspect-square object-cover"
              />
            </div>
          )}

          {/* Informações da música */}
          <div className="mb-4 text-center">
            <h4 className="font-semibold text-gold mb-1 truncate">{currentTrack.title}</h4>
            <p className="text-sm text-ethereal truncate">{currentTrack.artist}</p>
          </div>

          {/* Controles de reprodução */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={prevTrack}
              className="p-2 hover:bg-gold/10 rounded-full transition-all hover:scale-110"
              title="Anterior"
            >
              <SkipBack className="w-5 h-5 text-ethereal fill-ethereal" />
            </button>

            <button
              onClick={togglePlay}
              className="p-4 bg-gradient-to-br from-gold to-gold/80 rounded-full shadow-lg hover:shadow-gold/50 transition-all hover:scale-110"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-obsidian fill-obsidian" />
              ) : (
                <Play className="w-6 h-6 text-obsidian fill-obsidian ml-1" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 hover:bg-gold/10 rounded-full transition-all hover:scale-110"
              title="Próxima"
            >
              <SkipForward className="w-5 h-5 text-ethereal fill-ethereal" />
            </button>
          </div>

          {/* Controle de volume */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-gold/10 rounded-lg transition-colors"
              title={isMuted ? 'Ativar som' : 'Mutar'}
            >
              <VolumeIcon className={`w-5 h-5 ${isMuted ? 'text-gray-500' : 'text-ethereal'}`} />
            </button>

            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-ethereal/20 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(212, 175, 55) 0%, rgb(212, 175, 55) ${(isMuted ? 0 : volume) * 100}%, rgba(90, 159, 212, 0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(90, 159, 212, 0.3) 100%)`
                }}
              />
            </div>

            <span className="text-sm text-ethereal w-12 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Indicador visual de áudio */}
          {isPlaying && (
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gold rounded-full"
                  style={{
                    height: '16px',
                    animation: `audioBar ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes audioBar {
          from { height: 4px; opacity: 0.5; }
          to { height: 16px; opacity: 1; }
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(212, 175, 55);
          cursor: pointer;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(212, 175, 55);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
        }

        input[type="range"][writing-mode="vertical-lr"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(212, 175, 55);
          cursor: pointer;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  );
});