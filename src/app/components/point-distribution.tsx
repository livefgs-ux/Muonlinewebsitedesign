import { useState, useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  Sword, 
  Target, 
  Heart, 
  Zap, 
  Crown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';

export function PointDistribution() {
  const { characters, distributePoints } = usePlayer();
  const { t } = useLanguage();

  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [strength, setStrength] = useState(0);
  const [agility, setAgility] = useState(0);
  const [vitality, setVitality] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [command, setCommand] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const character = characters.find(c => c.name === selectedCharacter);
  const totalAllocated = strength + agility + vitality + energy + command;
  const remainingPoints = (character?.points || 0) - totalAllocated;

  const handleIncrement = (stat: 'str' | 'agi' | 'vit' | 'ene' | 'cmd') => {
    if (remainingPoints <= 0) return;
    
    switch (stat) {
      case 'str': setStrength(prev => prev + 1); break;
      case 'agi': setAgility(prev => prev + 1); break;
      case 'vit': setVitality(prev => prev + 1); break;
      case 'ene': setEnergy(prev => prev + 1); break;
      case 'cmd': setCommand(prev => prev + 1); break;
    }
  };

  const handleDecrement = (stat: 'str' | 'agi' | 'vit' | 'ene' | 'cmd') => {
    switch (stat) {
      case 'str': setStrength(prev => Math.max(0, prev - 1)); break;
      case 'agi': setAgility(prev => Math.max(0, prev - 1)); break;
      case 'vit': setVitality(prev => Math.max(0, prev - 1)); break;
      case 'ene': setEnergy(prev => Math.max(0, prev - 1)); break;
      case 'cmd': setCommand(prev => Math.max(0, prev - 1)); break;
    }
  };

  const handleReset = () => {
    setStrength(0);
    setAgility(0);
    setVitality(0);
    setEnergy(0);
    setCommand(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedCharacter) {
      setMessage({ type: 'error', text: t.dashboard?.selectCharacter || 'Selecione um personagem' });
      return;
    }

    if (totalAllocated === 0) {
      setMessage({ type: 'error', text: t.dashboard?.noPointsAllocated || 'Você precisa alocar pelo menos 1 ponto' });
      return;
    }

    if (totalAllocated > (character?.points || 0)) {
      setMessage({ type: 'error', text: t.dashboard?.tooManyPoints || 'Você alocou mais pontos do que possui' });
      return;
    }

    setIsLoading(true);

    const stats: any = {};
    if (strength > 0) stats.strength = strength;
    if (agility > 0) stats.dexterity = agility;  // ✅ BACKEND ESPERA "dexterity"
    if (vitality > 0) stats.vitality = vitality;
    if (energy > 0) stats.energy = energy;
    if (command > 0) stats.command = command;

    const result = await distributePoints(selectedCharacter, stats);
    
    setIsLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      handleReset();
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const StatRow = ({ 
    icon: Icon, 
    label, 
    color, 
    value, 
    current,
    onIncrement, 
    onDecrement,
    onChange
  }: { 
    icon: any; 
    label: string; 
    color: string; 
    value: number; 
    current: number;
    onIncrement: () => void; 
    onDecrement: () => void; 
    onChange: (newValue: number) => void;
  }) => {
    const [inputValue, setInputValue] = useState(value.toString());

    // Sincronizar input com valor externo
    useEffect(() => {
      setInputValue(value.toString());
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      // Permitir campo vazio temporariamente
      if (newValue === '') {
        setInputValue('');
        return;
      }

      // Validar apenas números
      if (!/^\d+$/.test(newValue)) {
        return;
      }

      const numValue = parseInt(newValue, 10);
      
      // Limitar ao máximo de pontos disponíveis
      const maxAllowable = remainingPoints + value; // Pontos restantes + pontos já alocados neste stat
      const finalValue = Math.min(numValue, maxAllowable);
      
      setInputValue(finalValue.toString());
      onChange(finalValue);
    };

    const handleInputBlur = () => {
      // Se campo vazio, resetar para 0
      if (inputValue === '') {
        setInputValue('0');
        onChange(0);
      }
    };

    return (
      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${color}-950/30 border border-${color}-500/20`}>
            <Icon className={`size-5 text-${color}-400`} />
          </div>
          <div>
            <p className="text-sm text-slate-300">{label}</p>
            <p className="text-xs text-slate-500">Current: {current}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onDecrement}
            disabled={value === 0}
            className="h-8 w-8 p-0 border-slate-600 hover:bg-red-500/20"
          >
            <Minus className="size-4" />
          </Button>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">+</span>
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="w-20 h-8 text-center text-lg font-semibold bg-slate-900/50 border-slate-600 text-white px-1"
                placeholder="0"
              />
            </div>
            {value > 0 && (
              <p className="text-xs text-green-400 whitespace-nowrap">→ {current + value}</p>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onIncrement}
            disabled={remainingPoints === 0}
            className="h-8 w-8 p-0 border-slate-600 hover:bg-green-500/20"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-xl text-amber-400 flex items-center gap-2">
            <TrendingUp className="size-6" />
            {t.dashboard?.distributePoints || 'Distribuir Pontos'}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {t.dashboard?.distributePointsDesc || 'Aloque seus pontos de atributo para fortalecer seu personagem'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Character Selection */}
            <div className="space-y-2">
              <Label className="text-slate-200">
                {t.dashboard?.selectCharacter || 'Selecionar Personagem'}
              </Label>
              <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
                <SelectTrigger className="bg-black/40 border-slate-700 text-white">
                  <SelectValue placeholder={t.dashboard?.chooseCharacter || 'Escolha um personagem'} />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {characters.map((char) => (
                    <SelectItem key={char.name} value={char.name} className="text-white">
                      {char.name} - Lv.{char.level} ({char.points} {t.dashboard?.points || 'pontos'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {character && (
              <>
                {/* Points Summary */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-950/40 to-purple-950/40 border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">{t.dashboard?.availablePoints || 'Pontos Disponíveis'}</p>
                      <p className="text-3xl text-blue-400 mt-1">{character.points}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">{t.dashboard?.allocated || 'Alocados'}</p>
                      <p className="text-3xl text-green-400 mt-1">{totalAllocated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">{t.dashboard?.remaining || 'Restantes'}</p>
                      <p className={`text-3xl mt-1 ${remainingPoints === 0 ? 'text-amber-400' : 'text-white'}`}>
                        {remainingPoints}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-700/50" />

                {/* Stat Allocation */}
                <div className="space-y-3">
                  <StatRow
                    icon={Sword}
                    label="Strength (STR)"
                    color="red"
                    value={strength}
                    current={character.stats.strength}
                    onIncrement={() => handleIncrement('str')}
                    onDecrement={() => handleDecrement('str')}
                    onChange={setStrength}
                  />

                  <StatRow
                    icon={Target}
                    label="Agility (AGI)"
                    color="green"
                    value={agility}
                    current={character.stats.dexterity}
                    onIncrement={() => handleIncrement('agi')}
                    onDecrement={() => handleDecrement('agi')}
                    onChange={setAgility}
                  />

                  <StatRow
                    icon={Heart}
                    label="Vitality (VIT)"
                    color="orange"
                    value={vitality}
                    current={character.stats.vitality}
                    onIncrement={() => handleIncrement('vit')}
                    onDecrement={() => handleDecrement('vit')}
                    onChange={setVitality}
                  />

                  <StatRow
                    icon={Zap}
                    label="Energy (ENE)"
                    color="blue"
                    value={energy}
                    current={character.stats.energy}
                    onIncrement={() => handleIncrement('ene')}
                    onDecrement={() => handleDecrement('ene')}
                    onChange={setEnergy}
                  />

                  <StatRow
                    icon={Crown}
                    label="Command (CMD)"
                    color="purple"
                    value={command}
                    current={character.stats.command}
                    onIncrement={() => handleIncrement('cmd')}
                    onDecrement={() => handleDecrement('cmd')}
                    onChange={setCommand}
                  />
                </div>

                {/* Messages */}
                {message && (
                  <Alert 
                    variant={message.type === 'error' ? 'destructive' : 'default'}
                    className={message.type === 'error' 
                      ? 'bg-red-950/50 border-red-500/50' 
                      : 'bg-green-950/50 border-green-500/50 text-green-400'
                    }
                  >
                    {message.type === 'error' ? (
                      <AlertCircle className="size-4" />
                    ) : (
                      <CheckCircle2 className="size-4" />
                    )}
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={totalAllocated === 0 || isLoading}
                    className="flex-1 border-slate-600 hover:bg-slate-700/50"
                  >
                    <RotateCcw className="size-4 mr-2" />
                    {t.common?.reset || 'Resetar'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={totalAllocated === 0 || isLoading || remainingPoints < 0}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        {t.common?.processing || 'Processando...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 size-4" />
                        {t.dashboard?.confirmDistribution || 'Confirmar Distribuição'}
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {!character && characters.length === 0 && (
              <Alert className="bg-blue-950/30 border-blue-500/30">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-slate-300">
                  {t.dashboard?.noCharacters || 'Você ainda não possui personagens'}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}