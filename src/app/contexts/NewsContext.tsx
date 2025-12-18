import { createContext, useContext, useState, ReactNode } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  image?: string; // Alias for imageUrl for compatibility
  links?: { title: string; url: string }[];
  language?: string;
  status?: 'published' | 'draft';
  views?: number;
  publishedAt?: string; // Alias for date for compatibility
  publishTo?: ('news' | 'home')[]; // Where to publish: news section, home page, or both
}

interface NewsContextType {
  news: NewsItem[];
  addNews: (newsItem: Omit<NewsItem, 'id' | 'date'>) => void;
  updateNews: (newsItemOrId: NewsItem | string, newsItem?: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  getNewsById: (id: string) => NewsItem | undefined;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

// Initial mock news data
const initialNews: NewsItem[] = [
  {
    id: '1',
    title: 'Novo Evento: Castle Siege Season 10',
    content:
      'Prepare-se para a maior batalha de guildas! O Castle Siege Season 10 começa em 15 de Janeiro às 20h. Recompensas exclusivas e novos títulos para os vencedores. Não perca!',
    author: 'Admin',
    date: '2024-01-10',
    publishedAt: '2024-01-10T10:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=800&h=400&fit=crop',
    image: 'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=800&h=400&fit=crop',
    links: [
      { title: 'Regras do Evento', url: '#' },
      { title: 'Recompensas', url: '#' },
    ],
    language: 'pt',
    status: 'published',
    views: 1234,
    publishTo: ['news', 'home'],
  },
  {
    id: '2',
    title: 'Atualização: Balanceamento de Classes',
    content:
      'Ajustes importantes nas classes para melhorar o equilíbrio PvP. Dark Knight recebeu buff em defesa, Elf teve skills de ataque aprimoradas. Confira todas as mudanças no changelog completo.',
    author: 'GameMaster',
    date: '2024-01-08',
    publishedAt: '2024-01-08T15:20:00',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    language: 'pt',
    status: 'published',
    views: 856,
    publishTo: ['news'],
  },
  {
    id: '3',
    title: 'Manutenção Programada - 12/01',
    content:
      'O servidor passará por manutenção no dia 12/01 das 06h às 10h. Serão implementadas melhorias de performance e correções de bugs. Agradecemos a compreensão!',
    author: 'Admin',
    date: '2024-01-05',
    publishedAt: '2024-01-05T09:00:00',
    language: 'pt',
    status: 'published',
    views: 543,
    publishTo: ['news'],
  },
  {
    id: '4',
    title: 'Novo Sistema de Pets',
    content:
      'Chegou o sistema de pets! Capture criaturas poderosas, treine e evolua seus companheiros. Pets fornecem bônus únicos em batalha. Visite o NPC Pet Master em Lorencia para começar.',
    author: 'GameMaster',
    date: '2024-01-03',
    publishedAt: '2024-01-03T14:10:00',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop',
    links: [
      { title: 'Guia de Pets', url: '#' },
      { title: 'Lista de Pets', url: '#' },
    ],
    language: 'pt',
    status: 'published',
    views: 1023,
    publishTo: ['news'],
  },
  {
    id: '5',
    title: 'Promoção: Dobro de EXP no Final de Semana',
    content:
      'Todo final de semana de janeiro teremos 2x EXP! Aproveite para subir de nível mais rápido e dominar os rankings. Válido para todos os personagens e mapas.',
    author: 'Admin',
    date: '2024-01-01',
    publishedAt: '2024-01-01T12:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
    language: 'pt',
    status: 'published',
    views: 2150,
    publishTo: ['news'],
  },
];

export function NewsProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);

  const addNews = (newsItem: Omit<NewsItem, 'id' | 'date'>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const dateTimeStr = now.toISOString();
    
    const newNews: NewsItem = {
      ...newsItem,
      id: Date.now().toString(),
      date: dateStr,
      publishedAt: dateTimeStr,
      language: newsItem.language || 'en',
      status: newsItem.status || 'published',
      views: newsItem.views || 0,
      image: newsItem.imageUrl,
      imageUrl: newsItem.image,
      publishTo: newsItem.publishTo || ['news'], // Default to 'news' if not specified
    };
    
    setNews([newNews, ...news]);
  };

  const updateNews = (newsItemOrId: NewsItem | string, newsItem?: Partial<NewsItem>) => {
    if (typeof newsItemOrId === 'string') {
      setNews((prevNews) =>
        prevNews.map((item) =>
          item.id === newsItemOrId ? { ...item, ...newsItem } : item
        )
      );
    } else {
      setNews((prevNews) =>
        prevNews.map((item) =>
          item.id === newsItemOrId.id ? { ...item, ...newsItemOrId } : item
        )
      );
    }

    console.log('✅ News updated successfully!', newsItemOrId);
  };

  const deleteNews = (id: string) => {
    setNews((prevNews) => prevNews.filter((item) => item.id !== id));
    console.log('✅ News deleted successfully!', id);
  };

  const getNewsById = (id: string) => {
    return news.find((item) => item.id === id);
  };

  return (
    <NewsContext.Provider
      value={{
        news,
        addNews,
        updateNews,
        deleteNews,
        getNewsById,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    console.error('⚠️ useNews called outside NewsProvider! Returning empty fallback.');
    // Return a safe fallback instead of throwing
    return {
      news: [],
      addNews: () => console.warn('addNews called outside provider'),
      updateNews: () => console.warn('updateNews called outside provider'),
      deleteNews: () => console.warn('deleteNews called outside provider'),
      getNewsById: () => undefined,
    };
  }
  return context;
}