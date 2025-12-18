import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import {
  Link as LinkIcon,
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Twitch,
  Mail,
  Globe,
} from 'lucide-react';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  enabled: boolean;
  locations: {
    widget: boolean;
    footer: boolean;
    header: boolean;
    navigation: boolean;
  };
}

const defaultSocialLinks: SocialLink[] = [
  {
    id: '1',
    name: 'Discord',
    url: 'https://discord.gg/seu-servidor',
    icon: 'MessageCircle',
    color: '#5865F2',
    enabled: true,
    locations: { widget: true, footer: true, header: false, navigation: true },
  },
  {
    id: '2',
    name: 'WhatsApp',
    url: 'https://wa.me/5511999999999',
    icon: 'MessageCircle',
    color: '#25D366',
    enabled: true,
    locations: { widget: true, footer: true, header: false, navigation: false },
  },
  {
    id: '3',
    name: 'Instagram',
    url: 'https://instagram.com/seu-servidor',
    icon: 'Instagram',
    color: '#E4405F',
    enabled: false,
    locations: { widget: false, footer: true, header: false, navigation: false },
  },
  {
    id: '4',
    name: 'Facebook',
    url: 'https://facebook.com/seu-servidor',
    icon: 'Facebook',
    color: '#1877F2',
    enabled: false,
    locations: { widget: false, footer: true, header: false, navigation: false },
  },
  {
    id: '5',
    name: 'Twitter/X',
    url: 'https://twitter.com/seu-servidor',
    icon: 'Twitter',
    color: '#1DA1F2',
    enabled: false,
    locations: { widget: false, footer: false, header: false, navigation: false },
  },
  {
    id: '6',
    name: 'YouTube',
    url: 'https://youtube.com/@seu-servidor',
    icon: 'Youtube',
    color: '#FF0000',
    enabled: false,
    locations: { widget: false, footer: true, header: false, navigation: false },
  },
  {
    id: '7',
    name: 'Twitch',
    url: 'https://twitch.tv/seu-servidor',
    icon: 'Twitch',
    color: '#9146FF',
    enabled: false,
    locations: { widget: false, footer: false, header: false, navigation: false },
  },
  {
    id: '8',
    name: 'Fórum',
    url: 'https://forum.seu-servidor.com',
    icon: 'Globe',
    color: '#fbbf24',
    enabled: true,
    locations: { widget: true, footer: true, header: false, navigation: true },
  },
];

const iconMap: { [key: string]: any } = {
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Twitch,
  Mail,
  Globe,
};

