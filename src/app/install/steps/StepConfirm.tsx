/**
 * ETAPA 3 - CONFIRMAÇÃO E INSTALAÇÃO
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, CheckCircle, Loader, AlertCircle, Database, User, Shield } from 'lucide-react';
import { DatabaseConfig, AdminConfig } from '../InstallWizard';

interface Props {
  databaseConfig: DatabaseConfig;
  adminConfig: AdminConfig;
  onPrevious: () => void;
  onComplete: () => void;
}

const StepConfirm = ({ databaseConfig, adminConfig, onPrevious, onComplete }: Props) => {
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');

  /**
   * Executar instalação
   */
  const handleInstall = async () => {
    setInstalling(true);
    setProgress(0);

    try {
      // Simular processo de instalação
      const tasks = [
        { name: 'Conectando ao banco de dados...', duration: 1000 },
        { name: 'Criando banco webmu...', duration: 1500 },
        { name: 'Criando tabelas...', duration: 2000 },
        { name: 'Inserindo dados iniciais...', duration: 1500 },
        { name: 'Criando conta administrativa...', duration: 1000 },
        { name: 'Gerando arquivos de configuração...', duration: 1000 },
        { name: 'Finalizando instalação...', duration: 500 }
      ];

      for (let i = 0; i < tasks.length; i++) {
        setCurrentTask(tasks[i].name);
        await new Promise(resolve => setTimeout(resolve, tasks[i].duration));
        setProgress(((i + 1) / tasks.length) * 100);
      }

      // Completar instalação
      setTimeout(() => {
        onComplete();
      }, 500);

    } catch (error) {
      console.error('Erro na instalação:', error);
      alert('Erro ao executar instalação. Tente novamente.');
      setInstalling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-[#FFB800]" />
        <div>
          <h2 className="text-2xl font-bold text-white">Confirmação</h2>
          <p className="text-gray-400">Revise as configurações antes de instalar</p>
        </div>
      </div>

      {!installing ? (
        <>
          {/* Database Config Summary */}
          <div className="bg-black/40 border border-gray-700 rounded-lg p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Configuração do Banco de Dados</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Host:</span>
                <span className="ml-2 text-white font-semibold">{databaseConfig.host}</span>
              </div>
              <div>
                <span className="text-gray-400">Porta:</span>
                <span className="ml-2 text-white font-semibold">{databaseConfig.port}</span>
              </div>
              <div>
                <span className="text-gray-400">Usuário:</span>
                <span className="ml-2 text-white font-semibold">{databaseConfig.user}</span>
              </div>
              <div>
                <span className="text-gray-400">Senha:</span>
                <span className="ml-2 text-white font-semibold">••••••••</span>
              </div>
              <div>
                <span className="text-gray-400">DB MuOnline:</span>
                <span className="ml-2 text-white font-semibold">{databaseConfig.db_muonline}</span>
              </div>
              <div>
                <span className="text-gray-400">DB WebMU:</span>
                <span className="ml-2 text-white font-semibold">{databaseConfig.db_webmu}</span>
              </div>
            </div>
          </div>

          {/* Admin Config Summary */}
          <div className="bg-black/40 border border-gray-700 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-[#FFB800]" />
              <h3 className="text-lg font-bold text-white">Conta Administrativa</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Usuário:</span>
                <span className="ml-2 text-white font-semibold">{adminConfig.username}</span>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <span className="ml-2 text-white font-semibold">{adminConfig.email}</span>
              </div>
              <div>
                <span className="text-gray-400">Senha:</span>
                <span className="ml-2 text-white font-semibold">••••••••</span>
              </div>
              <div>
                <span className="text-gray-400">Nível:</span>
                <span className="ml-2 text-[#FFB800] font-semibold">Super Admin</span>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-300">
                <p className="font-semibold mb-1">Atenção:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>O banco <strong>{databaseConfig.db_webmu}</strong> será criado/sobrescrito</li>
                  <li>Backup recomendado antes de continuar</li>
                  <li>Certifique-se de que o servidor de jogo está desligado</li>
                  <li>O processo pode levar alguns minutos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onPrevious}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
            >
              ← Voltar
            </button>

            <button
              onClick={handleInstall}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Instalar Agora
            </button>
          </div>
        </>
      ) : (
        /* Installing Progress */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              <Loader className="w-20 h-20 text-[#FFB800] animate-spin" />
              <Shield className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Instalando MeuMU Online</h3>
            <p className="text-gray-400">Por favor, aguarde enquanto configuramos tudo...</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progresso</span>
              <span className="text-sm font-bold text-[#FFB800]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[#FFB800] to-yellow-400 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Current Task */}
          <div className="bg-black/40 border border-[#FFB800]/30 rounded-lg p-4 text-center">
            <p className="text-white font-semibold">{currentTask}</p>
          </div>

          {/* Installation Steps */}
          <div className="mt-6 space-y-2">
            {[
              'Conectando ao banco de dados',
              'Criando estrutura',
              'Configurando sistema',
              'Criando conta admin',
              'Finalizando'
            ].map((step, index) => {
              const stepProgress = (index / 5) * 100;
              const isCompleted = progress > stepProgress;
              const isCurrent = progress >= stepProgress && progress < ((index + 1) / 5) * 100;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isCompleted
                      ? 'bg-green-500/20'
                      : isCurrent
                      ? 'bg-[#FFB800]/20'
                      : 'bg-black/20'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : isCurrent ? (
                    <Loader className="w-5 h-5 text-[#FFB800] animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      isCompleted
                        ? 'text-green-400'
                        : isCurrent
                        ? 'text-[#FFB800]'
                        : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StepConfirm;
