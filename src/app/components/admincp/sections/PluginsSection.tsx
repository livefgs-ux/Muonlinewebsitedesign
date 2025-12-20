import { Boxes, Download, Power, Settings, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';

const MOCK_PLUGINS = [
  { id: 1, name: 'Event Ranking', author: 'IGCNetwork', version: '1.2.0', active: true, description: 'Sistema de ranking de eventos automatizado' },
  { id: 2, name: 'Auto Backup', author: 'MuCore', version: '2.0.1', active: true, description: 'Backup automático do banco de dados' },
  { id: 3, name: 'Discord Bot', author: 'MuTools', version: '1.5.3', active: false, description: 'Integração com Discord' },
  { id: 4, name: 'Analytics', author: 'MuStats', version: '3.1.0', active: true, description: 'Estatísticas avançadas do servidor' },
];

export function PluginsSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Plugins</h2>
          <p className="text-sm text-slate-400">Gerencie plugins e extensões do site</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
          <Download className="w-4 h-4 mr-2" />
          Instalar Plugin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_PLUGINS.map((plugin) => (
          <Card key={plugin.id} className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 hover:border-amber-500/40 transition-all shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${plugin.active ? 'bg-green-500/20' : 'bg-slate-500/20'}`}>
                    <Boxes className={`w-5 h-5 ${plugin.active ? 'text-green-400' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{plugin.name}</CardTitle>
                    <p className="text-xs text-slate-400">Por {plugin.author}</p>
                  </div>
                </div>
                <Badge className={plugin.active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>
                  v{plugin.version}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-400">{plugin.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={plugin.active} />
                  <span className="text-sm text-slate-300">
                    {plugin.active ? 'Ativado' : 'Desativado'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/10">
                    <Settings className="w-4 h-4" />
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