export function AdminSocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingLink, setEditingLink] = useState<string | null>(null);

  useEffect(() => {
    // Carregar links salvos do localStorage
    const saved = localStorage.getItem('socialLinks');
    if (saved) {
      try {
        setSocialLinks(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading social links:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('socialLinks', JSON.stringify(socialLinks));
    setHasChanges(false);
    alert('✅ Links sociais salvos com sucesso!');
  };

  const updateLink = (id: string, field: keyof SocialLink, value: any) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
    setHasChanges(true);
  };

  const updateLinkLocation = (id: string, location: keyof SocialLink['locations'], value: boolean) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.id === id
          ? { ...link, locations: { ...link.locations, [location]: value } }
          : link
      )
    );
    setHasChanges(true);
  };

  const toggleLink = (id: string) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, enabled: !link.enabled } : link
      )
    );
    setHasChanges(true);
  };

  const deleteLink = (id: string) => {
    if (confirm('🗑️ Tem certeza que deseja remover este link?')) {
      setSocialLinks((prev) => prev.filter((link) => link.id !== id));
      setHasChanges(true);
    }
  };

  const addNewLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      name: 'Nova Rede Social',
      url: 'https://',
      icon: 'Globe',
      color: '#fbbf24',
      enabled: false,
      locations: { widget: false, footer: false, header: false, navigation: false },
    };
    setSocialLinks((prev) => [...prev, newLink]);
    setEditingLink(newLink.id);
    setHasChanges(true);
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Globe;
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
          <h1 className="text-4xl text-white mb-2">Gerenciar Links Sociais</h1>
          <p className="text-gray-400">
            Configure os links de redes sociais que aparecem no site
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addNewLink}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Link
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black"
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4"
        >
          <p className="text-yellow-500 text-sm">
            ⚠️ Você tem alterações não salvas. Clique em "Salvar Alterações" para aplicar.
          </p>
        </motion.div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-black/70 border-yellow-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <LinkIcon className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total de Links</p>
              <p className="text-2xl text-white">{socialLinks.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-black/70 border-green-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Links Ativos</p>
              <p className="text-2xl text-white">
                {socialLinks.filter((l) => l.enabled).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-black/70 border-blue-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">No Widget</p>
              <p className="text-2xl text-white">
                {socialLinks.filter((l) => l.locations.widget && l.enabled).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-black/70 border-purple-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <MessageCircle className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">No Rodapé</p>
              <p className="text-2xl text-white">
                {socialLinks.filter((l) => l.locations.footer && l.enabled).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Social Links List */}
      <div className="space-y-4">
        {socialLinks.map((link) => {
          const Icon = getIcon(link.icon);
          const isEditing = editingLink === link.id;

          return (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className={`bg-black/70 p-6 transition-all ${
                  link.enabled
                    ? 'border-yellow-500/30'
                    : 'border-gray-500/30 opacity-60'
                }`}
              >
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: link.color + '20' }}
                      >
                        <Icon className="w-6 h-6" style={{ color: link.color }} />
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => updateLink(link.id, 'name', e.target.value)}
                          className="bg-black/50 border border-yellow-500/30 rounded px-3 py-2 text-white text-lg w-64"
                          placeholder="Nome da rede social"
                        />
                      ) : (
                        <div>
                          <h3 className="text-xl text-white">{link.name}</h3>
                          <p className="text-sm text-gray-400">{link.url}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() =>
                          setEditingLink(isEditing ? null : link.id)
                        }
                        variant="outline"
                        size="sm"
                        className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                      >
                        {isEditing ? 'Concluir' : 'Editar'}
                      </Button>

                      <Button
                        onClick={() => toggleLink(link.id)}
                        variant="outline"
                        size="sm"
                        className={
                          link.enabled
                            ? 'border-green-500/50 text-green-500 hover:bg-green-500/10'
                            : 'border-gray-500/50 text-gray-500 hover:bg-gray-500/10'
                        }
                      >
                        {link.enabled ? (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Inativo
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => deleteLink(link.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Editing Fields */}
                  {isEditing && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-yellow-500/20">
                      <div className="space-y-2">
                        <label className="text-sm text-white">
                          URL do Link
                        </label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                          className="w-full bg-black/50 border border-yellow-500/30 rounded px-3 py-2 text-white text-sm"
                          placeholder="https://..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-white">
                          Ícone
                        </label>
                        <select
                          value={link.icon}
                          onChange={(e) => updateLink(link.id, 'icon', e.target.value)}
                          className="w-full bg-black/50 border border-yellow-500/30 rounded px-3 py-2 text-white text-sm"
                        >
                          <option value="MessageCircle">MessageCircle</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Twitter">Twitter</option>
                          <option value="Youtube">Youtube</option>
                          <option value="Twitch">Twitch</option>
                          <option value="Mail">Mail</option>
                          <option value="Globe">Globe</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-white flex items-center gap-2">
                          Cor do Ícone
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={link.color}
                            onChange={(e) => updateLink(link.id, 'color', e.target.value)}
                            className="w-16 h-10 rounded border border-yellow-500/30 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={link.color}
                            onChange={(e) => updateLink(link.id, 'color', e.target.value)}
                            className="flex-1 bg-black/50 border border-yellow-500/30 rounded px-3 py-2 text-white text-sm"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location Toggles */}
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-yellow-500/20">
                    <div className="space-y-2">
                      <label className="text-sm text-white">
                        📍 Onde aparece
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`${link.id}-widget`}
                        checked={link.locations.widget}
                        onChange={(e) =>
                          updateLinkLocation(link.id, 'widget', e.target.checked)
                        }
                        className="w-4 h-4 rounded border-yellow-500/30"
                      />
                      <label
                        htmlFor={`${link.id}-widget`}
                        className="text-sm text-gray-400 cursor-pointer"
                      >
                        Widget Lateral
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`${link.id}-footer`}
                        checked={link.locations.footer}
                        onChange={(e) =>
                          updateLinkLocation(link.id, 'footer', e.target.checked)
                        }
                        className="w-4 h-4 rounded border-yellow-500/30"
                      />
                      <label
                        htmlFor={`${link.id}-footer`}
                        className="text-sm text-gray-400 cursor-pointer"
                      >
                        Rodapé
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`${link.id}-header`}
                        checked={link.locations.header}
                        onChange={(e) =>
                          updateLinkLocation(link.id, 'header', e.target.checked)
                        }
                        className="w-4 h-4 rounded border-yellow-500/30"
                      />
                      <label
                        htmlFor={`${link.id}-header`}
                        className="text-sm text-gray-400 cursor-pointer"
                      >
                        Topo
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {socialLinks.length === 0 && (
        <Card className="bg-black/70 border-yellow-500/30 p-12 text-center">
          <LinkIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">Nenhum link configurado</p>
          <p className="text-gray-500 text-sm mb-6">
            Clique em "Adicionar Link" para começar
          </p>
          <Button
            onClick={addNewLink}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Link
          </Button>
        </Card>
      )}
    </motion.div>
  );
}
