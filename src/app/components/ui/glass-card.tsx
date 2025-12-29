/**
 * 🎨 GLASS CARD - Componente Reutilizável Glassmorphism
 * Elimina 50+ duplicações de código
 * V561 - Refatoração completa
 * V564 - Import corrigido definitivamente
 */

import React from 'react';
import { cn } from './utils';

interface GlassCardProps {
  variant?: 'default' | 'intense' | 'subtle' | 'gradient';
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
    default: 'bg-black/40 backdrop-blur-xl border border-yellow-500/30',
    intense: 'bg-black/60 backdrop-blur-lg border border-yellow-500/40',
    subtle: 'bg-black/20 backdrop-blur-md border border-yellow-500/20',
    gradient: 'bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl border border-yellow-500/30'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const hoverClasses = hover ? 'transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10' : '';
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