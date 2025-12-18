import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import {
  Newspaper,
  Image as ImageIcon,
  Link as LinkIcon,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Home,
  FileText,
} from 'lucide-react';

interface NewsLink {
  id: string;
  title: string;
  url: string;
}

export function AdminPublishNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [links, setLinks] = useState<NewsLink[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [publishTo, setPublishTo] = useState<'home' | 'news'>('home');
  const [showPreview, setShowPreview] = useState(false);

  const addLink = () => {
    if (newLinkTitle && newLinkUrl) {
      setLinks([
        ...links,
        {
          id: Date.now().toString(),
          title: newLinkTitle,
          url: newLinkUrl,
        },
      ]);
      setNewLinkTitle('');
      setNewLinkUrl('');
    }
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handlePublish = () => {
    // Implementar lógica de publicação
    alert(`📰 Notícia publicada em: ${publishTo === 'home' ? 'Home Page' : 'Página News'}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-sky-400 mb-2">Publish News</h1>
          <p className="text-gray-400">
            Criar e publicar notícias para seus jogadores
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-ethereal/20 hover:bg-ethereal/30 text-ethereal border border-ethereal/50"
          >
            <Eye className="w-5 h-5 mr-2" />
            {showPreview ? 'Ocultar' : 'Preview'}
          </Button>
          <Button
            onClick={handlePublish}
            className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white"
          >
            <Save className="w-5 h-5 mr-2" />
            Publicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor - 2 colunas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Choose Destination */}
          <Card className="bg-black/70 border-sky-500/30 p-6">
            <h3 className="text-xl text-sky-400 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Destino da Publicação
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPublishTo('home')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  publishTo === 'home'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                    : 'bg-black/50 border-gray-500/30 text-gray-400 hover:border-sky-500/50'
                }`}
              >
                <Home className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Home Page</p>
                <p className="text-xs mt-1 opacity-70">Página inicial do site</p>
              </button>
              <button
                onClick={() => setPublishTo('news')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  publishTo === 'news'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                    : 'bg-black/50 border-gray-500/30 text-gray-400 hover:border-sky-500/50'
                }`}
              >
                <Newspaper className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Página News</p>
                <p className="text-xs mt-1 opacity-70">Página de notícias</p>
              </button>
            </div>
          </Card>

          {/* Title */}
          <Card className="bg-black/70 border-sky-500/30 p-6">
            <h3 className="text-xl text-sky-400 mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Título da Notícia
            </h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da notícia..."
              className="w-full bg-black/50 border border-sky-500/30 rounded-lg px-4 py-3 text-white text-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </Card>

          {/* Content */}
          <Card className="bg-black/70 border-sky-500/30 p-6">
            <h3 className="text-xl text-sky-400 mb-4">Conteúdo</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva o conteúdo da notícia aqui...&#10;&#10;💡 Dica: Use quebras de linha para organizar melhor o texto."
              rows={12}
              className="w-full bg-black/50 border border-sky-500/30 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
            <p className="text-gray-500 text-sm mt-2">
              {content.length} caracteres
            </p>
          </Card>

          {/* Image Upload */}
          <Card className="bg-black/70 border-sky-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-sky-400 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Imagem de Destaque
              </h3>
              <Button
                onClick={() => setShowImageUpload(!showImageUpload)}
                size="sm"
                className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/50"
              >
                {showImageUpload ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                {showImageUpload ? 'Cancelar' : 'Adicionar'}
              </Button>
            </div>

            {showImageUpload && (
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    URL da Imagem:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="flex-1 bg-black/50 border border-sky-500/30 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <Button
                      size="sm"
                      className="bg-sky-600 hover:bg-sky-700 text-white"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {imageUrl && (
                  <div className="relative rounded-lg overflow-hidden border border-sky-500/30">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/800x400?text=Imagem+não+encontrada';
                      }}
                    />
                    <button
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {!showImageUpload && imageUrl && (
              <div className="relative rounded-lg overflow-hidden border border-sky-500/30">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            {!showImageUpload && !imageUrl && (
              <div className="bg-black/50 border border-dashed border-sky-500/30 rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Nenhuma imagem adicionada</p>
              </div>
            )}
          </Card>

          {/* Links */}
          <Card className="bg-black/70 border-sky-500/30 p-6">
            <h3 className="text-xl text-sky-400 mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Links Relacionados
            </h3>

            {/* Add Link Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="Título do link..."
                className="bg-black/50 border border-sky-500/30 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-black/50 border border-sky-500/30 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Button
                  onClick={addLink}
                  size="sm"
                  className="bg-sky-600 hover:bg-sky-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Links List */}
            {links.length > 0 ? (
              <div className="space-y-2">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-sky-500/20"
                  >
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{link.title}</p>
                      <p className="text-gray-400 text-xs truncate">{link.url}</p>
                    </div>
                    <button
                      onClick={() => removeLink(link.id)}
                      className="ml-2 p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-black/50 border border-dashed border-sky-500/30 rounded-lg p-6 text-center">
                <LinkIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Nenhum link adicionado</p>
              </div>
            )}
          </Card>
        </div>

        {/* Preview - 1 coluna */}
        {showPreview && (
          <div className="lg:col-span-1">
            <Card className="bg-black/70 border-sky-500/30 p-6 sticky top-24">
              <h3 className="text-xl text-sky-400 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview
              </h3>

              {/* News Card Preview */}
              <div className="bg-gradient-to-br from-obsidian/95 to-obsidian-light/95 backdrop-blur-md border border-gold/30 rounded-xl overflow-hidden">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="News"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/400x200?text=Imagem';
                    }}
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-sky-500/20 text-sky-400 rounded text-xs border border-sky-500/50">
                      {publishTo === 'home' ? 'HOME' : 'NEWS'}
                    </span>
                    <span className="text-gray-500 text-xs">Hoje</span>
                  </div>
                  <h4 className="text-lg text-gold mb-2">
                    {title || 'Título da notícia'}
                  </h4>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                    {content || 'Conteúdo da notícia aparecerá aqui...'}
                  </p>
                  {links.length > 0 && (
                    <div className="space-y-1 pt-3 border-t border-gold/20">
                      <p className="text-xs text-gray-400 mb-2">Links:</p>
                      {links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-ethereal hover:text-sky-400 text-xs"
                        >
                          <LinkIcon className="w-3 h-3" />
                          {link.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-500 text-xs mt-4 text-center">
                ✨ Esta é uma prévia de como a notícia aparecerá
              </p>
            </Card>
          </div>
        )}
      </div>
    </motion.div>
  );
}
