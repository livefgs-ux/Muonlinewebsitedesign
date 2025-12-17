import { useState } from 'react';
import { User, Sword, Shield, Heart, Zap, RotateCcw, LogOut, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { SectionBackground } from './section-background';

// Mock data
const mockUser = {
  username: 'DarkKnight123',
  email: 'player@muonline.com',
  characters: [
    {
      id: 1,
      name: 'DarkKnight',
      class: 'Dark Knight',
      level: 400,
      resets: 15,
      strength: 32000,
      agility: 4000,
      vitality: 5000,
      energy: 2000,
      availablePoints: 500,
    },
    {
      id: 2,
      name: 'SoulMaster',
      class: 'Soul Master',
      level: 380,
      resets: 12,
      strength: 1000,
      agility: 1000,
      vitality: 3000,
      energy: 32000,
      availablePoints: 350,
    },
    {
      id: 3,
      name: 'MuseElf',
      class: 'Muse Elf',
      level: 365,
      resets: 10,
      strength: 1500,
      agility: 28000,
      vitality: 2500,
      energy: 8000,
      availablePoints: 200,
    },
  ],
};

export function DashboardSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChar, setSelectedChar] = useState(mockUser.characters[0]);
  const [pointsToAdd, setPointsToAdd] = useState({ str: 0, agi: 0, vit: 0, ene: 0 });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleAddPoints = (stat: string) => {
    const total = Object.values(pointsToAdd).reduce((a, b) => a + b, 0);
    if (total < selectedChar.availablePoints) {
      setPointsToAdd({ ...pointsToAdd, [stat]: pointsToAdd[stat as keyof typeof pointsToAdd] + 1 });
    }
  };

  const handleReset = () => {
    if (selectedChar.level >= 400) {
      alert(`Reset realizado com sucesso para ${selectedChar.name}! Novo reset: ${selectedChar.resets + 1}`);
    } else {
      alert('Seu personagem precisa estar no nível 400 para fazer reset!');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
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
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-300">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    className="bg-black/50 border-yellow-500/30 text-white"
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
      <SectionBackground 
        imageUrl="https://images.unsplash.com/photo-1762968755051-5f0b37d75609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwa25pZ2h0JTIwYXJtb3J8ZW58MXx8fHwxNzY1ODcxMjAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
        character="Dark Knight"
      />
      <div className="max-w-7xl mx-auto">
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
              onClick={() => setIsLoggedIn(false)}
              variant="outline"
              className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Character Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {mockUser.characters.map((char) => (
              <Card
                key={char.id}
                onClick={() => setSelectedChar(char)}
                className={`cursor-pointer backdrop-blur-md border-2 transition-all hover:scale-105 ${
                  selectedChar.id === char.id
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
                </div>
              </Card>
            ))}
          </div>

          {/* Character Details */}
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="bg-black/50 border border-yellow-500/30">
              <TabsTrigger value="stats" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-500">
                Distribuir Pontos
              </TabsTrigger>
              <TabsTrigger value="reset" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-500">
                Sistema de Reset
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8">
                <h3 className="text-2xl text-white mb-6">Distribuição de Pontos - {selectedChar.name}</h3>
                
                <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Pontos Disponíveis:</span>
                    <span className="text-2xl text-yellow-500">
                      {selectedChar.availablePoints - Object.values(pointsToAdd).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[
                    { key: 'str', label: 'Força', icon: Sword, current: selectedChar.strength, color: 'red' },
                    { key: 'agi', label: 'Agilidade', icon: Zap, current: selectedChar.agility, color: 'green' },
                    { key: 'vit', label: 'Vitalidade', icon: Heart, current: selectedChar.vitality, color: 'pink' },
                    { key: 'ene', label: 'Energia', icon: Shield, current: selectedChar.energy, color: 'blue' },
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
                <h3 className="text-2xl text-white mb-6">Sistema de Reset - {selectedChar.name}</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-black/30 rounded-lg border border-yellow-500/20">
                      <div className="text-gray-400 text-sm mb-1">Nível Atual</div>
                      <div className="text-2xl text-yellow-500">{selectedChar.level}</div>
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg border border-yellow-500/20">
                      <div className="text-gray-400 text-sm mb-1">Resets Totais</div>
                      <div className="text-2xl text-yellow-500">{selectedChar.resets}</div>
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
                    disabled={selectedChar.level < 400}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    {selectedChar.level >= 400 ? 'Fazer Reset Agora' : `Nível ${400 - selectedChar.level} para Reset`}
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