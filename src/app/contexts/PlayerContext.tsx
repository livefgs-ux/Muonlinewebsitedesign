import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../config/api';
import { logger } from '../utils/logger'; // 🔒 V606: Logger seguro

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
  distributePoints: (characterName: string, stats: any) => Promise<{ success: boolean; message: string }>;
  resetCharacter: (characterName: string) => Promise<{ success: boolean; message: string }>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🔥 V606 FIX: Prevenir chamadas duplicadas de refreshCharacters
  const hasInitializedRef = React.useRef(false);

  // 🛡️ V582 FIX CRÍTICO: Limpar dados ao deslogar
  // Monitora mudanças no token de autenticação
  useEffect(() => {
    const checkToken = () => {
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      
      if (!token) {
        // ✅ TOKEN REMOVIDO = LOGOUT → LIMPAR TUDO!
        logger.info('🧹 [PlayerContext] Token removido - limpando dados de personagens');
        // 🔥 V606 FIX: Só atualizar se realmente tiver mudanças
        setCharacters(prev => prev.length > 0 ? [] : prev);
        setSelectedCharacter(prev => prev ? null : prev);
        setPlayerStats(prev => prev ? null : prev);
        setIsLoading(prev => prev ? false : prev);
        hasInitializedRef.current = false;
      } else {
        // ✅ TOKEN EXISTE = LOGIN → BUSCAR PERSONAGENS
        // 🔥 V606 FIX: Só chamar refreshCharacters() UMA VEZ!
        if (!hasInitializedRef.current) {
          logger.info('🔄 [PlayerContext] Primeira inicialização - buscando personagens...');
          hasInitializedRef.current = true;
          refreshCharacters();
        }
      }
    };
    
    // Executar na montagem
    checkToken();
    
    // 🛡️ V582 FIX: Escutar mudanças no sessionStorage/localStorage (logout de outra aba)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'admin_token') {
        logger.info('🔄 [PlayerContext] Detectada mudança no token - atualizando...');
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
    
    // V589: Log detalhado do token
    logger.info('🔍 [PlayerContext] refreshCharacters chamado');
    logger.info('🔍 [PlayerContext] Token presente:', !!token);
    logger.info('🔍 [PlayerContext] Token length:', token?.length || 0);
    
    if (!token) {
      logger.info('❌ [PlayerContext] Nenhum token encontrado - não buscando personagens');
      return;
    }
    
    // 🧪 Se for token fake (teste), não faz requisição
    if (token === 'fake_token') {
      logger.warn('⚠️ Modo de teste ativo - usando dados mockados');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // V589: Log da URL da requisição
    const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.CHARACTERS);
    logger.info('🔍 [PlayerContext] Requisitando:', apiUrl);
    
    try {
      const response = await fetch(apiUrl, {
        headers: {
          ...getAuthHeaders(token),
          // 🛡️ V580 FIX: Desabilitar cache para evitar HTTP 304 sem body
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      logger.info(`📊 [PlayerContext] Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        
        logger.info(`📊 [PlayerContext] Dados recebidos:`, data);
        
        // ✅ CORREÇÃO: Backend retorna { success, data: [...] }, não { characters: [...] }
        const charactersArray = Array.isArray(data.data) ? data.data : (data.characters || []);
        
        logger.info(`📊 [PlayerContext] Personagens processados (${charactersArray.length}):`, charactersArray);
        
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
        logger.error(`❌ [PlayerContext] Erro ${response.status}:`, errorData);
        
        // Mesmo com erro, não bloqueia - dados vazios
        setCharacters([]);
        setPlayerStats(null);
      }
    } catch (error) {
      // ✅ LOGAR ERRO DE REDE (não tem nada a ver com servidor do jogo!)
      logger.error('❌ [PlayerContext] Erro de requisição (backend Node.js pode estar offline):', error);
      
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

  const distributePoints = async (characterName: string, stats: any) => {
    // ✅ BUSCAR TOKEN EM MÚLTIPLOS LOCAIS (jogador OU admin)
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
    if (!token) {
      return { success: false, message: '⚠️ Sessão expirada. Faça login novamente.' };
    }

    try {
      console.log('📤 [PlayerContext] Distribuindo pontos:', { characterName, stats });
      
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.CHARACTERS}/${characterName}/points`), {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stats)
      });

      console.log('📥 [PlayerContext] Response status:', response.status);
      const data = await response.json();
      console.log('📥 [PlayerContext] Response data:', data);

      if (response.ok) {
        await refreshCharacters();
        return { success: true, message: '✅ Pontos distribuídos com sucesso!' };
      } else {
        // ✅ V629: MELHOR FEEDBACK DE ERRO
        let errorMessage = data.message || data.error || 'Erro ao distribuir pontos';
        
        // Mensagens específicas por código de erro
        if (response.status === 400) {
          errorMessage = '⚠️ Dados inválidos. Verifique os valores.';
        } else if (response.status === 403) {
          errorMessage = '⚠️ Personagem está online! Desconecte do jogo primeiro.';
        } else if (response.status === 404) {
          errorMessage = '⚠️ Personagem não encontrado.';
        } else if (response.status === 500) {
          errorMessage = '❌ Erro no servidor. Tente novamente em alguns instantes.';
          console.error('🔥 [PlayerContext] Erro 500 detalhado:', data);
        }
        
        return { success: false, message: errorMessage };
      }
    } catch (error: any) {
      console.error('❌ [PlayerContext] Erro ao distribuir pontos:', error);
      
      // Mensagem de erro específica
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          message: '❌ Erro de conexão. Verifique sua internet e tente novamente.' 
        };
      }
      
      return { 
        success: false, 
        message: '❌ Erro inesperado. Contate o suporte se persistir.' 
      };
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
      logger.error('Erro ao realizar reset:', error);
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