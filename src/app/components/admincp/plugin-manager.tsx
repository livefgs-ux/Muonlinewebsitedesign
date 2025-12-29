/**
 * 🔌 AdminCP - Plugin Manager Module
 * Sistema de plugins modular e extensível
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { 
  Plug, 
  Upload, 
  Power, 
  PowerOff, 
  Trash2, 
  Settings, 
  RefreshCw,
  Package,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface Plugin {
  id: number;
  name: string;
  slug: string;
  version: string;
  author: string;
  description: string;
  status: 'enabled' | 'disabled';
  compatibleVersions: string[];
  installedAt: string;
  updatedAt: string;
}

interface PluginManagerProps {
  // Removido fakeMode - MODO PRODUÇÃO APENAS
}

// MOCK REMOVIDO - Modo produção usa apenas dados reais da API

export function PluginManager({}: PluginManagerProps) {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; plugin: Plugin | null }>({
    open: false,
    plugin: null
  });

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/plugins', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPlugins(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading plugins:', error);
      toast.error('Erro ao carregar plugins');
    } finally {
      setLoading(false);
    }
  };

  const togglePlugin = async (plugin: Plugin) => {
    try {
      const response = await fetch(`/api/admin/plugins/${plugin.id}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setPlugins(plugins.map(p => 
          p.id === plugin.id 
            ? { ...p, status: data.data.status }
            : p
        ));
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Erro ao alternar plugin');
      }
    } catch (error) {
      console.error('Error toggling plugin:', error);
      toast.error('Erro ao alternar status do plugin');
    }
  };

  const deletePlugin = async (plugin: Plugin) => {
    try {
      const response = await fetch(`/api/admin/plugins/${plugin.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setPlugins(plugins.filter(p => p.id !== plugin.id));
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Erro ao desinstalar plugin');
      }
    } catch (error) {
      console.error('Error deleting plugin:', error);
      toast.error('Erro ao desinstalar plugin');
    } finally {
      setDeleteDialog({ open: false, plugin: null });
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
      const formData = new FormData();
      formData.append('plugin', file);

      const response = await fetch('/api/admin/plugins/install', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        await loadPlugins();
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Erro ao instalar plugin');
      }
    } catch (error) {
      console.error('Error uploading plugin:', error);
      toast.error('Erro ao fazer upload do plugin');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-amber-400/80">Carregando plugins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3">
            <Plug className="w-7 h-7 text-amber-500" />
            Gerenciador de Plugins
          </h2>
          <p className="text-slate-400 mt-1">
            Instale, ative e configure plugins para estender funcionalidades
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={loadPlugins}
            variant="outline"
            className="border-amber-500/30 hover:bg-amber-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>

          <Button
            onClick={() => document.getElementById('plugin-upload')?.click()}
            disabled={uploading}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Instalando...' : 'Instalar Plugin'}
          </Button>
          <input
            id="plugin-upload"
            type="file"
            accept=".zip"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 backdrop-blur-sm border-emerald-500/30">
          <CardHeader className="pb-3">
            <CardDescription className="text-emerald-400/80">Plugins Ativos</CardDescription>
            <CardTitle className="text-3xl text-emerald-400">
              {plugins.filter(p => p.status === 'enabled').length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-sm border-slate-500/30">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400/80">Plugins Inativos</CardDescription>
            <CardTitle className="text-3xl text-slate-400">
              {plugins.filter(p => p.status === 'disabled').length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 backdrop-blur-sm border-amber-500/30">
          <CardHeader className="pb-3">
            <CardDescription className="text-amber-400/80">Total Instalados</CardDescription>
            <CardTitle className="text-3xl text-amber-400">
              {plugins.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Plugins List */}
      {plugins.length === 0 ? (
        <Card className="bg-black/40 backdrop-blur-sm border-amber-500/20">
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl text-slate-400 mb-2">Nenhum plugin instalado</h3>
            <p className="text-slate-500 mb-6">
              Faça upload de um arquivo .zip para instalar seu primeiro plugin
            </p>
            <Button
              onClick={() => document.getElementById('plugin-upload')?.click()}
              className="bg-gradient-to-r from-amber-600 to-amber-500"
            >
              <Upload className="w-4 h-4 mr-2" />
              Instalar Plugin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plugins.map((plugin) => (
            <Card 
              key={plugin.id}
              className={`bg-black/60 backdrop-blur-sm transition-all ${
                plugin.status === 'enabled'
                  ? 'border-emerald-500/40 shadow-emerald-500/20 shadow-lg'
                  : 'border-slate-500/20'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg text-amber-400">
                        {plugin.name}
                      </CardTitle>
                      {plugin.status === 'enabled' ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-500/30 text-slate-400">
                          <Clock className="w-3 h-3 mr-1" />
                          Inativo
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      v{plugin.version} • {plugin.author}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-slate-300">
                  {plugin.description}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="px-2 py-1 bg-black/40 rounded border border-amber-500/20 text-amber-400/80">
                    Compatível: {plugin.compatibleVersions.join(', ')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => togglePlugin(plugin)}
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${
                      plugin.status === 'enabled'
                        ? 'border-red-500/30 hover:bg-red-500/10 text-red-400'
                        : 'border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {plugin.status === 'enabled' ? (
                      <>
                        <PowerOff className="w-4 h-4 mr-2" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setDeleteDialog({ open: true, plugin })}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Installation Guide */}
      <Card className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 backdrop-blur-sm border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <AlertCircle className="w-5 h-5" />
            Como Instalar Plugins
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center">
              1
            </div>
            <div>
              <p className="font-semibold text-white">Obtenha o arquivo .zip do plugin</p>
              <p className="text-slate-400">O plugin deve conter um arquivo manifest.json válido</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center">
              2
            </div>
            <div>
              <p className="font-semibold text-white">Clique em "Instalar Plugin" e selecione o arquivo</p>
              <p className="text-slate-400">O sistema validará a compatibilidade automaticamente</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center">
              3
            </div>
            <div>
              <p className="font-semibold text-white">Ative o plugin após a instalação</p>
              <p className="text-slate-400">Plugins inativos não afetam o sistema</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
            <p className="text-yellow-400 text-xs">
              <strong>⚠️ Atenção:</strong> Instale apenas plugins de fontes confiáveis. 
              Plugins maliciosos podem comprometer a segurança do servidor.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent className="bg-black/95 backdrop-blur-xl border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Confirmar Desinstalação
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Tem certeza que deseja desinstalar o plugin <strong className="text-amber-400">{deleteDialog.plugin?.name}</strong>?
              <br /><br />
              Todos os arquivos do plugin serão removidos permanentemente. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-500/30">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.plugin && deletePlugin(deleteDialog.plugin)}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Desinstalar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}