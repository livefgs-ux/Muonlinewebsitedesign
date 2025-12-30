import { useState, useEffect } from 'react';
import { Clock, Play, Pause, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';

/**
 * ⏰ Crons Section
 * Gerenciamento de Cron Jobs - CONECTADO À API REAL
 */

interface CronJob {
  id: number;
  name: string;
  schedule: string;
  description: string;
  active: boolean;
  lastRun: string | null;
  command: string;
}

export function CronsSection() {
  const [crons, setCrons] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCron, setNewCron] = useState({
    name: '',
    schedule: '',
    command: '',
    description: ''
  });

  useEffect(() => {
    loadCrons();
  }, []);

  const loadCrons = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('/api/admin/crons', {
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
        setCrons(data.data);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar crons:', error);
      toast.error('Erro ao carregar cron jobs');
      setCrons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCron = async () => {
    if (!newCron.name || !newCron.schedule || !newCron.command) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setCreating(true);
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('/api/admin/crons', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCron)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Cron job criado com sucesso!');
        setShowCreateModal(false);
        setNewCron({ name: '', schedule: '', command: '', description: '' });
        loadCrons();
      } else {
        toast.error(data.message || 'Erro ao criar cron job');
      }
    } catch (error) {
      console.error('❌ Erro ao criar cron:', error);
      toast.error('Erro ao criar cron job');
    } finally {
      setCreating(false);
    }
  };

  const handleExecuteCron = async (cronId: number) => {
    try {
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`/api/admin/crons/${cronId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Cron job executado com sucesso!');
        loadCrons();
      } else {
        toast.error(data.message || 'Erro ao executar cron job');
      }
    } catch (error) {
      console.error('❌ Erro ao executar cron:', error);
      toast.error('Erro ao executar cron job');
    }
  };

  const handleDeleteCron = async (cronId: number) => {
    if (!confirm('Tem certeza que deseja deletar este cron job?')) return;

    try {
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`/api/admin/crons/${cronId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Cron job deletado com sucesso!');
        loadCrons();
      } else {
        toast.error(data.message || 'Erro ao deletar cron job');
      }
    } catch (error) {
      console.error('❌ Erro ao deletar cron:', error);
      toast.error('Erro ao deletar cron job');
    }
  };

  const handleToggleCron = async (cronId: number, currentStatus: boolean) => {
    try {
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`/api/admin/crons/${cronId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: !currentStatus })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Cron job ${!currentStatus ? 'ativado' : 'desativado'}!`);
        loadCrons();
      } else {
        toast.error(data.message || 'Erro ao alterar status');
      }
    } catch (error) {
      console.error('❌ Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do cron job');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Cron Jobs</h2>
          <p className="text-sm text-slate-400">Gerencie tarefas automatizadas do servidor</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cron Job
        </Button>
      </div>

      {/* Create Cron Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-slate-900 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-400">Criar Novo Cron Job</DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure uma nova tarefa automatizada
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cron-name" className="text-white">Nome *</Label>
              <Input
                id="cron-name"
                type="text"
                placeholder="Ex: Sincronizar Rankings"
                value={newCron.name}
                onChange={(e) => setNewCron({ ...newCron, name: e.target.value })}
                className="bg-black/40 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="cron-schedule" className="text-white">Schedule (Cron Format) *</Label>
              <Input
                id="cron-schedule"
                type="text"
                placeholder="Ex: */5 * * * * (a cada 5 minutos)"
                value={newCron.schedule}
                onChange={(e) => setNewCron({ ...newCron, schedule: e.target.value })}
                className="bg-black/40 border-slate-700 text-white font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">Formato: minuto hora dia mês dia-da-semana</p>
            </div>

            <div>
              <Label htmlFor="cron-command" className="text-white">Comando *</Label>
              <Input
                id="cron-command"
                type="text"
                placeholder="Ex: node sync-rankings.js"
                value={newCron.command}
                onChange={(e) => setNewCron({ ...newCron, command: e.target.value })}
                className="bg-black/40 border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <Label htmlFor="cron-description" className="text-white">Descrição</Label>
              <Textarea
                id="cron-description"
                placeholder="Descrição opcional da tarefa"
                value={newCron.description}
                onChange={(e) => setNewCron({ ...newCron, description: e.target.value })}
                rows={3}
                className="bg-black/40 border-slate-700 text-white resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="border-slate-700 text-slate-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCron}
              disabled={creating}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
            >
              {creating ? 'Criando...' : 'Criar Cron Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Crons List */}
      {loading ? (
        <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
          <CardContent className="p-6 text-center text-slate-400">
            Carregando cron jobs...
          </CardContent>
        </Card>
      ) : crons.length === 0 ? (
        <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
          <CardContent className="p-6 text-center text-slate-400">
            Nenhum cron job cadastrado. Clique em "Novo Cron Job" para começar.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {crons.map((cron) => (
            <Card key={cron.id} className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 hover:border-amber-500/40 transition-all shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${cron.active ? 'bg-green-500/20' : 'bg-slate-500/20'}`}>
                      <Clock className={`w-6 h-6 ${cron.active ? 'text-green-400' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-lg">{cron.name}</h3>
                        <Badge className={cron.active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>
                          {cron.active ? 'Ativo' : 'Pausado'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{cron.description || 'Sem descrição'}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="text-slate-500">Schedule: </span>
                          <code className="text-amber-400 bg-slate-800/50 px-2 py-1 rounded font-mono">
                            {cron.schedule}
                          </code>
                        </div>
                        <div>
                          <span className="text-slate-500">Última execução: </span>
                          <span className="text-slate-300">
                            {cron.lastRun ? new Date(cron.lastRun).toLocaleString('pt-BR') : 'Nunca'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={cron.active}
                      onCheckedChange={() => handleToggleCron(cron.id, cron.active)}
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-blue-400 hover:bg-blue-500/10"
                      onClick={() => handleExecuteCron(cron.id)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDeleteCron(cron.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
