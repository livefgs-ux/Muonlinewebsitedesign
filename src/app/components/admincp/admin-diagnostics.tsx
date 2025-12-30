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
  XCircle,
  Info
} from "lucide-react";

/**
 * 🔍 ADMIN DIAGNOSTICS - V573+
 * Diagnostics usando backend Node.js próprio
 */

interface DiagnosticData {
  timestamp: string;
  status: {
    database: 'online' | 'offline' | 'error';
    api: 'online' | 'offline' | 'error';
    server: 'online' | 'offline' | 'error';
  };
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
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const startTime = performance.now();
      
      // Testar health endpoint
      const healthRes = await fetch(`${API_URL}/health`);
      const healthData = await healthRes.json();
      
      // Buscar estatísticas do dashboard
      const statsRes = await fetch(`${API_URL}/api/admin/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (!statsRes.ok) {
        throw new Error('Erro ao buscar estatísticas');
      }
      
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        const stats = statsData.data;
        
        setDiagnostics({
          timestamp: new Date().toISOString(),
          status: {
            database: healthData.database === 'connected' ? 'online' : 'offline',
            api: healthRes.ok ? 'online' : 'offline',
            server: healthData.status === 'healthy' ? 'online' : 'offline'
          },
          metrics: {
            playersOnline: stats.server.playersOnline || 0,
            totalCharacters: stats.characters.total || 0,
            totalAccounts: stats.accounts.total || 0,
            uptime: stats.server.uptime || '0%',
            databaseSize: 'N/A'
          },
          health: {
            database: healthData.database === 'connected',
            apiEndpoints: 20, // Número de endpoints disponíveis
            responseTime
          }
        });
        
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Erro ao executar diagnósticos:", err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
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

  if (error && !diagnostics) {
    return (
      <Card className="p-6 bg-red-500/10 border border-red-500/30">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-400 mb-2">Erro ao Carregar Diagnósticos</h3>
            <p className="text-sm text-red-200/80 mb-3">{error}</p>
            <Button 
              onClick={runDiagnostics}
              size="sm"
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#FFB800]" />
          <div>
            <h2 className="text-2xl font-bold text-white">System Diagnostics</h2>
            <p className="text-sm text-gray-400">
              {lastUpdate 
                ? `Última atualização: ${lastUpdate.toLocaleTimeString('pt-BR')}`
                : 'Carregando diagnósticos...'}
            </p>
          </div>
        </div>
        <Button
          onClick={runDiagnostics}
          disabled={isLoading}
          className="bg-[#FFB800]/20 hover:bg-[#FFB800]/30 text-[#FFB800] border border-[#FFB800]/30"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && !diagnostics && (
        <Card className="p-12 bg-black/40 border border-[#FFB800]/20 text-center">
          <RefreshCw className="w-12 h-12 text-[#FFB800] mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Executando diagnósticos...</p>
        </Card>
      )}

      {/* Diagnostics Content */}
      {diagnostics && (
        <>
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-black/40 border border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-blue-400" />
                  <span className="font-semibold text-white">Database</span>
                </div>
                {getStatusIcon(diagnostics.status.database)}
              </div>
              <p className={`text-2xl font-bold ${getStatusColor(diagnostics.status.database)}`}>
                {diagnostics.status.database.toUpperCase()}
              </p>
            </Card>

            <Card className="p-6 bg-black/40 border border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Server className="w-6 h-6 text-purple-400" />
                  <span className="font-semibold text-white">API</span>
                </div>
                {getStatusIcon(diagnostics.status.api)}
              </div>
              <p className={`text-2xl font-bold ${getStatusColor(diagnostics.status.api)}`}>
                {diagnostics.status.api.toUpperCase()}
              </p>
            </Card>

            <Card className="p-6 bg-black/40 border border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-green-400" />
                  <span className="font-semibold text-white">Server</span>
                </div>
                {getStatusIcon(diagnostics.status.server)}
              </div>
              <p className={`text-2xl font-bold ${getStatusColor(diagnostics.status.server)}`}>
                {diagnostics.status.server.toUpperCase()}
              </p>
            </Card>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={Activity}
              label="Jogadores Online"
              value={diagnostics.metrics.playersOnline.toString()}
              color="text-green-400"
            />
            <MetricCard
              icon={Database}
              label="Total de Personagens"
              value={diagnostics.metrics.totalCharacters.toLocaleString()}
              color="text-blue-400"
            />
            <MetricCard
              icon={Server}
              label="Total de Contas"
              value={diagnostics.metrics.totalAccounts.toLocaleString()}
              color="text-purple-400"
            />
            <MetricCard
              icon={Cpu}
              label="Tempo de Resposta"
              value={`${diagnostics.health.responseTime}ms`}
              color="text-yellow-400"
            />
          </div>

          {/* Health Info */}
          <Card className="p-6 bg-black/40 border border-gray-700/30">
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="w-6 h-6 text-[#FFB800]" />
              <h3 className="text-lg font-bold text-white">Health Check</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                <span className="text-sm text-gray-400">Database Connection</span>
                <span className={`font-bold ${diagnostics.health.database ? 'text-green-400' : 'text-red-400'}`}>
                  {diagnostics.health.database ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                <span className="text-sm text-gray-400">API Endpoints</span>
                <span className="font-bold text-blue-400">{diagnostics.health.apiEndpoints}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                <span className="text-sm text-gray-400">Uptime</span>
                <span className="font-bold text-green-400">{diagnostics.metrics.uptime}</span>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

// Helper Component
interface MetricCardProps {
  icon: any;
  label: string;
  value: string;
  color: string;
}

function MetricCard({ icon: Icon, label, value, color }: MetricCardProps) {
  return (
    <Card className="p-4 bg-black/40 border border-gray-700/30">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </Card>
  );
}
