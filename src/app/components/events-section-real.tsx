import { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, Swords, Castle, Skull, Shield, Flame, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import api, { GameEvent } from '../../services/api';

// Mapeamento de ícones disponíveis
const iconMap: Record<string, any> = {
  Trophy,
  Swords,
  Castle,
  Skull,
  Shield,
  Flame,
  Calendar,
  Clock,
};

function EventsSectionReal() {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Atualizar relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Carregar eventos do backend
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.events.getAllEvents();
      setEvents(data);
    } catch (err: any) {
      console.error('Erro ao carregar eventos:', err);
      setError(err.message || 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  // Função para obter o nome traduzido do evento
  const getEventName = (event: GameEvent): string => {
    const langMap: Record<string, keyof GameEvent> = {
      'en': 'name_en',
      'pt-BR': 'name',
      'es': 'name_es',
      'de': 'name_de',
      'zh': 'name_zh',
      'ru': 'name_ru',
      'fil': 'name_fil',
      'vi': 'name_vi',
    };

    const key = langMap[language] || 'name';
    return (event[key] as string) || event.name;
  };

  // Função para obter a descrição traduzida do evento
  const getEventDescription = (event: GameEvent): string => {
    const langMap: Record<string, keyof GameEvent> = {
      'en': 'description_en',
      'pt-BR': 'description',
      'es': 'description_es',
      'de': 'description_de',
      'zh': 'description_zh',
      'ru': 'description_ru',
      'fil': 'description_fil',
      'vi': 'description_vi',
    };

    const key = langMap[language] || 'description';
    return (event[key] as string) || event.description || '';
  };

  // Calcular próxima ocorrência do evento
  const calculateNextOccurrence = (event: GameEvent): Date => {
    const now = new Date();

    switch (event.schedule_type) {
      case 'recurring': {
        const intervalMs = ((event.interval_hours || 0) * 60 + (event.interval_minutes || 0)) * 60 * 1000;
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        
        let currentTime = startOfDay.getTime();
        while (currentTime <= now.getTime()) {
          currentTime += intervalMs;
        }
        return new Date(currentTime);
      }

      case 'daily': {
        if (event.daily_times && event.daily_times.length > 0) {
          const today = new Date(now);
          
          for (const time of event.daily_times) {
            const [hours, minutes] = time.split(':').map(Number);
            const eventTime = new Date(today);
            eventTime.setHours(hours, minutes, 0, 0);
            
            if (eventTime > now) {
              return eventTime;
            }
          }
          
          // Se não encontrou hoje, pegar primeiro horário de amanhã
          const [hours, minutes] = event.daily_times[0].split(':').map(Number);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(hours, minutes, 0, 0);
          return tomorrow;
        }
        break;
      }

      case 'weekly': {
        if (event.weekly_day !== null && event.weekly_time) {
          const targetDay = event.weekly_day;
          const [hours, minutes] = event.weekly_time.split(':').map(Number);
          
          let daysUntilEvent = targetDay - now.getDay();
          if (daysUntilEvent < 0 || (daysUntilEvent === 0 && now.getHours() >= hours)) {
            daysUntilEvent += 7;
          }
          
          const nextDate = new Date(now);
          nextDate.setDate(now.getDate() + daysUntilEvent);
          nextDate.setHours(hours, minutes, 0, 0);
          return nextDate;
        }
        break;
      }

      case 'specific': {
        if (event.specific_datetime) {
          return new Date(event.specific_datetime);
        }
        break;
      }
    }

    return new Date(now.getTime() + 3600000); // Default: 1 hora
  };

  // Formatar tempo restante
  const getTimeRemaining = (eventTime: Date): string => {
    const diff = eventTime.getTime() - currentTime.getTime();
    
    if (diff <= 0) return t('events.happeningNow');
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Obter texto de frequência
  const getScheduleText = (event: GameEvent): string => {
    switch (event.schedule_type) {
      case 'recurring':
        if (event.interval_hours === 2) return t('events.every2Hours');
        if (event.interval_hours === 3) return t('events.every3Hours');
        if (event.interval_hours === 4) return t('events.every4Hours');
        return `${t('events.every')} ${event.interval_hours}h`;
      
      case 'daily':
        return t('events.daily');
      
      case 'weekly':
        return t('events.weekly');
      
      case 'specific':
        return t('events.specific');
      
      default:
        return '';
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string; shadow: string }> = {
      red: { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-500', shadow: 'shadow-red-500/50' },
      purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-500', shadow: 'shadow-purple-500/50' },
      orange: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-500', shadow: 'shadow-orange-500/50' },
      yellow: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-500', shadow: 'shadow-yellow-500/50' },
      blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-500', shadow: 'shadow-blue-500/50' },
      green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-500', shadow: 'shadow-green-500/50' },
      gold: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-500', shadow: 'shadow-amber-500/50' },
      ethereal: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-500', shadow: 'shadow-cyan-500/50' },
    };
    return colors[color] || colors.yellow;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-gold animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="backdrop-blur-md bg-red-950/30 border-red-500/30 p-8 text-center">
            <p className="text-red-400 mb-4">❌ {error}</p>
            <button
              onClick={loadEvents}
              className="px-6 py-2 bg-gold hover:bg-gold/80 text-black rounded-lg transition-colors"
            >
              {t('common.retry')}
            </button>
          </Card>
        </div>
      </div>
    );
  }

  // Separar eventos em destaque
  const featuredEvents = events.filter(e => e.is_featured);
  const regularEvents = events.filter(e => !e.is_featured);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="w-8 h-8 text-yellow-500" />
              <h2 className="text-4xl text-white">{t('events.title')}</h2>
            </div>
            <p className="text-gray-400 text-lg">
              {t('events.subtitle')}
            </p>
          </div>

          {/* Current Server Time */}
          <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6 mb-8">
            <div className="flex items-center justify-center gap-4">
              <Clock className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-gray-400 text-sm">{t('events.serverTime')}</p>
                <p className="text-2xl text-white">
                  {currentTime.toLocaleTimeString(language === 'pt-BR' ? 'pt-BR' : language)}
                </p>
              </div>
            </div>
          </Card>

          {/* Eventos em Destaque */}
          {featuredEvents.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Flame className="w-6 h-6 text-red-500" />
                <h3 className="text-2xl text-white">{t('events.liveEvents')}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredEvents.slice(0, 4).map((event, index) => {
                  const Icon = iconMap[event.icon] || Trophy;
                  const colors = getColorClasses(event.color);
                  const nextOccurrence = calculateNextOccurrence(event);
                  const timeRemaining = getTimeRemaining(nextOccurrence);

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className={`backdrop-blur-md bg-gradient-to-br from-${event.color}-950/30 to-${event.color}-900/20 border ${colors.border} p-4 hover:scale-105 transition-all`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center border ${colors.border}`}>
                            <Icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{getEventName(event)}</h4>
                            <p className={`${colors.text} text-xs`}>{getScheduleText(event)}</p>
                          </div>
                        </div>
                        <div className={`${colors.bg} border ${colors.border} rounded-lg p-3 text-center`}>
                          <p className="text-gray-400 text-xs mb-1">{t('events.startsIn')}</p>
                          <p className={`${colors.text} text-lg font-mono font-bold`}>{timeRemaining}</p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Todos os Eventos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {events.map((event, index) => {
              const Icon = iconMap[event.icon] || Trophy;
              const colors = getColorClasses(event.color);
              const nextOccurrence = calculateNextOccurrence(event);
              const timeRemaining = getTimeRemaining(nextOccurrence);
              const isHappening = timeRemaining === t('events.happeningNow');

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className={`backdrop-blur-md bg-black/50 border ${colors.border} p-6 hover:scale-105 transition-all ${isHappening ? 'animate-pulse' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center shadow-lg ${colors.shadow}`}>
                          <Icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div>
                          <h3 className="text-xl text-white">{getEventName(event)}</h3>
                          <p className="text-gray-400 text-sm">{getScheduleText(event)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Descrição */}
                    {getEventDescription(event) && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {getEventDescription(event)}
                      </p>
                    )}

                    {/* Próximo evento */}
                    <div className={`p-4 ${colors.bg} border ${colors.border} rounded-lg mb-3`}>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{t('events.nextEventIn')}</span>
                        <span className={`text-xl ${colors.text} font-mono`}>
                          {timeRemaining}
                        </span>
                      </div>
                    </div>

                    {/* Recompensas */}
                    {event.rewards && (
                      <div className={`p-3 ${colors.bg} border ${colors.border} rounded-lg mb-3`}>
                        <p className="text-gray-400 text-xs mb-1">{t('events.rewards')}</p>
                        <p className="text-gray-200 text-sm">{event.rewards}</p>
                      </div>
                    )}

                    {/* Requisitos */}
                    <div className="flex gap-2 text-xs text-gray-400">
                      <span>Lv {event.min_level}-{event.max_level}</span>
                      {event.min_reset > 0 && <span>• {event.min_reset}+ Resets</span>}
                      <span>• {event.duration}min</span>
                    </div>

                    {isHappening && (
                      <div className="mt-4 text-center">
                        <span className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-full text-sm border ${colors.border}`}>
                          🔥 {t('events.happeningNow')}
                        </span>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Dica */}
          <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h4 className="text-xl text-gold mb-2">{t('events.tip')}</h4>
                <p className="text-gray-300">{t('events.tipMessage')}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default EventsSectionReal;
