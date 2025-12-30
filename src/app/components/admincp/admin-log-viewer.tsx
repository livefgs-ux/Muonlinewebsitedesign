import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FileText, Info } from "lucide-react";

/**
 * 📜 LOG VIEWER - PLACEHOLDER V573
 * Funcionalidade desabilitada temporariamente
 */

export function AdminLogViewer() {
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
                Módulo de Logs Desabilitado
              </h3>
              <p className="text-sm text-yellow-200/80 mb-3">
                O visualizador de logs requer implementação de endpoint no backend.
                Por enquanto, use PM2 ou arquivos de log diretos.
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
        <FileText className="w-8 h-8 text-[#FFB800]" />
        <div>
          <h2 className="text-2xl font-bold text-white">System Logs</h2>
          <p className="text-sm text-gray-400 mt-1">
            Visualização e gerenciamento de logs do sistema
          </p>
        </div>
      </div>

      {/* Manual Access Instructions */}
      <Card className="p-6 bg-black/40 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Acessar Logs Manualmente</h3>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-black/20">
            <h4 className="font-semibold text-white mb-2">Via PM2:</h4>
            <div className="bg-black/40 p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
              <p className="mb-2"># Ver logs em tempo real</p>
              <p className="mb-4">pm2 logs meumu-backend --lines 100</p>
              
              <p className="mb-2"># Ver logs de erro</p>
              <p className="mb-4">pm2 logs meumu-backend --err</p>
              
              <p className="mb-2"># Limpar logs</p>
              <p>pm2 flush</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-black/20">
            <h4 className="font-semibold text-white mb-2">Via Arquivos:</h4>
            <div className="bg-black/40 p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
              <p className="mb-2"># Backend logs</p>
              <p className="mb-4">tail -f /home/meumu.com/public_html/backend-nodejs/logs/server.log</p>
              
              <p className="mb-2"># Security logs</p>
              <p className="mb-4">tail -f /home/meumu.com/public_html/backend-nodejs/logs/security/*.log</p>
              
              <p className="mb-2"># Audit logs</p>
              <p>tail -f /home/meumu.com/public_html/backend-nodejs/logs/audit/*.log</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Log Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-black/40 border border-blue-500/30">
          <h4 className="font-semibold text-blue-400 mb-2">Backend Logs</h4>
          <p className="text-sm text-gray-400">Logs do servidor Node.js</p>
          <p className="text-xs text-gray-500 mt-2 font-mono">/logs/server.log</p>
        </Card>

        <Card className="p-4 bg-black/40 border border-red-500/30">
          <h4 className="font-semibold text-red-400 mb-2">Security Logs</h4>
          <p className="text-sm text-gray-400">Tentativas de ataque, bans</p>
          <p className="text-xs text-gray-500 mt-2 font-mono">/logs/security/*.log</p>
        </Card>

        <Card className="p-4 bg-black/40 border border-purple-500/30">
          <h4 className="font-semibold text-purple-400 mb-2">Audit Logs</h4>
          <p className="text-sm text-gray-400">Ações administrativas</p>
          <p className="text-xs text-gray-500 mt-2 font-mono">/logs/audit/*.log</p>
        </Card>
      </div>
    </div>
  );
}
