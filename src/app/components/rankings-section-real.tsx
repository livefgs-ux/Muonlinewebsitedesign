/**
 * 🏆 Rankings Section - API REAL
 * 
 * ✅ SEM MOCKS - Dados 100% reais do banco MySQL/MariaDB
 * ✅ Loading states
 * ✅ Error handling
 * ✅ Auto-refresh
 * ✅ Rankings por Level
 * ✅ Rankings por Classe
 */

import { Trophy, Medal, Award, Users, Skull, Flame, Clock, Castle as CastleIcon, Swords, Shield, Crown, Target, Zap, RefreshCw, TrendingUp, Layers } from 'lucide-react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../../services/api';
import type { RankingPlayer, RankingGuild } from '../../services/api';

// Classes do MU Online
interface MuClass {
  id: number;
  name: string;
  shortName: string;
  color: string;
  icon: any;
}

const MU_CLASSES: MuClass[] = [
  { id: 0, name: 'Dark Wizard', shortName: 'DW', color: 'text-blue-500', icon: Zap },
  { id: 16, name: 'Dark Knight', shortName: 'DK', color: 'text-red-500', icon: Swords },
  { id: 32, name: 'Elf', shortName: 'ELF', color: 'text-green-500', icon: Target },
  { id: 48, name: 'Magic Gladiator', shortName: 'MG', color: 'text-purple-500', icon: Shield },
  { id: 64, name: 'Dark Lord', shortName: 'DL', color: 'text-yellow-500', icon: Crown },
  { id: 80, name: 'Summoner', shortName: 'SUM', color: 'text-pink-500', icon: Flame },
  { id: 96, name: 'Rage Fighter', shortName: 'RF', color: 'text-orange-500', icon: Flame },
  { id: 112, name: 'Grow Lancer', shortName: 'GL', color: 'text-cyan-500', icon: Swords },
  { id: 128, name: 'Rune Wizard', shortName: 'RW', color: 'text-indigo-500', icon: Zap },
  { id: 144, name: 'Slayer', shortName: 'SL', color: 'text-teal-500', icon: Swords },
];

