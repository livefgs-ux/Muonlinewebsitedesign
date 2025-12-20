import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { 
  FileText, 
  Download, 
  Trash2, 
  RefreshCw, 
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  Filter
} from "lucide-react";
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  category?: string;
  details?: any;
}

type LogLevel = 'all' | 'info' | 'warning' | 'error' | 'debug';

export function AdminLogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/system/logs`,
        {
          headers: { "Authorization": `Bearer ${publicAnonKey}` }
        }
      );
      const data = await res.json();
      if (data.ok) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Erro ao carregar logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = async () => {
    if (!confirm("Tem certeza que deseja limpar todos os logs?")) return;
    
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/system/logs/clear`,
        {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${publicAnonKey}` }
        }
      );
      const data = await res.json();
      if (data.ok) {
        setLogs([]);
      }
    } catch (err) {
      console.error("Erro ao limpar logs:", err);
    }
  };

  const downloadLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.category ? `[${log.category}] ` : ''}${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muonline-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    if (selectedLevel === 'all') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => log.level === selectedLevel));
    }
  }, [logs, selectedLevel]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'debug':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/10 border-red-500/30';
      case 'debug':
        return 'bg-gray-500/10 border-gray-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <Card className="p-6 bg-black/40 border border-[#FFB800]/20 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#FFB800]" />
          <h2 className="text-2xl font-bold text-white">System Logs</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            className={autoRefresh 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "border-gray-600 text-gray-400"
            }
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>

          <Button 
            onClick={loadLogs}
            disabled={isLoading}
            className="bg-[#FFB800]/20 hover:bg-[#FFB800]/30 text-[#FFB800] border border-[#FFB800]/50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>

          <Button 
            onClick={downloadLogs}
            disabled={logs.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          <Button 
            onClick={clearLogs}
            disabled={logs.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Filtrar por nível:</span>
        {(['all', 'info', 'warning', 'error', 'debug'] as LogLevel[]).map(level => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              selectedLevel === level
                ? 'bg-[#FFB800] text-black'
                : 'bg-black/60 text-gray-400 hover:bg-black/80'
            }`}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
          <p className="text-xs text-blue-300">Info</p>
          <p className="text-lg font-bold text-white">
            {logs.filter(l => l.level === 'info').length}
          </p>
        </div>
        <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/30">
          <p className="text-xs text-yellow-300">Warnings</p>
          <p className="text-lg font-bold text-white">
            {logs.filter(l => l.level === 'warning').length}
          </p>
        </div>
        <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
          <p className="text-xs text-red-300">Errors</p>
          <p className="text-lg font-bold text-white">
            {logs.filter(l => l.level === 'error').length}
          </p>
        </div>
        <div className="p-3 bg-gray-500/10 rounded border border-gray-500/30">
          <p className="text-xs text-gray-300">Debug</p>
          <p className="text-lg font-bold text-white">
            {logs.filter(l => l.level === 'debug').length}
          </p>
        </div>
      </div>

      {/* Lista de Logs */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-lg border ${getLevelColor(log.level)}`}
            >
              <div className="flex items-start gap-3">
                {getLevelIcon(log.level)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 font-mono">
                      {log.timestamp}
                    </span>
                    {log.category && (
                      <span className="text-xs px-2 py-0.5 bg-black/40 rounded text-[#FFB800] font-semibold">
                        {log.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white break-words">{log.message}</p>
                  {log.details && (
                    <pre className="text-xs text-gray-400 mt-2 p-2 bg-black/40 rounded overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {selectedLevel === 'all' 
                ? 'Nenhum log disponível' 
                : `Nenhum log de ${selectedLevel} encontrado`
              }
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}