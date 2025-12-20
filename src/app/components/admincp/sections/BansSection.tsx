import { Ban, Search, Plus, Unlock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';

const MOCK_BANS = [
  { id: 1, username: 'hack123', reason: 'Uso de terceiros / Hacks', bannedBy: 'AdminTest', date: '2024-12-18', expires: 'Permanente', type: 'permanent' },
  { id: 2, username: 'spammer99', reason: 'Spam no chat global', bannedBy: 'ModeratorX', date: '2024-12-19', expires: '2024-12-26', type: 'temporary' },
  { id: 3, username: 'toxic_player', reason: 'Comportamento tóxico', bannedBy: 'AdminTest', date: '2024-12-17', expires: '2024-12-24', type: 'temporary' },
  { id: 4, username: 'bot_user', reason: 'Uso de bot/macro', bannedBy: 'ModeratorY', date: '2024-12-16', expires: 'Permanente', type: 'permanent' },
];

export function BansSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Sistema de Bans</h2>
          <p className="text-sm text-slate-400">Gerencie banimentos de jogadores</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Novo Banimento
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar usuário banido..."
              className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bans List */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Ban className="w-5 h-5" />
            Usuários Banidos ({MOCK_BANS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50 text-slate-400 text-sm">
                  <th className="text-left p-3 font-semibold">Usuário</th>
                  <th className="text-left p-3 font-semibold">Motivo</th>
                  <th className="text-left p-3 font-semibold">Banido Por</th>
                  <th className="text-left p-3 font-semibold">Data</th>
                  <th className="text-left p-3 font-semibold">Expira</th>
                  <th className="text-right p-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BANS.map((ban) => (
                  <tr key={ban.id} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Ban className="w-4 h-4 text-red-400" />
                        <span className="font-semibold text-white">{ban.username}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-400 text-sm">{ban.reason}</td>
                    <td className="p-3 text-slate-400 text-sm">{ban.bannedBy}</td>
                    <td className="p-3 text-slate-400 text-sm">{ban.date}</td>
                    <td className="p-3">
                      <Badge className={ban.type === 'permanent' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}>
                        {ban.expires}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                        >
                          <Unlock className="w-4 h-4 mr-1" />
                          Desbanir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
