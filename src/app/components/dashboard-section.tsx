import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Users, Settings, User, Shield, Trophy, Calendar, LogOut, Eye, EyeOff, Mail, Lock, Swords, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';

// ⚠️ REMOVIDO figma:asset - usando placeholder
const characterPlaceholder = 'https://via.placeholder.com/400x600/1a1a1a/FFB800?text=Character';

// Mock data
const mockUser = {
  username: 'SaulNoob',
  email: 'saul@muserver.com',
  password: '********',
  vipStatus: 'VIP Gold',
  vipExpiry: '15/02/2024',
  accountStatus: 'Active', // Status da conta
  onlineStatus: 'Offline', // Status online/offline
  characters: [
    {
      id: 1,
      name: 'SaulNoob',
      class: 'Dark Knight',
      level: 400,
      resets: 175,
      location: 'Noria',
      coords: '175, 96',
      online: false,
      lastLogin: new Date('2024-12-17T14:30:00'), // Último login mais recente
      stats: {
        str: 3250,
        agi: 1800,
        vit: 2100,
        ene: 850,
        points: 1250
      }
    },
    {
      id: 2,
      name: 'AgoraVAI',
      class: 'Soul Master',
      level: 400,
      resets: 148,
      location: 'Lorencia',
      coords: '132, 121',
      online: false,
      lastLogin: new Date('2024-12-17T12:15:00'), // Segundo último login
      stats: {
        str: 950,
        agi: 1200,
        vit: 1500,
        ene: 4800,
        points: 890
      }
    },
    {
      id: 3,
      name: 'MageWarrior',
      class: 'Blade Knight',
      level: 395,
      resets: 132,
      location: 'Devias',
      coords: '215, 45',
      online: false,
      lastLogin: new Date('2024-12-17T10:00:00'), // Terceiro último login
      stats: {
        str: 3100,
        agi: 1650,
        vit: 1950,
        ene: 700,
        points: 1100
      }
    },
    {
      id: 4,
      name: 'ArchMage',
      class: 'Grand Master',
      level: 388,
      resets: 98,
      location: 'Dungeon',
      coords: '88, 143',
      online: false,
      lastLogin: new Date('2024-12-16T18:20:00'),
      stats: {
        str: 800,
        agi: 1100,
        vit: 1300,
        ene: 5200,
        points: 750
      }
    },
    {
      id: 5,
      name: 'ElfQueen',
      class: 'Muse Elf',
      level: 380,
      resets: 85,
      location: 'Atlans',
      coords: '45, 98',
      online: false,
      lastLogin: new Date('2024-12-15T22:30:00'),
      stats: {
        str: 700,
        agi: 3800,
        vit: 1200,
        ene: 2100,
        points: 650
      }
    },
    {
      id: 6,
      name: 'DarkLord99',
      class: 'Lord Emperor',
      level: 375,
      resets: 72,
      location: 'Tarkan',
      coords: '120, 85',
      online: false,
      lastLogin: new Date('2024-12-14T16:45:00'),
      stats: {
        str: 2800,
        agi: 1500,
        vit: 1800,
        ene: 1200,
        points: 580
      }
    }
  ],
};

