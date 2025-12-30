import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Sparkles, Info, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

/**
 * 🎯 SECURITY DASHBOARD - PLACEHOLDER V573
 * Funcionalidade desabilitada temporariamente
 */

export function AdminSecurityDashboard() {
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
                Dashboard de Segurança Desabilitado
              </h3>
              <p className="text-sm text-yellow-200/80 mb-3">
                O dashboard unificado de segurança requer infraestrutura adicional.
                Use as outras abas do Sistema para monitoramento manual.
              </p>
              <Button 
                onClick={() => setShowInfo(false)}
                size="sm"
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-500/30"
              >
                Entendi
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Security Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">
            Visão geral unificada de segurança do sistema
          </p>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          icon={Shield}
          title="Sistema Protegido"
          description="Backend com 20 proteções ativas"
          status="good"
        />
        <StatusCard
          icon={CheckCircle}
          title="Database Seguro"
          description="Usuário dedicado com permissões limitadas"
          status="good"
        />
        <StatusCard
          icon={AlertTriangle}
          title="Monitoramento Manual"
          description="Verificação manual recomendada"
          status="warning"
        />
      </div>

      {/* Active Protections */}
      <Card className="p-6 bg-black/40 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">🛡️ Proteções Ativas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ProtectionItem name="Rate Limiting" status="active" />
          <ProtectionItem name="Helmet Security Headers" status="active" />
          <ProtectionItem name="CORS Protection" status="active" />
          <ProtectionItem name="JWT Authentication" status="active" />
          <ProtectionItem name="XSS Protection" status="active" />
          <ProtectionItem name="SQL Injection Protection" status="active" />
          <ProtectionItem name="HTTPS/TLS" status="active" />
          <ProtectionItem name="HSTS Headers" status="active" />
          <ProtectionItem name="CSP Headers" status="active" />
          <ProtectionItem name="NoSniff Protection" status="active" />
          <ProtectionItem name="Request Validation" status="active" />
          <ProtectionItem name="Input Sanitization" status="active" />
          <ProtectionItem name="Prepared Statements" status="active" />
          <ProtectionItem name="Error Handler" status="active" />
          <ProtectionItem name="Least Privilege DB User" status="active" />
          <ProtectionItem name="Environment Variables" status="active" />
          <ProtectionItem name="Compression" status="active" />
          <ProtectionItem name="Graceful Shutdown" status="active" />
          <ProtectionItem name="Admin Auth Required" status="active" />
          <ProtectionItem name="Token Expiration" status="active" />
        </div>
      </Card>

      {/* Monitoring Recommendations */}
      <Card className="p-6 bg-blue-500/10 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Recomendações de Monitoramento</h3>
        <div className="space-y-2 text-sm text-blue-200/80">
          <p>✓ Revise logs de segurança diariamente</p>
          <p>✓ Monitore tentativas de login falhadas</p>
          <p>✓ Verifique conexões de banco de dados suspeitas</p>
          <p>✓ Acompanhe uso de recursos (CPU, memória, disco)</p>
          <p>✓ Teste backups semanalmente</p>
          <p>✓ Mantenha sistema operacional atualizado</p>
          <p>✓ Use Fail2Ban para proteção contra força bruta</p>
          <p>✓ Configure alertas de email para eventos críticos</p>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-black/40 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            disabled
          >
            Executar Auditoria
          </Button>
          <Button
            variant="outline"
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            disabled
          >
            Ver Logs de Segurança
          </Button>
          <Button
            variant="outline"
            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
            disabled
          >
            Testar Backup
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Funcionalidades automáticas disponíveis em versão futura
        </p>
      </Card>
    </div>
  );
}

// Helper Components
interface StatusCardProps {
  icon: any;
  title: string;
  description: string;
  status: 'good' | 'warning' | 'error';
}

function StatusCard({ icon: Icon, title, description, status }: StatusCardProps) {
  const colors = {
    good: 'border-green-500/30 bg-green-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    error: 'border-red-500/30 bg-red-500/10'
  };

  const iconColors = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  };

  return (
    <Card className={`p-4 ${colors[status]}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${iconColors[status]} flex-shrink-0`} />
        <div>
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
    </Card>
  );
}

interface ProtectionItemProps {
  name: string;
  status: 'active' | 'inactive';
}

function ProtectionItem({ name, status }: ProtectionItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded bg-black/20">
      {status === 'active' ? (
        <CheckCircle className="w-4 h-4 text-green-400" />
      ) : (
        <XCircle className="w-4 h-4 text-red-400" />
      )}
      <span className="text-sm text-gray-300">{name}</span>
    </div>
  );
}
