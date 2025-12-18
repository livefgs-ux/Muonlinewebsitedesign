// Hook para buscar rankings REAIS do servidor MU Online
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface PlayerRanking {
  rank: number;
  name: string;
  level: number;
  resets: number;
  class: string;
  kills: number;
  accountId: string;
}

interface GuildRanking {
  rank: number;
  name: string;
  master: string;
  score: number;
  members: number;
  notice: string;
}

// Hook para ranking de players
export function usePlayerRankings(orderBy: 'level' | 'resets' | 'kills' = 'level', limit = 100) {
  const [rankings, setRankings] = useState<PlayerRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankings = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rankings/players?orderBy=${orderBy}&limit=${limit}`
      );
      const data = await response.json();
      
      if (data.success) {
        setRankings(data.data.rankings);
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao buscar ranking de players:', err);
      setError('Erro ao carregar ranking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [orderBy, limit]);

  return { rankings, loading, error, refresh: fetchRankings };
}

// Hook para ranking de guilds
export function useGuildRankings(limit = 50) {
  const [rankings, setRankings] = useState<GuildRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankings = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rankings/guilds?limit=${limit}`
      );
      const data = await response.json();
      
      if (data.success) {
        setRankings(data.data.rankings);
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao buscar ranking de guilds:', err);
      setError('Erro ao carregar ranking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [limit]);

  return { rankings, loading, error, refresh: fetchRankings };
}

// Hook para ranking de PKs
export function useKillerRankings(limit = 100) {
  const [rankings, setRankings] = useState<PlayerRanking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rankings/killers?limit=${limit}`
      );
      const data = await response.json();
      
      if (data.success) {
        setRankings(data.data.rankings);
      }
    } catch (err) {
      console.error('Erro ao buscar ranking de killers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [limit]);

  return { rankings, loading, refresh: fetchRankings };
}

// Hook para ranking Gens
export function useGensRankings() {
  const [gensData, setGensData] = useState({
    duprian: { members: 0, percentage: 0 },
    vanert: { members: 0, percentage: 0 }
  });
  const [loading, setLoading] = useState(true);

  const fetchGens = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rankings/gens`);
      const data = await response.json();
      
      if (data.success) {
        const total = data.data.duprian.members + data.data.vanert.members;
        setGensData({
          duprian: {
            members: data.data.duprian.members,
            percentage: total > 0 ? (data.data.duprian.members / total) * 100 : 50
          },
          vanert: {
            members: data.data.vanert.members,
            percentage: total > 0 ? (data.data.vanert.members / total) * 100 : 50
          }
        });
      }
    } catch (err) {
      console.error('Erro ao buscar Gens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGens();
  }, []);

  return { gensData, loading, refresh: fetchGens };
}
