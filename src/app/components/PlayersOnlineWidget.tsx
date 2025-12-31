// Widget que exibe players online EM TEMPO REAL do servidor MU Online
import { usePlayersOnline } from '../hooks/useServerStats';
import { Users } from 'lucide-react';

interface PlayersOnlineWidgetProps {
  className?: string;
  refreshInterval?: number; // Intervalo de atualização em ms (padrão: 10 segundos)
}

export function PlayersOnlineWidget({ 
  className = '', 
  refreshInterval = 10000 
}: PlayersOnlineWidgetProps) {
  const { playersOnline, loading } = usePlayersOnline(refreshInterval);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Users className="w-5 h-5 text-[var(--color-gold)]" />
        {playersOnline > 0 && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          Jogadores Online
        </span>
        <span className="text-lg font-bold text-[var(--color-gold)]">
          {loading ? (
            <span className="animate-pulse">...</span>
          ) : (
            <>
              {playersOnline.toLocaleString()}
              <span className="text-xs text-gray-500 ml-1">players</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

// Widget compacto para header
export function PlayersOnlineBadge({ 
  refreshInterval = 10000 
}: { refreshInterval?: number }) {
  const { playersOnline, loading } = usePlayersOnline(refreshInterval);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-[var(--color-gold)]/20">
      <div className="relative">
        <Users className="w-4 h-4 text-[var(--color-gold)]" />
        {playersOnline > 0 && (
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
      <span className="text-sm font-semibold text-[var(--color-gold)]">
        {loading ? '...' : playersOnline.toLocaleString()}
      </span>
      <span className="text-xs text-gray-400">online</span>
    </div>
  );
}

// Widget animado para página inicial
export function PlayersOnlineHero({ 
  refreshInterval = 10000 
}: { refreshInterval?: number }) {
  const { playersOnline, loading } = usePlayersOnline(refreshInterval);

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold)]/20 to-[var(--color-blue)]/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
      
      <div className="glass-dialog p-8 text-center relative">
        <Users className="w-12 h-12 text-[var(--color-gold)] mx-auto mb-4" />
        
        <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">
          Jogadores Online Agora
        </div>
        
        <div className="text-6xl font-black bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-blue)] bg-clip-text text-transparent">
          {loading ? (
            <span className="animate-pulse">...</span>
          ) : (
            playersOnline.toLocaleString()
          )}
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          Atualizado em tempo real
        </div>
        
        {/* Animated pulse */}
        {playersOnline > 0 && (
          <div className="absolute top-4 right-4">
            <div className="relative w-3 h-3">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping" />
              <div className="absolute inset-0 bg-green-500 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}