/**
 * ⏰ AdminCP - Cron Manager Module
 * Gerenciamento visual de tarefas agendadas
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { 
  Clock, 
  Play, 
  Pause, 
  BarChart3, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CronJob {
  id: number;
  name: string;
  slug: string;
  description: string;
  intervalMinutes: number;
  status: 'active' | 'paused' | 'disabled';
  lastRun: string | null;
  nextRun: string | null;
  averageDuration: number;
  totalExecutions: number;
  failedExecutions: number;
}

interface CronManagerProps {
  // Removido fakeMode - MODO PRODUÇÃO APENAS
}

// MOCK REMOVIDO - Modo produção usa apenas dados reais da API

export function CronManager({}: CronManagerProps) {
  const [crons, setCrons] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<number | null>(null);

  useEffect(() => {
    loadCrons();
  }, []);

  const loadCrons = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/crons', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCrons(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading crons:', error);
      toast.error('Erro ao carregar cron jobs');
    } finally {
      setLoading(false);
    }
  };

  const executeCron = async (cron: CronJob) => {
    setExecuting(cron.id);
    try {
      const response = await fetch(`/api/admin/crons/${cron.id}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        await loadCrons();
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Erro ao executar cron');
      }
    } catch (error) {
      console.error('Error executing cron:', error);
      toast.error('Erro ao executar cron job');
    } finally {
      setExecuting(null);
    }
  };

  const toggleCron = async (cron: CronJob) => {
    try {
      const response = await fetch(`/api/admin/crons/${cron.id}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCrons(crons.map(c => 
          c.id === cron.id 
            ? { ...c, status: data.data.status }
            : c
        ));
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Erro ao alternar cron');
      }
    } catch (error) {
      console.error('Error toggling cron:', error);
      toast.error('Erro ao alternar status do cron');
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const formatNextRun = (dateString: string | null) => {
    if (!dateString) return 'Pausado';
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 0) return 'Em breve';
    if (minutes < 60) return `${minutes}min`;
    return `${hours}h`;
  };

  // Calculate success rate
  const getSuccessRate = (cron: CronJob) => {
    if (cron.totalExecutions === 0) return 100;
    return ((cron.totalExecutions - cron.failedExecutions) / cron.totalExecutions * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-amber-400/80">Carregando cron jobs...</p>
        </div>
      </div>
    );
  }

  const activeCrons = crons.filter(c => c.status === 'active').length;
  const totalExecutions = crons.reduce((sum, c) => sum + c.totalExecutions, 0);
  const avgSuccessRate = crons.length > 0 
    ? (crons.reduce((sum, c) => sum + parseFloat(getSuccessRate(c)), 0) / crons.length).toFixed(1)
    : '100.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3">
            <Clock className="w-7 h-7 text-amber-500" />
            Gerenciador de Cron Jobs
          </h2>
          <p className="text-slate-400 mt-1">
            Controle e monitore tarefas automáticas do sistema
          </p>
        </div>

        <Button
          onClick={loadCrons}
          variant="outline"
          className="border-amber-500/30 hover:bg-amber-500/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 backdrop-blur-sm border-emerald-500/30">
          <CardHeader className="pb-3">
            <CardDescription className="text-emerald-400/80">Crons Ativos</CardDescription>
            <CardTitle className="text-3xl text-emerald-400">{activeCrons}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 backdrop-blur-sm border-blue-500/30">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-400/80">Total de Execuções</CardDescription>
            <CardTitle className="text-3xl text-blue-400">
              {totalExecutions.toLocaleString('pt-BR')}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 backdrop-blur-sm border-amber-500/30">
          <CardHeader className="pb-3">
            <CardDescription className="text-amber-400/80">Taxa de Sucesso</CardDescription>
            <CardTitle className="text-3xl text-amber-400">{avgSuccessRate}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Cron Jobs List */}
      <div className="grid grid-cols-1 gap-4">
        {crons.map((cron) => {
          const successRate = parseFloat(getSuccessRate(cron));
          const isRunning = executing === cron.id;
          
          return (
            <Card 
              key={cron.id}
              className={`bg-black/60 backdrop-blur-sm transition-all ${
                cron.status === 'active'
                  ? 'border-emerald-500/40'
                  : 'border-slate-500/20'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg text-amber-400">
                        {cron.name}
                      </CardTitle>
                      {cron.status === 'active' ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <Activity className="w-3 h-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-500/30 text-slate-400">
                          <Pause className="w-3 h-3 mr-1" />
                          Pausado
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {cron.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="p-3 bg-black/20 rounded border border-amber-500/10">
                    <p className="text-slate-400 text-xs mb-1">Intervalo</p>
                    <p className="text-amber-400">{cron.intervalMinutes}min</p>
                  </div>

                  <div className="p-3 bg-black/20 rounded border border-amber-500/10">
                    <p className="text-slate-400 text-xs mb-1">Última Exec.</p>
                    <p className="text-white">{formatTimeAgo(cron.lastRun)}</p>
                  </div>

                  <div className="p-3 bg-black/20 rounded border border-amber-500/10">
                    <p className="text-slate-400 text-xs mb-1">Próxima</p>
                    <p className="text-emerald-400">{formatNextRun(cron.nextRun)}</p>
                  </div>

                  <div className="p-3 bg-black/20 rounded border border-amber-500/10">
                    <p className="text-slate-400 text-xs mb-1">Duração Média</p>
                    <p className="text-blue-400">{formatDuration(cron.averageDuration)}</p>
                  </div>
                </div>

                {/* Performance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Taxa de Sucesso</span>
                    <span className={`font-semibold ${
                      successRate >= 95 ? 'text-emerald-400' :
                      successRate >= 85 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {successRate}%
                    </span>
                  </div>
                  <Progress value={successRate} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      {cron.totalExecutions - cron.failedExecutions} sucessos
                    </span>
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-red-400" />
                      {cron.failedExecutions} falhas
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => executeCron(cron)}
                    disabled={isRunning}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Executando...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Executar Agora
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => toggleCron(cron)}
                    variant="outline"
                    size="sm"
                    className={`${
                      cron.status === 'active'
                        ? 'border-red-500/30 hover:bg-red-500/10 text-red-400'
                        : 'border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {cron.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Chart */}
      <Card className="bg-black/60 backdrop-blur-sm border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-400 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance dos Cron Jobs
          </CardTitle>
          <CardDescription>Duração média de execução (em ms)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={crons}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(234, 179, 8, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="averageDuration" 
                stroke="#eab308" 
                strokeWidth={2}
                dot={{ fill: '#eab308', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}