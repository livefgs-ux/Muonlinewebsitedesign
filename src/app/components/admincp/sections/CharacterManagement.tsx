import { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertCircle, Trash2, Edit, Shield } from 'lucide-react';
import { motion } from 'motion/react'; // ✅ V581: Import motion
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'; // ✅ V581: Import CardHeader
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { getApiUrl, getAuthHeaders } from '../../../config/api'; // ✅ V581: Import helpers

/**
 * ⚔️ Character Management Section
 * ✅ V573+ - DADOS REAIS DO BACKEND
 * Gerenciamento completo de personagens com dados do banco de dados
 */

interface Character {
  guid: number;
  name: string;
  race: number;
  className: string;
  level: number;
  level_master: number;
  level_majestic: number;
  totalLevel: number;
  reset: number;
  online: number;
  money: number;
  account_username: string;
  account_guid: number;
  authority: number;
  isGM: boolean;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function CharacterManagement() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  // Função para buscar personagens
  const fetchCharacters = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // ✅ V574 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      // ✅ V581 FIX: Usar getApiUrl() corretamente
      const baseUrl = getApiUrl('/admin/all-characters'); // Retorna /api/admin/all-characters OU http://localhost:3001/api/admin/all-characters
      const url = new URL(baseUrl, window.location.origin); // Converte para URL absoluta
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', '50');
      if (searchTerm && searchTerm.trim() !== '') {
        url.searchParams.append('search', searchTerm.trim());
      }
      url.searchParams.append('sortBy', 'level');
      url.searchParams.append('sortOrder', 'DESC');

      console.log('🔍 Buscando personagens:', url.toString());

      const response = await fetch(url.toString(), {
        headers: getAuthHeaders(token) // ✅ V581: Use helper function
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ao buscar personagens: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erro ao buscar personagens');
      }

      console.log('✅ Personagens recebidos:', data.data.characters.length);
      setCharacters(data.data.characters);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error('❌ Erro ao buscar personagens:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Buscar personagens ao montar o componente
  useEffect(() => {
    fetchCharacters(1, searchTerm);
  }, []);

  // Buscar com delay ao digitar
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        fetchCharacters(1, searchTerm);
      } else {
        fetchCharacters(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Mudar página
  const handlePageChange = (newPage: number) => {
    fetchCharacters(newPage, searchTerm);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Gerenciar Personagens</h2>
          <p className="text-sm text-slate-400">
            {pagination.total > 0 
              ? `${pagination.total} personagens encontrados` 
              : 'Visualize e edite personagens dos jogadores'}
          </p>
        </div>
        <Button
          onClick={() => fetchCharacters(pagination.page, searchTerm)}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            icon={Shield} 
            label="Total de Personagens" 
            value={pagination.total.toLocaleString()} 
            color="text-purple-400" 
          />
          <StatCard 
            icon={Shield} 
            label="Personagens Online" 
            value={characters.filter(c => c.online === 1).length.toString()} 
            color="text-green-400" 
          />
          <StatCard 
            icon={Shield} 
            label="Nível Máximo" 
            value={characters.length > 0 ? Math.max(...characters.map(c => c.level)).toString() : '0'} 
            color="text-amber-400" 
          />
          <StatCard 
            icon={Shield} 
            label="Total de Resets" 
            value={characters.reduce((sum, c) => sum + c.reset, 0).toLocaleString()} 
            color="text-blue-400" 
          />
        </div>
      )}

      {/* Search */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por nome do personagem ou conta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold">Carregando personagens...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-400 mb-2">Erro ao Carregar Personagens</h3>
            <p className="text-slate-300 mb-4">{error}</p>
            <Button 
              onClick={() => fetchCharacters(pagination.page, searchTerm)}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Characters Table */}
      {!loading && !error && characters.length > 0 && (
        <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Shield className="w-5 h-5" />
              Lista de Personagens ({characters.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="text-left p-3 text-sm font-semibold text-slate-400">Nome</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-400">Classe</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-400">Nível</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-400">Resets</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-400">Conta</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-400">Status</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-400">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {characters.map((char, index) => (
                    <motion.tr
                      key={char.guid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{char.name}</span>
                          {char.isGM && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                              GM
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-slate-300 text-sm">{char.className}</td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{char.level}</span>
                          {char.level_master > 0 && (
                            <span className="text-xs text-blue-400">M: {char.level_master}</span>
                          )}
                          {char.level_majestic > 0 && (
                            <span className="text-xs text-purple-400">Maj: {char.level_majestic}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                          {char.reset}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-400 text-sm">{char.account_username}</td>
                      <td className="p-3">
                        {char.online === 1 ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Online
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                            Offline
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-slate-800/50 pt-4">
                <p className="text-sm text-slate-400">
                  Página {pagination.page} de {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    variant="outline"
                    size="sm"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 disabled:opacity-50"
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || loading}
                    variant="outline"
                    size="sm"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 disabled:opacity-50"
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && characters.length === 0 && (
        <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
          <CardContent className="p-12 text-center">
            <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">Nenhum Personagem Encontrado</h3>
            <p className="text-slate-500">
              {searchTerm 
                ? `Nenhum resultado para "${searchTerm}"` 
                : 'Não há personagens cadastrados no servidor'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ========================================
// Componentes Auxiliares
// ========================================

interface StatCardProps {
  icon: any;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-slate-900/40 backdrop-blur-2xl border border-amber-500/20 rounded-xl p-4 hover:border-amber-500/40 transition-all"
    >
      <Icon className={`w-5 h-5 ${color} mb-2`} />
      <p className="text-2xl font-black text-white mb-1">{value}</p>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
    </motion.div>
  );
}