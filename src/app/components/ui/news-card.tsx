/**
 * 📰 NEWS CARD - Componente Reutilizável para Notícias
 * Usado em: news-section + home-news-section
 * V561 - Refatoração completa
 */

import React from 'react';
import { Card, CardContent, CardHeader } from './card';
import { Badge } from './badge';
import { Calendar, Eye, User } from 'lucide-react';
import { NewsArticle } from '../../hooks/useNews';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'preview' | 'full';
  onClick?: () => void;
}

export function NewsCard({ article, variant = 'full', onClick }: NewsCardProps) {
  const isPreview = variant === 'preview';

  const categoryColors: Record<string, string> = {
    'update': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'evento': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'manutencao': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'novidade': 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const categoryColor = categoryColors[article.category.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  return (
    <Card 
      className={`group h-full backdrop-blur-lg bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Image */}
      {article.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={`${categoryColor} border`}>
              {article.category}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader>
        <h3 className="text-xl font-bold text-yellow-500 group-hover:text-yellow-400 transition-colors line-clamp-2">
          {article.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        <p className={`text-gray-300 ${isPreview ? 'line-clamp-2' : 'line-clamp-3'}`}>
          {article.summary}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {article.views}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(article.published_at).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {/* Read More (only on preview) */}
        {isPreview && (
          <div className="pt-2">
            <span className="text-yellow-500 hover:text-yellow-400 text-sm font-semibold group-hover:underline">
              Ler mais →
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
