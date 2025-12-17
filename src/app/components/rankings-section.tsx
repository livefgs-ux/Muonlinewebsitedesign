import { Trophy, Medal, Award, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import heroImage from 'figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png';

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

const getRankMedal = (rank: number) => {
  if (rank === 1) return { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500' };
  if (rank === 2) return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-400/20', border: 'border-gray-400' };
  if (rank === 3) return { icon: Award, color: 'text-orange-600', bg: 'bg-orange-600/20', border: 'border-orange-600' };
  return { icon: Trophy, color: 'text-gray-500', bg: 'bg-gray-500/20', border: 'border-gray-500' };
};

export function RankingsSection() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
        <img
          src={heroImage}
          alt="MU Online Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

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
              <h2 className="text-4xl text-white">Rankings</h2>
            </div>
            <p className="text-gray-400 text-lg">
              Veja os melhores jogadores e guilds do servidor
            </p>
          </div>

          {/* Rankings Tabs */}
          <Tabs defaultValue="resets" className="w-full">
            <TabsList className="bg-black/50 border border-yellow-500/30 mb-8">
              <TabsTrigger value="resets" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-500">
                <Trophy className="w-4 h-4 mr-2" />
                Top Resets
              </TabsTrigger>
              <TabsTrigger value="pk" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-500">
                <Medal className="w-4 h-4 mr-2" />
                Top PK
              </TabsTrigger>
              <TabsTrigger value="guilds" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-500">
                <Users className="w-4 h-4 mr-2" />
                Top Guilds
              </TabsTrigger>
            </TabsList>

            {/* Top Resets */}
            <TabsContent value="resets">
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
            <TabsContent value="pk">
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
            <TabsContent value="guilds">
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
          </Tabs>

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
        </motion.div>
      </div>
    </div>
  );
}