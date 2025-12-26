// Hook para buscar estatísticas REAIS do servidor MU Online
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ServerStats {
  playersOnline: number;
  totalAccounts: number;
  totalCharacters: number;
  totalGuilds: number;
  serverStatus: 'online' | 'offline' | 'maintenance';
  timestamp: string;
}

export function useServerStats(refreshInterval = 30000) {
  const [stats, setStats] = useState<ServerStats>({
    playersOnline: 0,
    totalAccounts: 0,
    totalCharacters: 0,
    totalGuilds: 0,
    serverStatus: 'offline',
    timestamp: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats/server`);
      if (!response.ok) throw new Error('Falha ao buscar estatísticas');
      
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao buscar stats:', err);
      setError('Não foi possível conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { stats, loading, error, refresh: fetchStats };
}

// Hook para buscar apenas players online
export function usePlayersOnline(refreshInterval = 10000) {
  const [playersOnline, setPlayersOnline] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOnline = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats/online`);
      const data = await response.json();
      if (data.success) {
        setPlayersOnline(data.data.playersOnline);
      }
    } catch (err) {
      console.error('Erro ao buscar players online:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnline();
    const interval = setInterval(fetchOnline, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { playersOnline, loading, refresh: fetchOnline };
}

// Hook para buscar dados do Castle Siege
export function useCastleSiege() {
  const [castleData, setCastleData] = useState({
    ownerGuild: null as string | null,
    startDate: null as string | null,
    endDate: null as string | null,
    registrationOpen: false,
    timestamp: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  const fetchCastle = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats/castle-siege`);
      const data = await response.json();
      if (data.success) {
        setCastleData(data.data);
      }
    } catch (err) {
      console.error('Erro ao buscar Castle Siege:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCastle();
    const interval = setInterval(fetchCastle, 60000); // Atualiza a cada 1 minuto
    return () => clearInterval(interval);
  }, []);

  return { castleData, loading, refresh: fetchCastle };
}