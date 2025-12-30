import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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
  Info
} from "lucide-react";

/**
 * ⚠️ AI ADAPTIVE FIREWALL - FUNCIONALIDADE DESABILITADA
 * 
 * Este módulo requer infraestrutura adicional de edge functions
 * que não está disponível no backend Node.js atual.
 * 
 * Status: PLACEHOLDER (não funcional)
 */

export function AdminAdaptiveFirewall() {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {showInfo && (
        <Card className="p-6 bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">
                Módulo AI Firewall Desabilitado
              </h3>
              <p className="text-sm text-yellow-200/80 mb-3">
                O módulo de Firewall Adaptativo com IA requer infraestrutura adicional de edge functions
                que não está disponível na arquitetura atual do backend Node.js. Esta funcionalidade
                será implementada em uma versão futura.
              </p>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setShowInfo(false)}
                  size="sm"
                  className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-500/30"
                >
                  Entendi
                </Button>
                <span className="text-xs text-yellow-400/70">
                  Versão estimada: V580+
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10">
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Adaptive Firewall</h2>
            <p className="text-sm text-gray-400 mt-1">
              Firewall inteligente com aprendizado automático de padrões
            </p>
          </div>
        </div>
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
          INDISPONÍVEL
        </Badge>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          icon={Shield}
          title="Proteção Adaptativa"
          description="Rate limiting dinâmico baseado em comportamento"
          status="planned"
        />
        <FeatureCard
          icon={Brain}
          title="Aprendizado de Máquina"
          description="Sistema aprende padrões normais vs. suspeitos"
          status="planned"
        />
        <FeatureCard
          icon={Activity}
          title="Detecção em Tempo Real"
          description="Análise instantânea de requisições"
          status="planned"
        />
        <FeatureCard
          icon={TrendingUp}
          title="Auto-Ajuste"
          description="Limites ajustados automaticamente"
          status="planned"
        />
        <FeatureCard
          icon={BarChart3}
          title="Estatísticas Detalhadas"
          description="Métricas de acurácia e eficiência"
          status="planned"
        />
        <FeatureCard
          icon={Clock}
          title="Histórico de Ataques"
          description="Registro completo de tentativas bloqueadas"
          status="planned"
        />
      </div>

      {/* Placeholder Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="IPs Rastreados"
          value="0"
          icon={Shield}
          color="text-blue-400"
          disabled
        />
        <StatCard
          label="Taxa de Acerto"
          value="0%"
          icon={CheckCircle}
          color="text-green-400"
          disabled
        />
        <StatCard
          label="Ameaças Bloqueadas"
          value="0"
          icon={AlertCircle}
          color="text-red-400"
          disabled
        />
        <StatCard
          label="Ajustes Automáticos"
          value="0"
          icon={Zap}
          color="text-yellow-400"
          disabled
        />
      </div>

      {/* Roadmap */}
      <Card className="p-6 bg-black/40 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Implementação Futura</h3>
        </div>
        <div className="space-y-3">
          <RoadmapItem
            title="Fase 1: Coleta de Dados"
            description="Implementar sistema de logging de requisições e IPs"
            status="pending"
          />
          <RoadmapItem
            title="Fase 2: Análise de Padrões"
            description="Desenvolver algoritmo de detecção de anomalias"
            status="pending"
          />
          <RoadmapItem
            title="Fase 3: Sistema de Bans Automáticos"
            description="Integrar com sistema de bans existente"
            status="pending"
          />
          <RoadmapItem
            title="Fase 4: Dashboard e Configuração"
            description="Interface completa de gerenciamento"
            status="pending"
          />
        </div>
      </Card>
    </div>
  );
}

// ========================================
// Componentes Auxiliares
// ========================================

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  status: 'planned' | 'active' | 'disabled';
}

function FeatureCard({ icon: Icon, title, description, status }: FeatureCardProps) {
  return (
    <Card className="p-4 bg-black/40 border border-gray-700/30 opacity-60">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-gray-500/10">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
          <p className="text-xs text-gray-400">{description}</p>
          <Badge className="mt-2 bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
            {status === 'planned' && '🔜 Planejado'}
            {status === 'active' && '✅ Ativo'}
            {status === 'disabled' && '❌ Desabilitado'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: any;
  color: string;
  disabled?: boolean;
}

function StatCard({ label, value, icon: Icon, color, disabled }: StatCardProps) {
  return (
    <Card className={`p-4 bg-black/40 border border-gray-700/30 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${disabled ? 'text-gray-500' : color}`} />
        {disabled && (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
            N/A
          </Badge>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </Card>
  );
}

interface RoadmapItemProps {
  title: string;
  description: string;
  status: 'pending' | 'progress' | 'done';
}

function RoadmapItem({ title, description, status }: RoadmapItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        status === 'done' ? 'bg-green-500/20' :
        status === 'progress' ? 'bg-yellow-500/20' :
        'bg-gray-500/20'
      }`}>
        {status === 'done' && <CheckCircle className="w-4 h-4 text-green-400" />}
        {status === 'progress' && <Clock className="w-4 h-4 text-yellow-400" />}
        {status === 'pending' && <div className="w-2 h-2 rounded-full bg-gray-400" />}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}
