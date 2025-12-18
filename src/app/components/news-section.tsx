import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  Newspaper,
  Calendar,
  User,
  ArrowRight,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  links?: { title: string; url: string }[];
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Novo Evento: Castle Siege Season 10',
    content:
      'Prepare-se para a maior batalha de guildas! O Castle Siege Season 10 começa em 15 de Janeiro às 20h. Recompensas exclusivas e novos títulos para os vencedores. Não perca!',
    author: 'Admin',
    date: '2024-01-10',
    imageUrl: 'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=800&h=400&fit=crop',
    links: [
      { title: 'Regras do Evento', url: '#' },
      { title: 'Recompensas', url: '#' },
    ],
  },
  {
    id: '2',
    title: 'Atualização: Balanceamento de Classes',
    content:
      'Ajustes importantes nas classes para melhorar o equilíbrio PvP. Dark Knight recebeu buff em defesa, Elf teve skills de ataque aprimoradas. Confira todas as mudanças no changelog completo.',
    author: 'GameMaster',
    date: '2024-01-08',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Manutenção Programada - 12/01',
    content:
      'O servidor passará por manutenção no dia 12/01 das 06h às 10h. Serão implementadas melhorias de performance e correções de bugs. Agradecemos a compreensão!',
    author: 'Admin',
    date: '2024-01-05',
  },
  {
    id: '4',
    title: 'Novo Sistema de Pets',
    content:
      'Chegou o sistema de pets! Capture criaturas poderosas, treine e evolua seus companheiros. Pets fornecem bônus únicos em batalha. Visite o NPC Pet Master em Lorencia para começar.',
    author: 'GameMaster',
    date: '2024-01-03',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop',
    links: [
      { title: 'Guia de Pets', url: '#' },
      { title: 'Lista de Pets', url: '#' },
    ],
  },
  {
    id: '5',
    title: 'Promoção: Dobro de EXP no Final de Semana',
    content:
      'Todo final de semana de janeiro teremos 2x EXP! Aproveite para subir de nível mais rápido e dominar os rankings. Válido para todos os personagens e mapas.',
    author: 'Admin',
    date: '2024-01-01',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
  },
];

export function NewsSection() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Newspaper className="w-12 h-12 text-gold" />
          <h1 className="text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-gold">
            Notícias
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Fique por dentro de todas as atualizações, eventos e novidades do MeuMU Online
        </p>
      </motion.div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto space-y-8">
        {mockNews.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-md bg-gradient-to-br from-obsidian/95 to-obsidian-light/95 border-gold/30 overflow-hidden hover:border-gold/50 transition-all group">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image */}
                {news.imageUrl ? (
                  <div className="md:col-span-1 relative overflow-hidden">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                ) : (
                  <div className="md:col-span-1 bg-gradient-to-br from-gold/10 to-ethereal/10 flex items-center justify-center">
                    <ImageIcon className="w-24 h-24 text-gold/30" />
                  </div>
                )}

                {/* Content */}
                <div className={`${news.imageUrl ? 'md:col-span-2' : 'md:col-span-3'} p-6`}>
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-ethereal">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(news.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gold">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Por {news.author}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl text-gold mb-4 group-hover:text-yellow-300 transition-colors">
                    {news.title}
                  </h2>

                  {/* Content */}
                  <p className="text-gray-300 mb-6 leading-relaxed">{news.content}</p>

                  {/* Links */}
                  {news.links && news.links.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gold/20">
                      {news.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          className="flex items-center gap-2 px-4 py-2 bg-ethereal/10 hover:bg-ethereal/20 border border-ethereal/30 rounded-lg text-ethereal hover:text-white transition-all group/link"
                        >
                          <LinkIcon className="w-4 h-4" />
                          <span className="text-sm">{link.title}</span>
                          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Read More Button */}
                  <Button className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black group-hover:shadow-lg group-hover:shadow-gold/50 transition-all">
                    Ler Mais
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-ethereal to-sky-600 hover:from-sky-600 hover:to-ethereal text-white px-12"
        >
          Carregar Mais Notícias
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
