import { formatNumber, formatDate, formatRelativeTime, formatLocalizedCurrency } from '../../../utils/formatters';
import { validateStatPoints } from '../../../utils/validators';
import { getStatusColor, getIconEmoji } from '../../../utils/status-helpers';
import type { Character, Activity as ActivityType, Stats } from '../../../types/common';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-toastify';
import { API_CONFIG } from '../../config/api';

interface UserInfo {
  username: string;
  email: string;
  password: string;
  createdAt: string;
  status: string;
  vipLevel: number;
  mainClass: string;
  accountStatus: string;
  onlineStatus: string;
}

interface ExtendedCharacter extends Character {
  location: string;
  coords: string;
  lastLogin: Date;
  stats: {
    str: number;
    agi: number;
    vit: number;
    ene: number;
    points: number;
  };
}

interface PlayerDashboardProps {
  onLogout?: () => void;
}

type TabType = 'account' | 'characters' | 'stats' | 'reset' | 'shop' | 'tickets' | 'settings';

const PlayerDashboard = ({ onLogout }: PlayerDashboardProps) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [selectedChar, setSelectedChar] = useState<ExtendedCharacter | null>(null);
  const [showStatsBox, setShowStatsBox] = useState(false);
  const [statsMessage, setStatsMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Stats inputs
  const [pointsToAdd, setPointsToAdd] = useState({ str: 0, agi: 0, vit: 0, ene: 0 });
  
  // Account settings
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Transfer states
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);

  // Ticket states
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  // Shop states
  const [wcoinPackages, setWcoinPackages] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Mock data - futuramente buscar da API
  const [accountInfo] = useState<UserInfo>({
    username: 'SoulMageX',
    email: 'player@meumu.com',
    password: '********',
    createdAt: '12/02/2024',
    status: 'Online',
    vipLevel: 2,
    mainClass: 'Grand Master',
    accountStatus: 'Active',
    onlineStatus: 'Offline'
  });

  const [userStats] = useState<Stats>({
    wcoin: 2150,
    goblinPoints: 800,
    zen: 15000000
  });

  const [characters] = useState<ExtendedCharacter[]>([
    {
      id: 1,
      name: 'SoulMageX',
      class: 'Grand Master',
      level: 400,
      resets: 10,
      masterResets: 2,
      guild: 'Phoenix',
      online: false,
      location: 'Noria',
      coords: '175, 96',
      lastLogin: new Date('2024-12-19 14:30:00'),
      stats: { str: 950, agi: 1200, vit: 1500, ene: 4800, points: 1250 }
    },
    {
      id: 2,
      name: 'DarkKnightX',
      class: 'Blade Knight',
      level: 380,
      resets: 8,
      masterResets: 1,
      guild: 'Phoenix',
      online: false,
      location: 'Lorencia',
      coords: '132, 121',
      lastLogin: new Date('2024-12-19 12:15:00'),
      stats: { str: 3250, agi: 1800, vit: 2100, ene: 850, points: 890 }
    },
    {
      id: 3,
      name: 'ElfArcher',
      class: 'Muse Elf',
      level: 350,
      resets: 5,
      masterResets: 0,
      guild: '-',
      online: false,
      location: 'Devias',
      coords: '215, 45',
      lastLogin: new Date('2024-12-19 10:00:00'),
      stats: { str: 700, agi: 3800, vit: 1200, ene: 2100, points: 650 }
    },
    {
      id: 4,
      name: 'ArchMage',
      class: 'Grand Master',
      level: 388,
      resets: 98,
      masterResets: 0,
      guild: '-',
      online: false,
      location: 'Dungeon',
      coords: '88, 143',
      lastLogin: new Date('2024-12-18 18:20:00'),
      stats: { str: 800, agi: 1100, vit: 1300, ene: 5200, points: 750 }
    },
    {
      id: 5,
      name: 'ElfQueen',
      class: 'Muse Elf',
      level: 380,
      resets: 85,
      masterResets: 0,
      guild: '-',
      online: false,
      location: 'Atlans',
      coords: '45, 98',
      lastLogin: new Date('2024-12-17 22:30:00'),
      stats: { str: 700, agi: 3800, vit: 1200, ene: 2100, points: 650 }
    },
    {
      id: 6,
      name: 'DarkLord99',
      class: 'Lord Emperor',
      level: 375,
      resets: 72,
      masterResets: 0,
      guild: '-',
      online: false,
      location: 'Tarkan',
      coords: '120, 85',
      lastLogin: new Date('2024-12-16 16:45:00'),
      stats: { str: 2800, agi: 1500, vit: 1800, ene: 1200, points: 580 }
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


  // Initialize email and password from accountInfo
  useEffect(() => {
    setEmail(accountInfo.email);
    setPassword(accountInfo.password);
  }, [accountInfo]);

  // Carregar pacotes de WCoin do backend
  useEffect(() => {
    const loadWCoinPackages = async () => {
      try {
        setLoadingPackages(true);
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WCOIN_PACKAGES}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setWcoinPackages(data.data);
        } else {
          console.error('Erro ao carregar pacotes de WCoin');
          // Fallback para pacotes padrão se o backend não estiver disponível
          setWcoinPackages([]);
        }
      } catch (error) {
        console.error('Erro ao conectar com o backend:', error);
        // Fallback para pacotes padrão se o backend não estiver disponível
        setWcoinPackages([]);
      } finally {
        setLoadingPackages(false);
      }
    };

    loadWCoinPackages();
  }, []);

  // Ordenar personagens por último login (mais recente primeiro)
  const sortedCharacters = [...characters].sort((a, b) => 
    b.lastLogin.getTime() - a.lastLogin.getTime()
  );

  // Mostrar apenas os 3 últimos personagens logados
  const displayedCharacters = sortedCharacters.slice(0, 3);

  // Verificar se pode executar ação no personagem
  const canPerformAction = () => {
    if (!selectedChar) {
      alert('⚠️ Por favor, selecione um personagem primeiro!');
      return false;
    }
    if (selectedChar.online) {
      alert('⚠️ O personagem está online no jogo! Para usar esta função, você precisa desconectar o personagem do servidor.');
      return false;
    }
    return true;
  };

  // Função para selecionar personagem
  const handleSelectCharacter = (char: ExtendedCharacter) => {
    setSelectedChar(char);
    // Reset points when changing character
    setPointsToAdd({ str: 0, agi: 0, vit: 0, ene: 0 });
  };

  const handleAddPoints = (stat: string) => {
    if (!selectedChar) return;
    
    const total = Object.values(pointsToAdd).reduce((a, b) => a + b, 0);
    if (total < selectedChar.stats.points) {
      setPointsToAdd({ ...pointsToAdd, [stat]: pointsToAdd[stat as keyof typeof pointsToAdd] + 1 });
    }
  };

  const handleApplyPoints = () => {
    if (!canPerformAction()) return;
    
    const total = Object.values(pointsToAdd).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
      alert('❌ Adicione pelo menos 1 ponto!');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      alert(`✅ ${total} pontos distribuídos com sucesso!\n\nSTR: +${pointsToAdd.str}\nAGI: +${pointsToAdd.agi}\nVIT: +${pointsToAdd.vit}\nENE: +${pointsToAdd.ene}`);
      setIsProcessing(false);
      setPointsToAdd({ str: 0, agi: 0, vit: 0, ene: 0 });
    }, 1500);
  };

  const handleReset = () => {
    if (!canPerformAction()) return;
    
    if (selectedChar && selectedChar.level >= 400) {
      const confirmed = window.confirm(
        `Deseja realmente fazer reset do personagem ${selectedChar.name}?\n\n` +
        `O personagem voltará ao level 1 e ganhará +1 reset.`
      );
      
      if (confirmed) {
        setIsProcessing(true);
        setTimeout(() => {
          alert(`✅ Reset concluído!\n\nPersonagem: ${selectedChar.name}\nNovo Level: 1\nResets: ${selectedChar.resets + 1}`);
          setIsProcessing(false);
        }, 2000);
      }
    } else {
      alert(`Seu personagem precisa estar no nível 400 para fazer reset!\n\nNível atual: ${selectedChar?.level}\nFaltam: ${400 - (selectedChar?.level || 0)} níveis`);
    }
  };

  const handleUnstuck = () => {
    if (!canPerformAction()) return;
    alert(`✅ Personagem ${selectedChar?.name} desbloqueado com sucesso!`);
  };

  const handleClearPK = () => {
    if (!canPerformAction()) return;
    alert(`✅ PK limpo com sucesso para ${selectedChar?.name}!`);
  };

  const handleResetStats = () => {
    if (!canPerformAction()) return;
    const confirmed = window.confirm(
      `Deseja realmente resetar os stats do personagem ${selectedChar?.name}?\n\n` +
      `Todos os pontos distribuídos voltarão para pontos disponíveis.`
    );
    
    if (confirmed) {
      alert(`✅ Stats resetados com sucesso para ${selectedChar?.name}!`);
    }
  };

  const handleTransfer = () => {
    if (!transferFrom || !transferTo) {
      alert('❌ Selecione os personagens de origem e destino!');
      return;
    }
    if (transferFrom === transferTo) {
      alert('❌ Não é possível transferir para o mesmo personagem!');
      return;
    }
    if (transferAmount <= 0) {
      alert('❌ Digite um valor válido!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      alert(`✅ Transferência concluída!\n\n${formatNumber(transferAmount)} Zen transferido de ${transferFrom} para ${transferTo}`);
      setIsProcessing(false);
      setTransferFrom('');
      setTransferTo('');
      setTransferAmount(0);
    }, 1500);
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketMessage) {
      alert('❌ Preencha todos os campos!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      alert('✅ Ticket enviado com sucesso!\n\nNossa equipe responderá em breve.');
      setIsProcessing(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 1500);
  };

  const handleSaveEmail = () => {
    setIsEditingEmail(false);
    alert('✅ Email atualizado com sucesso!');
  };

  const handleSavePassword = () => {
    setIsEditingPassword(false);
    alert('✅ Senha atualizada com sucesso!');
  };

  const tabs = [
    { id: 'account', name: t('dashboard.myAccount'), icon: Shield },
    { id: 'characters', name: t('dashboard.characters'), icon: Users },
    { id: 'stats', name: t('dashboard.addStats'), icon: TrendingUp },
    { id: 'reset', name: t('dashboard.resetSystem'), icon: RefreshCw },
    { id: 'shop', name: t('dashboard.cashShop'), icon: ShoppingCart },
    { id: 'tickets', name: 'Suporte', icon: MessageSquare },
    { id: 'settings', name: 'Configurações', icon: Settings }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto pt-28 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">{t('dashboard.welcomeBack')}, {accountInfo.username}</h2>
          <p className="text-gray-400">{t('dashboard.manageCharacters')}</p>
        </motion.div>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/40 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>

      {/* Character Selection */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-[#FFB800]" />
            3 Últimos Personagens Logados
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayedCharacters.map((char) => (
            <motion.div
              key={char.id}
              onClick={() => handleSelectCharacter(char)}
              className={`cursor-pointer backdrop-blur-xl bg-black/60 p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                selectedChar?.id === char.id
                  ? 'bg-[#FFB800]/20 border-[#FFB800]'
                  : 'border-[#FFB800]/30 hover:border-[#FFB800]/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Layout Horizontal Compacto */}
              <div className="flex items-center gap-4">
                {/* Ícone da Espada */}
                <div className="w-14 h-14 bg-gradient-to-br from-[#FFB800] to-yellow-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sword className="w-7 h-7 text-black" />
                </div>
                
                {/* Informações do Personagem */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg text-white font-semibold truncate">{char.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ml-2 flex-shrink-0 ${
                      char.online 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${char.online ? 'bg-green-400' : 'bg-gray-400'}`} />
                      {char.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2 truncate">{char.class}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Level</span>
                      <span className="text-[#FFB800] font-bold">{char.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Resets</span>
                      <span className="text-[#FFB800] font-bold">{char.resets}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Localização e Último Login */}
              <div className="mt-3 pt-3 border-t border-[#FFB800]/20 space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#FFB800] flex-shrink-0" />
                  <span className="text-gray-400 truncate">{char.location} ({char.coords})</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-500 truncate">
                    {char.lastLogin.toLocaleDateString('pt-BR')} às {char.lastLogin.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-semibold ${
                  activeTab === tab.id
                    ? 'bg-[#FFB800] text-black'
                    : 'backdrop-blur-xl bg-black/60 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* MINHA CONTA TAB */}
        {activeTab === 'account' && (
          <motion.div
            key="account"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Account Information */}
            <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/40 shadow-lg shadow-[#FFB800]/10">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-[#FFB800]" />
                <h3 className="text-2xl text-white font-semibold">Informações da Conta</h3>
              </div>

              <div className="space-y-6">
                {/* Account Status */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Status da Conta:</label>
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-lg font-semibold ${
                      accountInfo.accountStatus === 'Active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}>
                      {accountInfo.accountStatus}
                    </span>
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Nome de Usuário:</label>
                  <div className="bg-black/50 border border-[#FFB800]/30 rounded-lg px-4 py-3">
                    <p className="text-white font-semibold">{accountInfo.username}</p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Endereço de Email:</label>
                  <div className="flex gap-2">
                    {isEditingEmail ? (
                      <>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 bg-black/50 border border-[#FFB800]/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                        />
                        <button
                          onClick={handleSaveEmail}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg font-semibold transition-all"
                        >
                          Salvar
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 bg-black/50 border border-[#FFB800]/30 rounded-lg px-4 py-3 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#FFB800]" />
                          <p className="text-white">{email}</p>
                        </div>
                        <button
                          onClick={() => setIsEditingEmail(true)}
                          className="bg-[#FFB800] hover:bg-[#FFC933] text-black px-6 rounded-lg font-semibold transition-all"
                        >
                          Trocar
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Password:</label>
                  <div className="flex gap-2">
                    {isEditingPassword ? (
                      <>
                        <div className="flex-1 relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-[#FFB800]/50 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFB800]"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <button
                          onClick={handleSavePassword}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg font-semibold transition-all"
                        >
                          Salvar
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 bg-black/50 border border-[#FFB800]/30 rounded-lg px-4 py-3 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-[#FFB800]" />
                          <p className="text-white flex-1">
                            {showPassword ? password : '••••••••••'}
                          </p>
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-[#FFB800]"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <button
                          onClick={() => setIsEditingPassword(true)}
                          className="bg-[#FFB800] hover:bg-[#FFC933] text-black px-6 rounded-lg font-semibold transition-all"
                        >
                          Trocar
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Online Status */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Online Status:</label>
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-lg font-semibold ${
                      accountInfo.onlineStatus === 'Online' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}>
                      {accountInfo.onlineStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Control Panel */}
            <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/40 shadow-lg shadow-[#FFB800]/10">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-6 h-6 text-[#FFB800]" />
                <h3 className="text-2xl text-white font-semibold">Painel de Controle</h3>
              </div>

              {/* Aviso quando nenhum personagem está selecionado */}
              {!selectedChar && (
                <div className="mb-4 p-4 bg-[#FFB800]/20 border border-[#FFB800]/50 rounded-lg">
                  <p className="text-[#FFB800] text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    ⚠️ Por favor, selecione um personagem acima para usar as funções
                  </p>
                </div>
              )}

              {/* Aviso quando personagem está online */}
              {selectedChar && selectedChar.online && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    ⚠️ O personagem <strong>{selectedChar.name}</strong> está online! Desconecte do jogo para usar as funções.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button className="w-full justify-start bg-gradient-to-r from-blue-600/30 to-blue-700/30 border border-blue-500/50 text-blue-400 hover:from-blue-600/50 hover:to-blue-700/50 py-4 px-4 rounded-lg flex items-center gap-3 transition-all font-semibold">
                  <Shield className="w-5 h-5" />
                  Minha Conta
                </button>
                
                <button 
                  onClick={() => {
                    if (canPerformAction()) {
                      setActiveTab('reset');
                    }
                  }}
                  disabled={!selectedChar || selectedChar?.online}
                  className={`w-full justify-start py-4 px-4 rounded-lg flex items-center gap-3 transition-all font-semibold ${
                    !selectedChar || selectedChar?.online
                      ? 'bg-black/30 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                      : 'backdrop-blur-xl bg-black/60 border border-[#FFB800]/20 text-gray-300 hover:bg-[#FFB800]/10 hover:border-[#FFB800]/30'
                  }`}
                >
                  <Swords className="w-5 h-5" />
                  Reset Character
                </button>
                
                <button 
                  onClick={handleUnstuck}
                  disabled={!selectedChar || selectedChar?.online}
                  className={`w-full justify-start py-4 px-4 rounded-lg flex items-center gap-3 transition-all font-semibold ${
                    !selectedChar || selectedChar?.online
                      ? 'bg-black/30 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                      : 'backdrop-blur-xl bg-black/60 border border-[#FFB800]/20 text-gray-300 hover:bg-[#FFB800]/10 hover:border-[#FFB800]/30'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Unstuck Character
                </button>
                
                <button 
                  onClick={handleClearPK}
                  disabled={!selectedChar || selectedChar?.online}
                  className={`w-full justify-start py-4 px-4 rounded-lg flex items-center gap-3 transition-all font-semibold ${
                    !selectedChar || selectedChar?.online
                      ? 'bg-black/30 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                      : 'backdrop-blur-xl bg-black/60 border border-[#FFB800]/20 text-gray-300 hover:bg-[#FFB800]/10 hover:border-[#FFB800]/30'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  Clear PK
                </button>
                
                <button 
                  onClick={() => {
                    if (canPerformAction()) {
                      handleResetStats();
                    }
                  }}
                  disabled={!selectedChar || selectedChar?.online}
                  className={`w-full justify-start py-4 px-4 rounded-lg flex items-center gap-3 transition-all font-semibold ${
                    !selectedChar || selectedChar?.online
                      ? 'bg-black/30 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                      : 'backdrop-blur-xl bg-black/60 border border-[#FFB800]/20 text-gray-300 hover:bg-[#FFB800]/10 hover:border-[#FFB800]/30'
                  }`}
                >
                  <Crown className="w-5 h-5" />
                  Reset Stats
                </button>
                
                <button 
                  onClick={() => {
                    if (canPerformAction()) {
                      setActiveTab('stats');
                    }
                  }}
                  disabled={!selectedChar || selectedChar?.online}
                  className={`w-full justify-start py-4 px-4 rounded-lg flex items-center gap-3 transition-all font-semibold ${
                    !selectedChar || selectedChar?.online
                      ? 'bg-black/30 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                      : 'backdrop-blur-xl bg-black/60 border border-[#FFB800]/20 text-gray-300 hover:bg-[#FFB800]/10 hover:border-[#FFB800]/30'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  Add Stats
                </button>
                
                <button className="w-full justify-start backdrop-blur-xl bg-black/60 border border-[#FFB800]/20 text-gray-300 hover:bg-[#FFB800]/10 hover:border-[#FFB800]/30 py-4 px-4 rounded-lg flex items-center gap-3 transition-all font-semibold">
                  <Crown className="w-5 h-5" />
                  Vote for Credits
                </button>
                
                <button 
                  onClick={() => setActiveTab('shop')}
                  className="w-full justify-start backdrop-blur-xl bg-black/60 border border-[#FFB800]/20 text-gray-300 hover:bg-[#FFB800]/10 hover:border-[#FFB800]/30 py-4 px-4 rounded-lg flex items-center gap-3 transition-all font-semibold"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy Credits
                </button>
                
                <button className="w-full justify-start backdrop-blur-xl bg-black/60 border border-[#FFB800]/20 text-gray-300 hover:bg-[#FFB800]/10 hover:border-[#FFB800]/30 py-4 px-4 rounded-lg flex items-center gap-3 transition-all font-semibold">
                  <Coins className="w-5 h-5" />
                  Buy Zen
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* CHARACTERS TAB */}
        {activeTab === 'characters' && (
          <motion.div
            key="characters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-[#FFB800]" />
              <h3 className="text-2xl font-semibold text-[#FFB800]">Todos os Personagens</h3>
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
                    <th className="p-3">Localização</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCharacters.map((char) => (
                    <tr
                      key={char.id}
                      onClick={() => handleSelectCharacter(char)}
                      className={`border-b border-gray-800 hover:bg-white/5 transition-colors cursor-pointer ${
                        selectedChar?.id === char.id ? 'bg-[#FFB800]/10' : ''
                      }`}
                    >
                      <td className="p-3 text-white font-semibold">{char.name}</td>
                      <td className="p-3 text-gray-300">{char.class}</td>
                      <td className="p-3 text-blue-400 font-bold">{char.level}</td>
                      <td className="p-3 text-green-400 font-bold">{char.resets}</td>
                      <td className="p-3 text-purple-400 font-bold">{char.masterResets}</td>
                      <td className="p-3 text-gray-300">{char.guild}</td>
                      <td className="p-3 text-gray-400 text-sm">{char.location} ({char.coords})</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ADD STATS TAB */}
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-xl bg-black/60 p-8 rounded-xl border border-[#FFB800]/30"
          >
            <h3 className="text-2xl text-white mb-6 font-semibold">
              Distribuição de Pontos - <span className="text-[#FFB800]">{selectedChar?.name || 'Selecione um personagem'}</span>
            </h3>
            
            {!selectedChar && (
              <div className="mb-6 p-4 bg-[#FFB800]/20 border border-[#FFB800]/50 rounded-lg">
                <p className="text-[#FFB800] text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Por favor, selecione um personagem primeiro
                </p>
              </div>
            )}

            {selectedChar && (
              <>
                <div className="mb-8 p-4 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Pontos Disponíveis:</span>
                    <span className="text-2xl text-[#FFB800] font-bold">
                      {selectedChar.stats.points - Object.values(pointsToAdd).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[
                    { key: 'str', label: 'Força (STR)', icon: Sword, current: selectedChar.stats.str, color: 'red' },
                    { key: 'agi', label: 'Agilidade (AGI)', icon: Zap, current: selectedChar.stats.agi, color: 'green' },
                    { key: 'vit', label: 'Vitalidade (VIT)', icon: Heart, current: selectedChar.stats.vit, color: 'pink' },
                    { key: 'ene', label: 'Energia (ENE)', icon: Shield, current: selectedChar.stats.ene, color: 'blue' },
                  ].map((stat) => (
                    <div key={stat.key} className="p-4 bg-black/30 rounded-lg border border-[#FFB800]/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <stat.icon className="w-5 h-5 text-[#FFB800]" />
                          <span className="text-white font-semibold">{stat.label}</span>
                        </div>
                        <span className="text-gray-400">Atual: {stat.current}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={pointsToAdd[stat.key as keyof typeof pointsToAdd]}
                          readOnly
                          className="flex-1 bg-black/50 border border-[#FFB800]/30 text-white text-center p-3 rounded-lg font-semibold"
                        />
                        <button
                          onClick={() => handleAddPoints(stat.key)}
                          disabled={!selectedChar || selectedChar.online}
                          className="bg-[#FFB800]/20 hover:bg-[#FFB800]/30 text-[#FFB800] border border-[#FFB800]/50 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleApplyPoints}
                  disabled={!selectedChar || selectedChar.online || isProcessing}
                  className="w-full bg-gradient-to-r from-[#FFB800] to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Aplicar Pontos
                    </>
                  )}
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* RESET TAB */}
        {activeTab === 'reset' && (
          <motion.div
            key="reset"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-xl bg-black/60 p-8 rounded-xl border border-[#FFB800]/30"
          >
            <h3 className="text-2xl text-white mb-6 font-semibold">
              Sistema de Reset - <span className="text-[#FFB800]">{selectedChar?.name || 'Selecione um personagem'}</span>
            </h3>
            
            {!selectedChar && (
              <div className="mb-6 p-4 bg-[#FFB800]/20 border border-[#FFB800]/50 rounded-lg">
                <p className="text-[#FFB800] text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Por favor, selecione um personagem primeiro
                </p>
              </div>
            )}

            {selectedChar && (
              <>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-black/30 rounded-lg border border-[#FFB800]/20">
                      <div className="text-gray-400 text-sm mb-1">Nível Atual</div>
                      <div className="text-2xl text-[#FFB800] font-bold">{selectedChar.level}</div>
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg border border-[#FFB800]/20">
                      <div className="text-gray-400 text-sm mb-1">Resets Totais</div>
                      <div className="text-2xl text-[#FFB800] font-bold">{selectedChar.resets}</div>
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg border border-[#FFB800]/20">
                      <div className="text-gray-400 text-sm mb-1">Nível Necessário</div>
                      <div className="text-2xl text-white font-bold">400</div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-lg">
                    <h4 className="text-white mb-3 font-semibold">Benefícios do Reset:</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Ganhe pontos extras de atributos
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Acesse áreas exclusivas de reset
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Desbloqueie novos títulos e recompensas
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Suba no ranking de resets
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleReset}
                    disabled={!selectedChar || selectedChar.online || selectedChar.level < 400 || isProcessing}
                    className="w-full bg-gradient-to-r from-[#FFB800] to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        {selectedChar.level >= 400 ? 'Fazer Reset Agora' : `Faltam ${400 - selectedChar.level} níveis para Reset`}
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <motion.div
            key="shop"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="w-6 h-6 text-[#FFB800]" />
              <h3 className="text-2xl font-semibold text-[#FFB800]">Loja de Créditos</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wcoinPackages.map((pack, index) => {
                // Obter link de compra configurado no AdminCP ou usar padrão
                const purchaseLinks = JSON.parse(localStorage.getItem('wcoin_purchase_links') || '{}');
                const defaultLink = purchaseLinks.default || '#';
                const packageLink = purchaseLinks[`package_${pack.wcoin}`] || purchaseLinks[`package_${pack.wcoin_amount}`] || defaultLink;
                
                // Formatar preço de acordo com o idioma selecionado
                const localizedPrice = formatLocalizedCurrency(Number(pack.price), language);
                
                return (
                  <div
                    key={index}
                    className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20 hover:border-[#FFB800]/60 transition-all text-center flex flex-col"
                  >
                    <div className="flex justify-center mb-3">
                      <Coins className="w-12 h-12 text-[#FFB800]" />
                    </div>
                    <h4 className="text-2xl font-bold text-[#FFB800] mb-2">{formatNumber(pack.wcoin_amount || pack.wcoin)} WCoin</h4>
                    {/* Container com altura fixa para o bônus */}
                    <div className="h-6 mb-2">
                      {(pack.bonus_amount || pack.bonus || 0) > 0 && (
                        <p className="text-green-400 text-sm">+ {formatNumber(pack.bonus_amount || pack.bonus)} {t('bonus')}!</p>
                      )}
                    </div>
                    <p className="text-3xl font-bold text-white mb-4">{localizedPrice}</p>
                    {/* Espaçador flex para empurrar botão para baixo */}
                    <div className="flex-grow"></div>
                    <button 
                      onClick={() => {
                        if (packageLink === '#') {
                          toast.error('⚠️ Sistema de compra ainda não configurado. Contate o administrador.');
                        } else {
                          window.open(packageLink, '_blank');
                        }
                      }}
                      className="w-full bg-[#FFB800] text-black py-3 rounded-md hover:bg-[#FFC933] transition-all font-semibold mt-auto"
                    >
                      {t('buyNow')}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}



        {/* TICKETS TAB */}
        {activeTab === 'tickets' && (
          <motion.div
            key="tickets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Create Ticket */}
            <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Send className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-semibold text-green-400">Abrir Novo Ticket</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Assunto</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Ex: Problema com reset"
                    className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-green-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Mensagem</label>
                  <textarea
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Descreva seu problema detalhadamente..."
                    rows={6}
                    className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-green-400 focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmitTicket}
                  disabled={isProcessing}
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-all font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Enviar Ticket
                </button>
              </div>
            </div>

            {/* Tickets List */}
            <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-[#FFB800]" />
                <h3 className="text-2xl font-semibold text-[#FFB800]">Meus Tickets</h3>
              </div>

              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="backdrop-blur-xl bg-black/60 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{ticket.subject}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        ticket.status === 'Resolvido' 
                          ? 'bg-green-500/20 text-green-400'
                          : ticket.status === 'Respondido'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ticket.date}
                      </span>
                      <span>Última resposta: {ticket.lastReply}</span>
                    </div>
                    <button className="mt-2 text-[#FFB800] hover:text-[#FFC933] text-sm font-semibold">
                      Ver Detalhes <ChevronRight className="w-3 h-3 inline" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Account Settings */}
            <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-[#FFB800]/20">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-[#FFB800]" />
                <h3 className="text-2xl font-semibold text-[#FFB800]">Configurações da Conta</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={accountInfo.email}
                    disabled
                    className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Alterar Senha</label>
                  <input
                    type="password"
                    placeholder="Nova senha"
                    className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-[#FFB800] focus:outline-none mb-2"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    className="w-full p-3 bg-black/40 border border-gray-700 rounded-md text-white focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <button className="bg-[#FFB800] text-black px-6 py-3 rounded-md hover:bg-[#FFC933] transition-all font-semibold">
                  Salvar Alterações
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="backdrop-blur-xl bg-black/60 p-6 rounded-xl border border-red-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-red-400" />
                <h3 className="text-2xl font-semibold text-red-400">Segurança</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Nunca compartilhe sua senha com ninguém. A equipe MeuMU NUNCA pedirá sua senha.
                  </p>
                </div>

                <button className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-all font-semibold">
                  Ativar Autenticação em Duas Etapas
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerDashboard;