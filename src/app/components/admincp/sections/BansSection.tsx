import { useState, useEffect } from 'react';
import { Ban, Search, Plus, Unlock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner';

interface BanData {
  id: number;
  username: string;
  reason: string;
  bannedBy: string;
  date: string;
  expires: string;
  type: 'permanent' | 'temporary';
}

export function BansSection() {
  const [bans, setBans] = useState<BanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBans();
  }, []);

  const loadBans = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch('/api/admin/bans/latest', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setBans(data.data);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar bans:', error);
      toast.error('Erro ao carregar lista de banimentos');
      setBans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async (username: string) => {
    try {
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch('/api/admin/bans/unban', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success(`✅ Usuário ${username} desbanido com sucesso!`);
        loadBans(); // Recarregar lista
      }
    } catch (error) {
      console.error('❌ Erro ao desbanir:', error);
      toast.error('Erro ao desbanir usuário');
    }
  };

  const filteredBans = bans.filter(ban =>
    ban.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bans List */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Ban className="w-5 h-5" />
            Usuários Banidos ({loading ? '...' : filteredBans.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-400">
              Carregando banimentos...
            </div>
          ) : filteredBans.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Nenhum banimento encontrado
            </div>
          ) : (
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
                  {filteredBans.map((ban) => (
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
                            onClick={() => handleUnban(ban.username)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}