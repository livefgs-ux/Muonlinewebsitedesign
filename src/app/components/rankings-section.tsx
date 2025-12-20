import { Trophy, Medal, Award, Users, Skull, Flame } from 'lucide-react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { useState, useEffect, memo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Mock data
const topResets = [
  { rank: 1, name: 'ImmortalKing', class: 'Dark Knight', resets: 250, level: 400 },
  { rank: 2, name: 'MagicMaster', class: 'Soul Master', resets: 245, level: 400 },
  { rank: 3, name: 'SwiftArrow', class: 'Muse Elf', resets: 240, level: 400 },
  { rank: 4, name: 'DarkLord99', class: 'Dark Lord', resets: 235, level: 400 },
  { rank: 5, name: 'MagicGladiator', class: 'Magic Gladiator', resets: 230, level: 400 },
  { rank: 6, name: 'ElfQueen', class: 'Muse Elf', resets: 225, level: 400 },
  { rank: 7, name: 'KnightPro', class: 'Dark Knight', resets: 220, level: 400 },
  { rank: 8, name: 'SoulPower', class: 'Soul Master', resets: 215, level: 400 },
  { rank: 9, name: 'Summoner99', class: 'Summoner', resets: 210, level: 400 },
  { rank: 10, name: 'WarriorLegend', class: 'Dark Knight', resets: 205, level: 400 },
];

const topPK = [
  { rank: 1, name: 'PK_Master', class: 'Dark Knight', kills: 15420, deaths: 2340 },
  { rank: 2, name: 'DeathBringer', class: 'Magic Gladiator', kills: 14850, deaths: 2100 },
  { rank: 3, name: 'Assassin', class: 'Muse Elf', kills: 14200, deaths: 1950 },
  { rank: 4, name: 'BloodThirsty', class: 'Dark Lord', kills: 13500, deaths: 2200 },
  { rank: 5, name: 'ShadowKiller', class: 'Dark Knight', kills: 12800, deaths: 2050 },
  { rank: 6, name: 'NightHunter', class: 'Muse Elf', kills: 12300, deaths: 1800 },
  { rank: 7, name: 'WarLord', class: 'Dark Knight', kills: 11900, deaths: 2300 },
  { rank: 8, name: 'MagicDestroyer', class: 'Soul Master', kills: 11500, deaths: 1900 },
  { rank: 9, name: 'ElfSlayer', class: 'Dark Lord', kills: 11000, deaths: 2100 },
  { rank: 10, name: 'PvPKing', class: 'Magic Gladiator', kills: 10500, deaths: 1750 },
];

const topGuilds = [
  { rank: 1, name: 'Immortals', master: 'ImmortalKing', members: 80, score: 95000 },
  { rank: 2, name: 'Dragons', master: 'DragonMaster', members: 75, score: 92000 },
  { rank: 3, name: 'Legends', master: 'LegendaryOne', members: 70, score: 88000 },
  { rank: 4, name: 'Warriors', master: 'WarChief', members: 65, score: 85000 },
  { rank: 5, name: 'Knights', master: 'KnightKing', members: 60, score: 82000 },
  { rank: 6, name: 'Titans', master: 'TitanLord', members: 58, score: 79000 },
  { rank: 7, name: 'Phoenix', master: 'Phoenix99', members: 55, score: 76000 },
  { rank: 8, name: 'Spartans', master: 'Leonidas', members: 52, score: 73000 },
  { rank: 9, name: 'Vikings', master: 'Odin', members: 50, score: 70000 },
  { rank: 10, name: 'Samurais', master: 'Shogun', members: 48, score: 67000 },
];

const topEvents = [
  { rank: 1, name: 'EventMaster', class: 'Dark Knight', points: 125400, wins: 852 },
  { rank: 2, name: 'ChaosKing', class: 'Soul Master', points: 119800, wins: 824 },
  { rank: 3, name: 'BloodChampion', class: 'Muse Elf', points: 112500, wins: 795 },
  { rank: 4, name: 'DevilSlayer', class: 'Magic Gladiator', points: 108200, wins: 768 },
  { rank: 5, name: 'CastleLord', class: 'Dark Lord', points: 103900, wins: 741 },
  { rank: 6, name: 'EventPro', class: 'Dark Knight', points: 98500, wins: 715 },
  { rank: 7, name: 'ChaosMaster', class: 'Soul Master', points: 94200, wins: 688 },
  { rank: 8, name: 'BloodWarrior', class: 'Muse Elf', points: 89800, wins: 662 },
  { rank: 9, name: 'DevilHunter', class: 'Summoner', points: 85600, wins: 635 },
  { rank: 10, name: 'SiegeKing', class: 'Dark Knight', points: 81200, wins: 608 },
];

