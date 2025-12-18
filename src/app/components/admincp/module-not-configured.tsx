import { AlertTriangle, Settings, Wrench } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ModuleStatus } from '../../types/admincp';

interface ModuleNotConfiguredProps {
  moduleName: string;
  status: ModuleStatus;
  description?: string;
  onConfigure?: () => void;
}

export function ModuleNotConfigured({ 
  moduleName, 
  status,
  description,
  onConfigure 
}: ModuleNotConfiguredProps) {
  const statusConfig = {
    'not-configured': {
      icon: AlertTriangle,
      title: 'Módulo Não Configurado',
      subtitle: 'Este módulo ainda não foi configurado',
      color: 'orange',
      action: 'Configurar Agora'
    },
    'development': {
      icon: Wrench,
      title: 'Em Desenvolvimento',
      subtitle: 'Este módulo está sendo desenvolvido',
      color: 'yellow',
      action: 'Ver Progresso'
    },
    'disabled': {
      icon: Settings,
      title: 'Módulo Desabilitado',
      subtitle: 'Este módulo está desabilitado no momento',
      color: 'gray',
      action: 'Habilitar'
    }
  };

  if (status === 'active') {
    return null;
  }

  const config = statusConfig[status] || statusConfig['not-configured'];
  const Icon = config.icon;

  return (
    <Card className={`backdrop-blur-lg bg-${config.color}-500/5 border-${config.color}-500/30 p-8`}>
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-full bg-${config.color}-500/20 flex items-center justify-center`}>
          <Icon className={`w-8 h-8 text-${config.color}-500`} />
        </div>
        
        <div className="space-y-2">
          <h3 className={`text-2xl font-bold text-${config.color}-500`}>
            {config.title}
          </h3>
          <p className="text-gray-400 text-lg">
            {config.subtitle}
          </p>
          {description && (
            <p className="text-gray-500 text-sm max-w-md">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 pt-4">
          <p className="text-sm text-gray-500">
            Módulo: <span className="text-white font-medium">{moduleName}</span>
          </p>
          
          {onConfigure && (
            <Button
              onClick={onConfigure}
              className={`bg-${config.color}-500 hover:bg-${config.color}-600 text-white`}
            >
              <Settings className="w-4 h-4 mr-2" />
              {config.action}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
