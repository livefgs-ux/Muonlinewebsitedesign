import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  AlertTriangle, 
  Activity,
  Lock,
  Search,
  Ban,
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface SecurityLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  ip: string;
  status: 'success' | 'blocked' | 'warning';
}

const SecurityPanel = () => {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar logs de segurança reais
  useEffect(() => {
    loadSecurityLogs();
  }, []);

  const loadSecurityLogs = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch('/api/admin/logs/logs?type=security', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setSecurityLogs(data.data);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar logs:', error);
      toast.error('Erro ao carregar logs de segurança');
      setSecurityLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch('/api/admin/logs/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security_logs_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('✅ Logs exportados!');
    } catch (error) {
      console.error('❌ Erro ao exportar:', error);
      toast.error('Erro ao exportar logs');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'blocked':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'blocked': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Sucesso';
      case 'blocked': return 'Bloqueado';
      case 'warning': return 'Alerta';
      default: return status;
    }
  };

  return (
    <div className="p-6">
      <motion.h2 
        className="text-3xl font-bold mb-6 text-[#FFB800]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🛡️ Painel de Segurança & Logs
      </motion.h2>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-red-500/20 hover:border-red-500/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-center mb-3">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <p className="text-gray-400 mb-2">Tentativas Bloqueadas (24h)</p>
          <h3 className="text-4xl font-bold text-red-400">37</h3>
        </motion.div>

        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-yellow-500/20 hover:border-yellow-500/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center mb-3">
            <Ban className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="text-gray-400 mb-2">IPs Suspensos</p>
          <h3 className="text-4xl font-bold text-yellow-400">12</h3>
        </motion.div>

        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-green-500/20 hover:border-green-500/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-center mb-3">
            <Shield className="w-10 h-10 text-green-400" />
          </div>
          <p className="text-gray-400 mb-2">Status Firewall</p>
          <h3 className={`text-4xl font-bold ${firewallStatus === 'Ativo' ? 'text-green-400' : 'text-yellow-400'}`}>
            {firewallStatus}
          </h3>
        </motion.div>
      </div>

      {/* Atividades Recentes */}
      <motion.div 
        className="glass-card p-6 rounded-xl mb-10 border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Atividades Recentes</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Usuário</th>
                <th className="p-3">Ação</th>
                <th className="p-3">IP</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {securityLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  className="border-b border-gray-800 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <td className="p-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="p-3 text-white font-semibold">{log.user}</td>
                  <td className="p-3 text-gray-300">{log.action}</td>
                  <td className="p-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      {log.ip}
                    </div>
                  </td>
                  <td className={`p-3 font-semibold ${getStatusColor(log.status)}`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      {getStatusText(log.status)}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Proteções Ativas */}
      <motion.div 
        className="glass-card p-6 rounded-xl mb-10 border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Proteções Ativas</h3>
        </div>

        <ul className="space-y-3 text-gray-300">
          <motion.li 
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">Anti-DDoS Shield</span>
              <span className="text-gray-400"> — Monitoramento de IP e tráfego</span>
            </div>
          </motion.li>
          <motion.li 
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">SQL Injection Filter</span>
              <span className="text-gray-400"> — Bloqueia comandos suspeitos</span>
            </div>
          </motion.li>
          <motion.li 
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">Brute Force Lock</span>
              <span className="text-gray-400"> — Limite de 3 tentativas de login</span>
            </div>
          </motion.li>
          <motion.li 
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">XSS Sanitizer</span>
              <span className="text-gray-400"> — Filtra inputs HTML maliciosos</span>
            </div>
          </motion.li>
          <motion.li 
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">Session Validator</span>
              <span className="text-gray-400"> — Tokens expiram a cada 2h</span>
            </div>
          </motion.li>
          <motion.li 
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">File Integrity Scanner</span>
              <span className="text-gray-400"> — Verifica arquivos alterados</span>
            </div>
          </motion.li>
        </ul>
      </motion.div>

      {/* Ferramentas de Segurança */}
      <motion.div 
        className="glass-card p-6 rounded-xl border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Ferramentas de Segurança</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="bg-[#FFB800] text-black p-3 rounded-md hover:bg-[#FFC933] transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Escaneando...' : 'Escanear Sistema'}
          </button>

          <button
            onClick={handleBanIP}
            className="bg-black/40 text-gray-300 p-3 rounded-md border border-gray-600 hover:bg-black/60 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Ban className="w-4 h-4" />
            Banir IP
          </button>

          <button
            onClick={handleResetFirewall}
            className="bg-black/40 text-gray-300 p-3 rounded-md border border-gray-600 hover:bg-black/60 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar Firewall
          </button>

          <button
            onClick={handleExportLogs}
            className="bg-black/40 text-gray-300 p-3 rounded-md border border-gray-600 hover:bg-black/60 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar Logs
          </button>
        </div>

        {secStatus && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-semibold ${
              secStatus.includes('✅') 
                ? 'text-green-400' 
                : secStatus.includes('🚫') || secStatus.includes('🔍')
                ? 'text-yellow-400'
                : 'text-blue-400'
            }`}
          >
            {secStatus}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default SecurityPanel;