// Medal helper
const getRankMedal = (rank: number) => {
  if (rank === 1) return { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500' };
  if (rank === 2) return { icon: Medal, color: 'text-gray-300', bg: 'bg-gray-300/20', border: 'border-gray-300' };
  if (rank === 3) return { icon: Award, color: 'text-orange-600', bg: 'bg-orange-600/20', border: 'border-orange-600' };
  return { icon: Trophy, color: 'text-gray-300', bg: 'bg-gray-300/20', border: 'border-gray-300' };
};

export function RankingsSection() {
  const { t, language } = useLanguage();
  
  // Estados para cada ranking
  const [topResets, setTopResets] = useState<RankingPlayer[]>([]);
  const [topPK, setTopPK] = useState<RankingPlayer[]>([]);
  const [topLevel, setTopLevel] = useState<RankingPlayer[]>([]);
  const [topGuilds, setTopGuilds] = useState<RankingGuild[]>([]);
  const [topByClass, setTopByClass] = useState<Record<number, RankingPlayer[]>>({});
  
  // Loading states
  const [loadingResets, setLoadingResets] = useState(true);
  const [loadingPK, setLoadingPK] = useState(true);
  const [loadingLevel, setLoadingLevel] = useState(true);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [loadingClass, setLoadingClass] = useState<Record<number, boolean>>({});
  
  // Error states
  const [errorResets, setErrorResets] = useState<string | null>(null);
  const [errorPK, setErrorPK] = useState<string | null>(null);
  const [errorLevel, setErrorLevel] = useState<string | null>(null);
  const [errorGuilds, setErrorGuilds] = useState<string | null>(null);
  const [errorClass, setErrorClass] = useState<Record<number, string | null>>({});
  
  // Classe selecionada
  const [selectedClass, setSelectedClass] = useState<number>(0);
  
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
    loadTopLevel();
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
  
  // Carregar Top Level
  const loadTopLevel = async () => {
    try {
      setLoadingLevel(true);
      setErrorLevel(null);
      const data = await api.rankings.getTopLevel(10);
      setTopLevel(data);
    } catch (error: any) {
      console.error('❌ Erro ao carregar Top Level:', error);
      setErrorLevel(error.message || 'Erro ao carregar ranking');
    } finally {
      setLoadingLevel(false);
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
  
  // Carregar Top por Classe
  const loadTopByClass = async (classId: number) => {
    try {
      setLoadingClass(prev => ({ ...prev, [classId]: true }));
      setErrorClass(prev => ({ ...prev, [classId]: null }));
      
      const data = await api.rankings.getTopByClass(classId, 10);
      setTopByClass(prev => ({ ...prev, [classId]: data }));
    } catch (error: any) {
      console.error(`❌ Erro ao carregar ranking da classe ${classId}:`, error);
      setErrorClass(prev => ({ ...prev, [classId]: error.message || 'Erro ao carregar ranking' }));
    } finally {
      setLoadingClass(prev => ({ ...prev, [classId]: false }));
    }
  };
  
  // Carregar ranking da classe quando mudar seleção
  useEffect(() => {
    if (!topByClass[selectedClass] && !loadingClass[selectedClass]) {
      loadTopByClass(selectedClass);
    }
  }, [selectedClass]);
  
  // Componente de Loading
  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-300">Carregando ranking...</p>
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
              <Card className="glass-dialog p-6 hover:border-gold/60 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="w-8 h-8 text-gold" />
                  <div>
                    <div className="text-sm text-gray-300">Resets</div>
                    <div className="text-lg text-white">{topResets[0]?.name || '---'}</div>
                  </div>
                </div>
                <div className="text-2xl text-gold">{topResets[0]?.resets || 0} Resets</div>
              </Card>

              {/* Top #1 Level */}
              <Card className="glass-dialog p-6 hover:border-gold/60 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-ethereal" />
                  <div>
                    <div className="text-sm text-gray-300">Level</div>
                    <div className="text-lg text-white">{topLevel[0]?.name || '---'}</div>
                  </div>
                </div>
                <div className="text-2xl text-ethereal">Lv {topLevel[0]?.level || 0}</div>
              </Card>

              {/* Top #1 PK */}
              <Card className="glass-dialog p-6 hover:border-gold/60 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <Skull className="w-8 h-8 text-red-500" />
                  <div>
                    <div className="text-sm text-gray-300">PK</div>
                    <div className="text-lg text-white">{topPK[0]?.name || '---'}</div>
                  </div>
                </div>
                <div className="text-2xl text-red-500">{topPK[0]?.kills || 0} Kills</div>
              </Card>

              {/* Top #1 Guild */}
              <Card className="glass-dialog p-6 hover:border-gold/60 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-8 h-8 text-ethereal" />
                  <div>
                    <div className="text-sm text-gray-300">Guild</div>
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
              <TabsTrigger value="level" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                <TrendingUp className="w-4 h-4 mr-2" />
                Level
              </TabsTrigger>
              <TabsTrigger value="pk" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                <Skull className="w-4 h-4 mr-2" />
                PK
              </TabsTrigger>
              <TabsTrigger value="classes" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                <Layers className="w-4 h-4 mr-2" />
                Classes
              </TabsTrigger>
              <TabsTrigger value="guilds" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                <Users className="w-4 h-4 mr-2" />
                Guilds
              </TabsTrigger>
            </TabsList>

            {/* Tab Content: Resets */}
            <TabsContent value="resets">
              <Card className="glass-dialog">
                {loadingResets ? (
                  <LoadingState />
                ) : errorResets ? (
                  <ErrorState message={errorResets} onRetry={loadTopResets} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold/20">
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Rank</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Player</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Class</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">Resets</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">Level</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">Status</th>
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
                              <td className="px-6 py-4 text-center">
                                {player.online ? (
                                  <span className="text-green-500">●</span>
                                ) : (
                                  <span className="text-gray-500">●</span>
                                )}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Tab Content: Level */}
            <TabsContent value="level">
              <Card className="glass-dialog">
                {loadingLevel ? (
                  <LoadingState />
                ) : errorLevel ? (
                  <ErrorState message={errorLevel} onRetry={loadTopLevel} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold/20">
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Rank</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Player</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Class</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">Level</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">Resets</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topLevel.map((player) => {
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
                              <td className="px-6 py-4 text-center text-ethereal font-semibold">Lv {player.level}</td>
                              <td className="px-6 py-4 text-center text-gold">{player.resets}</td>
                              <td className="px-6 py-4 text-center">
                                {player.online ? (
                                  <span className="text-green-500">●</span>
                                ) : (
                                  <span className="text-gray-500">●</span>
                                )}
                              </td>
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
              <Card className="glass-dialog">
                {loadingPK ? (
                  <LoadingState />
                ) : errorPK ? (
                  <ErrorState message={errorPK} onRetry={loadTopPK} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold/20">
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Rank</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Player</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Class</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">Kills</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">PK Level</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPK.map((player) => {
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
                              <td className="px-6 py-4 text-center text-red-500 font-semibold">{player.kills}</td>
                              <td className="px-6 py-4 text-center text-ethereal">{player.pkLevel}</td>
                              <td className="px-6 py-4 text-center">
                                {player.online ? (
                                  <span className="text-green-500">●</span>
                                ) : (
                                  <span className="text-gray-500">●</span>
                                )}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Tab Content: Classes */}
            <TabsContent value="classes">
              <div className="space-y-6">
                {/* Seletor de Classes */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {MU_CLASSES.map((muClass) => {
                    const Icon = muClass.icon;
                    return (
                      <Button
                        key={muClass.id}
                        onClick={() => setSelectedClass(muClass.id)}
                        className={`${
                          selectedClass === muClass.id
                            ? 'bg-gold/30 border-gold text-gold'
                            : 'bg-black/40 border-gold/30 text-gray-300 hover:bg-gold/10'
                        } border transition-all`}
                      >
                        <Icon className={`w-4 h-4 mr-2 ${muClass.color}`} />
                        {muClass.name}
                      </Button>
                    );
                  })}
                </div>

                {/* Ranking da Classe Selecionada */}
                <Card className="glass-dialog">
                  {loadingClass[selectedClass] ? (
                    <LoadingState />
                  ) : errorClass[selectedClass] ? (
                    <ErrorState 
                      message={errorClass[selectedClass]!} 
                      onRetry={() => loadTopByClass(selectedClass)} 
                    />
                  ) : topByClass[selectedClass]?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gold/20">
                            <th className="px-6 py-4 text-left text-sm text-gray-200">Rank</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-200">Player</th>
                            <th className="px-6 py-4 text-center text-sm text-gray-200">Level</th>
                            <th className="px-6 py-4 text-center text-sm text-gray-200">Resets</th>
                            <th className="px-6 py-4 text-center text-sm text-gray-200">Kills</th>
                            <th className="px-6 py-4 text-center text-sm text-gray-200">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topByClass[selectedClass].map((player) => {
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
                                <td className="px-6 py-4 text-center text-ethereal">Lv {player.level}</td>
                                <td className="px-6 py-4 text-center text-gold">{player.resets}</td>
                                <td className="px-6 py-4 text-center text-red-500">{player.kills}</td>
                                <td className="px-6 py-4 text-center">
                                  {player.online ? (
                                    <span className="text-green-500">●</span>
                                  ) : (
                                    <span className="text-gray-500">●</span>
                                  )}
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-300">
                      Nenhum jogador encontrado para esta classe
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Tab Content: Guilds */}
            <TabsContent value="guilds">
              <Card className="glass-dialog">
                {loadingGuilds ? (
                  <LoadingState />
                ) : errorGuilds ? (
                  <ErrorState message={errorGuilds} onRetry={loadTopGuilds} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold/20">
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Rank</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Guild</th>
                          <th className="px-6 py-4 text-left text-sm text-gray-200">Master</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">Members</th>
                          <th className="px-6 py-4 text-center text-sm text-gray-200">Score</th>
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