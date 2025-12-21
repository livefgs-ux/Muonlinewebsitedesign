import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Database, CheckCircle, AlertCircle, Loader2, Activity } from "lucide-react";
import { backendUrl, getAuthHeaders } from '../../config/backend';

interface ConnectionResult {
  ok: boolean;
  message: string;
  details?: {
    host?: string;
    database?: string;
    responseTime?: number;
    serverVersion?: string;
  };
}

export function AdminDbTest() {
  const [status, setStatus] = useState<ConnectionResult | null>(null);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [host, setHost] = useState("");
  const [database, setDatabase] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setStatus(null);
    
    try {
      const startTime = performance.now();
      const res = await fetch(`${backendUrl}/functions/v1/make-server-4169bd43/system/test-db`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ 
          user: user || undefined, 
          pass: pass || undefined,
          host: host || undefined,
          database: database || undefined
        }),
      });
      const endTime = performance.now();
      const data = await res.json();
      
      setStatus({
        ...data,
        details: {
          ...data.details,
          responseTime: Math.round(endTime - startTime)
        }
      });
    } catch (err) {
      setStatus({
        ok: false,
        message: `❌ Erro ao testar conexão: ${err}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testCurrentConnection = async () => {
    setIsLoading(true);
    setStatus(null);
    
    try {
      const startTime = performance.now();
      const res = await fetch(`${backendUrl}/functions/v1/make-server-4169bd43/system/test-current-db`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders()
        }
      });
      const endTime = performance.now();
      const data = await res.json();
      
      setStatus({
        ...data,
        details: {
          ...data.details,
          responseTime: Math.round(endTime - startTime)
        }
      });
    } catch (err) {
      setStatus({
        ok: false,
        message: `❌ Erro ao testar conexão: ${err}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-black/40 border border-[#FFB800]/20 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-[#FFB800]" />
        <h2 className="text-2xl font-bold text-white">Database Connection Test</h2>
      </div>

      <div className="space-y-6">
        {/* Teste Rápido da Conexão Atual */}
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
          <h3 className="text-sm font-semibold text-blue-400 mb-3">🚀 Teste Rápido</h3>
          <p className="text-xs text-gray-400 mb-3">
            Testa a conexão atual do servidor com o banco de dados MySQL do Mu Online
          </p>
          <Button 
            onClick={testCurrentConnection}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testando conexão atual...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Testar Conexão Atual
              </>
            )}
          </Button>
        </div>

        {/* Divisor */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-500">Ou teste com credenciais customizadas</span>
          </div>
        </div>

        {/* Formulário de Credenciais Customizadas */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-semibold">
              Host do Banco de Dados
            </label>
            <Input 
              placeholder="localhost ou IP (deixe vazio para usar o padrão)" 
              value={host} 
              onChange={e => setHost(e.target.value)}
              className="bg-black/60 border-[#FFB800]/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2 font-semibold">
              Nome do Banco de Dados
            </label>
            <Input 
              placeholder="MuOnline (deixe vazio para usar o padrão)" 
              value={database} 
              onChange={e => setDatabase(e.target.value)}
              className="bg-black/60 border-[#FFB800]/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2 font-semibold">
              Usuário do Banco
            </label>
            <Input 
              placeholder="root (deixe vazio para usar o padrão)" 
              value={user} 
              onChange={e => setUser(e.target.value)}
              className="bg-black/60 border-[#FFB800]/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2 font-semibold">
              Senha do Banco
            </label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={pass} 
              onChange={e => setPass(e.target.value)}
              className="bg-black/60 border-[#FFB800]/30 text-white"
            />
          </div>

          <Button 
            onClick={testConnection}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#FFB800] to-[#FF8800] hover:from-[#FF8800] hover:to-[#FFB800] text-black font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Testar Conexão Customizada
              </>
            )}
          </Button>
        </div>

        {/* Resultado do Teste */}
        {status && (
          <div className={`p-5 rounded-lg border-2 ${
            status.ok 
              ? 'bg-green-500/10 border-green-500/50' 
              : 'bg-red-500/10 border-red-500/50'
          }`}>
            <div className="flex items-start gap-3 mb-3">
              {status.ok ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${status.ok ? 'text-green-300' : 'text-red-300'}`}>
                  {status.message}
                </p>
              </div>
            </div>

            {/* Detalhes da Conexão */}
            {status.details && (
              <div className="mt-4 p-4 bg-black/40 rounded border border-gray-700">
                <h4 className="text-xs font-semibold text-gray-400 mb-2">Detalhes da Conexão:</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {status.details.host && (
                    <div>
                      <span className="text-gray-500">Host:</span>
                      <span className="text-white ml-2 font-mono">{status.details.host}</span>
                    </div>
                  )}
                  {status.details.database && (
                    <div>
                      <span className="text-gray-500">Database:</span>
                      <span className="text-white ml-2 font-mono">{status.details.database}</span>
                    </div>
                  )}
                  {status.details.responseTime && (
                    <div>
                      <span className="text-gray-500">Tempo de Resposta:</span>
                      <span className="text-green-400 ml-2 font-mono">{status.details.responseTime}ms</span>
                    </div>
                  )}
                  {status.details.serverVersion && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Versão do MySQL:</span>
                      <span className="text-blue-400 ml-2 font-mono">{status.details.serverVersion}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informações de Segurança */}
        <div className="p-4 bg-black/60 rounded-lg border border-gray-700">
          <h3 className="text-sm font-semibold text-[#FFB800] mb-2">🔒 Informações de Segurança</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• As credenciais testadas NÃO são armazenadas</li>
            <li>• Use apenas para diagnóstico e testes</li>
            <li>• A conexão atual usa variáveis de ambiente seguras</li>
            <li>• Credenciais customizadas são usadas apenas para este teste</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}