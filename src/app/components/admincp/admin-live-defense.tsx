import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ShieldAlert, Info } from "lucide-react";

/**
 * 🛡️ LIVE DEFENSE - PLACEHOLDER V573
 * Funcionalidade desabilitada temporariamente
 */

export function AdminLiveDefense() {
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
                Módulo de Defesa em Tempo Real Desabilitado
              </h3>
              <p className="text-sm text-yellow-200/80 mb-3">
                O sistema de defesa ativa requer infraestrutura adicional de monitoramento.
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
        <ShieldAlert className="w-8 h-8 text-red-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Live Defense System</h2>
          <p className="text-sm text-gray-400 mt-1">
            Sistema de defesa ativa contra ameaças em tempo real
          </p>
        </div>
      </div>

      {/* Manual Defense Options */}
      <Card className="p-6 bg-black/40 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Opções de Defesa Manual</h3>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-black/20">
            <h4 className="font-semibold text-white mb-2">Bloquear IP via Firewall:</h4>
            <div className="bg-black/40 p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
              <p className="mb-2"># UFW (Ubuntu)</p>
              <p className="mb-4">sudo ufw deny from 192.168.1.100</p>
              
              <p className="mb-2"># Firewalld (CentOS/RHEL)</p>
              <p className="mb-4">sudo firewall-cmd --add-rich-rule="rule family='ipv4' source address='192.168.1.100' reject"</p>
              
              <p className="mb-2"># IPTables</p>
              <p>sudo iptables -A INPUT -s 192.168.1.100 -j DROP</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-black/20">
            <h4 className="font-semibold text-white mb-2">Fail2Ban (Recomendado):</h4>
            <div className="bg-black/40 p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
              <p className="mb-2"># Instalar Fail2Ban</p>
              <p className="mb-4">sudo apt install fail2ban</p>
              
              <p className="mb-2"># Ver IPs banidos</p>
              <p className="mb-4">sudo fail2ban-client status sshd</p>
              
              <p className="mb-2"># Desbanir IP</p>
              <p>sudo fail2ban-client set sshd unbanip 192.168.1.100</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Defense Features (Planned) */}
      <Card className="p-6 bg-black/40 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Recursos Planejados</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            title="Blacklist Automática"
            description="IPs suspeitos bloqueados automaticamente"
            status="planned"
          />
          <FeatureCard
            title="Whitelist Inteligente"
            description="IPs confiáveis sempre permitidos"
            status="planned"
          />
          <FeatureCard
            title="Rate Limiting Dinâmico"
            description="Limites ajustados em tempo real"
            status="planned"
          />
          <FeatureCard
            title="Alertas em Tempo Real"
            description="Notificações de ameaças detectadas"
            status="planned"
          />
        </div>
      </Card>

      {/* Current Protection Status */}
      <Card className="p-6 bg-green-500/10 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Proteções Ativas</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-green-200/80">
          <li>Rate Limiting: 1000 requisições/minuto (backend)</li>
          <li>Helmet Security Headers ativos</li>
          <li>CORS configurado corretamente</li>
          <li>JWT Authentication obrigatória</li>
          <li>XSS Protection ativa</li>
          <li>SQL Injection Protection (Prepared Statements)</li>
        </ul>
      </Card>
    </div>
  );
}

// Helper Component
interface FeatureCardProps {
  title: string;
  description: string;
  status: 'active' | 'planned' | 'disabled';
}

function FeatureCard({ title, description, status }: FeatureCardProps) {
  return (
    <div className="p-4 rounded-lg bg-black/20 border border-gray-700/30">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-white">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded ${
          status === 'active' ? 'bg-green-500/20 text-green-400' :
          status === 'planned' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {status === 'active' && '✅ Ativo'}
          {status === 'planned' && '🔜 Planejado'}
          {status === 'disabled' && '❌ Desabilitado'}
        </span>
      </div>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}
