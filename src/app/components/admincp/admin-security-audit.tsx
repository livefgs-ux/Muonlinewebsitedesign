import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Shield, Info } from "lucide-react";

/**
 * 🔒 SECURITY AUDIT - PLACEHOLDER V573
 * Funcionalidade desabilitada temporariamente
 */

export function AdminSecurityAudit() {
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
                Módulo de Auditoria de Segurança Desabilitado
              </h3>
              <p className="text-sm text-yellow-200/80 mb-3">
                A auditoria automática de segurança requer infraestrutura adicional.
                Esta funcionalidade será implementada em uma versão futura.
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
        <Shield className="w-8 h-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Security Audit</h2>
          <p className="text-sm text-gray-400 mt-1">
            Auditoria automática de segurança do sistema
          </p>
        </div>
      </div>

      {/* Manual Security Checklist */}
      <Card className="p-6 bg-black/40 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Checklist Manual de Segurança</h3>
        
        <div className="space-y-3">
          <SecurityCheckItem
            title="Firewall Configurado"
            description="Verificar se UFW/Firewalld está ativo e configurado"
            status="manual"
          />
          <SecurityCheckItem
            title="Senha Root MySQL"
            description="Senha forte e não padrão configurada"
            status="manual"
          />
          <SecurityCheckItem
            title="SSL/TLS Ativo"
            description="HTTPS funcionando com certificado válido"
            status="manual"
          />
          <SecurityCheckItem
            title="Backup Automático"
            description="Backups diários configurados"
            status="manual"
          />
          <SecurityCheckItem
            title="Rate Limiting"
            description="Proteção contra spam/DDoS ativa"
            status="manual"
          />
          <SecurityCheckItem
            title="Logs Monitorados"
            description="Logs de segurança sendo revisados"
            status="manual"
          />
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6 bg-blue-500/10 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Recomendações de Segurança</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-blue-200/80">
          <li>Mantenha o sistema operacional atualizado</li>
          <li>Use senhas fortes e únicas para cada serviço</li>
          <li>Ative autenticação de dois fatores quando possível</li>
          <li>Revise logs de segurança regularmente</li>
          <li>Faça backups frequentes e teste restauração</li>
          <li>Mantenha apenas portas necessárias abertas no firewall</li>
          <li>Use fail2ban para proteção contra força bruta</li>
        </ul>
      </Card>
    </div>
  );
}

// Helper Component
interface SecurityCheckItemProps {
  title: string;
  description: string;
  status: 'pass' | 'fail' | 'manual';
}

function SecurityCheckItem({ title, description, status }: SecurityCheckItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        status === 'pass' ? 'bg-green-500/20' :
        status === 'fail' ? 'bg-red-500/20' :
        'bg-gray-500/20'
      }`}>
        <span className={`text-sm ${
          status === 'pass' ? 'text-green-400' :
          status === 'fail' ? 'text-red-400' :
          'text-gray-400'
        }`}>
          {status === 'pass' ? '✓' : status === 'fail' ? '✗' : '?'}
        </span>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}
