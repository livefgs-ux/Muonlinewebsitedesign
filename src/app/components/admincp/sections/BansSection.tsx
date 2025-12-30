import { useState, useEffect } from 'react';
import { Ban, Search, Plus, Unlock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

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
  const [showBanModal, setShowBanModal] = useState(false);
  const [banning, setBanning] = useState(false);
  const [newBan, setNewBan] = useState({
    username: '',
    reason: '',
    duration: 'permanent',
    hours: 24
  });

  useEffect(() => {
    loadBans();
  }, []);

  const loadBans = async () => {
    try {
      setLoading(true);
      // ✅ V575 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
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
      // ✅ V575 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
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

  const handleCreateBan = async () => {
    if (!newBan.username || !newBan.reason) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setBanning(true);
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('/api/admin/bans/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newBan.username,
          reason: newBan.reason,
          duration: newBan.duration === 'permanent' ? null : newBan.hours
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Banimento aplicado com sucesso!');
        setShowBanModal(false);
        setNewBan({ username: '', reason: '', duration: 'permanent', hours: 24 });
        loadBans();
      } else {
        toast.error(data.message || 'Erro ao aplicar banimento');
      }
    } catch (error) {
      console.error('❌ Erro ao banir usuário:', error);
      toast.error('Erro ao aplicar banimento');
    } finally {
      setBanning(false);
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
        <Button 
          onClick={() => setShowBanModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Banimento
        </Button>
      </div>

      {/* Ban Modal */}
      <Dialog open={showBanModal} onOpenChange={setShowBanModal}>
        <DialogContent className="bg-slate-900 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-400">Aplicar Banimento</DialogTitle>
            <DialogDescription className="text-slate-400">
              Preencha os dados para banir um jogador
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="ban-username" className="text-white">Username *</Label>
              <Input
                id="ban-username"
                type="text"
                placeholder="Digite o username do jogador"
                value={newBan.username}
                onChange={(e) => setNewBan({ ...newBan, username: e.target.value })}
                className="bg-black/40 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="ban-reason" className="text-white">Motivo *</Label>
              <Textarea
                id="ban-reason"
                placeholder="Digite o motivo do banimento"
                value={newBan.reason}
                onChange={(e) => setNewBan({ ...newBan, reason: e.target.value })}
                rows={3}
                className="bg-black/40 border-slate-700 text-white resize-none"
              />
            </div>

            <div>
              <Label htmlFor="ban-duration" className="text-white">Duração *</Label>
              <Select
                value={newBan.duration}
                onValueChange={(value) => setNewBan({ ...newBan, duration: value })}
              >
                <SelectTrigger className="bg-black/40 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="permanent">Permanente</SelectItem>
                  <SelectItem value="temporary">Temporário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newBan.duration === 'temporary' && (
              <div>
                <Label htmlFor="ban-hours" className="text-white">Horas</Label>
                <Input
                  id="ban-hours"
                  type="number"
                  min="1"
                  max="8760"
                  value={newBan.hours}
                  onChange={(e) => setNewBan({ ...newBan, hours: parseInt(e.target.value) || 24 })}
                  className="bg-black/40 border-slate-700 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">1 dia = 24h, 1 semana = 168h, 1 mês = 720h</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBanModal(false)}
              className="border-slate-700 text-slate-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateBan}
              disabled={banning}
              className="bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              {banning ? 'Aplicando...' : 'Aplicar Banimento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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