const topBossKills = [
  { rank: 1, name: 'BossHunter', class: 'Dark Knight', kills: 2850, bosses: 'Golden Invasion, Red Dragon, Kundun' },
  { rank: 2, name: 'DragonSlayer99', class: 'Magic Gladiator', kills: 2680, bosses: 'Red Dragon, Ice Queen, Medusa' },
  { rank: 3, name: 'KundunKiller', class: 'Soul Master', kills: 2510, bosses: 'Kundun, Nightmare, Selupan' },
  { rank: 4, name: 'GoldenMaster', class: 'Muse Elf', kills: 2340, bosses: 'Golden Invasion, Tantalos, Hydra' },
  { rank: 5, name: 'BossDestroyer', class: 'Dark Lord', kills: 2180, bosses: 'All World Bosses' },
  { rank: 6, name: 'RedDragonPro', class: 'Dark Knight', kills: 2050, bosses: 'Red Dragon, Golden Invasion' },
  { rank: 7, name: 'MedusaHunter', class: 'Summoner', kills: 1920, bosses: 'Medusa, Ice Queen, Maya' },
  { rank: 8, name: 'NightmareBane', class: 'Soul Master', kills: 1790, bosses: 'Nightmare, Kundun, Selupan' },
  { rank: 9, name: 'QueenSlayer', class: 'Muse Elf', kills: 1660, bosses: 'Ice Queen, Medusa, Maya' },
  { rank: 10, name: 'InvasionKing', class: 'Magic Gladiator', kills: 1530, bosses: 'Golden Invasion, White Wizard' },
];

