import { useState, useEffect } from 'react';
import { ScrollText, Download, RefreshCw, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { toast } from 'sonner';

interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function LogsSection() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      // ✅ V575 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch('/api/admin/logs', {
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
        setLogs(data.data);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar logs:', error);
      toast.error('Erro ao carregar logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      // ✅ V575 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch('/api/admin/logs/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('✅ Logs exportados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao exportar logs:', error);
      toast.error('Erro ao exportar logs');
    }
  };

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Logs do Sistema</h2>
          <p className="text-sm text-slate-400">Visualize atividades administrativas</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            onClick={loadLogs}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar nos logs..."
              className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <ScrollText className="w-5 h-5" />
            Logs Recentes ({loading ? '...' : filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-400">
              Carregando logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Nenhum log encontrado
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-transparent hover:border-amber-500/20"
                  >
                    <div className={`mt-1 ${getTypeColor(log.type)}`}>
                      <ScrollText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500 font-mono">
                          {log.timestamp}
                        </span>
                        <Badge className="bg-slate-700/30 text-slate-300 border-slate-600/30 text-xs">
                          {log.user}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300">{log.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}