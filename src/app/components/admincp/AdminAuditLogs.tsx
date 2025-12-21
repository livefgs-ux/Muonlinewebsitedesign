/**
 * ADMIN AUDIT LOGS COMPONENT
 * Visualização completa de logs de auditoria administrativa
 * Filtros avançados, estatísticas e exportação para CSV
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Filter,
  Download,
  Search,
  Calendar,
  User,
  AlertTriangle,
  Activity,
  Shield,
  Clock,
  TrendingUp,
  BarChart3,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';
import { API_CONFIG } from '../../config/api';

interface AdminLog {
  id: number;
  admin_account: string;
  admin_email: string | null;
  action_type: string;
  action_category: string;
  description: string;
  target_table: string | null;
  target_id: string | null;
  ip_address: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  created_at: string;
}

interface LogStats {
  period_days: number;
  action_types: { action_type: string; count: number }[];
  categories: { action_category: string; count: number }[];
  severities: { severity: string; count: number }[];
  top_admins: { admin_account: string; actions: number }[];
  recent_critical: AdminLog[];
}

const AdminAuditLogs = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    admin_account: '',
    action_type: '',
    action_category: '',
    severity: '',
    start_date: '',
    end_date: '',
    search: ''
  });

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const itemsPerPage = 50;

  // View mode
  const [viewMode, setViewMode] = useState<'logs' | 'stats'>('logs');

  /**
   * Carregar logs do backend
   */
  const loadLogs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/logs/logs?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.data.logs);
        setTotalPages(data.data.pagination.totalPages);
        setTotalLogs(data.data.pagination.total);
      } else {
        toast.error('Erro ao carregar logs');
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carregar estatísticas
   */
  const loadStats = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/logs/stats?days=30`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  /**
   * Exportar logs para CSV
   */
  const handleExportCSV = async () => {
    try {
      setExporting(true);

      const params = new URLSearchParams({
        start_date: filters.start_date || '',
        end_date: filters.end_date || ''
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/logs/export?${params}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-logs-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('✅ Logs exportados com sucesso!');
      } else {
        toast.error('Erro ao exportar logs');
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar logs');
    } finally {
      setExporting(false);
    }
  };

  /**
   * Obter cor baseada na severidade
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'HIGH':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'LOW':
        return 'text-green-400 bg-green-500/20 border-green-500/50';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  /**
   * Obter cor baseada no status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-400 bg-green-500/20';
      case 'FAILED':
        return 'text-red-400 bg-red-500/20';
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  /**
   * Formatar data
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  // Carregar dados ao montar e quando filtros mudarem
  useEffect(() => {
    loadLogs();
  }, [currentPage, filters]);

  useEffect(() => {
    if (viewMode === 'stats') {
      loadStats();
    }
  }, [viewMode]);

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
              <div className="w-14 h-14 bg-gradient-to-br from-[#FFB800] to-yellow-700 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
                <p className="text-gray-400">Sistema de auditoria administrativa</p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('logs')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'logs'
                    ? 'bg-[#FFB800] text-black'
                    : 'bg-black/40 text-gray-400 hover:bg-black/60'
                }`}
              >
                <FileText className="w-4 h-4" />
                Logs
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'stats'
                    ? 'bg-[#FFB800] text-black'
                    : 'bg-black/40 text-gray-400 hover:bg-black/60'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Estatísticas
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* LOGS VIEW */}
          {viewMode === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Filters */}
              <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Filter className="w-5 h-5 text-[#FFB800]" />
                  <h3 className="text-lg font-semibold text-white">Filtros</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  {/* Admin Account */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Admin..."
                      value={filters.admin_account}
                      onChange={(e) => setFilters({ ...filters, admin_account: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  {/* Action Type */}
                  <select
                    value={filters.action_type}
                    onChange={(e) => setFilters({ ...filters, action_type: e.target.value })}
                    className="px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="CREATE">CREATE</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="DELETE">DELETE</option>
                    <option value="LOGIN">LOGIN</option>
                    <option value="LOGOUT">LOGOUT</option>
                    <option value="BAN">BAN</option>
                    <option value="UNBAN">UNBAN</option>
                  </select>

                  {/* Severity */}
                  <select
                    value={filters.severity}
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    className="px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                  >
                    <option value="">Todas as severidades</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>

                  {/* Start Date */}
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={filters.start_date}
                      onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  {/* End Date */}
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={filters.end_date}
                      onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setFilters({
                          admin_account: '',
                          action_type: '',
                          action_category: '',
                          severity: '',
                          start_date: '',
                          end_date: '',
                          search: ''
                        });
                        setCurrentPage(1);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
                    >
                      Limpar
                    </button>
                    <button
                      onClick={handleExportCSV}
                      disabled={exporting}
                      className="flex-1 px-4 py-2 bg-[#FFB800] hover:bg-[#FFC933] text-black rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {exporting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          CSV
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Results count */}
                <div className="mt-4 text-sm text-gray-400">
                  Total de logs: <span className="text-[#FFB800] font-semibold">{totalLogs}</span>
                </div>
              </div>

              {/* Logs Table */}
              <div className="backdrop-blur-xl bg-black/60 rounded-xl border border-[#FFB800]/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/40">
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Admin</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Ação</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Descrição</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">IP</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Severidade</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center">
                            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#FFB800]" />
                          </td>
                        </tr>
                      ) : logs.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                            Nenhum log encontrado
                          </td>
                        </tr>
                      ) : (
                        logs.map((log) => (
                          <tr
                            key={log.id}
                            className="border-b border-gray-800 hover:bg-white/5 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-400">#{log.id}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-[#FFB800]" />
                                <span className="text-sm font-semibold text-white">{log.admin_account}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-400">
                                {log.action_type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300 max-w-md truncate">
                              {log.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                              {log.ip_address}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border ${getSeverityColor(log.severity)}`}>
                                {log.severity === 'CRITICAL' && <AlertTriangle className="w-3 h-3" />}
                                {log.severity}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(log.status)}`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap">
                              {formatDate(log.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-t border-gray-700">
                    <div className="text-sm text-gray-400">
                      Página {currentPage} de {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        Próxima
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STATS VIEW */}
          {viewMode === 'stats' && stats && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Action Types */}
              <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-5 h-5 text-[#FFB800]" />
                  <h3 className="text-lg font-semibold text-white">Tipos de Ação</h3>
                </div>
                <div className="space-y-2">
                  {stats.action_types.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                      <span className="text-white font-semibold">{item.action_type}</span>
                      <span className="text-[#FFB800] font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Severities */}
              <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-[#FFB800]" />
                  <h3 className="text-lg font-semibold text-white">Severidades</h3>
                </div>
                <div className="space-y-2">
                  {stats.severities.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                      <span className={`font-semibold ${getSeverityColor(item.severity).split(' ')[0]}`}>
                        {item.severity}
                      </span>
                      <span className="text-white font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Admins */}
              <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#FFB800]" />
                  <h3 className="text-lg font-semibold text-white">Admins Mais Ativos</h3>
                </div>
                <div className="space-y-2">
                  {stats.top_admins.map((admin, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-[#FFB800] text-black rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-white font-semibold">{admin.admin_account}</span>
                      </div>
                      <span className="text-[#FFB800] font-bold">{admin.actions} ações</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Critical */}
              <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-400">Ações Críticas Recentes</h3>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {stats.recent_critical.length === 0 ? (
                    <div className="text-center text-gray-400 py-4">
                      Nenhuma ação crítica registrada
                    </div>
                  ) : (
                    stats.recent_critical.map((log) => (
                      <div key={log.id} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-white font-semibold text-sm">{log.admin_account}</span>
                          <span className="text-xs text-gray-400">{formatDate(log.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-300">{log.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminAuditLogs;