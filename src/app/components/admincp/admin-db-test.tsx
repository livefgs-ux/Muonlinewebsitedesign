import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Database, CheckCircle, AlertCircle, Loader2, Activity } from "lucide-react";

/**
 * 🧪 DATABASE CONNECTION TEST - V573
 * Testa conexão com banco de dados MariaDB
 */

interface TestResult {
  success: boolean;
  message: string;
  database?: string;
  responseTime?: number;
  error?: string;
}

export function AdminDbTest() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testCurrentConnection = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const startTime = performance.now();
      
      const res = await fetch(`${API_URL}/health`);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      const data = await res.json();
      
      if (data.database === 'connected') {
        setTestResult({
          success: true,
          message: 'Conexão com banco de dados OK',
          database: 'MuOnline / MeuWeb',
          responseTime
        });
      } else {
        setTestResult({
          success: false,
          message: 'Falha na conexão com banco de dados',
          error: 'Database disconnected',
          responseTime
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Erro ao testar conexão',
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-[#FFB800]" />
        <h2 className="text-2xl font-bold text-white">Database Connection Test</h2>
      </div>

      {/* Test Current Connection */}
      <Card className="p-6 bg-black/40 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Testar Conexão Atual</h3>
        <p className="text-sm text-gray-400 mb-4">
          Verifica se o backend consegue conectar aos bancos de dados MuOnline e MeuWeb
        </p>
        
        <Button
          onClick={testCurrentConnection}
          disabled={isLoading}
          className="bg-[#FFB800]/20 hover:bg-[#FFB800]/30 text-[#FFB800] border border-[#FFB800]/30"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testando...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Testar Conexão Atual
            </>
          )}
        </Button>
      </Card>

      {/* Test Result */}
      {testResult && (
        <Card className={`p-6 ${
          testResult.success 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-start gap-4">
            {testResult.success ? (
              <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
            )}
            
            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-2 ${
                testResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {testResult.message}
              </h3>
              
              <div className="space-y-2 text-sm">
                {testResult.database && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                    <span className="text-gray-400">Banco de Dados:</span>
                    <span className="text-white font-mono">{testResult.database}</span>
                  </div>
                )}
                
                {testResult.responseTime && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                    <span className="text-gray-400">Tempo de Resposta:</span>
                    <span className={`font-mono ${
                      testResult.responseTime < 100 ? 'text-green-400' :
                      testResult.responseTime < 500 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {testResult.responseTime}ms
                    </span>
                  </div>
                )}
                
                {testResult.error && (
                  <div className="p-3 rounded-lg bg-black/20">
                    <span className="text-gray-400">Erro:</span>
                    <p className="text-red-400 font-mono text-xs mt-1">{testResult.error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Connection Info */}
      <Card className="p-6 bg-black/40 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Informações de Conexão</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
            <span className="text-gray-400">Host:</span>
            <span className="text-white font-mono">localhost</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
            <span className="text-gray-400">Porta:</span>
            <span className="text-white font-mono">3306</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
            <span className="text-gray-400">Usuário:</span>
            <span className="text-white font-mono">webuser</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
            <span className="text-gray-400">Databases:</span>
            <span className="text-white font-mono">muonline, meuweb</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
            <span className="text-gray-400">Engine:</span>
            <span className="text-white font-mono">MariaDB 10.x</span>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6 bg-blue-500/10 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">💡 Dicas de Troubleshooting</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-blue-200/80">
          <li>Se a conexão falhar, verifique se o MySQL/MariaDB está rodando: <code className="bg-black/40 px-2 py-1 rounded text-xs">systemctl status mariadb</code></li>
          <li>Verifique as credenciais no arquivo <code className="bg-black/40 px-2 py-1 rounded text-xs">/backend-nodejs/.env</code></li>
          <li>Confirme que o usuário 'webuser' tem permissões corretas</li>
          <li>Teste conexão manual: <code className="bg-black/40 px-2 py-1 rounded text-xs">mysql -u webuser -p</code></li>
          <li>Verifique logs do backend: <code className="bg-black/40 px-2 py-1 rounded text-xs">pm2 logs meumu-backend</code></li>
        </ul>
      </Card>
    </div>
  );
}
