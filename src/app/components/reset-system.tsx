import { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { 
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Trophy,
  TrendingUp,
  Sparkles,
  Zap,
  Shield,
  Crown
} from 'lucide-react';

export function ResetSystem() {
  const { characters, resetCharacter } = usePlayer();
  const { t } = useLanguage();

  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const character = characters.find(c => c.name === selectedCharacter);

  // Reset requirements (ajuste conforme suas regras)
  const RESET_LEVEL_REQUIRED = 400;
  const RESET_ZEN_COST = 5000000;
  const canReset = character && character.cLevel >= RESET_LEVEL_REQUIRED && character.money >= RESET_ZEN_COST;

  const handleResetRequest = () => {
    setMessage(null);
    
    if (!selectedCharacter) {
      setMessage({ type: 'error', text: t.dashboard?.selectCharacter || 'Selecione um personagem' });
      return;
    }

    if (!canReset) {
      setMessage({ 
        type: 'error', 
        text: t.dashboard?.resetRequirementsNotMet || 'Requisitos para reset não atendidos' 
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmReset = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);
    setMessage(null);

    const result = await resetCharacter(selectedCharacter);
    
    setIsLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setSelectedCharacter(''); // Limpar seleção após reset
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const getResetBonuses = (currentResets: number) => {
    const nextReset = currentResets + 1;
    return {
      points: 500 + (nextReset * 100),
      stats: Math.floor(nextReset / 10) * 50,
      bonusDamage: nextReset * 5
    };
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-950/40 to-blue-950/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-xl text-purple-400 flex items-center gap-2">
            <RefreshCw className="size-6" />
            {t.dashboard?.resetSystem || 'Sistema de Reset'}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {t.dashboard?.resetSystemDesc || 'Realize reset para obter bônus permanentes e começar sua jornada novamente'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                    <div className="flex items-center gap-2">
                      {char.name} - Lv.{char.cLevel}
                      {char.resets > 0 && (
                        <Badge className="bg-purple-500/20 text-purple-400 ml-2">
                          {char.resets}R
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {character && (
            <>
              {/* Current Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-950/40 to-blue-900/20 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="size-5 text-blue-400" />
                    <p className="text-sm text-slate-300">{t.dashboard?.currentResets || 'Resets Atuais'}</p>
                  </div>
                  <p className="text-3xl text-blue-400">{character.resets}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-green-950/40 to-green-900/20 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="size-5 text-green-400" />
                    <p className="text-sm text-slate-300">{t.dashboard?.currentLevel || 'Nível Atual'}</p>
                  </div>
                  <p className="text-3xl text-green-400">{character.cLevel}</p>
                  <Progress 
                    value={(character.cLevel / RESET_LEVEL_REQUIRED) * 100} 
                    className="mt-2 h-1 bg-slate-800"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {character.cLevel}/{RESET_LEVEL_REQUIRED} required
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-950/40 to-amber-900/20 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="size-5 text-amber-400" />
                    <p className="text-sm text-slate-300">{t.dashboard?.zen || 'Zen'}</p>
                  </div>
                  <p className="text-xl text-amber-400">{character.money.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {RESET_ZEN_COST.toLocaleString()} required
                  </p>
                </div>
              </div>

              {/* Requirements Check */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">
                    {t.dashboard?.requirements || 'Requisitos'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {character.cLevel >= RESET_LEVEL_REQUIRED ? (
                        <CheckCircle2 className="size-5 text-green-400" />
                      ) : (
                        <AlertCircle className="size-5 text-red-400" />
                      )}
                      <span className="text-slate-300">
                        {t.dashboard?.levelRequirement || 'Nível'} {RESET_LEVEL_REQUIRED}
                      </span>
                    </div>
                    <Badge 
                      variant={character.cLevel >= RESET_LEVEL_REQUIRED ? "default" : "destructive"}
                      className={character.cLevel >= RESET_LEVEL_REQUIRED ? "bg-green-500/20 text-green-400" : ""}
                    >
                      {character.cLevel >= RESET_LEVEL_REQUIRED ? t.common?.met || 'OK' : t.common?.notMet || 'Não atende'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {character.money >= RESET_ZEN_COST ? (
                        <CheckCircle2 className="size-5 text-green-400" />
                      ) : (
                        <AlertCircle className="size-5 text-red-400" />
                      )}
                      <span className="text-slate-300">
                        {RESET_ZEN_COST.toLocaleString()} Zen
                      </span>
                    </div>
                    <Badge 
                      variant={character.money >= RESET_ZEN_COST ? "default" : "destructive"}
                      className={character.money >= RESET_ZEN_COST ? "bg-green-500/20 text-green-400" : ""}
                    >
                      {character.money >= RESET_ZEN_COST ? t.common?.met || 'OK' : t.common?.notMet || 'Não atende'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Reset Bonuses */}
              <Card className="bg-gradient-to-br from-purple-950/30 to-blue-950/30 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-400 flex items-center gap-2">
                    <Sparkles className="size-5" />
                    {t.dashboard?.resetBonuses || 'Bônus do Próximo Reset'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const bonuses = getResetBonuses(character.resets);
                    return (
                      <>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="size-4 text-green-400" />
                            <span className="text-slate-300">{t.dashboard?.bonusPoints || 'Pontos de Nível'}</span>
                          </div>
                          <span className="text-green-400 font-semibold">+{bonuses.points}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                          <div className="flex items-center gap-2">
                            <Shield className="size-4 text-blue-400" />
                            <span className="text-slate-300">{t.dashboard?.bonusStats || 'Atributos Base'}</span>
                          </div>
                          <span className="text-blue-400 font-semibold">+{bonuses.stats}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                          <div className="flex items-center gap-2">
                            <Zap className="size-4 text-amber-400" />
                            <span className="text-slate-300">{t.dashboard?.bonusDamage || 'Dano Extra'}</span>
                          </div>
                          <span className="text-amber-400 font-semibold">+{bonuses.bonusDamage}%</span>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

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

              {/* Reset Button */}
              <Button
                onClick={handleResetRequest}
                disabled={!canReset || isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all duration-300 h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    {t.common?.processing || 'Processando...'}
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 size-5" />
                    {t.dashboard?.performReset || 'Realizar Reset'}
                  </>
                )}
              </Button>

              {!canReset && (
                <p className="text-center text-sm text-slate-400">
                  {t.dashboard?.resetHint || 'Atenda todos os requisitos para realizar o reset'}
                </p>
              )}
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
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-slate-900 border-purple-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-purple-400 flex items-center gap-2">
              <RefreshCw className="size-5" />
              {t.dashboard?.confirmReset || 'Confirmar Reset'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              {t.dashboard?.resetWarning || 'Você está prestes a realizar um reset. Seu personagem voltará ao nível 1, mas manterá seus resets e ganhará bônus permanentes.'}
              <div className="mt-4 p-3 rounded-lg bg-amber-950/30 border border-amber-500/30">
                <p className="text-amber-400 text-sm font-semibold">
                  {t.dashboard?.resetCharacter || 'Personagem'}: {character?.name}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  {t.dashboard?.currentResets || 'Resets'}: {character?.resets} → {(character?.resets || 0) + 1}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 hover:bg-slate-800">
              {t.common?.cancel || 'Cancelar'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReset}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            >
              {t.common?.confirm || 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
