import { CheckCircle2, AlertCircle, Construction, XCircle } from 'lucide-react';
import { ModuleStatus } from '../../types/admincp';

interface ModuleStatusBadgeProps {
  status: ModuleStatus;
  showIcon?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  active: {
    icon: CheckCircle2,
    text: 'Active',
    textPt: 'Ativo',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  development: {
    icon: Construction,
    text: 'In Development',
    textPt: 'Em Desenvolvimento',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30'
  },
  'not-configured': {
    icon: AlertCircle,
    text: 'Not Configured',
    textPt: 'Não Configurado',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30'
  },
  disabled: {
    icon: XCircle,
    text: 'Disabled',
    textPt: 'Desabilitado',
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/30'
  }
};

const sizeConfig = {
  sm: {
    icon: 'w-3 h-3',
    text: 'text-xs',
    padding: 'px-2 py-1'
  },
  md: {
    icon: 'w-4 h-4',
    text: 'text-sm',
    padding: 'px-3 py-1.5'
  },
  lg: {
    icon: 'w-5 h-5',
    text: 'text-base',
    padding: 'px-4 py-2'
  }
};

export function ModuleStatusBadge({ 
  status, 
  showIcon = true, 
  showText = true,
  size = 'md'
}: ModuleStatusBadgeProps) {
  const config = statusConfig[status];
  const sizeConf = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full ${config.bgColor} ${config.borderColor} border ${sizeConf.padding} ${sizeConf.text} ${config.color} font-medium`}
    >
      {showIcon && <Icon className={sizeConf.icon} />}
      {showText && <span>{config.textPt}</span>}
    </span>
  );
}
