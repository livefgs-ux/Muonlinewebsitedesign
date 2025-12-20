import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Zap, 
  Database,
  Activity,
  Lock,
  Unlock,
  Bell,
  RefreshCw,
  Download,
  Upload,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface SecuritySummary {
  totalIssues: number;
  criticalIssues: number;
  blockedIPs: number;
  activeBlocks: number;
  adaptiveLearnedIPs: number;
  securityScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastScan: string;
  adaptiveEnabled: boolean;
  incidentResponseEnabled: boolean;
}

interface IncidentLog {
  timestamp: string;
  level: 'info' | 'warning' | 'critical';
  type: string;
  description: string;
  action: string;
  ip?: string;
}

interface BackupInfo {
  enabled: boolean;
  schedule: string;
  maxBackups: number;
  autoRollback: boolean;
  lastBackup: string | null;
  nextBackup: string | null;
  totalBackups: number;
}

export function AdminSecurityDashboard() {
  const [summary, setSummary] = useState<SecuritySummary | null>(null);
  const [incidents, setIncidents] = useState<IncidentLog[]>([]);
  const [backupInfo, setBackupInfo] = useState<BackupInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [backupMsg, setBackupMsg] = useState("");
  const [lockdownMode, setLockdownMode] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch security summary
      const summaryRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/dashboard/summary`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const summaryData = await summaryRes.json();
      if (summaryData.ok) {
        setSummary(summaryData.summary);
      }

      // Fetch incident logs
      const incidentsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/dashboard/incidents`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const incidentsData = await incidentsRes.json();
      if (incidentsData.ok) {
        setIncidents(incidentsData.incidents || []);
      }

      // Fetch backup info
      const backupRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/dashboard/backup-info`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const backupData = await backupRes.json();
      if (backupData.ok) {
        setBackupInfo(backupData.backup);
      }

      // Fetch lockdown status
      const lockdownRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/dashboard/lockdown-status`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const lockdownData = await lockdownRes.json();
      if (lockdownData.ok) {
        setLockdownMode(lockdownData.lockdown);
      }

      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      setLoading(false);
    }
  };

  const handleManualBackup = async () => {
    setBackupMsg("Criando backup...");
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/dashboard/backup/manual`,
        {
          method: 'POST',
          headers: { "Authorization": `Bearer ${publicAnonKey}` }
        }
      );
      const data = await res.json();
      if (data.ok) {
        setBackupMsg("✅ Backup manual criado com sucesso!");
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Erro ao criar backup:", err);
      setBackupMsg("❌ Erro ao criar backup");
    }
  };

  const handleToggleLockdown = async () => {
    if (!confirm(`${lockdownMode ? 'Desativar' : 'Ativar'} modo Lockdown?`)) return;

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/dashboard/toggle-lockdown`,
        {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ enabled: !lockdownMode })
        }
      );
      const data = await res.json();
      if (data.ok) {
        setLockdownMode(!lockdownMode);
      }
    } catch (err) {
      console.error("Erro ao alternar lockdown:", err);
    }
  };

  const getThreatColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getIncidentIcon = (level: string) => {
    switch (level) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  if (loading || !summary) {
    return (
      <Card className="p-12 bg-black/40 border border-purple-500/20 text-center">
        <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50 animate-pulse" />
        <p className="text-gray-400">Carregando Security Center...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Security Center</h2>
              <p className="text-sm text-gray-400 mt-1">
                Central unificada de segurança, monitoramento e resposta a incidentes
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={fetchDashboardData}
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>

            <Button
              onClick={handleToggleLockdown}
              variant={lockdownMode ? "destructive" : "outline"}
              className={lockdownMode ? "" : "border-red-500/50 text-red-400 hover:bg-red-500/10"}
            >
              {lockdownMode ? (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Desativar Lockdown
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Ativar Lockdown
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Lockdown Alert */}
      {lockdownMode && (
        <Card className="p-4 bg-red-500/10 border border-red-500/30 animate-pulse">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-300 font-semibold">🚨 MODO LOCKDOWN ATIVO</p>
              <p className="text-xs text-red-400/80 mt-1">
                Acesso restrito. Apenas administradores podem fazer login. Todas as ações são registradas.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Security Score */}
        <Card className={`p-6 bg-black/40 border ${getThreatColor(summary.threatLevel)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Security Score</span>
            <Shield className={`w-6 h-6 ${summary.securityScore >= 80 ? 'text-green-400' : summary.securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`} />
          </div>
          <div className={`text-4xl font-bold ${summary.securityScore >= 80 ? 'text-green-400' : summary.securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            {summary.securityScore}/100
          </div>
          <Progress value={summary.securityScore} className="mt-3 h-2" />
          <p className="text-xs text-gray-500 mt-2 uppercase">
            Nível: {summary.threatLevel}
          </p>
        </Card>

        {/* Total Issues */}
        <Card className="p-6 bg-black/40 border border-red-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Issues Detectadas</span>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-4xl font-bold text-red-400">
            {summary.totalIssues}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {summary.criticalIssues} críticas
          </p>
          {summary.totalIssues > summary.criticalIssues && (
            <TrendingUp className="w-4 h-4 text-red-400 absolute top-2 right-2" />
          )}
        </Card>

        {/* Blocked IPs */}
        <Card className="p-6 bg-black/40 border border-orange-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">IPs Bloqueados</span>
            <Lock className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-4xl font-bold text-orange-400">
            {summary.blockedIPs}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {summary.activeBlocks} ativos agora
          </p>
        </Card>

        {/* Adaptive Learning */}
        <Card className="p-6 bg-black/40 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">IPs Rastreados</span>
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-blue-400">
            {summary.adaptiveLearnedIPs}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            IA Adaptativa {summary.adaptiveEnabled ? '✓' : '✗'}
          </p>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Response */}
        <Card className="p-6 bg-black/40 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Incident Response System
            </h3>
            <Badge className={summary.incidentResponseEnabled ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}>
              {summary.incidentResponseEnabled ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Auto Bloqueio</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 text-xs">Ativado</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-gray-700">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Notificações</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 text-xs">Discord + Email</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-gray-700">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Auto Lockdown</span>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">
                {lockdownMode ? 'ATIVO' : 'Pronto'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-gray-700">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">Backup on Incident</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 text-xs">Ativado</Badge>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            Última verificação: {new Date(summary.lastScan).toLocaleString('pt-BR')}
          </p>
        </Card>

        {/* Backup & Recovery */}
        {backupInfo && (
          <Card className="p-6 bg-black/40 border border-teal-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-400" />
                Backup & Recovery System
              </h3>
              <Badge className={backupInfo.enabled ? 'bg-teal-500/20 text-teal-300' : 'bg-gray-500/20 text-gray-400'}>
                {backupInfo.enabled ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-gray-700">
                <span className="text-sm text-gray-300">Agendamento</span>
                <Badge className="bg-teal-500/20 text-teal-300 text-xs">
                  {backupInfo.schedule === '0 */6 * * *' ? 'A cada 6h' : backupInfo.schedule}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-gray-700">
                <span className="text-sm text-gray-300">Total de Backups</span>
                <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                  {backupInfo.totalBackups} / {backupInfo.maxBackups}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-gray-700">
                <span className="text-sm text-gray-300">Auto Rollback</span>
                <Badge className={backupInfo.autoRollback ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'} >
                  {backupInfo.autoRollback ? 'Ativado' : 'Desativado'}
                </Badge>
              </div>

              {backupInfo.lastBackup && (
                <div className="p-3 bg-black/40 rounded border border-gray-700">
                  <p className="text-xs text-gray-400">Último backup:</p>
                  <p className="text-sm text-gray-300 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(backupInfo.lastBackup).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}

              {backupInfo.nextBackup && (
                <div className="p-3 bg-black/40 rounded border border-gray-700">
                  <p className="text-xs text-gray-400">Próximo backup:</p>
                  <p className="text-sm text-teal-300 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {backupInfo.nextBackup}
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={handleManualBackup}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Criar Backup Manual
            </Button>

            {backupMsg && (
              <p className="text-xs mt-2 text-center text-teal-300">{backupMsg}</p>
            )}
          </Card>
        )}
      </div>

      {/* Incident Logs */}
      <Card className="p-6 bg-black/40 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Incident Activity Log
          </h3>
          <Badge className="bg-purple-500/20 text-purple-300">
            Últimos {incidents.length} eventos
          </Badge>
        </div>

        <div className="bg-black/60 rounded border border-gray-700 h-80 overflow-y-auto">
          {incidents.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {incidents.map((incident, idx) => (
                <div key={idx} className="p-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getIncidentIcon(incident.level)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-white">{incident.type}</span>
                          <Badge className={getThreatColor(incident.level)}>
                            {incident.level.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">{incident.description}</p>
                        {incident.ip && (
                          <p className="text-xs text-gray-500 mt-1">
                            IP: <span className="font-mono text-gray-400">{incident.ip}</span>
                          </p>
                        )}
                        <p className="text-xs text-blue-400 mt-1">
                          ⚡ Ação: {incident.action}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-3">
                      {new Date(incident.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <CheckCircle className="w-12 h-12 mb-3 opacity-50" />
              <p>Nenhum incidente registrado</p>
            </div>
          )}
        </div>
      </Card>

      {/* System Status Footer */}
      <Card className="p-4 bg-black/40 border border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>Security Modules: 5/5 Online</span>
            <span>•</span>
            <span>Auto-refresh: 10s</span>
            <span>•</span>
            <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-green-400 animate-pulse" />
            <span className="text-green-400">Sistema Operacional</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
