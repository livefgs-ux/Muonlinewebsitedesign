import { useState } from 'react';
import { motion } from 'motion/react';
import { Swords, Search, Shield, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';

/**
 * ⚔️ Character Management Section
 * Gerenciamento completo de personagens
 */

const MOCK_CHARACTERS = [
  { id: 1, name: 'DarkWarrior', class: 'Dark Knight', level: 400, resets: 15, account: 'DarkLord99', online: true },
  { id: 2, name: 'FireMage', class: 'Soul Master', level: 387, resets: 12, account: 'MageSupreme', online: true },
  { id: 3, name: 'FastElf', class: 'Muse Elf', level: 395, resets: 14, account: 'WarriorKing', online: false },
  { id: 4, name: 'MagicGladiator', class: 'Duel Master', level: 370, resets: 10, account: 'HealerPro', online: true },
  { id: 5, name: 'ShadowNinja', class: 'Bloody Summoner', level: 361, resets: 8, account: 'NinjaStrike', online: false },
];

export function CharacterManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Gerenciar Personagens</h2>
        <p className="text-sm text-slate-400">Visualize e edite personagens dos jogadores</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Swords} label="Total de Personagens" value="3,542" color="text-purple-400" />
        <StatCard icon={Shield} label="Personagens Online" value="156" color="text-green-400" />
        <StatCard icon={Award} label="Nível Médio" value="287" color="text-amber-400" />
        <StatCard icon={TrendingUp} label="Resets Totais" value="28,456" color="text-blue-400" />
      </div>

      {/* Search */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por nome do personagem ou conta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Characters Table */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Swords className="w-5 h-5" />
            Lista de Personagens ({MOCK_CHARACTERS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50 text-slate-400 text-sm">
                  <th className="text-left p-3 font-semibold">Personagem</th>
                  <th className="text-left p-3 font-semibold">Classe</th>
                  <th className="text-left p-3 font-semibold">Nível</th>
                  <th className="text-left p-3 font-semibold">Resets</th>
                  <th className="text-left p-3 font-semibold">Conta</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-right p-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CHARACTERS.map((char, index) => (
                  <motion.tr
                    key={char.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Swords className="w-5 h-5 text-amber-400" />
                        <span className="font-bold text-white">{char.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {char.class}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="text-green-400 font-bold text-lg">{char.level}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-amber-400 font-bold">{char.resets}</span>
                      <span className="text-slate-500 text-sm ml-1">resets</span>
                    </td>
                    <td className="p-3 text-slate-400 text-sm">{char.account}</td>
                    <td className="p-3">
                      {char.online ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Online
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                          Offline
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                        >
                          Editar
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 hover:border-amber-500/40 transition-all shadow-xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-8 h-8 ${color}`} />
          <div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
