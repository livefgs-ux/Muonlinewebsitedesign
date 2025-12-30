import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Coins,
  DollarSign,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface WCoinPackage {
  id: number;
  name: string;
  wcoin_amount: number;
  bonus_amount: number;
  price: string;
  currency: string;
  purchase_link: string;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface WCoinPackagesSectionProps {
  apiBaseUrl: string;
}

const WCoinPackagesSection: React.FC<WCoinPackagesSectionProps> = ({ apiBaseUrl }) => {
  const [packages, setPackages] = useState<WCoinPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    wcoin_amount: '',
    bonus_amount: '0',
    price: '',
    currency: 'BRL',
    purchase_link: '#',
    is_active: 1,
    display_order: 0
  });

  // Carregar pacotes
  const loadPackages = async () => {
    try {
      setLoading(true);
      // ✅ V575 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch(`${apiBaseUrl}/wcoin/admin/packages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setPackages(data.data || []);
      } else {
        toast.error('Erro ao carregar pacotes');
      }
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      wcoin_amount: '',
      bonus_amount: '0',
      price: '',
      currency: 'BRL',
      purchase_link: '#',
      is_active: 1,
      display_order: 0
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Criar pacote
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // ✅ V575 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch(`${apiBaseUrl}/wcoin/admin/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          wcoin_amount: parseInt(formData.wcoin_amount),
          bonus_amount: parseInt(formData.bonus_amount),
          price: formData.price,
          display_order: parseInt(formData.display_order as any)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Pacote criado com sucesso!');
        loadPackages();
        resetForm();
      } else {
        toast.error(data.error || 'Erro ao criar pacote');
      }
    } catch (error) {
      console.error('Erro ao criar pacote:', error);
      toast.error('Erro ao conectar com o servidor');
    }
  };

  // Editar pacote
  const handleEdit = (pkg: WCoinPackage) => {
    setFormData({
      name: pkg.name,
      wcoin_amount: pkg.wcoin_amount.toString(),
      bonus_amount: pkg.bonus_amount.toString(),
      price: pkg.price,
      currency: pkg.currency,
      purchase_link: pkg.purchase_link,
      is_active: pkg.is_active,
      display_order: pkg.display_order
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  // Atualizar pacote
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId) return;
    
    try {
      // ✅ V575 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch(`${apiBaseUrl}/wcoin/admin/packages/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          wcoin_amount: parseInt(formData.wcoin_amount),
          bonus_amount: parseInt(formData.bonus_amount),
          price: formData.price,
          display_order: parseInt(formData.display_order as any)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Pacote atualizado com sucesso!');
        loadPackages();
        resetForm();
      } else {
        toast.error(data.error || 'Erro ao atualizar pacote');
      }
    } catch (error) {
      console.error('Erro ao atualizar pacote:', error);
      toast.error('Erro ao conectar com o servidor');
    }
  };

  // Deletar pacote
  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente desativar este pacote?')) return;
    
    try {
      // ✅ V576 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch(`${apiBaseUrl}/wcoin/admin/packages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Pacote desativado com sucesso!');
        loadPackages();
      } else {
        toast.error(data.error || 'Erro ao desativar pacote');
      }
    } catch (error) {
      console.error('Erro ao desativar pacote:', error);
      toast.error('Erro ao conectar com o servidor');
    }
  };

  // Deletar permanentemente
  const handlePermanentDelete = async (id: number) => {
    if (!confirm('⚠️ ATENÇÃO: Isso deletará o pacote PERMANENTEMENTE! Esta ação não pode ser desfeita. Deseja continuar?')) return;
    
    try {
      // ✅ V576 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch(`${apiBaseUrl}/wcoin/admin/packages/${id}/permanent`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Pacote removido permanentemente!');
        loadPackages();
      } else {
        toast.error(data.error || 'Erro ao remover pacote');
      }
    } catch (error) {
      console.error('Erro ao remover pacote:', error);
      toast.error('Erro ao conectar com o servidor');
    }
  };

  // Toggle ativo/inativo
  const toggleActive = async (pkg: WCoinPackage) => {
    try {
      // ✅ V576 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch(`${apiBaseUrl}/wcoin/admin/packages/${pkg.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          is_active: pkg.is_active === 1 ? 0 : 1
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(pkg.is_active === 1 ? 'Pacote desativado' : 'Pacote ativado');
        loadPackages();
      } else {
        toast.error(data.error || 'Erro ao alterar status');
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao conectar com o servidor');
    }
  };

  const formatPrice = (price: string, currency: string) => {
    const symbols: Record<string, string> = {
      'BRL': 'R$',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    return `${symbols[currency] || currency} ${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB800] mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando pacotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-[#FFB800]" />
          <div>
            <h2 className="text-2xl font-bold text-white">Pacotes de WCoin</h2>
            <p className="text-gray-400 text-sm">Gerencie os pacotes de WCoin para venda</p>
          </div>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#FFB800] hover:bg-[#FFC933] text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Novo Pacote
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-1">Como funciona:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-200">
              <li>Configure pacotes com diferentes quantidades e preços</li>
              <li>Adicione bônus para tornar pacotes mais atrativos</li>
              <li>Defina links de compra (MercadoPago, PayPal, PagSeguro, etc)</li>
              <li>Ative/desative pacotes conforme necessário</li>
              <li>A ordem de exibição define como aparecem no site</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-black/60 border border-[#FFB800]/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#FFB800]">
              {editingId ? 'Editar Pacote' : 'Novo Pacote'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nome do Pacote *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Pacote Iniciante"
                  className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                  required
                />
              </div>

              {/* Quantidade WCoin */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Quantidade WCoin *</label>
                <input
                  type="number"
                  value={formData.wcoin_amount}
                  onChange={(e) => setFormData({ ...formData, wcoin_amount: e.target.value })}
                  placeholder="500"
                  min="1"
                  className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                  required
                />
              </div>

              {/* Bônus */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Bônus WCoin</label>
                <input
                  type="number"
                  value={formData.bonus_amount}
                  onChange={(e) => setFormData({ ...formData, bonus_amount: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              {/* Preço */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Preço *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="25.00"
                  min="0.01"
                  className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                  required
                />
              </div>

              {/* Moeda */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Moeda</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                >
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              {/* Ordem de Exibição */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Ordem de Exibição</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Menor número aparece primeiro</p>
              </div>

              {/* Link de Compra */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Link de Compra</label>
                <input
                  type="text"
                  value={formData.purchase_link}
                  onChange={(e) => setFormData({ ...formData, purchase_link: e.target.value })}
                  placeholder="https://mercadopago.com.br/checkout/..."
                  className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-[#FFB800] focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Deixe # para desabilitar o botão de compra</p>
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active === 1}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-[#FFB800] bg-black/40 border-gray-700 rounded focus:ring-[#FFB800]"
                  />
                  <span className="text-gray-300">Pacote Ativo</span>
                </label>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-[#FFB800] hover:bg-[#FFC933] text-black px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Atualizar' : 'Criar'} Pacote
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de Pacotes */}
      <div className="backdrop-blur-xl bg-black/60 border border-[#FFB800]/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/40">
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="px-6 py-4 font-semibold">Pacote</th>
                <th className="px-6 py-4 font-semibold">WCoin</th>
                <th className="px-6 py-4 font-semibold">Bônus</th>
                <th className="px-6 py-4 font-semibold">Preço</th>
                <th className="px-6 py-4 font-semibold">Link</th>
                <th className="px-6 py-4 font-semibold">Ordem</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {packages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Nenhum pacote cadastrado. Clique em "Novo Pacote" para começar.
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-[#FFB800]" />
                        <span className="text-white font-semibold">{pkg.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#FFB800] font-bold">{pkg.wcoin_amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      {pkg.bonus_amount > 0 ? (
                        <span className="text-green-400">+{pkg.bonus_amount.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold">{formatPrice(pkg.price, pkg.currency)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {pkg.purchase_link === '#' ? (
                        <span className="text-gray-500 text-sm">Não configurado</span>
                      ) : (
                        <a
                          href={pkg.purchase_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm truncate max-w-[200px] block"
                          title={pkg.purchase_link}
                        >
                          {pkg.purchase_link.substring(0, 30)}...
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">{pkg.display_order}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(pkg)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          pkg.is_active === 1
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}
                      >
                        {pkg.is_active === 1 ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-all"
                          title="Desativar"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(pkg.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                          title="Deletar Permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-xl bg-black/60 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Eye className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pacotes Ativos</p>
              <p className="text-2xl font-bold text-white">
                {packages.filter(p => p.is_active === 1).length}
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-black/60 border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-500/20 rounded-lg">
              <EyeOff className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pacotes Inativos</p>
              <p className="text-2xl font-bold text-white">
                {packages.filter(p => p.is_active === 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-black/60 border border-[#FFB800]/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFB800]/20 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-[#FFB800]" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total de Pacotes</p>
              <p className="text-2xl font-bold text-white">{packages.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WCoinPackagesSection;