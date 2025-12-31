import { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  Sword, 
  Shield, 
  Zap, 
  Heart,
  Target,
  Crown,
  MapPin,
  DollarSign,
  TrendingUp,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function CharacterManagement() {
  const { characters, selectedCharacter, selectCharacter, isLoading } = usePlayer();
  const { t } = useLanguage();
  const [expandedCharacter, setExpandedCharacter] = useState<string | null>(null);

  // V592: LOG CRÍTICO - Debug para rastrear problema
  console.log('🎮 [CharacterManagement] Renderizado');
  console.log('🎮 [CharacterManagement] isLoading:', isLoading);
  console.log('🎮 [CharacterManagement] characters.length:', characters.length);
  console.log('🎮 [CharacterManagement] characters:', characters);

  if (isLoading) {
    console.log('⏳ [CharacterManagement] Mostrando loading...');
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (characters.length === 0) {
    console.log('❌ [CharacterManagement] Nenhum personagem - mostrando alerta');
    return (
      <Alert className="bg-blue-950/30 border-blue-500/30">
        <AlertDescription className="text-slate-300">
          {t.dashboard?.noCharacters || 'Você ainda não possui personagens. Crie um no jogo!'}
        </AlertDescription>
      </Alert>
    );
  }

  console.log('✅ [CharacterManagement] Mostrando', characters.length, 'personagens');

  const getClassColor = (className: string) => {
    const classLower = className.toLowerCase();
    if (classLower.includes('dark wizard') || classLower.includes('soul master')) return 'text-purple-400';
    if (classLower.includes('dark knight') || classLower.includes('blade knight')) return 'text-red-400';
    if (classLower.includes('fairy elf') || classLower.includes('muse elf')) return 'text-green-400';
    if (classLower.includes('magic gladiator')) return 'text-orange-400';
    if (classLower.includes('dark lord')) return 'text-yellow-400';
    if (classLower.includes('summoner')) return 'text-blue-400';
    if (classLower.includes('rage fighter')) return 'text-pink-400';
    return 'text-slate-400';
  };

  const toggleExpand = (charName: string) => {
    setExpandedCharacter(expandedCharacter === charName ? null : charName);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl text-amber-400">
          {t.dashboard?.characterList || 'Lista de Personagens'}
        </h3>
        <Badge variant="outline" className="border-amber-500/30 text-amber-400">
          {characters.length} {t.dashboard?.total || 'Total'}
        </Badge>
      </div>

      {characters.map((character) => {
        const isExpanded = expandedCharacter === character.name;
        
        return (
          <Card 
            key={character.name}
            className="bg-gradient-to-r from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-amber-500/50 transition-all"
          >
            <CardContent className="p-4">
              {/* Header */}
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(character.name)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
                    <User className="size-6 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-lg text-white flex items-center gap-2">
                      {character.name}
                      {character.resets > 0 && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          {character.resets}R
                        </Badge>
                      )}
                    </h4>
                    <p className={`text-sm ${getClassColor(character.class)}`}>
                      {character.class}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Level</p>
                    <p className="text-xl text-blue-400">{character.level}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Points</p>
                    <p className="text-xl text-green-400">{character.points}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-slate-400 hover:text-amber-400"
                  >
                    {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <>
                  <Separator className="my-4 bg-slate-700/50" />
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/30 border border-red-500/20">
                      <Sword className="size-5 text-red-400" />
                      <div>
                        <p className="text-xs text-slate-400">Strength</p>
                        <p className="text-lg text-white">{character.stats.strength}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-950/30 border border-green-500/20">
                      <Target className="size-5 text-green-400" />
                      <div>
                        <p className="text-xs text-slate-400">Agility</p>
                        <p className="text-lg text-white">{character.stats.dexterity}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-950/30 border border-orange-500/20">
                      <Heart className="size-5 text-orange-400" />
                      <div>
                        <p className="text-xs text-slate-400">Vitality</p>
                        <p className="text-lg text-white">{character.stats.vitality}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-950/30 border border-blue-500/20">
                      <Zap className="size-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-slate-400">Energy</p>
                        <p className="text-lg text-white">{character.stats.energy}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-950/30 border border-purple-500/20">
                      <Crown className="size-5 text-purple-400" />
                      <div>
                        <p className="text-xs text-slate-400">Command</p>
                        <p className="text-lg text-white">{character.stats.command}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="size-4 text-slate-400" />
                        <p className="text-xs text-slate-400">Location</p>
                      </div>
                      <p className="text-sm text-white">Lorencia</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="size-4 text-slate-400" />
                        <p className="text-xs text-slate-400">Zen</p>
                      </div>
                      <p className="text-sm text-amber-400">
                        {character.zen?.toLocaleString() || '0'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="size-4 text-slate-400" />
                        <p className="text-xs text-slate-400">PK Status</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={character.pk.level > 3 ? "destructive" : "outline"}
                          className={character.pk.level > 3 ? "" : "border-green-500/30 text-green-400"}
                        >
                          {character.pk.level > 3 ? 'Murderer' : 'Hero'}
                        </Badge>
                        <span className="text-xs text-slate-400">({character.pk.kills} kills)</span>
                      </div>
                    </div>
                  </div>

                  {/* Level Progress */}
                  {character.points > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-green-950/20 border border-green-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-green-400 flex items-center gap-2">
                          <TrendingUp className="size-4" />
                          {t.dashboard?.availablePoints || 'Pontos Disponíveis'}
                        </p>
                        <p className="text-lg text-white">{character.points}</p>
                      </div>
                      <p className="text-xs text-slate-400">
                        {t.dashboard?.distributePointsHint || 'Use a aba "Distribuir Pontos" para alocar seus pontos'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}