import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';

/**
 * 📰 News Management Section
 * Sistema de gerenciamento de notícias
 */

const MOCK_NEWS = [
  { id: 1, title: 'Novo Evento: Castle Siege', date: '2024-12-19', author: 'AdminTest', status: 'published' },
  { id: 2, title: 'Atualização 19.2.3 Disponível', date: '2024-12-18', author: 'AdminTest', status: 'published' },
  { id: 3, title: 'Manutenção Programada', date: '2024-12-17', author: 'AdminTest', status: 'draft' },
];

export function NewsManagement() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800/50 border-slate-700/50 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Conteúdo</label>
            <Textarea
              placeholder="Digite o conteúdo da notícia..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="bg-slate-800/50 border-slate-700/50 text-white resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
              <FileText className="w-4 h-4 mr-2" />
              Publicar
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Salvar como Rascunho
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <FileText className="w-5 h-5" />
            Notícias Publicadas ({MOCK_NEWS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_NEWS.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-transparent hover:border-amber-500/20"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">{news.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Por {news.author}</span>
                    <span>•</span>
                    <span>{news.date}</span>
                    <Badge className={news.status === 'published' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>
                      {news.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/10">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-amber-400 hover:bg-amber-500/10">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
