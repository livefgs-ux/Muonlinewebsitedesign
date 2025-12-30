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

  // 🛡️ V582 FIX CRÍTICO: Limpar dados ao deslogar
  // Monitora mudanças no token de autenticação
  useEffect(() => {
    const checkToken = () => {
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      
      if (!token) {
        // ✅ TOKEN REMOVIDO = LOGOUT → LIMPAR TUDO!
        console.log('🧹 [PlayerContext] Token removido - limpando dados de personagens');
        setCharacters([]);
        setSelectedCharacter(null);
        setPlayerStats(null);
        setIsLoading(false);
      } else {
        // ✅ TOKEN EXISTE = LOGIN → BUSCAR PERSONAGENS
        refreshCharacters();
      }
    };
    
    // Executar na montagem
    checkToken();
    
    // 🛡️ V582 FIX: Escutar mudanças no sessionStorage/localStorage (logout de outra aba)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'admin_token') {
        console.log('🔄 [PlayerContext] Detectada mudança no token - atualizando...');
        checkToken();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // ✅ EXECUTAR APENAS UMA VEZ NA MONTAGEM

  const refreshCharacters = async () => {
    // ✅ BUSCAR TOKEN EM MÚLTIPLOS LOCAIS (jogador OU admin)
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
    if (!token) return;
    
    // 🧪 Se for token fake (teste), não faz requisição
    if (token === 'fake_token') {
      console.log('⚠️ Modo de teste ativo - usando dados mockados');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHARACTERS), {
        headers: {
          ...getAuthHeaders(token),
          // 🛡️ V580 FIX: Desabilitar cache para evitar HTTP 304 sem body
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      console.log(`📊 [PlayerContext] Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        
        console.log(`📊 [PlayerContext] Dados recebidos:`, data);
        
        // ✅ CORREÇÃO: Backend retorna { success, data: [...] }, não { characters: [...] }
        const charactersArray = Array.isArray(data.data) ? data.data : (data.characters || []);
        
        console.log(`📊 [PlayerContext] Personagens processados (${charactersArray.length}):`, charactersArray);
        
        setCharacters(charactersArray);
        setPlayerStats(data.stats || null);
        
        // Se há um personagem selecionado, atualizá-lo
        if (selectedCharacter) {
          const updated = charactersArray.find((c: Character) => c.name === selectedCharacter.name);
          if (updated) {
            setSelectedCharacter(updated);
          }
        }
      } else {
        // ✅ LOGAR ERRO REAL DO BACKEND
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        console.error(`❌ [PlayerContext] Erro ${response.status}:`, errorData);
        
        // Mesmo com erro, não bloqueia - dados vazios
        setCharacters([]);
        setPlayerStats(null);
      }
    } catch (error) {
      // ✅ LOGAR ERRO DE REDE (não tem nada a ver com servidor do jogo!)
      console.error('❌ [PlayerContext] Erro de requisição (backend Node.js pode estar offline):', error);
      
      // Mesmo com erro de rede, não bloqueia
      setCharacters([]);
      setPlayerStats(null);
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
    // ✅ BUSCAR TOKEN EM MÚLTIPLOS LOCAIS (jogador OU admin)
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
    if (!token) {
      return { success: false, message: 'Não autenticado' };
    }

    try {
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.CHARACTERS}/${characterName}/points`), {  // ✅ CORRETO
        method: 'PUT',  // ✅ PUT, não POST
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stats })
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
    // ✅ BUSCAR TOKEN EM MÚLTIPLOS LOCAIS (jogador OU admin)
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
    if (!token) {
      return { success: false, message: 'Não autenticado' };
    }

    try {
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.CHARACTERS}/${characterName}/reset`), {  // ✅ CORRETO
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