const getRankMedal = (rank: number) => {
  if (rank === 1) return { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500' };
  if (rank === 2) return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-400/20', border: 'border-gray-400' };
  if (rank === 3) return { icon: Award, color: 'text-orange-600', bg: 'bg-orange-600/20', border: 'border-orange-600' };
  return { icon: Trophy, color: 'text-gray-500', bg: 'bg-gray-500/20', border: 'border-gray-500' };
};

export function RankingsSection() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background já está em App.tsx - não duplicar! */}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-4xl text-white">{t('rankings.title')}</h2>
          </div>
          <p className="text-gray-400 text-lg">
            Veja os melhores jogadores e guilds do servidor
          </p>
        </div>

        {/* Rankings Tabs */}
        <div className="flex justify-center mb-8">
          <Tabs defaultValue="resets" className="w-full max-w-4xl">
            <TabsList className="bg-black/50 border-2 border-yellow-500/30 backdrop-blur-md w-full grid grid-cols-5 h-auto p-1 gap-1">
              <TabsTrigger 
                value="resets" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/30 data-[state=active]:to-yellow-600/30 data-[state=active]:text-yellow-400 data-[state=active]:border data-[state=active]:border-yellow-500/50 data-[state=active]:shadow-lg data-[state=active]:shadow-yellow-500/30 text-gray-300 hover:text-white transition-all py-3 px-3 rounded-md text-sm"
              >
                <Trophy className="w-4 h-4 mr-1" />
                Resets
              </TabsTrigger>
              <TabsTrigger 
                value="pk" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/30 data-[state=active]:to-red-600/30 data-[state=active]:text-red-400 data-[state=active]:border data-[state=active]:border-red-500/50 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/30 text-gray-300 hover:text-white transition-all py-3 px-3 rounded-md text-sm"
              >
                <Medal className="w-4 h-4 mr-1" />
                PK
              </TabsTrigger>
              <TabsTrigger 
                value="guilds" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-blue-600/30 data-[state=active]:text-blue-400 data-[state=active]:border data-[state=active]:border-blue-500/50 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 text-gray-300 hover:text-white transition-all py-3 px-3 rounded-md text-sm"
              >
                <Users className="w-4 h-4 mr-1" />
                Guilds
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-purple-600/30 data-[state=active]:text-purple-400 data-[state=active]:border data-[state=active]:border-purple-500/50 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 text-gray-300 hover:text-white transition-all py-3 px-3 rounded-md text-sm"
              >
                <Flame className="w-4 h-4 mr-1" />
                Eventos
              </TabsTrigger>
              <TabsTrigger 
                value="bosses" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/30 data-[state=active]:to-orange-600/30 data-[state=active]:text-orange-400 data-[state=active]:border data-[state=active]:border-orange-500/50 data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 text-gray-300 hover:text-white transition-all py-3 px-3 rounded-md text-sm"
              >
                <Skull className="w-4 h-4 mr-1" />
                Bosses
              </TabsTrigger>
            </TabsList>

            {/* Top Resets */}
            <TabsContent value="resets" className="mt-6">
              <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6 overflow-hidden">
                <div className="space-y-3">
                  {topResets.map((player, index) => {
                    const medal = getRankMedal(player.rank);
                    return (
                      <motion.div
                        key={player.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          player.rank <= 3
                            ? `${medal.bg} ${medal.border}`
                            : 'bg-black/30 border-yellow-500/20'
                        } hover:scale-102 transition-all`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${medal.bg} rounded-lg flex items-center justify-center border ${medal.border}`}>
                            <medal.icon className={`w-6 h-6 ${medal.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">#{player.rank}</span>
                              <h3 className="text-white">{player.name}</h3>
                            </div>
                            <p className="text-gray-400 text-sm">{player.class}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-yellow-500">{player.resets}</div>
                          <p className="text-gray-400 text-sm">Resets</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Top PK */}
            <TabsContent value="pk" className="mt-6">
              <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6 overflow-hidden">
                <div className="space-y-3">
                  {topPK.map((player, index) => {
                    const medal = getRankMedal(player.rank);
                    const kd = (player.kills / player.deaths).toFixed(2);
                    return (
                      <motion.div
                        key={player.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          player.rank <= 3
                            ? `${medal.bg} ${medal.border}`
                            : 'bg-black/30 border-yellow-500/20'
                        } hover:scale-102 transition-all`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${medal.bg} rounded-lg flex items-center justify-center border ${medal.border}`}>
                            <medal.icon className={`w-6 h-6 ${medal.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">#{player.rank}</span>
                              <h3 className="text-white">{player.name}</h3>
                            </div>
                            <p className="text-gray-400 text-sm">{player.class}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-red-500">{player.kills.toLocaleString()}</div>
                          <p className="text-gray-400 text-sm">Kills | K/D: {kd}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Top Guilds */}
            <TabsContent value="guilds" className="mt-6">
              <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6 overflow-hidden">
                <div className="space-y-3">
                  {topGuilds.map((guild, index) => {
                    const medal = getRankMedal(guild.rank);
                    return (
                      <motion.div
                        key={guild.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          guild.rank <= 3
                            ? `${medal.bg} ${medal.border}`
                            : 'bg-black/30 border-yellow-500/20'
                        } hover:scale-102 transition-all`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${medal.bg} rounded-lg flex items-center justify-center border ${medal.border}`}>
                            <medal.icon className={`w-6 h-6 ${medal.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">#{guild.rank}</span>
                              <h3 className="text-white">{guild.name}</h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                              Mestre: {guild.master} | {guild.members} membros
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-yellow-500">{guild.score.toLocaleString()}</div>
                          <p className="text-gray-400 text-sm">Pontos</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Top Events */}
            <TabsContent value="events" className="mt-6">
              <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6 overflow-hidden">
                <div className="space-y-3">
                  {topEvents.map((event, index) => {
                    const medal = getRankMedal(event.rank);
                    return (
                      <motion.div
                        key={event.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          event.rank <= 3
                            ? `${medal.bg} ${medal.border}`
                            : 'bg-black/30 border-yellow-500/20'
                        } hover:scale-102 transition-all`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${medal.bg} rounded-lg flex items-center justify-center border ${medal.border}`}>
                            <medal.icon className={`w-6 h-6 ${medal.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">#{event.rank}</span>
                              <h3 className="text-white">{event.name}</h3>
                            </div>
                            <p className="text-gray-400 text-sm">{event.class}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-purple-500">{event.points.toLocaleString()}</div>
                          <p className="text-gray-400 text-sm">Pontos | Vitórias: {event.wins}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Top Boss Kills */}
            <TabsContent value="bosses" className="mt-6">
              <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6 overflow-hidden">
                <div className="space-y-3">
                  {topBossKills.map((boss, index) => {
                    const medal = getRankMedal(boss.rank);
                    return (
                      <motion.div
                        key={boss.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          boss.rank <= 3
                            ? `${medal.bg} ${medal.border}`
                            : 'bg-black/30 border-yellow-500/20'
                        } hover:scale-102 transition-all`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${medal.bg} rounded-lg flex items-center justify-center border ${medal.border}`}>
                            <medal.icon className={`w-6 h-6 ${medal.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">#{boss.rank}</span>
                              <h3 className="text-white">{boss.name}</h3>
                            </div>
                            <p className="text-gray-400 text-sm">{boss.class}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-orange-500">{boss.kills.toLocaleString()}</div>
                          <p className="text-gray-400 text-sm">Bosses: {boss.bosses}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Update Notice */}
        <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6 mt-8">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="text-white mb-1">Rankings Atualizados em Tempo Real</h3>
              <p className="text-gray-400 text-sm">
                Os rankings são atualizados automaticamente a cada 5 minutos diretamente do banco de dados do servidor.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default RankingsSection;