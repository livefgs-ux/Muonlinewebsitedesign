/**
 * 🎨 GLASS CARD - Componente Reutilizável Glassmorphism
 * Padrão Oficial Dark Medieval Fantasy MeuMU Online
 * V568 - Padronização completa de glassmorphism
 */

import React from 'react';
import { cn } from './utils';

interface GlassCardProps {
  variant?: 'default' | 'intense' | 'subtle' | 'premium' | 'dialog';
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ 
  variant = 'default', 
  children, 
  className,
  padding = 'md',
  hover = false,
  onClick
}: GlassCardProps) {
  const variants = {
    // Padrão principal - uso geral em todo o site
    default: 'bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl border border-yellow-500/30',
    
    // Versão mais intensa - AdminCP, modais importantes
    intense: 'bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-2xl border border-yellow-500/40',
    
    // Versão sutil - widgets, cards secundários
    subtle: 'bg-black/40 backdrop-blur-lg border border-yellow-500/20',
    
    // Versão premium - hero sections, destaques
    premium: 'bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-xl border-2 border-yellow-500/40 shadow-2xl shadow-yellow-500/10',
    
    // Versão dialog - modais e overlays
    dialog: 'bg-gradient-to-br from-black/95 to-black/90 backdrop-blur-2xl border-2 border-yellow-500/30 shadow-2xl shadow-black/50'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const hoverClasses = hover 
    ? 'transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20' 
    : '';
  
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={cn(
        variants[variant],
        paddings[padding],
        hoverClasses,
        clickableClasses,
        'rounded-xl',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}