export function DashboardSection({ onLoginSuccess, isLoggedIn: isLoggedInProp, onLogout }: { 
  onLoginSuccess?: (username: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp || false);
  const [selectedChar, setSelectedChar] = useState<typeof mockUser.characters[0] | null>(null); // Nenhum personagem selecionado inicialmente
  const [pointsToAdd, setPointsToAdd] = useState({ str: 0, agi: 0, vit: 0, ene: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [email, setEmail] = useState(mockUser.email);
  const [password, setPassword] = useState(mockUser.password);
  const [username, setUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showAllCharacters, setShowAllCharacters] = useState(false); // Estado para controlar exibição de todos os personagens
  const [activeTab, setActiveTab] = useState('account'); // Estado para controlar aba ativa

  // Ordenar personagens por último login (mais recente primeiro)
  const sortedCharacters = [...mockUser.characters].sort((a, b) => 
    b.lastLogin.getTime() - a.lastLogin.getTime()
  );

  // Mostrar apenas os 3 últimos personagens logados, a menos que showAllCharacters seja true
  const displayedCharacters = showAllCharacters 
    ? sortedCharacters 
    : sortedCharacters.slice(0, 3);

  // Função para selecionar personagem e mudar para aba de conta
  const handleSelectCharacter = (char: typeof mockUser.characters[0]) => {
    setSelectedChar(char);
    setActiveTab('account'); // Muda para aba Minha Conta
  };

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    // Call parent callback to update app-wide login state
    if (onLoginSuccess) {
      onLoginSuccess(username || mockUser.username);
    }
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Update local state when prop changes
  if (isLoggedInProp !== undefined && isLoggedInProp !== isLoggedIn) {
    setIsLoggedIn(isLoggedInProp);
  }

  const handleAddPoints = (stat: string) => {
    const total = Object.values(pointsToAdd).reduce((a, b) => a + b, 0);
    if (total < selectedChar?.stats.points) {
      setPointsToAdd({ ...pointsToAdd, [stat]: pointsToAdd[stat as keyof typeof pointsToAdd] + 1 });
    }
  };

  const handleReset = () => {
    if (selectedChar && selectedChar.level >= 400) {
      alert(`Reset realizado com sucesso para ${selectedChar.name}! Novo reset: ${selectedChar.resets + 1}`);
    } else {
      alert('Seu personagem precisa estar no nível 400 para fazer reset!');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/50">
                  <User className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl text-white mb-2">Área do Jogador</h2>
                <p className="text-gray-400">Faça login para acessar sua conta</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-gray-300">Usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu usuário"
                    className="bg-black/50 border-yellow-500/30 text-white"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-300">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    className="bg-black/50 border-yellow-500/30 text-white"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                >
                  Entrar
                </Button>
              </form>

              <div className="mt-6 text-center">
                <a href="#" className="text-yellow-500 hover:text-yellow-400 text-sm">
                  Não tem conta? Cadastre-se
                </a>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      {/* Background já está em App.tsx - não duplicar! */}

      <div className="max-w-7xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl text-white mb-2">Bem-vindo, {mockUser.username}</h2>
              <p className="text-gray-400">Gerencie seus personagens e distribua pontos</p>
            </div>
            <Button
              onClick={handleLogoutClick}
              variant="outline"
              className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Character Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-white flex items-center gap-2">
                <Swords className="w-5 h-5 text-yellow-500" />
                {showAllCharacters ? 'Todos os Personagens' : '3 Últimos Personagens Logados'}
              </h3>
              {sortedCharacters.length > 3 && (
                <Button
                  onClick={() => setShowAllCharacters(!showAllCharacters)}
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {showAllCharacters ? 'Ver Últimos 3' : `Ver Todos (${sortedCharacters.length})`}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayedCharacters.map((char) => (
                <Card
                  key={char.id}
                  onClick={() => handleSelectCharacter(char)}
                  className={`cursor-pointer backdrop-blur-md border-2 transition-all hover:scale-105 ${
                    selectedChar?.id === char.id
                      ? 'bg-yellow-500/20 border-yellow-500'
                      : 'bg-black/50 border-yellow-500/30 hover:border-yellow-500/50'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center">
                        <Sword className="w-6 h-6 text-black" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Resets</div>
                        <div className="text-xl text-yellow-500">{char.resets}</div>
                      </div>
                    </div>
                    <h3 className="text-xl text-white mb-1">{char.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{char.class}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Nível</span>
                      <span className="text-yellow-500">{char.level}</span>
                    </div>
                    {!showAllCharacters && (
                      <div className="mt-2 pt-2 border-t border-yellow-500/20">
                        <p className="text-xs text-gray-500">
                          Último login: {new Date(char.lastLogin).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Character Details */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-black/50 border border-yellow-500/30 w-full justify-start">
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-500 data-[state=inactive]:text-gray-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                Minha Conta
              </TabsTrigger>
              <TabsTrigger 
                value="stats" 
                className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-500 data-[state=inactive]:text-gray-300"
              >
                <Heart className="w-4 h-4 mr-2" />
                Distribuir Pontos
              </TabsTrigger>
              <TabsTrigger 
                value="reset" 
                className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-500 data-[state=inactive]:text-gray-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Sistema de Reset
              </TabsTrigger>
            </TabsList>

            {/* Minha Conta Tab */}
            <TabsContent value="account">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Account Information */}
                <Card className="backdrop-blur-md bg-black/70 border-yellow-500/40 p-6 shadow-lg shadow-yellow-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-2xl text-white">Informações da Conta</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Account Status */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Status da Conta:</label>
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 rounded-lg ${
                          mockUser.accountStatus === 'Active' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                          {mockUser.accountStatus}
                        </span>
                      </div>
                    </div>

                    {/* Username */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Nome de Usuário:</label>
                      <div className="bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-3">
                        <p className="text-white">{mockUser.username}</p>
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
                              className="flex-1 bg-black/50 border border-yellow-500/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                            <Button
                              onClick={() => setIsEditingEmail(false)}
                              className="bg-green-600 hover:bg-green-700 text-white px-6"
                            >
                              Salvar
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-3 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-yellow-500" />
                              <p className="text-white">{email}</p>
                            </div>
                            <Button
                              onClick={() => setIsEditingEmail(true)}
                              className="bg-yellow-600 hover:bg-yellow-700 text-black px-6"
                            >
                              Trocar
                            </Button>
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
                                className="w-full bg-black/50 border border-yellow-500/50 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            <Button
                              onClick={() => setIsEditingPassword(false)}
                              className="bg-green-600 hover:bg-green-700 text-white px-6"
                            >
                              Salvar
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-3 flex items-center gap-2">
                              <Lock className="w-4 h-4 text-yellow-500" />
                              <p className="text-white flex-1">
                                {showPassword ? password : '••••••••••'}
                              </p>
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-yellow-500"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            <Button
                              onClick={() => setIsEditingPassword(true)}
                              className="bg-yellow-600 hover:bg-yellow-700 text-black px-6"
                            >
                              Trocar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Online Status */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Online Status:</label>
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 rounded-lg ${
                          mockUser.onlineStatus === 'Online' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                          {mockUser.onlineStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* User Control Panel */}
                <Card className="backdrop-blur-md bg-black/70 border-yellow-500/40 p-6 shadow-lg shadow-yellow-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-2xl text-white">Painel de Controle</h3>
                  </div>

                  {/* Aviso quando nenhum personagem está selecionado */}
                  {!selectedChar && (
                    <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                      <p className="text-yellow-500 text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        ⚠️ Por favor, selecione um personagem acima para usar as funções
                      </p>
                    </div>
                  )}

                  {/* Aviso quando personagem está online */}
                  {selectedChar && selectedChar.online && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        ⚠️ O personagem <strong>{selectedChar.name}</strong> está online! Desconecte do jogo para usar as funções.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-600/30 to-blue-700/30 border border-blue-500/50 text-blue-400 hover:from-blue-600/50 hover:to-blue-700/50 py-6">
                      <Shield className="w-5 h-5 mr-3" />
                      Minha Conta
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        if (canPerformAction()) {
                          setActiveTab('reset');
                        }
                      }}
                      disabled={!selectedChar || selectedChar?.online}
                      className={`w-full justify-start py-6 ${
                        !selectedChar || selectedChar?.online
                          ? 'bg-black/30 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                          : 'bg-black/30 border border-yellow-500/20 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-500/30'
                      }`}
                    >
                      <Swords className="w-5 h-5 mr-3" />
                      Reset Character
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        if (canPerformAction()) {
                          alert(`✅ Personagem ${selectedChar?.name} desbloqueado com sucesso!`);
                        }
                      }}
                      disabled={!selectedChar || selectedChar?.online}
                      className={`w-full justify-start py-6 ${
                        !selectedChar || selectedChar?.online
                          ? 'bg-black/30 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                          : 'bg-black/30 border border-yellow-500/20 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-500/30'
                      }`}
                    >
                      <User className="w-5 h-5 mr-3" />
                      Unstuck Character
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        if (canPerformAction()) {
                          alert(`✅ PK limpo com sucesso para ${selectedChar?.name}!`);
                        }
                      }}
                      disabled={!selectedChar || selectedChar?.online}
                      className={`w-full justify-start py-6 ${
                        !selectedChar || selectedChar?.online
                          ? 'bg-black/30 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                          : 'bg-black/30 border border-yellow-500/20 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-500/30'
                      }`}
                    >
                      <Shield className="w-5 h-5 mr-3" />
                      Clear PK
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        if (canPerformAction()) {
                          setActiveTab('stats');
                        }
                      }}
                      disabled={!selectedChar || selectedChar?.online}
                      className={`w-full justify-start py-6 ${
                        !selectedChar || selectedChar?.online
                          ? 'bg-black/30 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                          : 'bg-black/30 border border-yellow-500/20 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-500/30'
                      }`}
                    >
                      <Crown className="w-5 h-5 mr-3" />
                      Reset Stats
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        if (canPerformAction()) {
                          setActiveTab('stats');
                        }
                      }}
                      disabled={!selectedChar || selectedChar?.online}
                      className={`w-full justify-start py-6 ${
                        !selectedChar || selectedChar?.online
                          ? 'bg-black/30 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                          : 'bg-black/30 border border-yellow-500/20 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-500/30'
                      }`}
                    >
                      <Shield className="w-5 h-5 mr-3" />
                      Add Stats
                    </Button>
                    
                    <Button className="w-full justify-start bg-black/30 border border-yellow-500/20 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-500/30 py-6">
                      <Crown className="w-5 h-5 mr-3" />
                      Vote for Credits
                    </Button>
                    
                    <Button className="w-full justify-start bg-black/30 border border-yellow-500/20 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-500/30 py-6">
                      <Shield className="w-5 h-5 mr-3" />
                      Buy Credits
                    </Button>
                    
                    <Button className="w-full justify-start bg-black/30 border border-yellow-500/20 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-500/30 py-6">
                      <Crown className="w-5 h-5 mr-3" />
                      Buy Zen
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Meus Personagens Tab */}
            <TabsContent value="characters">
              <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Swords className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-2xl text-white">Meus Personagens</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockUser.characters.map((character, index) => (
                    <motion.div
                      key={character.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="backdrop-blur-md bg-gradient-to-b from-black/70 to-black/90 border-2 border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-500/60 transition-all">
                        {/* Character Image */}
                        <div className="relative h-64 overflow-hidden bg-gradient-to-b from-yellow-900/20 to-black">
                          <img
                            src={characterPlaceholder}
                            alt={character.name}
                            className="w-full h-full object-contain"
                          />
                          {/* Online/Offline Badge */}
                          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs ${
                            character.isOnline 
                              ? 'bg-green-500/80 text-white' 
                              : 'bg-red-500/80 text-white'
                          }`}>
                            {character.isOnline ? 'Online' : 'Offline'}
                          </div>
                        </div>

                        {/* Character Info */}
                        <div className="p-4 space-y-3">
                          <div className="text-center border-b border-yellow-500/20 pb-3">
                            <h4 className="text-xl text-yellow-500 mb-1">{character.name}</h4>
                            <p className="text-gray-400 text-sm">{character.class}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-center">
                              <p className="text-gray-400">Level</p>
                              <p className="text-white">{character.level}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-400">Resets</p>
                              <p className="text-yellow-500">{character.resets}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-yellow-500/20">
                            <MapPin className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">{character.location}</p>
                              <p className="text-gray-400 text-xs">{character.coordinates}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8">
                <h3 className="text-2xl text-white mb-6">Distribuição de Pontos - {selectedChar?.name}</h3>
                
                <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Pontos Disponíveis:</span>
                    <span className="text-2xl text-yellow-500">
                      {selectedChar?.stats.points - Object.values(pointsToAdd).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[
                    { key: 'str', label: 'Força', icon: Sword, current: selectedChar?.stats.str, color: 'red' },
                    { key: 'agi', label: 'Agilidade', icon: Zap, current: selectedChar?.stats.agi, color: 'green' },
                    { key: 'vit', label: 'Vitalidade', icon: Heart, current: selectedChar?.stats.vit, color: 'pink' },
                    { key: 'ene', label: 'Energia', icon: Shield, current: selectedChar?.stats.ene, color: 'blue' },
                  ].map((stat) => (
                    <div key={stat.key} className="p-4 bg-black/30 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <stat.icon className="w-5 h-5 text-yellow-500" />
                          <span className="text-white">{stat.label}</span>
                        </div>
                        <span className="text-gray-400">{stat.current}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={pointsToAdd[stat.key as keyof typeof pointsToAdd]}
                          readOnly
                          className="bg-black/50 border-yellow-500/30 text-white text-center"
                        />
                        <Button
                          onClick={() => handleAddPoints(stat.key)}
                          className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/50"
                        >
                          +1
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                  onClick={() => alert('Pontos distribuídos com sucesso!')}
                >
                  Aplicar Pontos
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="reset">
              <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8">
                <h3 className="text-2xl text-white mb-6">Sistema de Reset - {selectedChar?.name}</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-black/30 rounded-lg border border-yellow-500/20">
                      <div className="text-gray-400 text-sm mb-1">Nível Atual</div>
                      <div className="text-2xl text-yellow-500">{selectedChar?.level}</div>
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg border border-yellow-500/20">
                      <div className="text-gray-400 text-sm mb-1">Resets Totais</div>
                      <div className="text-2xl text-yellow-500">{selectedChar?.resets}</div>
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg border border-yellow-500/20">
                      <div className="text-gray-400 text-sm mb-1">Nível Necessário</div>
                      <div className="text-2xl text-white">400</div>
                    </div>
                  </div>

                  <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <h4 className="text-white mb-3">Benefícios do Reset:</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Ganhe pontos extras de atributos</li>
                      <li>• Acesse áreas exclusivas de reset</li>
                      <li>• Desbloqueie novos títulos e conquistas</li>
                      <li>• Suba no ranking de resets</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleReset}
                    disabled={selectedChar?.level < 400}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    {selectedChar?.level >= 400 ? 'Fazer Reset Agora' : `Nível ${400 - selectedChar?.level} para Reset`}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardSection;