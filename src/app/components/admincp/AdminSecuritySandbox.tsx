/**
 * ADMIN SECURITY SANDBOX COMPONENT
 * Simulador de ataques e testes de segurança
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  Database,
  Mail,
  Lock,
  Code,
  PlayCircle,
  RefreshCw,
  History,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import { API_CONFIG } from '../../config/api';

interface SimulationResult {
  type: string;
  description: string;
  packets_sent?: number;
  packets_blocked?: number;
  packets_allowed?: number;
  attempts?: number;
  attempts_blocked?: number;
  attempts_successful?: number;
  login_attempts?: number;
  success_rate: string;
  defense_actions: string[];
  severity: string;
  result: 'PASSED' | 'FAILED';
  recommendation: string;
  avg_response_time?: string;
}

interface Simulation {
  timestamp: string;
  attack_type: string;
  total_tests: number;
  passed: number;
  failed: number;
  results: SimulationResult[];
}

const AdminSecuritySandbox = () => {
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [history, setHistory] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  /**
   * Executar simulação
   */
  const runSimulation = async (attackType: string) => {
    try {
      setLoading(true);
      setSimulation(null);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/sandbox/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attack_type: attackType })
      });

      const data = await response.json();

      if (data.success) {
        setSimulation(data.data);
        toast.success(`✅ Simulação de ${attackType === 'ALL' ? 'todos os ataques' : attackType} concluída!`);
        loadHistory(); // Recarregar histórico
      } else {
        toast.error('Erro ao executar simulação');
      }
    } catch (error) {
      console.error('Erro ao executar simulação:', error);
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carregar histórico
   */
  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/sandbox/history`);
      const data = await response.json();

      if (data.success) {
        setHistory(data.data.history || []);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  /**
   * Limpar histórico
   */
  const clearHistory = async () => {
    if (!confirm('Tem certeza que deseja limpar todo o histórico de simulações?')) {
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/sandbox/history`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setHistory([]);
        toast.success('Histórico limpo com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      toast.error('Erro ao limpar histórico');
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  /**
   * Obter ícone do tipo de ataque
   */
  const getAttackIcon = (type: string) => {
    if (type.includes('SQL')) return <Database className="w-5 h-5" />;
    if (type.includes('DDoS')) return <Zap className="w-5 h-5" />;
    if (type.includes('Phishing')) return <Mail className="w-5 h-5" />;
    if (type.includes('Brute')) return <Lock className="w-5 h-5" />;
    if (type.includes('XSS')) return <Code className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  /**
   * Obter cor da severidade
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20';
      case 'LOW': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Security Sandbox</h1>
                <p className="text-gray-400">Simulador de ataques e testes de defesa</p>
              </div>
            </div>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-lg font-semibold transition-all"
            >
              <History className="w-4 h-4" />
              {showHistory ? 'Ocultar' : 'Ver'} Histórico
            </button>
          </div>
        </motion.div>

        {/* Attack Simulation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { type: 'SQLi', label: 'SQL Injection', icon: Database, color: 'from-blue-500 to-blue-700' },
            { type: 'DDoS', label: 'DDoS Attack', icon: Zap, color: 'from-purple-500 to-purple-700' },
            { type: 'Phishing', label: 'Phishing', icon: Mail, color: 'from-yellow-500 to-yellow-700' },
            { type: 'BruteForce', label: 'Brute Force', icon: Lock, color: 'from-red-500 to-red-700' },
            { type: 'XSS', label: 'XSS Attack', icon: Code, color: 'from-green-500 to-green-700' },
            { type: 'ALL', label: 'Todos', icon: Shield, color: 'from-[#FFB800] to-yellow-700' }
          ].map((attack) => (
            <button
              key={attack.type}
              onClick={() => runSimulation(attack.type)}
              disabled={loading}
              className={`relative group backdrop-blur-xl bg-gradient-to-br ${attack.color} p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all"></div>
              <div className="relative flex flex-col items-center gap-3">
                <attack.icon className="w-8 h-8 text-white" />
                <span className="text-sm font-bold text-white text-center">{attack.label}</span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <RefreshCw className="w-12 h-12 animate-spin text-[#FFB800] mb-4" />
            <p className="text-xl text-white font-semibold">Executando simulação de segurança...</p>
            <p className="text-gray-400">Analisando defesas e gerando relatório</p>
          </motion.div>
        )}

        {/* Simulation Results */}
        {simulation && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Summary */}
            <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Resultado da Simulação</h2>
                <span className="text-sm text-gray-400">
                  {new Date(simulation.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/40 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-400">Total de Testes</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{simulation.total_tests}</p>
                </div>

                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-400">Aprovados</span>
                  </div>
                  <p className="text-3xl font-bold text-green-400">{simulation.passed}</p>
                </div>

                <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-400">Reprovados</span>
                  </div>
                  <p className="text-3xl font-bold text-red-400">{simulation.failed}</p>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {simulation.results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`backdrop-blur-xl bg-black/60 p-6 rounded-xl border ${
                    result.result === 'PASSED' 
                      ? 'border-green-500/30' 
                      : 'border-red-500/30'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${result.result === 'PASSED' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {getAttackIcon(result.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{result.type}</h3>
                        <p className="text-sm text-gray-400">{result.description}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg font-bold ${
                      result.result === 'PASSED' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {result.result}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {result.packets_sent && (
                      <>
                        <div className="bg-black/40 p-3 rounded-lg">
                          <span className="text-xs text-gray-400 block mb-1">Pacotes Enviados</span>
                          <span className="text-lg font-bold text-white">{result.packets_sent}</span>
                        </div>
                        <div className="bg-green-500/10 p-3 rounded-lg">
                          <span className="text-xs text-gray-400 block mb-1">Bloqueados</span>
                          <span className="text-lg font-bold text-green-400">{result.packets_blocked}</span>
                        </div>
                      </>
                    )}
                    {result.attempts && (
                      <>
                        <div className="bg-black/40 p-3 rounded-lg">
                          <span className="text-xs text-gray-400 block mb-1">Tentativas</span>
                          <span className="text-lg font-bold text-white">{result.attempts}</span>
                        </div>
                        <div className="bg-green-500/10 p-3 rounded-lg">
                          <span className="text-xs text-gray-400 block mb-1">Bloqueadas</span>
                          <span className="text-lg font-bold text-green-400">{result.attempts_blocked}</span>
                        </div>
                      </>
                    )}
                    {result.login_attempts && (
                      <>
                        <div className="bg-black/40 p-3 rounded-lg">
                          <span className="text-xs text-gray-400 block mb-1">Logins</span>
                          <span className="text-lg font-bold text-white">{result.login_attempts}</span>
                        </div>
                        <div className="bg-green-500/10 p-3 rounded-lg">
                          <span className="text-xs text-gray-400 block mb-1">Bloqueados</span>
                          <span className="text-lg font-bold text-green-400">{result.attempts_blocked}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Success Rate */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Taxa de Bloqueio</span>
                      <span className="text-sm font-bold text-[#FFB800]">{result.success_rate}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all"
                        style={{ width: result.success_rate }}
                      ></div>
                    </div>
                  </div>

                  {/* Severity */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold ${getSeverityColor(result.severity)}`}>
                      <AlertTriangle className="w-4 h-4" />
                      {result.severity}
                    </span>
                  </div>

                  {/* Defense Actions */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Ações de Defesa:</h4>
                    <ul className="space-y-1">
                      {result.defense_actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                    <p className="text-sm text-blue-300">
                      <strong>Recomendação:</strong> {result.recommendation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* History Panel */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Histórico de Simulações</h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                Nenhuma simulação executada ainda
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.reverse().map((sim, index) => (
                  <div
                    key={index}
                    className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-all cursor-pointer"
                    onClick={() => setSimulation(sim)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-[#FFB800]" />
                        <div>
                          <p className="text-white font-semibold">{sim.attack_type}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(sim.timestamp).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-green-400 font-bold">{sim.passed} ✓</span>
                        <span className="text-red-400 font-bold">{sim.failed} ✗</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminSecuritySandbox;
