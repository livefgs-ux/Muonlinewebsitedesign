import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  Send, 
  History, 
  Settings,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';

interface Donation {
  id: number;
  date: string;
  account: string;
  amountUSD: number;
  credits: number;
  method: string;
  status: 'confirmed' | 'pending' | 'failed';
}

const DonationsPanel = () => {
  const [accountTarget, setAccountTarget] = useState('');
  const [coinAmount, setCoinAmount] = useState('');
  const [coinType, setCoinType] = useState('WCoin');
  const [conversionRate, setConversionRate] = useState(100);
  const [vipBonus, setVipBonus] = useState(20);
  const [paypalId, setPaypalId] = useState('');
  const [trillexKey, setTrillexKey] = useState('');
  
  // 🔴 REMOVIDO MOCK - Sistema de doações não implementado ainda
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar histórico de doações (quando backend estiver pronto)
  useEffect(() => {
    // TODO: Implementar endpoint /api/admin/donations
    // loadDonations();
  }, []);

  const handleSendCoins = async () => {
    if (!accountTarget || !coinAmount) {
      toast.error('❌ Preencha todos os campos!');
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem('auth_token');
      
      // TODO: Implementar endpoint /api/admin/send-coins
      const response = await fetch('/api/admin/send-coins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account: accountTarget,
          amount: parseInt(coinAmount),
          type: coinType
        })
      });

      if (!response.ok) {
        throw new Error('Endpoint não implementado');
      }

      toast.success(`✅ ${coinAmount} ${coinType} enviados para ${accountTarget}!`);
      setAccountTarget('');
      setCoinAmount('');
    } catch (error) {
      console.error('❌ Erro:', error);
      toast.error('⚠️ Função de envio de moedas não implementada ainda');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = () => {
    alert(`💾 Configurações salvas:\n1 USD = ${conversionRate} WCoin\nBônus VIP: +${vipBonus}%`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      <motion.h2 
        className="text-3xl font-bold mb-6 text-[#FFB800]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💳 Painel de Doações & Economia
      </motion.h2>

      {/* Estatísticas Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-[#FFB800]/20 hover:border-[#FFB800]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-center mb-3">
            <DollarSign className="w-10 h-10 text-[#FFB800]" />
          </div>
          <p className="text-gray-400 mb-2">Total Arrecadado</p>
          <h3 className="text-4xl font-bold text-[#FFB800]">$3.215</h3>
        </motion.div>

        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-[#FFB800]/20 hover:border-[#FFB800]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center mb-3">
            <TrendingUp className="w-10 h-10 text-[#FFB800]" />
          </div>
          <p className="text-gray-400 mb-2">Transações</p>
          <h3 className="text-4xl font-bold text-[#FFB800]">124</h3>
        </motion.div>

        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-[#FFB800]/20 hover:border-[#FFB800]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-center mb-3">
            <Wallet className="w-10 h-10 text-[#FFB800]" />
          </div>
          <p className="text-gray-400 mb-2">Saldo Médio / Conta</p>
          <h3 className="text-4xl font-bold text-[#FFB800]">4.550 WCoin</h3>
        </motion.div>
      </div>

      {/* Enviar Moedas */}
      <motion.div 
        className="glass-card p-6 rounded-xl mb-10 border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Send className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Enviar Moedas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Conta destino"
            value={accountTarget}
            onChange={(e) => setAccountTarget(e.target.value)}
            className="col-span-2 p-3 bg-black/40 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none transition-colors"
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value)}
            className="p-3 bg-black/40 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none transition-colors"
          />
          <select
            value={coinType}
            onChange={(e) => setCoinType(e.target.value)}
            className="p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-[#FFB800] focus:outline-none transition-colors"
          >
            <option>WCoin</option>
            <option>Goblin Points</option>
            <option>Zen</option>
          </select>
        </div>

        <button
          onClick={handleSendCoins}
          className="bg-[#FFB800] text-black px-6 py-2 rounded-md hover:bg-[#FFC933] transition-all font-semibold flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar
        </button>
        
        {loading && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 font-semibold text-gray-400"
          >
            Enviando...
          </motion.p>
        )}
      </motion.div>

      {/* Doações Recentes */}
      <motion.div 
        className="glass-card p-6 rounded-xl mb-10 border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <History className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Doações Recentes</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Conta</th>
                <th className="p-3">Valor (USD)</th>
                <th className="p-3">Créditos</th>
                <th className="p-3">Método</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => (
                <motion.tr
                  key={donation.id}
                  className="border-b border-gray-800 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <td className="p-3 text-gray-300">{donation.date}</td>
                  <td className="p-3 text-white font-semibold">{donation.account}</td>
                  <td className="p-3 text-green-400 font-bold">${donation.amountUSD}</td>
                  <td className="p-3 text-[#FFB800]">{donation.credits.toLocaleString()} WCoin</td>
                  <td className="p-3 text-gray-300">{donation.method}</td>
                  <td className={`p-3 font-semibold ${getStatusColor(donation.status)}`}>
                    {getStatusText(donation.status)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Configurações de Doação */}
      <motion.div 
        className="glass-card p-6 rounded-xl border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Configurações de Doação</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 mb-2">Taxa de Conversão (USD → WCoin)</label>
            <input
              type="number"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-[#FFB800] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Bônus VIP (%)</label>
            <input
              type="number"
              value={vipBonus}
              onChange={(e) => setVipBonus(Number(e.target.value))}
              className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-[#FFB800] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">PayPal Client ID</label>
            <input
              type="text"
              placeholder="ex: AbC123..."
              value={paypalId}
              onChange={(e) => setPaypalId(e.target.value)}
              className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Trillex Card Key</label>
            <input
              type="text"
              placeholder="ex: TLLX-API-KEY..."
              value={trillexKey}
              onChange={(e) => setTrillexKey(e.target.value)}
              className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleSaveConfig}
          className="bg-[#FFB800] text-black px-6 py-2 rounded-md hover:bg-[#FFC933] transition-all font-semibold flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Salvar Configurações
        </button>
      </motion.div>
    </div>
  );
};

export default DonationsPanel;