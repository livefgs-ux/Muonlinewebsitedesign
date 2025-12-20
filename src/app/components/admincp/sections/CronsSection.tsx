import { Clock, Play, Pause, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';

const MOCK_CRONS = [
  { id: 1, name: 'Sincronizar Rankings', schedule: '*/5 * * * *', description: 'Atualiza rankings a cada 5 minutos', active: true, lastRun: '2 min atrás' },
  { id: 2, name: 'Backup Automático', schedule: '0 3 * * *', description: 'Backup diário às 3h da manhã', active: true, lastRun: '6 horas atrás' },
  { id: 3, name: 'Limpeza de Logs', schedule: '0 0 * * 0', description: 'Remove logs antigos semanalmente', active: true, lastRun: '2 dias atrás' },
  { id: 4, name: 'Evento Automático', schedule: '0 */2 * * *', description: 'Inicia eventos a cada 2 horas', active: false, lastRun: '4 horas atrás' },
];

export function CronsSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Cron Jobs</h2>
          <p className="text-sm text-slate-400">Gerencie tarefas automatizadas do servidor</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cron Job
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_CRONS.map((cron) => (
          <Card key={cron.id} className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 hover:border-amber-500/40 transition-all shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${cron.active ? 'bg-green-500/20' : 'bg-slate-500/20'}`}>
                    <Clock className={`w-6 h-6 ${cron.active ? 'text-green-400' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg">{cron.name}</h3>
                      <Badge className={cron.active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>
                        {cron.active ? 'Ativo' : 'Pausado'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{cron.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-500">Schedule: </span>
                        <code className="text-amber-400 bg-slate-800/50 px-2 py-1 rounded font-mono">
                          {cron.schedule}
                        </code>
                      </div>
                      <div>
                        <span className="text-slate-500">Última execução: </span>
                        <span className="text-slate-300">{cron.lastRun}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={cron.active} />
                  <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/10">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
