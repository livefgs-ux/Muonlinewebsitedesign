import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Sparkles, 
  Sword, 
  Shield, 
  Crown,
  Users,
  TrendingUp
} from 'lucide-react';

interface EmptyStateProps {
  type: 'no-characters' | 'no-data' | 'error';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const { t } = useLanguage();

  const getContent = () => {
    switch (type) {
      case 'no-characters':
        return {
          icon: Users,
          title: title || t.dashboard?.noCharacters || 'Nenhum personagem encontrado',
          description: description || t.dashboard?.noCharactersDesc || 'Crie seu primeiro personagem no jogo para começar sua jornada!',
          gradient: 'from-blue-500/20 to-purple-500/20',
          iconColor: 'text-blue-400',
        };
      
      case 'no-data':
        return {
          icon: Sparkles,
          title: title || t.common?.noData || 'Nenhum dado disponível',
          description: description || t.common?.noDataDesc || 'Não há informações para exibir no momento.',
          gradient: 'from-slate-500/20 to-slate-600/20',
          iconColor: 'text-slate-400',
        };
      
      case 'error':
        return {
          icon: Shield,
          title: title || t.common?.error || 'Erro ao carregar',
          description: description || t.common?.errorDesc || 'Ocorreu um erro ao carregar os dados. Tente novamente.',
          gradient: 'from-red-500/20 to-orange-500/20',
          iconColor: 'text-red-400',
        };
      
      default:
        return {
          icon: Sparkles,
          title: title || 'Vazio',
          description: description || '',
          gradient: 'from-slate-500/20 to-slate-600/20',
          iconColor: 'text-slate-400',
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <Card className={`bg-gradient-to-br ${content.gradient} backdrop-blur-xl border-slate-700/50`}>
      <CardContent className="p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
            <Icon className={`size-16 ${content.iconColor}`} />
          </div>
        </div>
        
        <h3 className="text-2xl text-white mb-3">
          {content.title}
        </h3>
        
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          {content.description}
        </p>

        {action && (
          <Button
            onClick={action.onClick}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold"
          >
            {action.label}
          </Button>
        )}

        {type === 'no-characters' && !action && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <Sword className="size-8 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300">{t.dashboard?.createInGame || 'Crie no jogo'}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <Crown className="size-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300">{t.dashboard?.levelUp || 'Suba de nível'}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <TrendingUp className="size-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300">{t.dashboard?.useWeb || 'Use este site'}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
