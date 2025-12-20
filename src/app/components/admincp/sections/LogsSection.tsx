import { ScrollText, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';

const MOCK_LOGS = [
  { id: 1, timestamp: '2025-12-19 23:44:12', user: 'AdminTest', action: 'Publicou nova notícia: "Castle Siege"', type: 'info' },
  { id: 2, timestamp: '2025-12-19 23:42:08', user: 'System', action: 'Sincronização automática de rankings concluída', type: 'success' },
  { id: 3, timestamp: '2025-12-19 23:40:33', user: 'AdminTest', action: 'Instalou plugin: Event Ranking v1.2.0', type: 'info' },
  { id: 4, timestamp: '2025-12-19 23:38:15', user: 'AdminTest', action: 'Baniu usuário: hack123', type: 'warning' },
  { id: 5, timestamp: '2025-12-19 23:35:47', user: 'System', action: 'Backup automático do banco de dados realizado', type: 'success' },
  { id: 6, timestamp: '2025-12-19 23:30:22', user: 'AdminTest', action: 'Alterou configurações do servidor', type: 'info' },
  { id: 7, timestamp: '2025-12-19 23:25:11', user: 'System', action: 'Tentativa de acesso não autorizado bloqueada', type: 'error' },
  { id: 8, timestamp: '2025-12-19 23:20:03', user: 'AdminTest', action: 'Criou novo administrador: moderator01', type: 'info' },
  { id: 9, timestamp: '2025-12-19 23:15:44', user: 'System', action: 'Evento "Devil Square" iniciado automaticamente', type: 'success' },
  { id: 10, timestamp: '2025-12-19 23:10:28', user: 'AdminTest', action: 'Editou personagem: DarkWarrior', type: 'warning' },
];

export function LogsSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Logs do Sistema</h2>
          <p className="text-sm text-slate-400">Visualize todas as atividades e eventos do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <ScrollText className="w-5 h-5" />
            Registro de Atividades ({MOCK_LOGS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-2">
              {MOCK_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-transparent hover:border-amber-500/20"
                >
                  <Badge className={getLogBadgeClass(log.type)}>
                    {log.type}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm text-white mb-1">
                      <span className="font-bold text-amber-400">{log.user}</span>
                      {' '}{log.action}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function getLogBadgeClass(type: string) {
  switch (type) {
    case 'success':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'warning':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'error':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
}
