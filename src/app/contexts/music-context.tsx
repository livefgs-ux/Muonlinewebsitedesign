import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
}

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  isMuted: boolean;
  playlist: Track[];
  currentTrackIndex: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  setPlaylist: (tracks: Track[]) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function useMusicPlayer() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicProvider');
  }
  return context;
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('muonline_volume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('muonline_muted');
    return saved === 'true';
  });
  const [playlist, setPlaylistState] = useState<Track[]>(() => {
    const saved = localStorage.getItem('muonline_playlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getDefaultPlaylist();
      }
    }
    return getDefaultPlaylist();
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializa o audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = isMuted ? 0 : volume;
    
    // Event listeners
    audioRef.current.addEventListener('ended', handleTrackEnd);
    audioRef.current.addEventListener('play', () => setIsPlaying(true));
    audioRef.current.addEventListener('pause', () => setIsPlaying(false));
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, []);

  // Atualiza Media Session API quando a música muda
  useEffect(() => {
    if (playlist[currentTrackIndex] && 'mediaSession' in navigator) {
      const track = playlist[currentTrackIndex];
      
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: 'MeuMU Online - Season 19-2-3',
        artwork: [
          { 
            src: track.cover || '/mu-logo.png', 
            sizes: '512x512', 
            type: 'image/png' 
          }
        ]
      });

      navigator.mediaSession.setActionHandler('play', play);
      navigator.mediaSession.setActionHandler('pause', pause);
      navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
      navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
    }
  }, [currentTrackIndex, playlist]);

  // Carrega a faixa atual
  useEffect(() => {
    if (audioRef.current && playlist[currentTrackIndex]) {
      const wasPlaying = isPlaying;
      audioRef.current.src = playlist[currentTrackIndex].url;
      
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.error('Erro ao reproduzir:', e));
      }
    }
  }, [currentTrackIndex]);

  // Atualiza volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('muonline_volume', volume.toString());
  }, [volume, isMuted]);

  // Salva estado de mute
  useEffect(() => {
    localStorage.setItem('muonline_muted', isMuted.toString());
  }, [isMuted]);

  // Salva playlist
  useEffect(() => {
    localStorage.setItem('muonline_playlist', JSON.stringify(playlist));
  }, [playlist]);

  const handleTrackEnd = () => {
    nextTrack();
  };

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error('Erro ao reproduzir:', e));
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (isMuted && clampedVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const setPlaylist = (tracks: Track[]) => {
    setPlaylistState(tracks);
    setCurrentTrackIndex(0);
  };

  const currentTrack = playlist[currentTrackIndex] || null;

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        volume,
        isMuted,
        playlist,
        currentTrackIndex,
        play,
        pause,
        togglePlay,
        setVolume,
        toggleMute,
        nextTrack,
        prevTrack,
        selectTrack,
        setPlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

// Playlist padrão com tema de Lorencia
function getDefaultPlaylist(): Track[] {
  return [
    {
      id: '1',
      title: 'Mu Online - Season 19 Theme',
      artist: 'MU Online Official',
      url: 'https://www.youtube.com/watch?v=KU8V65G9G2s',
      cover: 'https://i.ytimg.com/vi/KU8V65G9G2s/maxresdefault.jpg'
    }
  ];
}