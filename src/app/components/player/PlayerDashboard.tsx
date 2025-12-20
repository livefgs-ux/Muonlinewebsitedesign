import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Calendar,
  Coins,
  Users,
  Swords,
  TrendingUp,
  Activity,
  RefreshCw,
  Plus,
  Award,
  Clock,
  Shield,
  Crown,
  Zap
} from 'lucide-react';
import { formatNumber, formatDate, formatRelativeTime } from '../../utils/formatters';
import { validateStatPoints } from '../../utils/validators';
import { getStatusColor, getIconEmoji } from '../../utils/status-helpers';
import type { Character, Activity as ActivityType, Stats } from '../../types/common';

interface UserInfo {
  username: string;
  email: string;
  createdAt: string;
  status: string;
  vipLevel: number;
  mainClass: string;
}

const PlayerDashboard = () => {
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [showStatsBox, setShowStatsBox] = useState(false);
  const [statsMessage, setStatsMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Stats inputs
  const [strength, setStrength] = useState(0);
  const [agility, setAgility] = useState(0);
  const [vitality, setVitality] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [command, setCommand] = useState(0);

  // Mock data - futuramente buscar da API
  const [accountInfo] = useState<UserInfo>({
    username: 'SoulMageX',
    email: 'player@meumu.com',
    createdAt: '12/02/2024',
    status: 'Online',
    vipLevel: 2,
    mainClass: 'Grand Master'
  });

  const [userStats] = useState<Stats>({
    wcoin: 2150,
    goblinPoints: 800,
    zen: 15000000
  });

  const [characters] = useState<Character[]>([
    {
      id: 1,
      name: 'SoulMageX',
      class: 'Grand Master',
      level: 400,
      resets: 10,
      masterResets: 2,
      guild: 'Phoenix',
      online: true
    },
    {
      id: 2,
      name: 'DarkKnightX',
      class: 'Blade Knight',
      level: 380,
      resets: 8,
      masterResets: 1,
      guild: 'Phoenix',
      online: false
    },
    {
      id: 3,
      name: 'ElfArcher',
      class: 'Muse Elf',
      level: 350,
      resets: 5,
      masterResets: 0,
      guild: '-',
      online: false
    }
  ]);

  const [activities] = useState<ActivityType[]>([
    {
      id: 1,
      timestamp: '2025-12-19 02:30',
      action: 'Reset realizado no personagem SoulMageX',
      icon: '♻️'
    },
    {
      id: 2,
      timestamp: '2025-12-19 01:05',
      action: '500 pontos adicionados',
      icon: '⚡'
    },
    {
      id: 3,
      timestamp: '2025-12-18 23:45',
      action: 'Recebeu 1.000 WCoin por doação',
      icon: '💰'
    },
    {
      id: 4,
      timestamp: '2025-12-18 22:30',
      action: 'Login efetuado com sucesso',
      icon: '✅'
    }
  ]);

  const handleOpenStats = (charName: string) => {
    setSelectedChar(charName);
    setShowStatsBox(true);
    setStatsMessage('');
    // Reset inputs
    setStrength(0);
    setAgility(0);
    setVitality(0);
    setEnergy(0);
    setCommand(0);
  };

  const handleSaveStats = () => {
    const totalPoints = strength + agility + vitality + energy + command;
    
    if (totalPoints === 0) {
      setStatsMessage('❌ Adicione pelo menos 1 ponto!');
      setTimeout(() => setStatsMessage(''), 3000);
      return;
    }

    if (totalPoints > 500) {
      setStatsMessage('❌ Máximo de 500 pontos por vez!');
      setTimeout(() => setStatsMessage(''), 3000);
      return;
    }

    setIsProcessing(true);
    
    // Simular requisição ao backend
    setTimeout(() => {
      setStatsMessage(`✅ ${totalPoints} pontos adicionados com sucesso!`);
      setIsProcessing(false);
      
      // Resetar campos após 2 segundos
      setTimeout(() => {
        setStatsMessage('');
        setShowStatsBox(false);
        setStrength(0);
        setAgility(0);
        setVitality(0);
        setEnergy(0);
        setCommand(0);
      }, 2000);
    }, 1500);
  };

  const handleReset = (charName: string) => {
    const confirmed = window.confirm(
      `Deseja realmente fazer reset do personagem ${charName}?\n\n` +
      `O personagem voltará ao level 1 e ganhará +1 reset.`
    );
    
    if (confirmed) {
      setIsProcessing(true);
      
      // Simular reset
      setTimeout(() => {
        alert(`✅ Reset concluído!\n\nPersonagem: ${charName}\nNovo Level: 1\nResets: +1`);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const getTotalPoints = () => {
    return strength + agility + vitality + energy + command;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h2 
        className="text-3xl font-bold mb-6 text-[#FFB800]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎮 Painel do Jogador
      </motion.h2>

      {/* Perfil do Jogador */}
      <motion.div 
        className="glass-card p-6 rounded-xl mb-10 flex flex-col md:flex-row items-center gap-6 border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <img 
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Knight"
            alt="avatar" 
            className="w-32 h-32 rounded-full border-4 border-[#FFB800]"
          />
          {accountInfo.vipLevel > 0 && (
            <div className="absolute -top-2 -right-2 bg-[#FFB800] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
              <Crown className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-bold text-white mb-2">{accountInfo.username}</h3>
          <div className="space-y-1 text-gray-300">
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <Calendar className="w-4 h-4" />
              Conta criada em: {accountInfo.createdAt}
            </p>
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <Activity className="w-4 h-4" />
              Status: <span className="text-green-400 font-semibold">{accountInfo.status}</span>
            </p>
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <Swords className="w-4 h-4" />
              Classe Principal: <span className="text-[#FFB800] font-semibold">{accountInfo.mainClass}</span>
            </p>
            {accountInfo.vipLevel > 0 && (
              <p className="flex items-center gap-2 justify-center md:justify-start">
                <Crown className="w-4 h-4 text-[#FFB800]" />
                VIP Level: <span className="text-[#FFB800] font-bold">{accountInfo.vipLevel}</span>
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-[#FFB800]/20 hover:border-[#FFB800]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center mb-3">
            <Coins className="w-10 h-10 text-[#FFB800]" />
          </div>
          <p className="text-gray-400 mb-2">WCoin</p>
          <h3 className="text-3xl font-bold text-[#FFB800]">{formatNumber(userStats.wcoin)}</h3>
        </motion.div>

        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-green-500/20 hover:border-green-500/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-center mb-3">
            <Award className="w-10 h-10 text-green-400" />
          </div>
          <p className="text-gray-400 mb-2">Goblin Points</p>
          <h3 className="text-3xl font-bold text-green-400">{formatNumber(userStats.goblinPoints)}</h3>
        </motion.div>

        <motion.div 
          className="glass-card p-6 rounded-xl text-center border border-blue-500/20 hover:border-blue-500/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-center mb-3">
            <Zap className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-gray-400 mb-2">Zen</p>
          <h3 className="text-3xl font-bold text-blue-400">{formatNumber(userStats.zen)}</h3>
        </motion.div>
      </div>

      {/* Personagens */}
      <motion.div 
        className="glass-card p-6 rounded-xl mb-10 border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Meus Personagens</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="p-3">Nome</th>
                <th className="p-3">Classe</th>
                <th className="p-3">Level</th>
                <th className="p-3">Resets</th>
                <th className="p-3">M.Resets</th>
                <th className="p-3">Guild</th>
                <th className="p-3">Status</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {characters.map((char, index) => (
                <motion.tr
                  key={char.id}
                  className="border-b border-gray-800 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <td className="p-3 text-white font-semibold">{char.name}</td>
                  <td className="p-3 text-gray-300">{char.class}</td>
                  <td className="p-3 text-blue-400 font-bold">{char.level}</td>
                  <td className="p-3 text-green-400 font-bold">{char.resets}</td>
                  <td className="p-3 text-purple-400 font-bold">{char.masterResets}</td>
                  <td className="p-3 text-gray-300">{char.guild}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      char.online 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${char.online ? 'bg-green-400' : 'bg-gray-400'}`} />
                      {char.online ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleOpenStats(char.name)}
                      className="text-blue-400 hover:text-blue-300 transition-colors font-semibold mr-3"
                      disabled={isProcessing}
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add Stats
                    </button>
                    <button
                      onClick={() => handleReset(char.name)}
                      className="text-[#FFB800] hover:text-yellow-300 transition-colors font-semibold"
                      disabled={isProcessing}
                    >
                      <RefreshCw className="w-4 h-4 inline mr-1" />
                      Reset
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Stats Box */}
      {showStatsBox && (
        <motion.div 
          className="glass-card p-6 rounded-xl mb-10 border border-blue-500/30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-semibold text-blue-400">
              Add Stats — <span className="text-[#FFB800]">{selectedChar}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Força (STR)</label>
              <input
                type="number"
                value={strength || ''}
                onChange={(e) => setStrength(parseInt(e.target.value) || 0)}
                min="0"
                placeholder="0"
                className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Agilidade (AGI)</label>
              <input
                type="number"
                value={agility || ''}
                onChange={(e) => setAgility(parseInt(e.target.value) || 0)}
                min="0"
                placeholder="0"
                className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Vitalidade (VIT)</label>
              <input
                type="number"
                value={vitality || ''}
                onChange={(e) => setVitality(parseInt(e.target.value) || 0)}
                min="0"
                placeholder="0"
                className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Energia (ENE)</label>
              <input
                type="number"
                value={energy || ''}
                onChange={(e) => setEnergy(parseInt(e.target.value) || 0)}
                min="0"
                placeholder="0"
                className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Comando (CMD)</label>
              <input
                type="number"
                value={command || ''}
                onChange={(e) => setCommand(parseInt(e.target.value) || 0)}
                min="0"
                placeholder="0"
                className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <p className="text-gray-300">
              Total de pontos: <span className="text-[#FFB800] font-bold text-xl">{getTotalPoints()}</span>
              <span className="text-gray-500 ml-2">(máx: 500)</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveStats}
              disabled={isProcessing || getTotalPoints() === 0}
              className="bg-[#FFB800] text-black px-6 py-3 rounded-md hover:bg-[#FFC933] transition-all font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Salvar Stats
                </>
              )}
            </button>
            <button
              onClick={() => setShowStatsBox(false)}
              className="bg-black/40 text-gray-300 px-6 py-3 rounded-md border border-gray-600 hover:bg-black/60 transition-all font-semibold"
            >
              Cancelar
            </button>
          </div>

          {statsMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 font-semibold ${
                statsMessage.includes('✅') ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {statsMessage}
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Últimas Atividades */}
      <motion.div 
        className="glass-card p-6 rounded-xl border border-[#FFB800]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-[#FFB800]" />
          <h3 className="text-2xl font-semibold text-[#FFB800]">Últimas Atividades</h3>
        </div>

        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <motion.li
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-gray-300">{activity.action}</p>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.timestamp}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default PlayerDashboard;