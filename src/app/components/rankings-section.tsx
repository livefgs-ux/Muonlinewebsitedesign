import { Trophy, Medal, Award, Users, Skull, Flame, Clock, Castle as CastleIcon, Swords, Shield, Crown, Target, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
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
  const { t, language } = useLanguage();
  
  // Traduções temporárias até adicionar no translations.ts
  const tempTranslations: Record<string, any> = {
    'pt-BR': {
      title: 'Rankings',
      subtitle: 'Veja os melhores jogadores e guilds do servidor',
      top1Category: '🏆 Top #1 de Cada Categoria',
      ranker: 'Ranker',
      resets: 'Resets',
      pk: 'PK',
      guilds: 'Guilds',
      events: 'Events',
      bosses: 'Bosses',
      rank: 'Rank',
      player: 'Player',
      class: 'Class',
      level: 'Level',
      kills: 'Kills',
      deaths: 'Deaths',
      guild: 'Guild',
      master: 'Master',
      members: 'Members',
      score: 'Score',
      points: 'Points',
      wins: 'Wins',
      bossKills: 'Boss Kills',
      specialty: 'Specialty',
    },
    'en': {
      title: 'Rankings',
      subtitle: 'See the best players and guilds on the server',
      top1Category: '🏆 Top #1 of Each Category',
      ranker: 'Ranker',
      resets: 'Resets',
      pk: 'PK',
      guilds: 'Guilds',
      events: 'Events',
      bosses: 'Bosses',
      rank: 'Rank',
      player: 'Player',
      class: 'Class',
      level: 'Level',
      kills: 'Kills',
      deaths: 'Deaths',
      guild: 'Guild',
      master: 'Master',
      members: 'Members',
      score: 'Score',
      points: 'Points',
      wins: 'Wins',
      bossKills: 'Boss Kills',
      specialty: 'Specialty',
    },
    'es': {
      title: 'Rankings',
      subtitle: 'Ver los mejores jugadores y guilds del servidor',
      top1Category: '🏆 Top #1 de Cada Categoría',
      ranker: 'Ranker',
      resets: 'Resets',
      pk: 'PK',
      guilds: 'Guilds',
      events: 'Events',
      bosses: 'Bosses',
      rank: 'Rango',
      player: 'Jugador',
      class: 'Clase',
      level: 'Nivel',
      kills: 'Kills',
      deaths: 'Muertes',
      guild: 'Guild',
      master: 'Maestro',
      members: 'Miembros',
      score: 'Puntuación',
      points: 'Puntos',
      wins: 'Victorias',
      bossKills: 'Kills de Boss',
      specialty: 'Especialidad',
    },
    'de': {
      title: 'Rankings',
      subtitle: 'Sehen Sie die besten Spieler und Gilden auf dem Server',
      top1Category: '🏆 Top #1 jeder Kategorie',
      ranker: 'Ranker',
      resets: 'Resets',
      pk: 'PK',
      guilds: 'Guilds',
      events: 'Events',
      bosses: 'Bosses',
      rank: 'Rang',
      player: 'Spieler',
      class: 'Klasse',
      level: 'Level',
      kills: 'Kills',
      deaths: 'Tode',
      guild: 'Guild',
      master: 'Meister',
      members: 'Mitglieder',
      score: 'Punktzahl',
      points: 'Punkte',
      wins: 'Siege',
      bossKills: 'Boss Kills',
      specialty: 'Spezialität',
    },
    'zh': {
      title: '排行榜',
      subtitle: '查看服务器上最优秀的玩家和公会',
      top1Category: '🏆 各类别第一名',
      ranker: '排名者',
      resets: 'Resets',
      pk: 'PK',
      guilds: 'Guilds',
      events: 'Events',
      bosses: 'Bosses',
      rank: '排名',
      player: '玩家',
      class: '职业',
      level: '等级',
      kills: 'Kills',
      deaths: '死亡',
      guild: 'Guild',
      master: '会长',
      members: '成员',
      score: '分数',
      points: '积分',
      wins: '胜利',
      bossKills: 'Boss Kills',
      specialty: '专长',
    },
    'ru': {
      title: 'Рейтинги',
      subtitle: 'Посмотрите лучших игроков и гильдий на сервере',
      top1Category: '🏆 Топ #1 каждой категории',
      ranker: 'Игрок',
      resets: 'Resets',
      pk: 'PK',
      guilds: 'Guilds',
      events: 'Events',
      bosses: 'Bosses',
      rank: 'Ранг',
      player: 'Игрок',
      class: 'Класс',
      level: 'Уровень',
      kills: 'Kills',
      deaths: 'Смерти',
      guild: 'Guild',
      master: 'Мастер',
      members: 'Члены',
      score: 'Счет',
      points: 'Очки',
      wins: 'Победы',
      bossKills: 'Boss Kills',
      specialty: 'Специализация',
    },
    'fil': {
      title: 'Mga Ranking',
      subtitle: 'Tingnan ang pinakamahusay na mga manlalaro at guilds sa server',
      top1Category: '🏆 Top #1 ng Bawat Kategorya',
      ranker: 'Ranker',
      resets: 'Resets',
      pk: 'PK',
      guilds: 'Guilds',
      events: 'Events',
      bosses: 'Bosses',
      rank: 'Ranggo',
      player: 'Manlalaro',
      class: 'Klase',
      level: 'Level',
      kills: 'Kills',
      deaths: 'Mga Kamatayan',
      guild: 'Guild',
      master: 'Master',
      members: 'Mga Miyembro',
      score: 'Puntos',
      points: 'Puntos',
      wins: 'Mga Panalo',
      bossKills: 'Boss Kills',
      specialty: 'Espesyalidad',
    },
    'vi': {
      title: 'Bảng Xếp Hạng',
      subtitle: 'Xem những người chơi và guild tốt nhất trên máy chủ',
      top1Category: '🏆 Top #1 của Mỗi Hạng Mục',
      ranker: 'Ranker',
      resets: 'Resets',
      pk: 'PK',
      guilds: 'Guilds',
      events: 'Events',
      bosses: 'Bosses',
      rank: 'Hạng',
      player: 'Người Chơi',
      class: 'Lớp',
      level: 'Cấp Độ',
      kills: 'Kills',
      deaths: 'Tử Vong',
      guild: 'Guild',
      master: 'Master',
      members: 'Thành Viên',
      score: 'Điểm',
      points: 'Điểm',
      wins: 'Chiến Thắng',
      bossKills: 'Boss Kills',
      specialty: 'Chuyên Môn',
    },
  };
  
  const tr = tempTranslations[language] || tempTranslations['en'];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h2 className="text-4xl text-white">{tr.title}</h2>
            </div>
            <p className="text-gray-400 text-lg">
              {tr.subtitle}
            </p>
          </div>

          {/* TOP 1 Rankers - Destaque */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-yellow-500" />
              <h3 className="text-2xl text-white">{tr.top1Category}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* TOP 1 Resets */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="backdrop-blur-md bg-gradient-to-br from-yellow-950/40 to-yellow-900/30 border-yellow-500/50 p-5 hover:scale-105 transition-all shadow-lg shadow-yellow-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-yellow-500/30 rounded-lg flex items-center justify-center border-2 border-yellow-500/70">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-yellow-400 font-semibold text-sm">{tr.resets}</h4>
                      <p className="text-gray-400 text-xs">#1 Ranker</p>
                    </div>
                  </div>
                  <div className="bg-yellow-950/50 border border-yellow-500/40 rounded-lg p-3">
                    <p className="text-white font-bold text-lg mb-1">{topResets[0].name}</p>
                    <p className="text-yellow-400 text-xs mb-2">{topResets[0].class}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Resets</span>
                      <span className="text-yellow-400 font-bold">{topResets[0].resets}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* TOP 1 PK */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="backdrop-blur-md bg-gradient-to-br from-red-950/40 to-red-900/30 border-red-500/50 p-5 hover:scale-105 transition-all shadow-lg shadow-red-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-red-500/30 rounded-lg flex items-center justify-center border-2 border-red-500/70">
                      <Swords className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-red-400 font-semibold text-sm">{tr.pk}</h4>
                      <p className="text-gray-400 text-xs">#1 Ranker</p>
                    </div>
                  </div>
                  <div className="bg-red-950/50 border border-red-500/40 rounded-lg p-3">
                    <p className="text-white font-bold text-lg mb-1">{topPK[0].name}</p>
                    <p className="text-red-400 text-xs mb-2">{topPK[0].class}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Kills</span>
                      <span className="text-red-400 font-bold">{topPK[0].kills.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* TOP 1 Guilds */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="backdrop-blur-md bg-gradient-to-br from-blue-950/40 to-blue-900/30 border-blue-500/50 p-5 hover:scale-105 transition-all shadow-lg shadow-blue-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center border-2 border-blue-500/70">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-blue-400 font-semibold text-sm">{tr.guilds}</h4>
                      <p className="text-gray-400 text-xs">#1 Ranker</p>
                    </div>
                  </div>
                  <div className="bg-blue-950/50 border border-blue-500/40 rounded-lg p-3">
                    <p className="text-white font-bold text-lg mb-1">{topGuilds[0].name}</p>
                    <p className="text-blue-400 text-xs mb-2">Master: {topGuilds[0].master}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Score</span>
                      <span className="text-blue-400 font-bold">{topGuilds[0].score.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* TOP 1 Events */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="backdrop-blur-md bg-gradient-to-br from-purple-950/40 to-purple-900/30 border-purple-500/50 p-5 hover:scale-105 transition-all shadow-lg shadow-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center border-2 border-purple-500/70">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-purple-400 font-semibold text-sm">{tr.events}</h4>
                      <p className="text-gray-400 text-xs">#1 Ranker</p>
                    </div>
                  </div>
                  <div className="bg-purple-950/50 border border-purple-500/40 rounded-lg p-3">
                    <p className="text-white font-bold text-lg mb-1">{topEvents[0].name}</p>
                    <p className="text-purple-400 text-xs mb-2">{topEvents[0].class}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Points</span>
                      <span className="text-purple-400 font-bold">{topEvents[0].points.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* TOP 1 Bosses */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card className="backdrop-blur-md bg-gradient-to-br from-orange-950/40 to-orange-900/30 border-orange-500/50 p-5 hover:scale-105 transition-all shadow-lg shadow-orange-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-orange-500/30 rounded-lg flex items-center justify-center border-2 border-orange-500/70">
                      <Skull className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-orange-400 font-semibold text-sm">{tr.bosses}</h4>
                      <p className="text-gray-400 text-xs">#1 Ranker</p>
                    </div>
                  </div>
                  <div className="bg-orange-950/50 border border-orange-500/40 rounded-lg p-3">
                    <p className="text-white font-bold text-lg mb-1">{topBossKills[0].name}</p>
                    <p className="text-orange-400 text-xs mb-2">{topBossKills[0].class}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Kills</span>
                      <span className="text-orange-400 font-bold">{topBossKills[0].kills}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
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
                  <Award className="w-4 h-4 mr-1" />
                  Events
                </TabsTrigger>
                <TabsTrigger 
                  value="bosses" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/30 data-[state=active]:to-orange-600/30 data-[state=active]:text-orange-400 data-[state=active]:border data-[state=active]:border-orange-500/50 data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 text-gray-300 hover:text-white transition-all py-3 px-3 rounded-md text-sm"
                >
                  <Skull className="w-4 h-4 mr-1" />
                  Bosses
                </TabsTrigger>
              </TabsList>

              {/* Resets Ranking */}
              <TabsContent value="resets" className="mt-8">
                <Card className="backdrop-blur-md bg-gradient-to-br from-black/70 to-black/50 border-yellow-500/30">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-yellow-500/30">
                        <tr className="text-yellow-500">
                          <th className="py-4 px-6 text-left">{tr.rank}</th>
                          <th className="py-4 px-6 text-left">{tr.player}</th>
                          <th className="py-4 px-6 text-left">{tr.class}</th>
                          <th className="py-4 px-6 text-right">{tr.resets}</th>
                          <th className="py-4 px-6 text-right">{tr.level}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topResets.map((player, index) => {
                          const medal = getRankMedal(player.rank);
                          return (
                            <motion.tr
                              key={player.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="border-b border-gray-800 hover:bg-yellow-500/5 transition-all"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg ${medal.bg} border ${medal.border} flex items-center justify-center`}>
                                    <medal.icon className={`w-4 h-4 ${medal.color}`} />
                                  </div>
                                  <span className="text-white font-semibold">#{player.rank}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-white font-medium">{player.name}</td>
                              <td className="py-4 px-6 text-gray-400">{player.class}</td>
                              <td className="py-4 px-6 text-right text-yellow-500 font-bold">{player.resets}</td>
                              <td className="py-4 px-6 text-right text-gray-300">{player.level}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* PK Ranking */}
              <TabsContent value="pk" className="mt-8">
                <Card className="backdrop-blur-md bg-gradient-to-br from-black/70 to-black/50 border-red-500/30">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-red-500/30">
                        <tr className="text-red-500">
                          <th className="py-4 px-6 text-left">{tr.rank}</th>
                          <th className="py-4 px-6 text-left">{tr.player}</th>
                          <th className="py-4 px-6 text-left">{tr.class}</th>
                          <th className="py-4 px-6 text-right">{tr.kills}</th>
                          <th className="py-4 px-6 text-right">{tr.deaths}</th>
                          <th className="py-4 px-6 text-right">K/D</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPK.map((player, index) => {
                          const medal = getRankMedal(player.rank);
                          const kd = (player.kills / player.deaths).toFixed(2);
                          return (
                            <motion.tr
                              key={player.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="border-b border-gray-800 hover:bg-red-500/5 transition-all"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg ${medal.bg} border ${medal.border} flex items-center justify-center`}>
                                    <medal.icon className={`w-4 h-4 ${medal.color}`} />
                                  </div>
                                  <span className="text-white font-semibold">#{player.rank}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-white font-medium">{player.name}</td>
                              <td className="py-4 px-6 text-gray-400">{player.class}</td>
                              <td className="py-4 px-6 text-right text-red-500 font-bold">{player.kills.toLocaleString()}</td>
                              <td className="py-4 px-6 text-right text-gray-400">{player.deaths.toLocaleString()}</td>
                              <td className="py-4 px-6 text-right text-green-500 font-semibold">{kd}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Guilds Ranking */}
              <TabsContent value="guilds" className="mt-8">
                <Card className="backdrop-blur-md bg-gradient-to-br from-black/70 to-black/50 border-blue-500/30">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-blue-500/30">
                        <tr className="text-blue-500">
                          <th className="py-4 px-6 text-left">{tr.rank}</th>
                          <th className="py-4 px-6 text-left">{tr.guild}</th>
                          <th className="py-4 px-6 text-left">{tr.master}</th>
                          <th className="py-4 px-6 text-right">{tr.members}</th>
                          <th className="py-4 px-6 text-right">{tr.score}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topGuilds.map((guild, index) => {
                          const medal = getRankMedal(guild.rank);
                          return (
                            <motion.tr
                              key={guild.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="border-b border-gray-800 hover:bg-blue-500/5 transition-all"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg ${medal.bg} border ${medal.border} flex items-center justify-center`}>
                                    <medal.icon className={`w-4 h-4 ${medal.color}`} />
                                  </div>
                                  <span className="text-white font-semibold">#{guild.rank}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-white font-medium">{guild.name}</td>
                              <td className="py-4 px-6 text-gray-400">{guild.master}</td>
                              <td className="py-4 px-6 text-right text-blue-400">{guild.members}</td>
                              <td className="py-4 px-6 text-right text-blue-500 font-bold">{guild.score.toLocaleString()}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Events Ranking */}
              <TabsContent value="events" className="mt-8">
                <Card className="backdrop-blur-md bg-gradient-to-br from-black/70 to-black/50 border-purple-500/30">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-purple-500/30">
                        <tr className="text-purple-500">
                          <th className="py-4 px-6 text-left">{tr.rank}</th>
                          <th className="py-4 px-6 text-left">{tr.player}</th>
                          <th className="py-4 px-6 text-left">{tr.class}</th>
                          <th className="py-4 px-6 text-right">{tr.points}</th>
                          <th className="py-4 px-6 text-right">{tr.wins}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topEvents.map((player, index) => {
                          const medal = getRankMedal(player.rank);
                          return (
                            <motion.tr
                              key={player.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="border-b border-gray-800 hover:bg-purple-500/5 transition-all"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg ${medal.bg} border ${medal.border} flex items-center justify-center`}>
                                    <medal.icon className={`w-4 h-4 ${medal.color}`} />
                                  </div>
                                  <span className="text-white font-semibold">#{player.rank}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-white font-medium">{player.name}</td>
                              <td className="py-4 px-6 text-gray-400">{player.class}</td>
                              <td className="py-4 px-6 text-right text-purple-500 font-bold">{player.points.toLocaleString()}</td>
                              <td className="py-4 px-6 text-right text-gray-300">{player.wins}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Bosses Ranking */}
              <TabsContent value="bosses" className="mt-8">
                <Card className="backdrop-blur-md bg-gradient-to-br from-black/70 to-black/50 border-orange-500/30">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-orange-500/30">
                        <tr className="text-orange-500">
                          <th className="py-4 px-6 text-left">{tr.rank}</th>
                          <th className="py-4 px-6 text-left">{tr.player}</th>
                          <th className="py-4 px-6 text-left">{tr.class}</th>
                          <th className="py-4 px-6 text-right">{tr.bossKills}</th>
                          <th className="py-4 px-6 text-left">{tr.specialty}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topBossKills.map((player, index) => {
                          const medal = getRankMedal(player.rank);
                          return (
                            <motion.tr
                              key={player.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="border-b border-gray-800 hover:bg-orange-500/5 transition-all"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg ${medal.bg} border ${medal.border} flex items-center justify-center`}>
                                    <medal.icon className={`w-4 h-4 ${medal.color}`} />
                                  </div>
                                  <span className="text-white font-semibold">#{player.rank}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-white font-medium">{player.name}</td>
                              <td className="py-4 px-6 text-gray-400">{player.class}</td>
                              <td className="py-4 px-6 text-right text-orange-500 font-bold">{player.kills}</td>
                              <td className="py-4 px-6 text-gray-400 text-sm">{player.bosses}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default RankingsSection;
