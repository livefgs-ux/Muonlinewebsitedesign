// Componente visual para configurar conexão com MySQL
import { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ConnectionStatus {
  connected: boolean;
  message: string;
  stats?: {
    playersOnline: number;
    totalAccounts: number;
    totalCharacters: number;
    totalGuilds: number;
  };
}

export function DatabaseConnectionSetup() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    
    try {
      // Testa endpoint de teste
      const response = await fetch(`${API_BASE_URL}/api/test-connection`);
      const data = await response.json();
      
      if (data.success) {
        // Se conectou, busca estatísticas
        const statsResponse = await fetch(`${API_BASE_URL}/api/stats/server`);
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStatus({
            connected: true,
            message: 'Conectado ao MySQL com sucesso!',
            stats: statsData.data
          });
        } else {
          setStatus({
            connected: true,
            message: 'Conectado, mas erro ao buscar estatísticas'
          });
        }
      } else {
        setStatus({
          connected: false,
          message: data.message || 'Falha ao conectar com MySQL'
        });
      }
    } catch (error) {
      setStatus({
        connected: false,
        message: 'Erro: Servidor backend não está rodando. Execute: npm run server'
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-gold)]/10 to-transparent p-6 rounded-t-2xl border border-[var(--color-gold)]/30">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8 text-[var(--color-gold)]" />
          <h1 className="text-3xl font-black text-white">Configuração do MySQL</h1>
        </div>
        <p className="text-gray-400">Configure a conexão com o banco de dados do MU Online</p>
      </div>

      <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl border border-[var(--color-gold)]/30 border-t-0 rounded-b-2xl p-6">
        
        {/* Status da Conexão */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Status da Conexão</h2>
            <button
              onClick={testConnection}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-gold)]/20 hover:bg-[var(--color-gold)]/30 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-semibold">Testar Conexão</span>
            </button>
          </div>

          {status && (
            <div className={`p-4 rounded-lg border ${
              status.connected 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start gap-3">
                {status.connected ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${status.connected ? 'text-green-400' : 'text-red-400'}`}>
                    {status.message}
                  </p>
                  
                  {status.stats && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard label="Players Online" value={status.stats.playersOnline} />
                      <StatCard label="Contas" value={status.stats.totalAccounts} />
                      <StatCard label="Personagens" value={status.stats.totalCharacters} />
                      <StatCard label="Guilds" value={status.stats.totalGuilds} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instruções Passo a Passo */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Passo a Passo</h2>

          {/* Passo 1 */}
          <StepCard
            number={1}
            title="Configure o arquivo .env"
            description="Edite o arquivo .env na raiz do projeto com as credenciais do MySQL"
            code={`DB_HOST=192.168.1.100
DB_PORT=3306
DB_USER=sa
DB_PASSWORD=sua_senha
DB_NAME=MuOnline`}
          />

          {/* Passo 2 */}
          <StepCard
            number={2}
            title="Teste a conexão"
            description="Execute o comando para verificar se consegue conectar"
            command="npm run test:db"
          />

          {/* Passo 3 */}
          <StepCard
            number={3}
            title="Inicie o servidor backend"
            description="Depois que o teste passar, inicie a API"
            command="npm run server"
          />

          {/* Passo 4 */}
          <StepCard
            number={4}
            title="Verifique o site"
            description="Clique em 'Testar Conexão' acima para verificar se tudo está funcionando"
          />
        </div>

        {/* Troubleshooting */}
        {status && !status.connected && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-400 mb-2">Problemas Comuns</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• <strong>Backend não rodando:</strong> Execute <code className="bg-black/30 px-2 py-1 rounded">npm run server</code></li>
                  <li>• <strong>Credenciais erradas:</strong> Verifique usuário/senha no arquivo <code className="bg-black/30 px-2 py-1 rounded">.env</code></li>
                  <li>• <strong>MySQL offline:</strong> Inicie o serviço MySQL no servidor</li>
                  <li>• <strong>Firewall bloqueando:</strong> Libere porta 3306 no firewall</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Link para documentação completa */}
        <div className="mt-6 p-4 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 rounded-lg">
          <p className="text-sm text-gray-300">
            📖 Para instruções detalhadas, consulte o arquivo{' '}
            <code className="bg-black/30 px-2 py-1 rounded text-[var(--color-gold)]">
              GUIA_CONEXAO_MYSQL.md
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente de Card de Estatística
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-black/40 p-3 rounded-lg border border-white/10">
      <div className="text-2xl font-black text-[var(--color-gold)]">
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  );
}

// Componente de Card de Passo
function StepCard({ 
  number, 
  title, 
  description, 
  code, 
  command 
}: { 
  number: number; 
  title: string; 
  description: string; 
  code?: string;
  command?: string;
}) {
  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-[var(--color-gold)] text-black font-black flex items-center justify-center flex-shrink-0">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400 mb-3">{description}</p>
          
          {code && (
            <pre className="bg-black/60 p-3 rounded text-xs text-green-400 overflow-x-auto">
              <code>{code}</code>
            </pre>
          )}
          
          {command && (
            <div className="bg-black/60 p-3 rounded">
              <code className="text-sm text-[var(--color-gold)]">{command}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
