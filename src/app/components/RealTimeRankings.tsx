// Componente que exibe Rankings REAIS do servidor MU Online
import { useState } from 'react';
import { usePlayerRankings, useGuildRankings } from '../hooks/useRankings';
import { Crown, Users, Swords, RefreshCw } from 'lucide-react';

export function RealTimeRankings() {
  const [tab, setTab] = useState<'players' | 'guilds'>('players');
  const [orderBy, setOrderBy] = useState<'level' | 'resets' | 'kills'>('level');
  
  const { rankings: playerRankings, loading: playersLoading, refresh: refreshPlayers } = usePlayerRankings(orderBy, 100);
  const { rankings: guildRankings, loading: guildsLoading, refresh: refreshGuilds } = useGuildRankings(50);

  const handleRefresh = () => {
    if (tab === 'players') {
      refreshPlayers();
    } else {
      refreshGuilds();
    }
  };

  return (
    <div className="glass-dialog overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-gold)]/10 to-transparent p-6 border-b border-[var(--color-gold)]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-[var(--color-gold)]" />
            <h2 className="text-2xl font-black text-white">Rankings em Tempo Real</h2>
          </div>
          
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-[var(--color-gold)]/20 hover:bg-[var(--color-gold)]/30 transition-colors"
            title="Atualizar rankings"
          >
            <RefreshCw className="w-5 h-5 text-[var(--color-gold)]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setTab('players')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              tab === 'players'
                ? 'bg-[var(--color-gold)] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Jogadores
          </button>
          <button
            onClick={() => setTab('guilds')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              tab === 'guilds'
                ? 'bg-[var(--color-gold)] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Swords className="w-4 h-4 inline mr-2" />
            Guilds
          </button>
        </div>

        {/* Filtros para Players */}
        {tab === 'players' && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setOrderBy('level')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                orderBy === 'level'
                  ? 'bg-[var(--color-gold)]/30 text-[var(--color-gold)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Por Nível
            </button>
            <button
              onClick={() => setOrderBy('resets')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                orderBy === 'resets'
                  ? 'bg-[var(--color-gold)]/30 text-[var(--color-gold)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Por Resets
            </button>
            <button
              onClick={() => setOrderBy('kills')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                orderBy === 'kills'
                  ? 'bg-[var(--color-gold)]/30 text-[var(--color-gold)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Por PKs
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {tab === 'players' ? (
          <PlayerRankingsList rankings={playerRankings} loading={playersLoading} />
        ) : (
          <GuildRankingsList rankings={guildRankings} loading={guildsLoading} />
        )}
      </div>
    </div>
  );
}

// Lista de rankings de players
function PlayerRankingsList({ rankings, loading }: { rankings: any[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Nenhum jogador encontrado
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto">
      {rankings.slice(0, 100).map((player) => (
        <div
          key={player.rank}
          className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
            player.rank <= 3
              ? 'bg-gradient-to-r from-[var(--color-gold)]/20 to-transparent border border-[var(--color-gold)]/30'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          {/* Rank */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
            player.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
            player.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
            player.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
            'bg-white/10 text-gray-400'
          }`}>
            {player.rank}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="font-bold text-white">{player.name}</div>
            <div className="text-sm text-gray-400">{player.class}</div>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="text-[var(--color-gold)] font-bold">Lvl {player.level}</div>
            {player.resets > 0 && (
              <div className="text-xs text-[var(--color-blue)]">{player.resets} Resets</div>
            )}
            {player.kills > 0 && (
              <div className="text-xs text-red-400">{player.kills} PKs</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Lista de rankings de guilds
function GuildRankingsList({ rankings, loading }: { rankings: any[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Nenhuma guild encontrada
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto">
      {rankings.map((guild) => (
        <div
          key={guild.rank}
          className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
            guild.rank <= 3
              ? 'bg-gradient-to-r from-[var(--color-gold)]/20 to-transparent border border-[var(--color-gold)]/30'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          {/* Rank */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
            guild.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
            guild.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
            guild.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
            'bg-white/10 text-gray-400'
          }`}>
            {guild.rank}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="font-bold text-white">{guild.name}</div>
            <div className="text-sm text-gray-400">Mestre: {guild.master}</div>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="text-[var(--color-gold)] font-bold">{guild.score} pts</div>
            <div className="text-xs text-gray-400">{guild.members} membros</div>
          </div>
        </div>
      ))}
    </div>
  );
}