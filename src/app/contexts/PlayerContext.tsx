import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../config/api';

interface Character {
  name: string;
  level: number; // ✅ CORRETO: backend retorna "level"
  masterLevel?: number;
  majesticLevel?: number;
  resets: number;
  class: string;
  classNumber: number;
  stats: {
    strength: number;
    dexterity: number;
    vitality: number;
    energy: number;
    command: number;
  };
  points: number;
  masterPoints?: number;
  majesticPoints?: number;
  zen: number;
  pk: {
    level: number;
    kills: number;
  };
  online: boolean;
}

interface PlayerStats {
  totalCharacters: number;
  totalResets: number;
  totalPKPoints: number;
  accountStatus: string;
}

interface PlayerContextType {
  characters: Character[];
  selectedCharacter: Character | null;
  playerStats: PlayerStats | null;
  isLoading: boolean;
  selectCharacter: (characterName: string) => void;
  refreshCharacters: () => Promise<void>;
  distributePoints: (characterName: string, stats: Partial<Pick<Character, 'strength' | 'dexterity' | 'vitality' | 'energy' | 'command'>>) => Promise<{ success: boolean; message: string }>;
  resetCharacter: (characterName: string) => Promise<{ success: boolean; message: string }>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    refreshCharacters();
  }, []);

  const refreshCharacters = async () => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;
    
    // 🧪 Se for token fake (teste), não faz requisição
    if (token === 'fake_token') {
      console.log('⚠️ Modo de teste ativo - usando dados mockados');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PLAYER_CHARACTERS), {
        headers: getAuthHeaders(token)
      });

      if (response.ok) {
        const data = await response.json();
        setCharacters(data.characters || []);
        setPlayerStats(data.stats || null);
        
        // Se há um personagem selecionado, atualizá-lo
        if (selectedCharacter) {
          const updated = data.characters.find((c: Character) => c.name === selectedCharacter.name);
          if (updated) {
            setSelectedCharacter(updated);
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Não foi possível carregar personagens - servidor pode estar offline');
      // Não mostra erro ao usuário, apenas loga
    } finally {
      setIsLoading(false);
    }
  };

  const selectCharacter = (characterName: string) => {
    const character = characters.find(c => c.name === characterName);
    if (character) {
      setSelectedCharacter(character);
    }
  };

  const distributePoints = async (
    characterName: string, 
    stats: Partial<Pick<Character, 'strength' | 'dexterity' | 'vitality' | 'energy' | 'command'>>
  ) => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      return { success: false, message: 'Não autenticado' };
    }

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PLAYER_DISTRIBUTE_POINTS), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ characterName, stats })
      });

      const data = await response.json();

      if (response.ok) {
        await refreshCharacters();
        return { success: true, message: data.message || 'Pontos distribuídos com sucesso!' };
      } else {
        return { success: false, message: data.message || 'Erro ao distribuir pontos' };
      }
    } catch (error) {
      console.error('Erro ao distribuir pontos:', error);
      return { success: false, message: 'Erro de conexão com o servidor' };
    }
  };

  const resetCharacter = async (characterName: string) => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      return { success: false, message: 'Não autenticado' };
    }

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PLAYER_RESET), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ characterName })
      });

      const data = await response.json();

      if (response.ok) {
        await refreshCharacters();
        return { success: true, message: data.message || 'Reset realizado com sucesso!' };
      } else {
        return { success: false, message: data.message || 'Erro ao realizar reset' };
      }
    } catch (error) {
      console.error('Erro ao realizar reset:', error);
      return { success: false, message: 'Erro de conexão com o servidor' };
    }
  };

  const value = {
    characters,
    selectedCharacter,
    playerStats,
    isLoading,
    selectCharacter,
    refreshCharacters,
    distributePoints,
    resetCharacter
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}