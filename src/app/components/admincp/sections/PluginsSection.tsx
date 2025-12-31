import { useState, useEffect } from 'react';
import { Boxes, Plus, Trash2, Power } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { toast } from 'sonner';

interface Plugin {
  id: number;
  name: string;
  author: string;
  version: string;
  enabled: boolean;
  description: string;
}

export function PluginsSection() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = async () => {
    try {
      setLoading(true);
      // ✅ V575 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch('/api/admin/plugins', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // V590: Tratamento gracioso - endpoint pode não estar implementado
        if (response.status === 500 || response.status === 404) {
          console.warn('⚠️ Endpoint /api/admin/plugins não disponível ou com erro');
          setPlugins([]);
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setPlugins(data.data);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar plugins:', error);
      // V590: Não mostrar erro se endpoint não implementado
      if (error instanceof Error && !error.message.includes('500') && !error.message.includes('404')) {
        setError('Erro ao carregar plugins');
      }
      setPlugins([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePlugin = async (id: number, currentState: boolean) => {
    try {
      // ✅ V575 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch(`/api/admin/plugins/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success(`✅ Plugin ${!currentState ? 'ativado' : 'desativado'}!`);
        loadPlugins(); // Recarregar lista
      }
    } catch (error) {
      console.error('❌ Erro ao alternar plugin:', error);
      toast.error('Erro ao alternar estado do plugin');
    }
  };

  const deletePlugin = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este plugin?')) return;

    try {
      // ✅ V575 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch(`/api/admin/plugins/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('✅ Plugin deletado!');
        loadPlugins(); // Recarregar lista
      }
    } catch (error) {
      console.error('❌ Erro ao deletar plugin:', error);
      toast.error('Erro ao deletar plugin');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      toast.error('Apenas arquivos .zip são permitidos');
      return;
    }

    setUploading(true);
    try {
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const formData = new FormData();
      formData.append('plugin', file);

      const response = await fetch('/api/admin/plugins/install', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Plugin instalado com sucesso!');
        loadPlugins();
      } else {
        toast.error(data.message || 'Erro ao instalar plugin');
      }
    } catch (error) {
      console.error('❌ Erro ao fazer upload do plugin:', error);
      toast.error('Erro ao fazer upload do plugin');
    } finally {
      setUploading(false);
      // Limpar input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Gerenciar Plugins</h2>
          <p className="text-sm text-slate-400">Estenda as funcionalidades do servidor</p>
        </div>
        <Button 
          onClick={() => document.getElementById('plugin-file-upload')?.click()}
          disabled={uploading}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          {uploading ? 'Instalando...' : 'Instalar Plugin'}
        </Button>
        <input
          id="plugin-file-upload"
          type="file"
          accept=".zip"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Boxes className="w-5 h-5" />
            Plugins Instalados ({loading ? '...' : plugins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-400">
              Carregando plugins...
            </div>
          ) : plugins.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Nenhum plugin instalado
            </div>
          ) : (
            <div className="space-y-3">
              {plugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-transparent hover:border-amber-500/20"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white">{plugin.name}</h3>
                      <Badge className="bg-slate-700/30 text-slate-300 border-slate-600/30 text-xs">
                        v{plugin.version}
                      </Badge>
                      <Badge
                        className={
                          plugin.enabled
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                        }
                      >
                        {plugin.enabled ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-1">{plugin.description}</p>
                    <p className="text-xs text-slate-500">Por {plugin.author}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50">
                      <Power className={`w-4 h-4 ${plugin.enabled ? 'text-green-400' : 'text-slate-400'}`} />
                      <Switch
                        checked={plugin.enabled}
                        onCheckedChange={() => togglePlugin(plugin.id, plugin.enabled)}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => deletePlugin(plugin.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}