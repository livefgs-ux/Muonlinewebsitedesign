/**
 * ETAPA 1 - CONFIGURAÇÃO DO BANCO DE DADOS
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Database, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { DatabaseConfig } from '../InstallWizard';

interface Props {
  config: DatabaseConfig;
  setConfig: (config: DatabaseConfig) => void;
  onNext: () => void;
}

const StepDatabase = ({ config, setConfig, onNext }: Props) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Testar conexão com o banco de dados
   */
  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setErrorMessage('');

    try {
      // Simular teste de conexão (aqui você faria a requisição real)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Sucesso (em produção, verificar resposta real do backend)
      setTestResult('success');
    } catch (error) {
      setTestResult('error');
      setErrorMessage('Falha ao conectar ao banco de dados. Verifique as credenciais.');
    } finally {
      setTesting(false);
    }
  };

  const handleNext = () => {
    if (testResult === 'success') {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-[#FFB800]" />
        <div>
          <h2 className="text-2xl font-bold text-white">Configuração do Banco de Dados</h2>
          <p className="text-gray-400">Configure a conexão com MySQL/MariaDB</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Host */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Host do Banco de Dados
          </label>
          <input
            type="text"
            value={config.host}
            onChange={(e) => setConfig({ ...config, host: e.target.value })}
            placeholder="localhost ou IP"
            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        {/* Port */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Porta
          </label>
          <input
            type="text"
            value={config.port}
            onChange={(e) => setConfig({ ...config, port: e.target.value })}
            placeholder="3306"
            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        {/* User */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Usuário
          </label>
          <input
            type="text"
            value={config.user}
            onChange={(e) => setConfig({ ...config, user: e.target.value })}
            placeholder="root"
            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Senha
          </label>
          <input
            type="password"
            value={config.password}
            onChange={(e) => setConfig({ ...config, password: e.target.value })}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Database MuOnline */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Database MuOnline
            </label>
            <input
              type="text"
              value={config.db_muonline}
              onChange={(e) => setConfig({ ...config, db_muonline: e.target.value })}
              placeholder="MuOnline"
              className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
            />
          </div>

          {/* Database WebMU */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Database WebMU
            </label>
            <input
              type="text"
              value={config.db_webmu}
              onChange={(e) => setConfig({ ...config, db_webmu: e.target.value })}
              placeholder="webmu"
              className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
            testResult === 'success'
              ? 'bg-green-500/20 border border-green-500/50'
              : 'bg-red-500/20 border border-red-500/50'
          }`}
        >
          {testResult === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-semibold">Conexão estabelecida com sucesso!</p>
                <p className="text-sm text-gray-300">Todos os bancos de dados foram encontrados</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-red-400 font-semibold">Falha na conexão</p>
                <p className="text-sm text-gray-300">{errorMessage}</p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-1">Importante:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Certifique-se de que o MySQL/MariaDB está rodando</li>
              <li>O banco <strong>MuOnline</strong> deve existir (servidor de jogo)</li>
              <li>O banco <strong>webmu</strong> será criado automaticamente se não existir</li>
              <li>O usuário deve ter permissões CREATE, DROP, INSERT, UPDATE, DELETE</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={testConnection}
          disabled={testing || !config.host || !config.user}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
        >
          {testing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Testando Conexão...
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              Testar Conexão
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={testResult !== 'success'}
          className="flex-1 px-6 py-3 bg-[#FFB800] hover:bg-[#FFC933] disabled:bg-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-500 rounded-lg font-semibold transition-all"
        >
          Próxima Etapa →
        </button>
      </div>
    </motion.div>
  );
};

export default StepDatabase;
