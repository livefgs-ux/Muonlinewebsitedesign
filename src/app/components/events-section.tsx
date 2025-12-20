import { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, Swords, Castle, Skull, Shield, Flame } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface Event {
  id: string;
  name: string;
  time: string;
  icon: any;
  color: string;
  nextOccurrence: Date;
}

function EventsSection() {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Traduções temporárias até adicionar no translations.ts
  const tempTranslations: Record<string, any> = {
    'pt-BR': {
      title: 'Eventos Épicos',
      subtitle: 'Participe dos eventos diários e ganhe recompensas exclusivas',
      serverTime: 'Horário do Servidor',
      liveEvents: '🔥 Eventos Ao Vivo',
      every2Hours: 'A cada 2 horas',
      every3Hours: 'A cada 3 horas',
      every4Hours: 'A cada 4 horas',
      saturdays20: 'Sábados 20:00',
      startsIn: 'Inicia em',
      currentDomain: 'Domínio Atual',
      nextEventIn: 'Próximo evento em:',
      happeningNow: 'Acontecendo agora!',
      completeSchedule: 'Programação Completa',
      tip: 'Dica',
      tipMessage: 'Todos os horários seguem o horário de Brasília (BRT/BRST). Prepare-se com antecedência para maximizar suas recompensas!',
      saturday: 'Sábado',
    },
    'en': {
      title: 'Epic Events',
      subtitle: 'Join daily events and earn exclusive rewards',
      serverTime: 'Server Time',
      liveEvents: '🔥 Live Events',
      every2Hours: 'Every 2 hours',
      every3Hours: 'Every 3 hours',
      every4Hours: 'Every 4 hours',
      saturdays20: 'Saturdays 8:00 PM',
      startsIn: 'Starts in',
      currentDomain: 'Current Domain',
      nextEventIn: 'Next event in:',
      happeningNow: 'Happening now!',
      completeSchedule: 'Complete Schedule',
      tip: 'Tip',
      tipMessage: 'All times follow Brasília time (BRT/BRST). Prepare in advance to maximize your rewards!',
      saturday: 'Saturday',
    },
    'es': {
      title: 'Eventos Épicos',
      subtitle: 'Participa en eventos diarios y gana recompensas exclusivas',
      serverTime: 'Hora del Servidor',
      liveEvents: '🔥 Eventos En Vivo',
      every2Hours: 'Cada 2 horas',
      every3Hours: 'Cada 3 horas',
      every4Hours: 'Cada 4 horas',
      saturdays20: 'Sábados 20:00',
      startsIn: 'Comienza en',
      currentDomain: 'Dominio Actual',
      nextEventIn: 'Próximo evento en:',
      happeningNow: '¡Sucediendo ahora!',
      completeSchedule: 'Programación Completa',
      tip: 'Consejo',
      tipMessage: 'Todos los horarios siguen la hora de Brasília (BRT/BRST). ¡Prepárate con anticipación para maximizar tus recompensas!',
      saturday: 'Sábado',
    },
    'de': {
      title: 'Epische Events',
      subtitle: 'Nimm an täglichen Events teil und verdiene exklusive Belohnungen',
      serverTime: 'Serverzeit',
      liveEvents: '🔥 Live Events',
      every2Hours: 'Alle 2 Stunden',
      every3Hours: 'Alle 3 Stunden',
      every4Hours: 'Alle 4 Stunden',
      saturdays20: 'Samstags 20:00',
      startsIn: 'Beginnt in',
      currentDomain: 'Aktuelle Domäne',
      nextEventIn: 'Nächstes Event in:',
      happeningNow: 'Läuft jetzt!',
      completeSchedule: 'Vollständiger Zeitplan',
      tip: 'Tipp',
      tipMessage: 'Alle Zeiten folgen der Brasília-Zeit (BRT/BRST). Bereite dich im Voraus vor, um deine Belohnungen zu maximieren!',
      saturday: 'Samstag',
    },
    'zh': {
      title: '史诗活动',
      subtitle: '参加每日活动并获得独家奖励',
      serverTime: '服务器时间',
      liveEvents: '🔥 实时活动',
      every2Hours: '每2小时',
      every3Hours: '每3小时',
      every4Hours: '每4小时',
      saturdays20: '周六 20:00',
      startsIn: '开始于',
      currentDomain: '当前领地',
      nextEventIn: '下一个活动:',
      happeningNow: '正在进行！',
      completeSchedule: '完整时间表',
      tip: '提示',
      tipMessage: '所有时间均遵循巴西利亚时间 (BRT/BRST)。提前准备以最大化您的奖励！',
      saturday: '周六',
    },
    'ru': {
      title: 'Эпические События',
      subtitle: 'Участвуйте в ежедневных событиях и получайте эксклюзивные награды',
      serverTime: 'Время Сервера',
      liveEvents: '🔥 Текущие События',
      every2Hours: 'Каждые 2 часа',
      every3Hours: 'Каждые 3 часа',
      every4Hours: 'Каждые 4 часа',
      saturdays20: 'Субботы 20:00',
      startsIn: 'Начинается через',
      currentDomain: 'Текущий Домен',
      nextEventIn: 'Следующее событие через:',
      happeningNow: 'Происходит сейчас!',
      completeSchedule: 'Полное Расписание',
      tip: 'Совет',
      tipMessage: 'Все время указано по бразильскому времени (BRT/BRST). Подготовьтесь заранее, чтобы максимизировать свои награды!',
      saturday: 'Суббота',
    },
    'fil': {
      title: 'Epic na mga Event',
      subtitle: 'Sumali sa mga araw-araw na event at manalo ng eksklusibong rewards',
      serverTime: 'Oras ng Server',
      liveEvents: '🔥 Live na mga Event',
      every2Hours: 'Bawat 2 oras',
      every3Hours: 'Bawat 3 oras',
      every4Hours: 'Bawat 4 na oras',
      saturdays20: 'Sabado 8:00 PM',
      startsIn: 'Magsisimula sa',
      currentDomain: 'Kasalukuyang Domain',
      nextEventIn: 'Susunod na event sa:',
      happeningNow: 'Nangyayari ngayon!',
      completeSchedule: 'Kumpletong Iskedyul',
      tip: 'Tip',
      tipMessage: 'Lahat ng oras ay sumusunod sa oras ng Brasília (BRT/BRST). Maghanda nang maaga upang maxi-maximize ang iyong mga reward!',
      saturday: 'Sabado',
    },
    'vi': {
      title: 'Sự Kiện Hoành Tráng',
      subtitle: 'Tham gia các sự kiện hàng ngày và nhận phần thưởng độc quyền',
      serverTime: 'Giờ Máy Chủ',
      liveEvents: '🔥 Sự Kiện Đang Diễn Ra',
      every2Hours: 'Mỗi 2 giờ',
      every3Hours: 'Mỗi 3 giờ',
      every4Hours: 'Mỗi 4 giờ',
      saturdays20: 'Thứ Bảy 20:00',
      startsIn: 'Bắt đầu sau',
      currentDomain: 'Lãnh Địa Hiện Tại',
      nextEventIn: 'Sự kiện tiếp theo sau:',
      happeningNow: 'Đang diễn ra!',
      completeSchedule: 'Lịch Trình Đầy Đủ',
      tip: 'Mẹo',
      tipMessage: 'Tất cả các giờ đều theo giờ Brasília (BRT/BRST). Chuẩn bị trước để tối đa hóa phần thưởng của bạn!',
      saturday: 'Thứ Bảy',
    },
  };
  
  const tr = tempTranslations[language] || tempTranslations['en'];

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

  // Calcula tempo restante para eventos ao vivo
  const getEventTimeRemaining = (targetMinutes: number) => {
    const now = new Date();
    const target = new Date();
    target.setMinutes(target.getMinutes() + targetMinutes);
    
    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const events: Event[] = [
    {
      id: '1',
      name: 'Blood Castle',
      time: tr.every2Hours,
      icon: Castle,
      color: 'red',
      nextOccurrence: getNextEventTime(14, 0),
    },
    {
      id: '2',
      name: 'Chaos Castle',
      time: tr.every3Hours,
      icon: Swords,
      color: 'purple',
      nextOccurrence: getNextEventTime(15, 30),
    },
    {
      id: '3',
      name: 'Devil Square',
      time: tr.every4Hours,
      icon: Trophy,
      color: 'orange',
      nextOccurrence: getNextEventTime(16, 0),
    },
    {
      id: '4',
      name: 'Castle Siege',
      time: tr.saturdays20,
      icon: Castle,
      color: 'yellow',
      nextOccurrence: getNextEventTime(20, 0),
    },
  ];

  const getTimeRemaining = (eventTime: Date) => {
    const diff = eventTime.getTime() - currentTime.getTime();
    
    if (diff <= 0) return tr.happeningNow;
    
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
              <h2 className="text-4xl text-white">{tr.title}</h2>
            </div>
            <p className="text-gray-400 text-lg">
              {tr.subtitle}
            </p>
          </div>

          {/* Current Server Time */}
          <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6 mb-8">
            <div className="flex items-center justify-center gap-4">
              <Clock className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-gray-400 text-sm">{tr.serverTime}</p>
                <p className="text-2xl text-white">
                  {currentTime.toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>

          {/* Eventos Ao Vivo */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-6 h-6 text-red-500" />
              <h3 className="text-2xl text-white">{tr.liveEvents}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Blood Castle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="backdrop-blur-md bg-gradient-to-br from-red-950/30 to-red-900/20 border-red-500/30 p-4 hover:scale-105 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/50">
                      <Castle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Blood Castle</h4>
                      <p className="text-red-400 text-xs">{tr.every2Hours}</p>
                    </div>
                  </div>
                  <div className="bg-red-950/50 border border-red-500/30 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs mb-1">{tr.startsIn}</p>
                    <p className="text-red-500 text-lg font-mono font-bold">{getEventTimeRemaining(87)}</p>
                  </div>
                </Card>
              </motion.div>

              {/* Chaos Castle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="backdrop-blur-md bg-gradient-to-br from-purple-950/30 to-purple-900/20 border-purple-500/30 p-4 hover:scale-105 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50">
                      <Swords className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Chaos Castle</h4>
                      <p className="text-purple-400 text-xs">{tr.every3Hours}</p>
                    </div>
                  </div>
                  <div className="bg-purple-950/50 border border-purple-500/30 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs mb-1">{tr.startsIn}</p>
                    <p className="text-purple-500 text-lg font-mono font-bold">{getEventTimeRemaining(135)}</p>
                  </div>
                </Card>
              </motion.div>

              {/* Devil Square */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="backdrop-blur-md bg-gradient-to-br from-orange-950/30 to-orange-900/20 border-orange-500/30 p-4 hover:scale-105 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/50">
                      <Skull className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Devil Square</h4>
                      <p className="text-orange-400 text-xs">{tr.every4Hours}</p>
                    </div>
                  </div>
                  <div className="bg-orange-950/50 border border-orange-500/30 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs mb-1">{tr.startsIn}</p>
                    <p className="text-orange-500 text-lg font-mono font-bold">{getEventTimeRemaining(52)}</p>
                  </div>
                </Card>
              </motion.div>

              {/* Castle Siege */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="backdrop-blur-md bg-gradient-to-br from-yellow-950/30 to-yellow-900/20 border-yellow-500/30 p-4 hover:scale-105 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50">
                      <Shield className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Castle Siege</h4>
                      <p className="text-yellow-400 text-xs">{tr.saturdays20}</p>
                    </div>
                  </div>
                  <div className="bg-yellow-950/50 border border-yellow-500/30 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs mb-1">{tr.currentDomain}</p>
                    <p className="text-yellow-500 font-bold">🏰 Knights</p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {events.map((event, index) => {
              const colors = getColorClasses(event.color);
              const timeRemaining = getTimeRemaining(event.nextOccurrence);
              const isHappening = timeRemaining === tr.happeningNow;

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
                        <span className="text-gray-300 text-sm">{tr.nextEventIn}</span>
                        <span className={`text-xl ${colors.text}`}>
                          {timeRemaining}
                        </span>
                      </div>
                    </div>

                    {isHappening && (
                      <div className="mt-4 text-center">
                        <span className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-full text-sm border ${colors.border}`}>
                          🔥 {tr.happeningNow}
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
            <h3 className="text-2xl text-white mb-6">{tr.completeSchedule}</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Blood Castle', times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'] },
                  { name: 'Chaos Castle', times: ['01:00', '04:00', '07:00', '10:00', '13:00', '16:00', '19:00', '22:00'] },
                  { name: 'Devil Square', times: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] },
                  { name: 'Castle Siege', times: [`${tr.saturday} 20:00`] },
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
                💡 <strong className="text-yellow-500">{tr.tip}:</strong> {tr.tipMessage}
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default EventsSection;