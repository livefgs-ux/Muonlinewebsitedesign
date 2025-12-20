import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface SystemStatus {
  database: 'online' | 'offline' | 'error';
  api: 'online' | 'offline' | 'error';
  server: 'online' | 'offline' | 'error';
}

interface DiagnosticData {
  timestamp: string;
  status: SystemStatus;
  metrics: {
    playersOnline: number;
    totalCharacters: number;
    totalAccounts: number;
    databaseSize?: string;
    uptime?: string;
  };
  health: {
    database: boolean;
    apiEndpoints: number;
    responseTime: number;
  };
}

export function AdminDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const startTime = performance.now();
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/system/diagnostics`,
        {
          headers: { "Authorization": `Bearer ${publicAnonKey}` }
        }
      );
      const endTime = performance.now();
      const data = await res.json();
      
      if (data.ok) {
        setDiagnostics({
          ...data.diagnostics,
          health: {
            ...data.diagnostics.health,
            responseTime: Math.round(endTime - startTime)
          }
        });
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Erro ao executar diagnósticos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(runDiagnostics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: 'online' | 'offline' | 'error') => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: 'online' | 'offline' | 'error') => {
    switch (status) {
      case 'online':
        return 'text-green-400';
      case 'offline':
        return 'text-red-400';
      case 'error':
        return 'text-yellow-400';
    }
  };

  return (
    <Card className="p-6 bg-black/40 border border-[#FFB800]/20 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#FFB800]" />
          <div>
            <h2 className="text-2xl font-bold text-white">System Diagnostics</h2>
            {lastUpdate && (
              <p className="text-xs text-gray-400">
                Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
              </p>
            )}
          </div>
        </div>
        
        <Button 
          onClick={runDiagnostics}
          disabled={isLoading}
          className="bg-[#FFB800]/20 hover:bg-[#FFB800]/30 text-[#FFB800] border border-[#FFB800]/50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {diagnostics ? (
        <div className="space-y-6">
          {/* Status dos Serviços */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black/60 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold text-white">Database</span>
                </div>
                {getStatusIcon(diagnostics.status.database)}
              </div>
              <p className={`text-lg font-bold ${getStatusColor(diagnostics.status.database)}`}>
                {diagnostics.status.database.toUpperCase()}
              </p>
            </div>

            <div className="p-4 bg-black/60 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-semibold text-white">API Server</span>
                </div>
                {getStatusIcon(diagnostics.status.api)}
              </div>
              <p className={`text-lg font-bold ${getStatusColor(diagnostics.status.api)}`}>
                {diagnostics.status.api.toUpperCase()}
              </p>
            </div>

            <div className="p-4 bg-black/60 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-semibold text-white">Game Server</span>
                </div>
                {getStatusIcon(diagnostics.status.server)}
              </div>
              <p className={`text-lg font-bold ${getStatusColor(diagnostics.status.server)}`}>
                {diagnostics.status.server.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Métricas do Sistema */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/30">
              <p className="text-xs text-blue-300 mb-1">Players Online</p>
              <p className="text-2xl font-bold text-white">{diagnostics.metrics.playersOnline}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg border border-green-500/30">
              <p className="text-xs text-green-300 mb-1">Total Characters</p>
              <p className="text-2xl font-bold text-white">{diagnostics.metrics.totalCharacters}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/30">
              <p className="text-xs text-purple-300 mb-1">Total Accounts</p>
              <p className="text-2xl font-bold text-white">{diagnostics.metrics.totalAccounts}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/30">
              <p className="text-xs text-orange-300 mb-1">Response Time</p>
              <p className="text-2xl font-bold text-white">{diagnostics.health.responseTime}ms</p>
            </div>
          </div>

          {/* Health Check */}
          <div className="p-5 bg-black/60 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#FFB800]" />
              Health Check
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Database Connection</span>
                <div className="flex items-center gap-2">
                  {diagnostics.health.database ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Healthy</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-400">Unhealthy</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">API Endpoints</span>
                <span className="text-sm text-white font-mono">{diagnostics.health.apiEndpoints} active</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Average Response Time</span>
                <span className={`text-sm font-mono ${
                  diagnostics.health.responseTime < 100 ? 'text-green-400' :
                  diagnostics.health.responseTime < 300 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {diagnostics.health.responseTime}ms
                </span>
              </div>

              {diagnostics.metrics.databaseSize && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Database Size</span>
                  <span className="text-sm text-white font-mono">{diagnostics.metrics.databaseSize}</span>
                </div>
              )}

              {diagnostics.metrics.uptime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Server Uptime</span>
                  <span className="text-sm text-white font-mono">{diagnostics.metrics.uptime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Diagnóstico gerado em: {diagnostics.timestamp}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Carregando diagnósticos do sistema...</p>
        </div>
      )}
    </Card>
  );
}