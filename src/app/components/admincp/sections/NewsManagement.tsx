import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner';

/**
 * 📰 News Management Section
 * Sistema de gerenciamento de notícias - CONECTADO À API REAL
 */

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  status: 'published' | 'draft';
}

export function NewsManagement() {
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: ''
  });
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news');

      if (!response.ok) {
        // V590: Tratamento gracioso - endpoint pode não estar implementado
        if (response.status === 500 || response.status === 404) {
          console.warn('⚠️ Endpoint /api/news não disponível ou com erro');
          setNews([]);
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setNews(data.data);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar notícias:', error);
      // V590: Não mostrar toast se for erro de endpoint não implementado
      if (error instanceof Error && !error.message.includes('500') && !error.message.includes('404')) {
        toast.error('Erro ao carregar notícias');
      }
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!newsForm.title || !newsForm.content) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setPublishing(true);
      // ✅ V574 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newsForm.title,
          content: newsForm.content,
          status: 'published'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('✅ Notícia publicada com sucesso!');
        setNewsForm({ title: '', content: '' });
        loadNews(); // Recarregar lista
      }
    } catch (error) {
      console.error('❌ Erro ao publicar notícia:', error);
      toast.error('Erro ao publicar notícia');
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!newsForm.title || !newsForm.content) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setSavingDraft(true);
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newsForm.title,
          content: newsForm.content,
          status: 'draft'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('✅ Rascunho salvo com sucesso!');
        setNewsForm({ title: '', content: '' });
        loadNews(); // Recarregar lista
      }
    } catch (error) {
      console.error('❌ Erro ao salvar rascunho:', error);
      toast.error('Erro ao salvar rascunho');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta notícia?')) return;

    try {
      // ✅ V574 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch(`/api/news/${id}`, {
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
        toast.success('✅ Notícia deletada!');
        loadNews(); // Recarregar lista
      }
    } catch (error) {
      console.error('❌ Erro ao deletar notícia:', error);
      toast.error('Erro ao deletar notícia');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Gerenciar Notícias</h2>
        <p className="text-sm text-slate-400">Crie e publique notícias para os jogadores</p>
      </div>

      {/* Create News Form */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Plus className="w-5 h-5" />
            Nova Notícia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Título</label>
            <Input
              type="text"
              placeholder="Digite o título da notícia..."
              value={newsForm.title}
              onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
              className="bg-slate-800/50 border-slate-700/50 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Conteúdo</label>
            <Textarea
              placeholder="Digite o conteúdo da notícia..."
              value={newsForm.content}
              onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
              rows={6}
              className="bg-slate-800/50 border-slate-700/50 text-white resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
              onClick={handlePublish}
              disabled={publishing || savingDraft}
            >
              <FileText className="w-4 h-4 mr-2" />
              {publishing ? 'Publicando...' : 'Publicar'}
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={handleSaveDraft}
              disabled={publishing || savingDraft}
            >
              {savingDraft ? 'Salvando...' : 'Salvar como Rascunho'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <FileText className="w-5 h-5" />
            Notícias Publicadas ({loading ? '...' : news.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-400">
              Carregando notícias...
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Nenhuma notícia publicada ainda
            </div>
          ) : (
            <div className="space-y-3">
              {news.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-transparent hover:border-amber-500/20"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>Por {item.author}</span>
                      <span>•</span>
                      <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                      <Badge className={item.status === 'published' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>
                        {item.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}