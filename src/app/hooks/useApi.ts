import { useState, useCallback } from 'react';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../config/api';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export function useApi<T = any>(endpoint: string, options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) => {
    setLoading(true);
    setError(null);

    try {
      const url = getApiUrl(endpoint);
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });

      const result: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      setData(result.data || result as unknown as T);
      options?.onSuccess?.(result.data || result);
      
      return { success: true, data: result.data || result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      options?.onError?.(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  const get = useCallback(() => execute('GET'), [execute]);
  const post = useCallback((body: any) => execute('POST', body), [execute]);
  const put = useCallback((body: any) => execute('PUT', body), [execute]);
  const del = useCallback(() => execute('DELETE'), [execute]);

  return {
    data,
    error,
    loading,
    execute,
    get,
    post,
    put,
    delete: del,
  };
}

// Hook específico para Rankings
export function useRankings() {
  const [resetsRanking, setResetsRanking] = useState([]);
  const [pkRanking, setPkRanking] = useState([]);
  const [guildsRanking, setGuildsRanking] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRankings = useCallback(async () => {
    setLoading(true);
    try {
      const [resets, pk, guilds] = await Promise.all([
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.RANKING_RESETS)).then(r => r.json()),
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.RANKING_PK)).then(r => r.json()),
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.RANKING_GUILDS)).then(r => r.json()),
      ]);

      setResetsRanking(resets.rankings || []);
      setPkRanking(pk.rankings || []);
      setGuildsRanking(guilds.rankings || []);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    resetsRanking,
    pkRanking,
    guildsRanking,
    loading,
    refresh: fetchRankings,
  };
}

// Hook específico para Eventos
export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.EVENTS_STATUS));
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    events,
    loading,
    refresh: fetchEvents,
  };
}

// Hook específico para Status do Servidor
export function useServerStatus() {
  const [status, setStatus] = useState({
    online: false,
    players: 0,
    uptime: '',
    experience: 1,
    drop: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SERVER_STATUS));
      const data = await response.json();
      setStatus(data.status || status);
    } catch (error) {
      console.error('Error fetching server status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    status,
    loading,
    refresh: fetchStatus,
  };
}
