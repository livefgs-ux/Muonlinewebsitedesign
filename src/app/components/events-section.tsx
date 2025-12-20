import { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, Swords, Castle } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'motion/react';

interface Event {
  id: string;
  name: string;
  time: string;
  icon: any;
  color: string;
  nextOccurrence: Date;
}

export function EventsSection() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate next event times
  const getNextEventTime = (hour: number, minute: number) => {
    const now = new Date();
    const eventTime = new Date();
    eventTime.setHours(hour, minute, 0, 0);
    
    if (eventTime <= now) {
      eventTime.setDate(eventTime.getDate() + 1);
    }
    
    return eventTime;
  };

  const events: Event[] = [
    {
      id: '1',
      name: 'Blood Castle',
      time: 'A cada 2 horas',
      icon: Castle,
      color: 'red',
      nextOccurrence: getNextEventTime(14, 0),
    },
    {
      id: '2',
      name: 'Chaos Castle',
      time: 'A cada 3 horas',
      icon: Swords,
      color: 'purple',
      nextOccurrence: getNextEventTime(15, 30),
    },
    {
      id: '3',
      name: 'Devil Square',
      time: 'A cada 4 horas',
      icon: Trophy,
      color: 'orange',
      nextOccurrence: getNextEventTime(16, 0),
    },
    {
      id: '4',
      name: 'Castle Siege',
      time: 'Sábados 20:00',
      icon: Castle,
      color: 'yellow',
      nextOccurrence: getNextEventTime(20, 0),
    },
  ];

  const getTimeRemaining = (eventTime: Date) => {
    const diff = eventTime.getTime() - currentTime.getTime();
    
    if (diff <= 0) return 'Acontecendo agora!';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string; shadow: string }> = {
      red: { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-500', shadow: 'shadow-red-500/50' },
      purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-500', shadow: 'shadow-purple-500/50' },
      orange: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-500', shadow: 'shadow-orange-500/50' },
      yellow: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-500', shadow: 'shadow-yellow-500/50' },
    };
    return colors[color] || colors.yellow;
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background já está em App.tsx - não duplicar! */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="w-8 h-8 text-yellow-500" />
              <h2 className="text-4xl text-white">Eventos Épicos</h2>
            </div>
            <p className="text-gray-400 text-lg">
              Participe dos eventos diários e ganhe recompensas exclusivas
            </p>
          </div>

          {/* Current Server Time */}
          <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6 mb-8">
            <div className="flex items-center justify-center gap-4">
              <Clock className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-gray-400 text-sm">Horário do Servidor</p>
                <p className="text-2xl text-white">
                  {currentTime.toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {events.map((event, index) => {
              const colors = getColorClasses(event.color);
              const timeRemaining = getTimeRemaining(event.nextOccurrence);
              const isHappening = timeRemaining === 'Acontecendo agora!';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`backdrop-blur-md bg-black/50 border ${colors.border} p-6 hover:scale-105 transition-all ${isHappening ? 'animate-pulse' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center shadow-lg ${colors.shadow}`}>
                          <event.icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div>
                          <h3 className="text-xl text-white">{event.name}</h3>
                          <p className="text-gray-400 text-sm">{event.time}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 ${colors.bg} border ${colors.border} rounded-lg`}>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">Próximo evento em:</span>
                        <span className={`text-xl ${colors.text}`}>
                          {timeRemaining}
                        </span>
                      </div>
                    </div>

                    {isHappening && (
                      <div className="mt-4 text-center">
                        <span className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-full text-sm border ${colors.border}`}>
                          🔥 Acontecendo Agora!
                        </span>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Event Schedule */}
          <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8">
            <h3 className="text-2xl text-white mb-6">Programação Completa</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Blood Castle', times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'] },
                  { name: 'Chaos Castle', times: ['01:00', '04:00', '07:00', '10:00', '13:00', '16:00', '19:00', '22:00'] },
                  { name: 'Devil Square', times: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] },
                  { name: 'Castle Siege', times: ['Sábado 20:00'] },
                ].map((schedule) => (
                  <div key={schedule.name} className="p-4 bg-black/30 rounded-lg border border-yellow-500/20">
                    <h4 className="text-white mb-2">{schedule.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {schedule.times.map((time, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-500 text-xs"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-gray-300">
                💡 <strong className="text-yellow-500">Dica:</strong> Todos os horários seguem o horário de Brasília (BRT/BRST).
                Prepare-se com antecedência para maximizar suas recompensas!
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default EventsSection;