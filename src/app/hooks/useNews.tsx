/**
 * 📰 USE NEWS HOOK - Custom Hook para News
 * Elimina duplicação entre news-section e home-news-section
 * V561 - Refatoração completa
 */

import { useState, useEffect } from 'react';
import { API_CONFIG, getApiUrl } from '../config/api';

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  image_url: string | null;
  published_at: string;
  views: number;
}

interface UseNewsOptions {
  limit?: number;
  category?: string;
  autoLoad?: boolean;
}

export function useNews(options: UseNewsOptions = {}) {
  const { limit, category, autoLoad = true } = options;
  
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = getApiUrl(API_CONFIG.ENDPOINTS.NEWS);
      const params = new URLSearchParams();
      
      if (limit) params.append('limit', limit.toString());
      if (category) params.append('category', category);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.data) {
        setNews(data.data);
      } else {
        setError(data.message || 'Erro ao carregar notícias');
        setNews([]);
      }
    } catch (err) {
      console.error('Erro ao carregar notícias:', err);
      setError('Erro ao conectar com o servidor');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      fetchNews();
    }
  }, [limit, category, autoLoad]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews
  };
}
