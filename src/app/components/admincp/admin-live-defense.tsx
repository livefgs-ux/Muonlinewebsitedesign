import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { 
  Shield, 
  ShieldAlert, 
  Ban, 
  Activity, 
  AlertTriangle,
  Trash2,
  RefreshCw,
  TrendingUp,
  Users,
  Clock,
  XCircle,
  CheckCircle
} from "lucide-react";
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface BlacklistEntry {
  ip: string;
  reason: string;
  timestamp: string;
  expiresAt: string;
  requestCount: number;
}

interface DefenseStats {
  totalBlocked: number;
  activeBlocks: number;
  attacksLastHour: number;
  topThreatType: string;
  requestsAnalyzed: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface ThreatActivity {
  ip: string;
  type: string;
  time: string;
  blocked: boolean;
}

export function AdminLiveDefense() {
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
  const [stats, setStats] = useState<DefenseStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ThreatActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualIp, setManualIp] = useState("");
  const [manualReason, setManualReason] = useState("");

  useEffect(() => {
    loadDefenseData();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadDefenseData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDefenseData = async () => {
    try {
      // Load blacklist
      const blacklistRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/blacklist`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const blacklistData = await blacklistRes.json();
      if (blacklistData.ok) {
        setBlacklist(blacklistData.blacklist || []);
      }

      // Load stats
      const statsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/defense-stats`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const statsData = await statsRes.json();
      if (statsData.ok) {
        setStats(statsData.stats);
      }

      // Load recent activity
      const activityRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/recent-threats`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const activityData = await activityRes.json();
      if (activityData.ok) {
        setRecentActivity(activityData.activity || []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados de defesa:", err);
    }
  };

  const handleManualBlock = async () => {
    if (!manualIp.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/block-ip`,
        {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ip: manualIp,
            reason: manualReason || "Manual block by admin"
          })
        }
      );
      const data = await res.json();
      if (data.ok) {
        setManualIp("");
        setManualReason("");
        loadDefenseData();
      }
    } catch (err) {
      console.error("Erro ao bloquear IP:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (ip: string) => {
    if (!confirm(`Desbloquear IP ${ip}?`)) return;

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/unblock-ip`,
        {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ip })
        }
      );
      const data = await res.json();
      if (data.ok) {
        loadDefenseData();
      }
    } catch (err) {
      console.error("Erro ao desbloquear IP:", err);
    }
  };

  const handleClearExpired = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/clear-expired`,
        {
          method: 'POST',
          headers: { "Authorization": `Bearer ${publicAnonKey}` }
        }
      );
      const data = await res.json();
      if (data.ok) {
        loadDefenseData();
      }
    } catch (err) {
      console.error("Erro ao limpar expirados:", err);
    }
  };

  const getThreatColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getThreatIcon = (level?: string) => {
    switch (level) {
      case 'critical': return <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />;
      case 'high': return <AlertTriangle className="w-8 h-8 text-orange-400" />;
      case 'medium': return <Activity className="w-8 h-8 text-yellow-400" />;
      default: return <Shield className="w-8 h-8 text-green-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-red-500/20 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Real-Time Defense</h2>
              <p className="text-sm text-gray-400 mt-1">
                Monitoramento contínuo e bloqueio automático de ameaças
              </p>
            </div>
          </div>

          <Button
            onClick={loadDefenseData}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </Card>

      {/* Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Threat Level */}
          <Card className={`p-6 bg-black/40 border ${getThreatColor(stats.threatLevel)}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Nível de Ameaça</span>
              {getThreatIcon(stats.threatLevel)}
            </div>
            <div className="text-2xl font-bold text-white uppercase">
              {stats.threatLevel}
            </div>
            <p className="text-xs text-gray-500 mt-2">Status atual do sistema</p>
          </Card>

          {/* Total Blocked */}
          <Card className="p-6 bg-black/40 border border-red-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Total Bloqueados</span>
              <Ban className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-4xl font-bold text-red-400">
              {stats.totalBlocked}
            </div>
            <p className="text-xs text-gray-500 mt-2">Desde o início</p>
          </Card>

          {/* Active Blocks */}
          <Card className="p-6 bg-black/40 border border-orange-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Bloqueios Ativos</span>
              <Users className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-4xl font-bold text-orange-400">
              {stats.activeBlocks}
            </div>
            <p className="text-xs text-gray-500 mt-2">IPs bloqueados agora</p>
          </Card>

          {/* Attacks Last Hour */}
          <Card className="p-6 bg-black/40 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Ataques (1h)</span>
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-4xl font-bold text-yellow-400">
              {stats.attacksLastHour}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tipo: {stats.topThreatType}
            </p>
          </Card>
        </div>
      )}

      {/* Manual IP Block */}
      <Card className="p-6 bg-black/40 border border-red-500/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Ban className="w-5 h-5 text-red-400" />
          Bloqueio Manual de IP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="IP Address (ex: 192.168.1.100)"
            value={manualIp}
            onChange={(e) => setManualIp(e.target.value)}
            className="bg-black/60 border-red-500/30 text-white"
          />
          <Input
            placeholder="Motivo (opcional)"
            value={manualReason}
            onChange={(e) => setManualReason(e.target.value)}
            className="bg-black/60 border-red-500/30 text-white"
          />
          <Button
            onClick={handleManualBlock}
            disabled={loading || !manualIp.trim()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Ban className="w-4 h-4 mr-2" />
            Bloquear IP
          </Button>
        </div>
      </Card>

      {/* Recent Threat Activity */}
      <Card className="p-6 bg-black/40 border border-orange-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" />
            Atividade Recente de Ameaças
          </h3>
          <Badge className="bg-orange-500/20 text-orange-300">
            Últimas 24h
          </Badge>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className={`p-3 rounded border ${
                  activity.blocked 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activity.blocked ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    )}
                    <div>
                      <p className="text-sm font-mono text-white">{activity.ip}</p>
                      <p className="text-xs text-gray-400">{activity.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={activity.blocked ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}>
                      {activity.blocked ? 'BLOQUEADO' : 'DETECTADO'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.time).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
              <p className="text-gray-400">Nenhuma ameaça detectada recentemente</p>
            </div>
          )}
        </div>
      </Card>

      {/* Blacklist Table */}
      <Card className="p-6 bg-black/40 border border-red-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Ban className="w-5 h-5 text-red-400" />
            IPs Bloqueados ({blacklist.length})
          </h3>
          <Button
            onClick={handleClearExpired}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Expirados
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">IP Address</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Motivo</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Requisições</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Bloqueado em</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Expira em</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.length > 0 ? (
                blacklist.map((entry, idx) => {
                  const isExpired = new Date(entry.expiresAt) < new Date();
                  return (
                    <tr key={idx} className={`border-b border-gray-800 hover:bg-white/5 ${isExpired ? 'opacity-50' : ''}`}>
                      <td className="py-3 px-4">
                        <span className="font-mono text-white">{entry.ip}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-red-500/20 text-red-300 text-xs">
                          {entry.reason}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {entry.requestCount || 0} req/s
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(entry.timestamp).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        {isExpired ? (
                          <Badge className="bg-gray-500/20 text-gray-400">Expirado</Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            {new Date(entry.expiresAt).toLocaleString('pt-BR')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          onClick={() => handleUnblock(entry.ip)}
                          variant="outline"
                          size="sm"
                          className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Desbloquear
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Shield className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-400">Nenhum IP bloqueado no momento</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Defense Info */}
      <Card className="p-4 bg-black/40 border border-gray-700">
        <h3 className="text-sm font-semibold text-[#FFB800] mb-2">ℹ️ Detecção Automática</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• <strong>Flood Detection:</strong> Bloqueio automático após 50 req/5s do mesmo IP</li>
          <li>• <strong>SQL Injection:</strong> Padrões como UNION SELECT, DROP TABLE, etc.</li>
          <li>• <strong>XSS Attacks:</strong> Tags &lt;script&gt;, eval(), innerHTML malicioso</li>
          <li>• <strong>Brute Force:</strong> Múltiplas tentativas de login falhadas</li>
          <li>• <strong>Duração:</strong> Bloqueios temporários de 24h (configurável)</li>
          <li>• <strong>Auto-limpeza:</strong> IPs expirados são removidos automaticamente</li>
        </ul>
      </Card>
    </div>
  );
}
