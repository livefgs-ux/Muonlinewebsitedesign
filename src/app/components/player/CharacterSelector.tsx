/**
 * 👥 CHARACTER SELECTOR - V627
 * Selecionador visual de personagens com filtro "últimos 3"
 * 
 * FUNCIONALIDADES:
 * - ✅ Listar personagens ordenados por último login
 * - ✅ Mostrar últimos 3 por padrão
 * - ✅ Botão "Ver Todos" para expandir
 * - ✅ Card interativo com hover e seleção visual
 * - ✅ Badge de "Online" se personagem conectado
 * - ✅ Informações resumidas
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, Users, Circle } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { Button } from '../ui/button';

export interface Character {
  id: number | string;
  name: string;
  class: string;
  level: number;
  resets: number;
  grandResets?: number;
  masterLevel?: number;
  location?: string;
  coords?: string;
  online: boolean;
  lastLogin: string | Date;
  stats?: {
    str: number;
    agi: number;
    vit: number;
    ene: number;
    cmd?: number;
    points: number;
  };
}

interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacter: Character | null;
  onSelectCharacter: (char: Character) => void;
  loading?: boolean;
}

export function CharacterSelector({
  characters,
  selectedCharacter,
  onSelectCharacter,
  loading = false
}: CharacterSelectorProps) {
  const [showAll, setShowAll] = useState(false);

  // Ordenar personagens por último login (mais recente primeiro)
  const sortedCharacters = [...characters].sort((a, b) => {
    const dateA = typeof a.lastLogin === 'string' ? new Date(a.lastLogin) : a.lastLogin;
    const dateB = typeof b.lastLogin === 'string' ? new Date(b.lastLogin) : b.lastLogin;
    return dateB.getTime() - dateA.getTime();
  });

  // Mostrar apenas os 3 últimos ou todos
  const displayedCharacters = showAll ? sortedCharacters : sortedCharacters.slice(0, 3);

  // Formatar data para exibição
  const formatLastLogin = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  };

  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="ml-3 text-gray-400">Carregando personagens...</p>
        </div>
      </GlassCard>
    );
  }

  if (characters.length === 0) {
    return (
      <GlassCard>
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">Nenhum personagem encontrado</p>
          <p className="text-gray-500 text-sm mt-1">
            Crie um personagem no jogo para começar
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Título */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl text-yellow-500 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Selecione um Personagem
        </h3>
        <p className="text-gray-400 text-sm">
          {selectedCharacter ? `Selecionado: ${selectedCharacter.name}` : 'Nenhum selecionado'}
        </p>
      </div>

      {/* Grid de Personagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {displayedCharacters.map((char, index) => {
            const isSelected = selectedCharacter?.id === char.id;
            
            return (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard
                  onClick={() => onSelectCharacter(char)}
                  className={`cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-yellow-500/20 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20'
                      : 'border border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/5'
                  }`}
                >
                  {/* Header: Ícone + Resets */}
                  <div className="flex items-center justify-between mb-3">
                    <Sword className={`w-6 h-6 ${isSelected ? 'text-yellow-500' : 'text-yellow-500/70'}`} />
                    <div className="flex items-center gap-2">
                      {char.online && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                          <Circle className="w-2 h-2 text-green-400 fill-green-400 animate-pulse" />
                          <span className="text-xs text-green-400 font-semibold">Online</span>
                        </div>
                      )}
                      <span className={`text-sm font-semibold ${isSelected ? 'text-yellow-500' : 'text-yellow-500/70'}`}>
                        Resets: {char.resets}
                      </span>
                    </div>
                  </div>

                  {/* Nome e Classe */}
                  <div className="mb-3">
                    <h4 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {char.name}
                    </h4>
                    <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      {char.class}
                    </p>
                  </div>

                  {/* Nível */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-xs">Nível</span>
                      <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {char.level}
                      </span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSelected ? 'bg-yellow-500' : 'bg-yellow-500/70'
                        }`}
                        style={{ width: `${(char.level / 400) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Último Login (apenas para não selecionados ou primeiros 3) */}
                  {!showAll && index < 3 && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span>Último login:</span>
                      <span className="text-gray-400">{formatLastLogin(char.lastLogin)}</span>
                    </div>
                  )}

                  {/* Grand Resets (se existir) */}
                  {char.grandResets !== undefined && char.grandResets > 0 && (
                    <div className="mt-2 px-2 py-1 bg-purple-500/20 border border-purple-500/50 rounded text-center">
                      <span className="text-xs text-purple-400 font-semibold">
                        Grand Resets: {char.grandResets}
                      </span>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Botão "Ver Todos" */}
      {sortedCharacters.length > 3 && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 transition-all duration-300"
          >
            <Users className="w-4 h-4 mr-2" />
            {showAll 
              ? 'Ver Últimos 3' 
              : `Ver Todos (${sortedCharacters.length})`
            }
          </Button>
        </div>
      )}

      {/* Aviso se nenhum selecionado */}
      {!selectedCharacter && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
        >
          <p className="text-amber-400 text-sm text-center">
            ⚠️ Selecione um personagem para usar as funções do painel
          </p>
        </motion.div>
      )}
    </div>
  );
}
