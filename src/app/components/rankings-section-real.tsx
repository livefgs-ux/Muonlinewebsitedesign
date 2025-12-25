/**
 * 🏆 Rankings Section - API REAL
 * 
 * ✅ SEM MOCKS - Dados 100% reais do banco MySQL/MariaDB
 * ✅ Loading states
 * ✅ Error handling
 * ✅ Auto-refresh
 */

import { Trophy, Medal, Award, Users, Skull, Flame, Clock, Castle as CastleIcon, Swords, Shield, Crown, Target, Zap, RefreshCw } from 'lucide-react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../../services/api';
import type { RankingPlayer, RankingGuild } from '../../services/api';

// Medal helper
const getRankMedal = (rank: number) => {
  if (rank === 1) return { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500' };
  if (rank === 2) return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-400/20', border: 'border-gray-400' };
  if (rank === 3) return { icon: Award, color: 'text-orange-600', bg: 'bg-orange-600/20', border: 'border-orange-600' };
  return { icon: Trophy, color: 'text-gray-500', bg: 'bg-gray-500/20', border: 'border-gray-500' };
};

export function RankingsSection() {
  const { t, language } = useLanguage();
  
  // Estados para cada ranking
  const [topResets, setTopResets] = useState<RankingPlayer[]>([]);
  const [topPK, setTopPK] = useState<RankingPlayer[]>([]);
  const [topGuilds, setTopGuilds] = useState<RankingGuild[]>([]);
  
  // Loading states
  const [loadingResets, setLoadingResets] = useState(true);
  const [loadingPK, setLoadingPK] = useState(true);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  
  // Error states
  const [errorResets, setErrorResets] = useState<string | null>(null);
  const [errorPK, setErrorPK] = useState<string | null>(null);
  const [errorGuilds, setErrorGuilds] = useState<string | null>(null);
  
  // Carregar rankings ao montar o componente
  useEffect(() => {
    loadAllRankings();
    
    // Auto-refresh a cada 60 segundos
    const interval = setInterval(() => {
      loadAllRankings();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const loadAllRankings = () => {
    loadTopResets();
    loadTopPK();
    loadTopGuilds();
  };
  
  // Carregar Top Resets
  const loadTopResets = async () => {
    try {
      setLoadingResets(true);
      setErrorResets(null);
      const data = await api.rankings.getTopResets(10);
      setTopResets(data);
    } catch (error: any) {
      console.error('❌ Erro ao carregar Top Resets:', error);
      
      // Mostrar mensagem amigável ao invés de erro técnico
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ECONNREFUSED')) {
        setErrorResets('⚠️ Backend não disponível. Inicie o servidor Node.js para ver dados reais.');
      } else {
        setErrorResets(error.message || 'Erro ao carregar ranking');
      }
    } finally {
      setLoadingResets(false);
    }
  };
  
  // Carregar Top PK
  const loadTopPK = async () => {
    try {
      setLoadingPK(true);
      setErrorPK(null);
      const data = await api.rankings.getTopPK(10);
      setTopPK(data);
    } catch (error: any) {
      console.error('❌ Erro ao carregar Top PK:', error);
      setErrorPK(error.message || 'Erro ao carregar ranking');
    } finally {
      setLoadingPK(false);
    }
  };
  
  // Carregar Top Guilds
  const loadTopGuilds = async () => {
    try {
      setLoadingGuilds(true);
      setErrorGuilds(null);
      const data = await api.rankings.getTopGuilds(10);
      setTopGuilds(data);
    } catch (error: any) {
      console.error('❌ Erro ao carregar Top Guilds:', error);
      setErrorGuilds(error.message || 'Erro ao carregar ranking');
    } finally {
      setLoadingGuilds(false);
    }
  };
  
  // Componente de Loading
  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Carregando ranking...</p>
      </div>
    </div>
  );
  
  // Componente de Erro
  const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Skull className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-400 mb-4">{message}</p>
        <Button 
          onClick={onRetry}
          className="bg-gold hover:bg-yellow-600 text-black"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-12 h-12 text-gold" />
              <h1 className="text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-gold">
                Rankings
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
              Veja os melhores jogadores e guilds do servidor
            </p>
            
            {/* Botão de Refresh Manual */}
            <Button
              onClick={loadAllRankings}
              className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar Rankings
            </Button>
          </div>

          {/* Top #1 de Cada Categoria */}
          <div className="mb-12">
            <h2 className="text-2xl text-white mb-6 flex items-center gap-2">
              <Crown className="w-6 h-6 text-gold" />
              🏆 Top #1 de Cada Categoria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Top #1 Resets */}
              <Card className="backdrop-blur-xl bg-black/60 border-gold/30 p-6 hover:border-gold/60 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="w-8 h-8 text-gold" />
                  <div>
                    <div className="text-sm text-gray-400">Resets</div>
                    <div className="text-lg text-white">{topResets[0]?.name || '---'}</div>
                  </div>
                </div>
                <div className="text-2xl text-gold">{topResets[0]?.resets || 0} Resets</div>
              </Card>

              {/* Top #1 PK */}
              <Card className="backdrop-blur-xl bg-black/60 border-gold/30 p-6 hover:border-gold/60 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <Skull className="w-8 h-8 text-red-500" />
                  <div>
                    <div className="text-sm text-gray-400">PK</div>
                    <div className="text-lg text-white">{topPK[0]?.name || '---'}</div>
                  </div>
                </div>
                <div className="text-2xl text-red-500">{topPK[0]?.kills || 0} Kills</div>
              </Card>

              {/* Top #1 Guild */}
              <Card className="backdrop-blur-xl bg-black/60 border-gold/30 p-6 hover:border-gold/60 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-8 h-8 text-ethereal" />
                  <div>
                    <div className="text-sm text-gray-400">Guild</div>
                    <div className="text-lg text-white">{topGuilds[0]?.name || '---'}</div>
                  </div>
                </div>
                <div className="text-2xl text-ethereal">{topGuilds[0]?.score || 0} Score</div>
              </Card>
            </div>
          </div>

          {/* Tabs de Rankings */}
          <Tabs defaultValue="resets" className="w-full">
            <TabsList className="bg-black/60 border border-gold/30 w-full justify-start overflow-x-auto">
              <TabsTrigger value="resets" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                <Flame className="w-4 h-4 mr-2" />
                Resets
              </TabsTrigger>
              <TabsTrigger value="pk" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                <Skull className="w-4 h-4 mr-2" />
                PK
              </TabsTrigger>
              <TabsTrigger value="guilds" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                <Users className="w-4 h-4 mr-2" />
                Guilds
              </TabsTrigger>
            </TabsList>

            {/* Tab Content: Resets */}
            <TabsContent value="resets">
              <Card className="backdrop-blur-xl bg-black/60 border-gold/30">
                {loadingResets ? (
                  <LoadingState />
                ) : errorResets ? (
                  <ErrorState message={errorResets} onRetry={loadTopResets} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold/20">
                          <th className="px-6 py-4 text-left text-sm text-gray-400">Rank</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-400">Player</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-400">Class</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-400">Resets</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-400">Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topResets.map((player) => {
                          const medal = getRankMedal(player.position);
                          return (
                            <motion.tr
                              key={player.position}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: player.position * 0.05 }}
                              className="border-b border-gold/10 hover:bg-gold/5 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <medal.icon className={`w-5 h-5 ${medal.color}`} />
                                  <span className="text-white">#{player.position}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gold">{player.name}</td>
                              <td className="px-6 py-4 text-gray-300">{player.class}</td>
                              <td className="px-6 py-4 text-center text-gold font-semibold">{player.resets}</td>
                              <td className="px-6 py-4 text-center text-white">{player.level}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Tab Content: PK */}
            <TabsContent value="pk">
              <Card className="backdrop-blur-xl bg-black/60 border-gold/30">
                {loadingPK ? (
                  <LoadingState />
                ) : errorPK ? (
                  <ErrorState message={errorPK} onRetry={loadTopPK} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold/20">
                          <th className="px-6 py-4 text-left text-sm text-gray-400">Rank</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-400">Player</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-400">Class</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-400">Kills</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-400">Deaths</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-400">K/D Ratio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPK.map((player) => {
                          const medal = getRankMedal(player.position);
                          const kdRatio = player.deaths ? (player.kills! / player.deaths).toFixed(2) : player.kills;
                          return (
                            <motion.tr
                              key={player.position}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: player.position * 0.05 }}
                              className="border-b border-gold/10 hover:bg-gold/5 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <medal.icon className={`w-5 h-5 ${medal.color}`} />
                                  <span className="text-white">#{player.position}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gold">{player.name}</td>
                              <td className="px-6 py-4 text-gray-300">{player.class}</td>
                              <td className="px-6 py-4 text-center text-red-500 font-semibold">{player.kills}</td>
                              <td className="px-6 py-4 text-center text-gray-400">{player.deaths}</td>
                              <td className="px-6 py-4 text-center text-ethereal">{kdRatio}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Tab Content: Guilds */}
            <TabsContent value="guilds">
              <Card className="backdrop-blur-xl bg-black/60 border-gold/30">
                {loadingGuilds ? (
                  <LoadingState />
                ) : errorGuilds ? (
                  <ErrorState message={errorGuilds} onRetry={loadTopGuilds} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold/20">
                          <th className="px-6 py-4 text-left text-sm text-gray-400">Rank</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-400">Guild</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-400">Master</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-400">Members</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-400">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topGuilds.map((guild) => {
                          const medal = getRankMedal(guild.position);
                          return (
                            <motion.tr
                              key={guild.position}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: guild.position * 0.05 }}
                              className="border-b border-gold/10 hover:bg-gold/5 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <medal.icon className={`w-5 h-5 ${medal.color}`} />
                                  <span className="text-white">#{guild.position}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gold font-semibold">{guild.name}</td>
                              <td className="px-6 py-4 text-gray-300">{guild.master}</td>
                              <td className="px-6 py-4 text-center text-ethereal">{guild.members}</td>
                              <td className="px-6 py-4 text-center text-gold font-semibold">{guild.score.toLocaleString()}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

export default RankingsSection;