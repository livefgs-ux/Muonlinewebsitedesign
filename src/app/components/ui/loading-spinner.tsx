/**
 * ⏳ LOADING SPINNER - Componente Reutilizável
 * Elimina 12+ duplicações de código
 * V561 - Refatoração completa
 */

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullHeight?: boolean;
}

export function LoadingSpinner({ 
  message = 'Carregando...',
  size = 'md',
  fullHeight = false
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const containerClasses = fullHeight 
    ? 'min-h-screen flex items-center justify-center' 
    : 'text-center py-12';

  return (
    <div className={containerClasses}>
      <div>
        <div className={`animate-spin rounded-full ${sizes[size]} border-b-2 border-yellow-500 mx-auto mb-4`}></div>
        {message && <p className="text-white">{message}</p>}
      </div>
    </div>
  );
}
