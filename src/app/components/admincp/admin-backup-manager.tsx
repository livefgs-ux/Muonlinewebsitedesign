import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Download, Database, Info, AlertCircle } from "lucide-react";

/**
 * 📦 BACKUP MANAGER - PLACEHOLDER V573
 * Funcionalidade desabilitada temporariamente
 */

export function AdminBackupManager() {
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
                Módulo de Backup Desabilitado
              </h3>
              <p className="text-sm text-yellow-200/80 mb-3">
                O sistema de backup automático requer configuração adicional no servidor.
                Por enquanto, recomendamos usar backups manuais via phpMyAdmin ou mysqldump.
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
        <Database className="w-8 h-8 text-[#FFB800]" />
        <div>
          <h2 className="text-2xl font-bold text-white">Backup Manager</h2>
          <p className="text-sm text-gray-400 mt-1">
            Sistema de backup e recuperação de banco de dados
          </p>
        </div>
      </div>

      {/* Manual Backup Instructions */}
      <Card className="p-6 bg-black/40 border border-gray-700/30">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Backup Manual</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-black/20">
            <h4 className="font-semibold text-white mb-2">Via phpMyAdmin:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Acesse phpMyAdmin (geralmente em https://meumu.com:8090/phpmyadmin)</li>
              <li>Selecione o banco de dados 'muonline' ou 'meuweb'</li>
              <li>Clique na aba "Exportar"</li>
              <li>Escolha o formato SQL</li>
              <li>Clique em "Executar"</li>
            </ol>
          </div>

          <div className="p-4 rounded-lg bg-black/20">
            <h4 className="font-semibold text-white mb-2">Via Linha de Comando:</h4>
            <div className="bg-black/40 p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
              <p className="mb-2"># Backup do muonline</p>
              <p className="mb-4">mysqldump -u root muonline &gt; backup_muonline_$(date +%Y%m%d).sql</p>
              
              <p className="mb-2"># Backup do meuweb</p>
              <p>mysqldump -u root meuweb &gt; backup_meuweb_$(date +%Y%m%d).sql</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-black/20">
            <h4 className="font-semibold text-white mb-2">Restaurar Backup:</h4>
            <div className="bg-black/40 p-3 rounded font-mono text-xs text-green-400 overflow-x-auto">
              <p className="mb-2"># Restaurar muonline</p>
              <p className="mb-4">mysql -u root muonline &lt; backup_muonline_20250130.sql</p>
              
              <p className="mb-2"># Restaurar meuweb</p>
              <p>mysql -u root meuweb &lt; backup_meuweb_20250130.sql</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6 bg-purple-500/10 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-purple-400 mb-2">Recomendações</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-purple-200/80">
              <li>Faça backups diários do banco de dados</li>
              <li>Mantenha pelo menos 7 dias de backups históricos</li>
              <li>Armazene backups em local seguro fora do servidor</li>
              <li>Teste a restauração periodicamente</li>
              <li>Use compressão gzip para economizar espaço: <code className="bg-black/40 px-2 py-1 rounded text-xs">mysqldump ... | gzip &gt; backup.sql.gz</code></li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
