import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Progress } from "../ui/progress";
import { 
  Shield, 
  Brain, 
  Activity, 
  TrendingUp, 
  Settings,
  AlertCircle,
  CheckCircle,
  Zap,
  BarChart3,
  Clock,
  RefreshCw,
  Save
} from "lucide-react";
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface FirewallConfig {
  enabled: boolean;
  adaptiveMode: boolean;
  baseRateLimit: number;
  autoBanThreshold: number;
  learningWindowMinutes: number;
  autoUnbanHours: number;
  learningOnly: boolean;
}

interface LearningStats {
  totalIpsTracked: number;
  highRiskIps: number;
  mediumRiskIps: number;
  lowRiskIps: number;
  averageRequestRate: number;
  adjustedLimits: number;
  falsePositives: number;
  truePositives: number;
  learningAccuracy: number;
}

interface IpBehavior {
  ip: string;
  hits: number;
  risk: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  lastSeen: string;
  banned: boolean;
}

export function AdminAdaptiveFirewall() {
  const [config, setConfig] = useState<FirewallConfig | null>(null);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [behaviors, setBehaviors] = useState<IpBehavior[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tempConfig, setTempConfig] = useState<FirewallConfig | null>(null);

  useEffect(() => {
    loadFirewallData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadFirewallData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadFirewallData = async () => {
    try {
      // Load config
      const configRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/adaptive/config`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const configData = await configRes.json();
      if (configData.ok) {
        setConfig(configData.config);
        if (!tempConfig) {
          setTempConfig(configData.config);
        }
      }

      // Load stats
      const statsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/adaptive/stats`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const statsData = await statsRes.json();
      if (statsData.ok) {
        setStats(statsData.stats);
      }

      // Load behaviors
      const behaviorsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/adaptive/behaviors`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const behaviorsData = await behaviorsRes.json();
      if (behaviorsData.ok) {
        setBehaviors(behaviorsData.behaviors || []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do firewall:", err);
    }
  };

  const handleToggleFirewall = async (enabled: boolean) => {
    if (!confirm(`${enabled ? 'Ativar' : 'Desativar'} o AI Adaptive Firewall?`)) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/adaptive/toggle`,
        {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ enabled })
        }
      );
      const data = await res.json();
      if (data.ok) {
        loadFirewallData();
      }
    } catch (err) {
      console.error("Erro ao alternar firewall:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!tempConfig) return;

    setSaving(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/adaptive/update-config`,
        {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(tempConfig)
        }
      );
      const data = await res.json();
      if (data.ok) {
        setConfig(tempConfig);
        loadFirewallData();
      }
    } catch (err) {
      console.error("Erro ao salvar configuração:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetLearning = async () => {
    if (!confirm("Isso irá resetar todo o aprendizado acumulado. Continuar?")) return;

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/adaptive/reset`,
        {
          method: 'POST',
          headers: { "Authorization": `Bearer ${publicAnonKey}` }
        }
      );
      const data = await res.json();
      if (data.ok) {
        loadFirewallData();
      }
    } catch (err) {
      console.error("Erro ao resetar aprendizado:", err);
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 8) return 'text-red-400 bg-red-500/20';
    if (risk >= 5) return 'text-orange-400 bg-orange-500/20';
    if (risk >= 2) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-green-400 bg-green-500/20';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return '↗️';
    if (trend === 'decreasing') return '↘️';
    return '→';
  };

  if (!config || !tempConfig) {
    return (
      <Card className="p-12 bg-black/40 border border-purple-500/20 text-center">
        <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50 animate-pulse" />
        <p className="text-gray-400">Carregando configuração do firewall...</p>
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
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Adaptive Firewall</h2>
              <p className="text-sm text-gray-400 mt-1">
                Firewall inteligente com aprendizado automático de padrões
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={config.enabled}
                onCheckedChange={handleToggleFirewall}
                disabled={loading}
              />
              <Label className={`text-sm font-semibold ${config.enabled ? 'text-green-400' : 'text-gray-400'}`}>
                {config.enabled ? 'ATIVO' : 'DESATIVADO'}
              </Label>
            </div>

            <Button
              onClick={loadFirewallData}
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </Card>

      {/* Warning Banner */}
      {!config.enabled && (
        <Card className="p-4 bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-300 font-semibold">Firewall Desativado</p>
              <p className="text-xs text-yellow-400/80 mt-1">
                O sistema está apenas registrando atividades, sem bloqueios automáticos.
                Ative para proteção em tempo real.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Learning Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total IPs Tracked */}
          <Card className="p-6 bg-black/40 border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">IPs Rastreados</span>
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-4xl font-bold text-purple-400">
              {stats.totalIpsTracked}
            </div>
            <p className="text-xs text-gray-500 mt-2">Total monitorado</p>
          </Card>

          {/* High Risk IPs */}
          <Card className="p-6 bg-black/40 border border-red-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Alto Risco</span>
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-4xl font-bold text-red-400">
              {stats.highRiskIps}
            </div>
            <p className="text-xs text-gray-500 mt-2">Risco ≥ 8</p>
          </Card>

          {/* Learning Accuracy */}
          <Card className="p-6 bg-black/40 border border-green-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Precisão IA</span>
              <Brain className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-4xl font-bold text-green-400">
              {stats.learningAccuracy}%
            </div>
            <Progress value={stats.learningAccuracy} className="mt-3 h-2" />
          </Card>

          {/* Adjusted Limits */}
          <Card className="p-6 bg-black/40 border border-blue-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Ajustes Automáticos</span>
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-4xl font-bold text-blue-400">
              {stats.adjustedLimits}
            </div>
            <p className="text-xs text-gray-500 mt-2">Limites adaptados</p>
          </Card>
        </div>
      )}

      {/* Configuration Panel */}
      <Card className="p-6 bg-black/40 border border-purple-500/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Configurações Avançadas
          </h3>
          <Badge className="bg-purple-500/20 text-purple-300">
            Apenas Super Admin
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Adaptive Mode */}
          <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-gray-700">
            <div>
              <Label className="text-sm font-semibold text-white">Modo Adaptativo</Label>
              <p className="text-xs text-gray-400 mt-1">
                Ajusta limites automaticamente baseado em padrões
              </p>
            </div>
            <Switch
              checked={tempConfig.adaptiveMode}
              onCheckedChange={(checked) => setTempConfig({ ...tempConfig, adaptiveMode: checked })}
            />
          </div>

          {/* Learning Only Mode */}
          <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-gray-700">
            <div>
              <Label className="text-sm font-semibold text-white">Modo Apenas Aprendizado</Label>
              <p className="text-xs text-gray-400 mt-1">
                Não bloqueia, apenas registra padrões
              </p>
            </div>
            <Switch
              checked={tempConfig.learningOnly}
              onCheckedChange={(checked) => setTempConfig({ ...tempConfig, learningOnly: checked })}
            />
          </div>

          {/* Base Rate Limit */}
          <div>
            <Label className="text-sm text-gray-300 mb-2">
              Rate Limit Base (req/5s)
            </Label>
            <Input
              type="number"
              value={tempConfig.baseRateLimit}
              onChange={(e) => setTempConfig({ ...tempConfig, baseRateLimit: parseInt(e.target.value) })}
              className="bg-black/60 border-purple-500/30 text-white mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Limite inicial antes de ajustes adaptativos
            </p>
          </div>

          {/* Auto Ban Threshold */}
          <div>
            <Label className="text-sm text-gray-300 mb-2">
              Threshold de Auto-Ban (pontos de risco)
            </Label>
            <Input
              type="number"
              value={tempConfig.autoBanThreshold}
              onChange={(e) => setTempConfig({ ...tempConfig, autoBanThreshold: parseInt(e.target.value) })}
              className="bg-black/60 border-purple-500/30 text-white mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Pontos de risco necessários para bloqueio automático
            </p>
          </div>

          {/* Learning Window */}
          <div>
            <Label className="text-sm text-gray-300 mb-2">
              Janela de Aprendizado (minutos)
            </Label>
            <Input
              type="number"
              value={tempConfig.learningWindowMinutes}
              onChange={(e) => setTempConfig({ ...tempConfig, learningWindowMinutes: parseInt(e.target.value) })}
              className="bg-black/60 border-purple-500/30 text-white mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tempo de análise de comportamento
            </p>
          </div>

          {/* Auto Unban Hours */}
          <div>
            <Label className="text-sm text-gray-300 mb-2">
              Auto-Desban (horas)
            </Label>
            <Input
              type="number"
              value={tempConfig.autoUnbanHours}
              onChange={(e) => setTempConfig({ ...tempConfig, autoUnbanHours: parseInt(e.target.value) })}
              className="bg-black/60 border-purple-500/30 text-white mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tempo até desban automático
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleSaveConfig}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configuração
              </>
            )}
          </Button>

          <Button
            onClick={handleResetLearning}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            Resetar Aprendizado
          </Button>
        </div>
      </Card>

      {/* IP Behavior Analysis */}
      <Card className="p-6 bg-black/40 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Análise de Comportamento de IPs
          </h3>
          <Badge className="bg-purple-500/20 text-purple-300">
            Top 20 IPs
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">IP</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Requisições</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Risco</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Tendência</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Última Atividade</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {behaviors.length > 0 ? (
                behaviors.slice(0, 20).map((behavior, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <span className="font-mono text-white">{behavior.ip}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {behavior.hits}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getRiskColor(behavior.risk)}>
                        Risco: {behavior.risk}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-2xl">
                      {getTrendIcon(behavior.trend)}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(behavior.lastSeen).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      {behavior.banned ? (
                        <Badge className="bg-red-500/20 text-red-300">Bloqueado</Badge>
                      ) : (
                        <Badge className="bg-green-500/20 text-green-300">Normal</Badge>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Brain className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-400">Nenhum comportamento registrado ainda</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Info Panel */}
      <Card className="p-4 bg-black/40 border border-gray-700">
        <h3 className="text-sm font-semibold text-[#FFB800] mb-2">ℹ️ Como Funciona o AI Adaptive Firewall</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• <strong>Aprendizado Contínuo:</strong> Analisa cada requisição e ajusta limites automaticamente</li>
          <li>• <strong>Sistema de Pontos de Risco:</strong> IPs ganham/perdem pontos baseado em comportamento</li>
          <li>• <strong>Modo Adaptativo:</strong> Ajusta rate limits baseado em padrões de tráfego normais</li>
          <li>• <strong>Learning Only:</strong> Registra sem bloquear (ideal para testes)</li>
          <li>• <strong>Compatível com WAF Externos:</strong> Funciona junto com Cloudflare, CSF, iptables</li>
          <li>• <strong>Auto-ajuste:</strong> Reduz sensibilidade se detectar muitos falsos positivos</li>
          <li>• <strong>Precisão IA:</strong> Melhora com o tempo conforme aprende padrões</li>
        </ul>
      </Card>
    </div>
  );
}
