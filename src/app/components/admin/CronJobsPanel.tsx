import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Play, 
  Pause,
  PlayCircle,
  FileText,
  Activity,
  RefreshCw,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface CronJob {
  id: number;
  name: string;
  description: string;
  schedule: string;
  lastRun: string;
  status: 'active' | 'paused' | 'error';
}

interface CronLog {
  id: number;
  jobName: string;
  runTime: string;
  status: 'success' | 'failed';
  output: string;
}

const CronJobsPanel = () => {
  const [cronStatus, setCronStatus] = useState('');
  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  // Mock data - cron jobs
  const [cronJobs, setCronJobs] = useState<CronJob[]>([
    {
      id: 1,
      name: 'update_rankings',
      description: 'Atualiza ranking de jogadores e guilds',
      schedule: 'A cada 15 min',
      lastRun: '02:30:11',
      status: 'active'
    },
    {
      id: 2,
      name: 'check_boss_status',
      description: 'Verifica bosses vivos no servidor',
      schedule: 'A cada 10 min',
      lastRun: '02:40:05',
      status: 'active'
    },
    {
      id: 3,
      name: 'check_events',
      description: 'Atualiza timers de Blood Castle / Devil Square',
      schedule: 'A cada 10 min',
      lastRun: '02:35:22',
      status: 'active'
    },
    {
      id: 4,
      name: 'backup_database',
      description: 'Backup automático do banco webmu',
      schedule: '1x por dia (03:00)',
      lastRun: 'Ontem 03:01',
      status: 'paused'
    },
    {
      id: 5,
      name: 'security_scan',
      description: 'Verificação de logs e IPs suspeitos',
      schedule: 'A cada 30 min',
      lastRun: '02:15:00',
      status: 'active'
    },
    {
      id: 6,
      name: 'cleanup_temp',
      description: 'Remove arquivos de cache temporários',
      schedule: '1x por dia (04:00)',
      lastRun: 'Ontem 04:02',
      status: 'active'
    },
    {
      id: 7,
      name: 'email_digest',
      description: 'Envia resumo diário de status do servidor',
      schedule: '1x por dia (08:00)',
      lastRun: 'Hoje 08:01',
      status: 'active'
    },
    {
      id: 8,
      name: 'update_online_stats',
      description: 'Atualiza estatísticas de jogadores online',
      schedule: 'A cada 5 min',
      lastRun: '02:45:00',
      status: 'active'
    }
  ]);

  // Mock data - logs recentes
  const [cronLogs] = useState<CronLog[]>([
    {
      id: 1,
      jobName: 'update_rankings',
      runTime: '02:30:11',
      status: 'success',
      output: 'Rankings atualizados com sucesso. 1247 jogadores processados.'
    },
    {
      id: 2,
      jobName: 'check_boss_status',
      runTime: '02:40:05',
      status: 'success',
      output: 'Bosses verificados. 3 bosses ativos no momento.'
    },
    {
      id: 3,
      jobName: 'backup_database',
      runTime: 'Ontem 03:01',
      status: 'failed',
      output: 'Erro: Espaço em disco insuficiente.'
    }
  ]);

  const handleToggleCron = (id: number) => {
    setCronJobs(jobs =>
      jobs.map(job => {
        if (job.id === id) {
          const newStatus = job.status === 'active' ? 'paused' : 'active';
          setCronStatus(`🔄 Tarefa '${job.name}' ${newStatus === 'active' ? 'ativada' : 'desativada'} com sucesso.`);
          setTimeout(() => setCronStatus(''), 3000);
          return { ...job, status: newStatus };
        }
        return job;
      })
    );
  };

  const handleRunManual = (name: string) => {
    setIsExecuting(name);
    setCronStatus(`⏳ Executando tarefa: ${name}...`);
    
    setTimeout(() => {
      setCronStatus(`✅ Execução concluída com sucesso: ${name}`);
      setIsExecuting(null);
      
      // Atualizar última execução
      setCronJobs(jobs =>
        jobs.map(job => {
          if (job.name === name) {
            const now = new Date();
            return { 
              ...job, 
              lastRun: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
            };
          }
          return job;
        })
      );
      
      setTimeout(() => setCronStatus(''), 3000);
    }, 3000);
  };

  const handleViewLogs = () => {
    setCronStatus('📜 Logs exportados: /webmu/logs/cron_2025-12-19.txt');
    setTimeout(() => setCronStatus(''), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'paused':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'paused':
        return 'Pausado';
      case 'error':
        return 'Erro';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const activeJobs = cronJobs.filter(job => job.status === 'active').length;
  const totalExecutions = 124; // Mock data

  return (
    <div className="p-6">
      <motion.h2 
        className="text-3xl font-bold mb-6 text-[#FFB800]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⏱️ Painel de CronJobs & Automação
      </motion.h2>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-green-500/20 hover:border-green-500/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-center mb-3">
            <Activity className="w-10 h-10 text-green-400" />
          </div>
          <p className="text-gray-400 mb-2">Tarefas Ativas</p>
          <h3 className="text-4xl font-bold text-green-400">{activeJobs}</h3>
        </motion.div>

        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-[#FFB800]/20 hover:border-[#FFB800]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center mb-3">
            <RefreshCw className="w-10 h-10 text-[#FFB800]" />
          </div>
          <p className="text-gray-400 mb-2">Execuções Hoje</p>
          <h3 className="text-4xl font-bold text-[#FFB800]">{totalExecutions}</h3>
        </motion.div>

        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-blue-500/20 hover:border-blue-500/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-center mb-3">
            <Clock className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-gray-400 mb-2">Última Atualização</p>
          <h3 className="text-2xl font-semibold text-blue-400">
            {new Date().toLocaleTimeString('pt-BR')}
          </h3>
        </motion.div>
      </div>

      {/* Tabela de CronJobs */}
      <motion.div 
        className="glass-card p-6 rounded-xl mb-10 border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Tarefas Automáticas</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="p-3">Nome</th>
                <th className="p-3">Descrição</th>
                <th className="p-3">Agendamento</th>
                <th className="p-3">Última Execução</th>
                <th className="p-3">Status</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cronJobs.map((job, index) => (
                <motion.tr
                  key={job.id}
                  className="border-b border-gray-800 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <td className="p-3 text-white font-mono font-semibold">{job.name}</td>
                  <td className="p-3 text-gray-300">{job.description}</td>
                  <td className="p-3 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {job.schedule}
                    </div>
                  </td>
                  <td className="p-3 text-gray-300">{job.lastRun}</td>
                  <td className={`p-3 font-semibold ${getStatusColor(job.status)}`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      {getStatusText(job.status)}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleCron(job.id)}
                      className={`${
                        job.status === 'active' 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-green-400 hover:text-green-300'
                      } transition-colors font-semibold`}
                    >
                      {job.status === 'active' ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Ferramentas de Automação */}
      <motion.div 
        className="glass-card p-6 rounded-xl border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <PlayCircle className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Ferramentas de Automação</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <button
            onClick={() => handleRunManual('update_rankings')}
            disabled={isExecuting === 'update_rankings'}
            className="bg-[#FFB800] text-black p-3 rounded-md hover:bg-[#FFC933] transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting === 'update_rankings' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isExecuting === 'update_rankings' ? 'Executando...' : '🏆 Executar Rankings'}
          </button>

          <button
            onClick={() => handleRunManual('check_boss_status')}
            disabled={isExecuting === 'check_boss_status'}
            className="bg-black/40 text-gray-300 p-3 rounded-md border border-gray-600 hover:bg-black/60 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isExecuting === 'check_boss_status' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isExecuting === 'check_boss_status' ? 'Executando...' : '🐉 Verificar Bosses'}
          </button>

          <button
            onClick={() => handleRunManual('backup_database')}
            disabled={isExecuting === 'backup_database'}
            className="bg-black/40 text-gray-300 p-3 rounded-md border border-gray-600 hover:bg-black/60 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isExecuting === 'backup_database' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isExecuting === 'backup_database' ? 'Executando...' : '💾 Rodar Backup'}
          </button>

          <button
            onClick={handleViewLogs}
            className="bg-black/40 text-gray-300 p-3 rounded-md border border-gray-600 hover:bg-black/60 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            📜 Ver Logs
          </button>
        </div>

        {cronStatus && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-semibold ${
              cronStatus.includes('✅') 
                ? 'text-green-400' 
                : cronStatus.includes('⏳')
                ? 'text-yellow-400'
                : 'text-blue-400'
            }`}
          >
            {cronStatus}
          </motion.p>
        )}
      </motion.div>

      {/* Logs Recentes */}
      <motion.div 
        className="glass-card p-6 rounded-xl mt-10 border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Logs Recentes</h3>
        </div>

        <div className="space-y-3">
          {cronLogs.map((log, index) => (
            <motion.div
              key={log.id}
              className={`p-4 rounded-lg border ${
                log.status === 'success' 
                  ? 'bg-green-500/5 border-green-500/20' 
                  : 'bg-red-500/5 border-red-500/20'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {log.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="font-mono font-semibold text-white">{log.jobName}</span>
                </div>
                <span className="text-sm text-gray-400">{log.runTime}</span>
              </div>
              <p className={`text-sm ${log.status === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                {log.output}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CronJobsPanel;
