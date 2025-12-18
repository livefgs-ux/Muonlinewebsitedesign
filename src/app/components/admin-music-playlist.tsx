import { useState } from 'react';
import { Music, Plus, Play, Pause, Trash2, Upload, Save, Volume2, Check, RotateCcw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useMusicPlayer, Track } from '../contexts/music-context';

export function AdminMusicPlaylist() {
  const { playlist, setPlaylist, isPlaying, currentTrackIndex, selectTrack, togglePlay } = useMusicPlayer();
  const [editMode, setEditMode] = useState(false);
  const [localPlaylist, setLocalPlaylist] = useState<Track[]>([...playlist]);
  const [newTrack, setNewTrack] = useState<Track>({
    id: '',
    title: '',
    artist: '',
    url: '',
    cover: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAddTrack = () => {
    if (newTrack.title && newTrack.artist && newTrack.url) {
      const track: Track = {
        ...newTrack,
        id: Date.now().toString()
      };
      setLocalPlaylist([...localPlaylist, track]);
      setNewTrack({
        id: '',
        title: '',
        artist: '',
        url: '',
        cover: ''
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveTrack = (id: string) => {
    setLocalPlaylist(localPlaylist.filter(t => t.id !== id));
  };

  const handleSavePlaylist = () => {
    setPlaylist(localPlaylist);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setLocalPlaylist([...playlist]);
    setEditMode(false);
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
          <h1 className="text-4xl text-white mb-2">Music Playlist Manager</h1>
          <p className="text-gray-400">Gerenciar músicas de fundo do site</p>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSavePlaylist}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                <Save className="w-5 h-5 mr-2" />
                {saved ? 'Salvo!' : 'Salvar Alterações'}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditMode(true)}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black"
            >
              Editar Playlist
            </Button>
          )}
        </div>
      </div>

      {/* Current Playing */}
      <Card className="backdrop-blur-md bg-gradient-to-br from-gold/10 to-ethereal/10 border-gold/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="w-6 h-6 text-gold" />
          <h3 className="text-2xl text-white">Tocando Agora</h3>
        </div>
        {playlist[currentTrackIndex] && (
          <div className="flex items-center gap-4">
            {playlist[currentTrackIndex].cover && (
              <img
                src={playlist[currentTrackIndex].cover}
                alt="Cover"
                className="w-20 h-20 rounded-lg object-cover border border-gold/30"
              />
            )}
            <div className="flex-1">
              <h4 className="text-xl text-gold mb-1">{playlist[currentTrackIndex].title}</h4>
              <p className="text-ethereal">{playlist[currentTrackIndex].artist}</p>
            </div>
            <button
              onClick={togglePlay}
              className="p-4 bg-gradient-to-br from-gold to-gold/80 rounded-full shadow-lg hover:shadow-gold/50 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-obsidian fill-obsidian" />
              ) : (
                <Play className="w-6 h-6 text-obsidian fill-obsidian ml-1" />
              )}
            </button>
          </div>
        )}
      </Card>

      {/* Playlist */}
      <Card className="backdrop-blur-md bg-black/70 border-gold/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-gold" />
            <h3 className="text-2xl text-white">Playlist ({localPlaylist.length} músicas)</h3>
          </div>
          {editMode && (
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Música
            </Button>
          )}
        </div>

        {/* Add Form */}
        {showAddForm && editMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-6 p-4 rounded-lg bg-black/50 border border-green-500/30"
          >
            <h4 className="text-lg text-white mb-4">Nova Música</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Título:</label>
                <input
                  type="text"
                  value={newTrack.title}
                  onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                  placeholder="Lorencia Theme"
                  className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Artista:</label>
                <input
                  type="text"
                  value={newTrack.artist}
                  onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                  placeholder="MU Online OST"
                  className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">URL do Áudio:</label>
                <input
                  type="text"
                  value={newTrack.url}
                  onChange={(e) => setNewTrack({ ...newTrack, url: e.target.value })}
                  placeholder="https://example.com/music.mp3"
                  className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">URL da Capa (opcional):</label>
                <input
                  type="text"
                  value={newTrack.cover}
                  onChange={(e) => setNewTrack({ ...newTrack, cover: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddTrack}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Playlist Items */}
        <div className="space-y-3">
          {localPlaylist.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                index === currentTrackIndex && !editMode
                  ? 'bg-gold/20 border border-gold/50'
                  : 'bg-black/50 border border-gold/20 hover:border-gold/40'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Número */}
                <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                  <span className="text-gold font-semibold">{index + 1}</span>
                </div>

                {/* Capa */}
                {track.cover && (
                  <img
                    src={track.cover}
                    alt="Cover"
                    className="w-12 h-12 rounded-lg object-cover border border-gold/30"
                  />
                )}

                {/* Info */}
                <div className="flex-1">
                  <h4 className="text-white font-medium">{track.title}</h4>
                  <p className="text-ethereal text-sm">{track.artist}</p>
                </div>

                {/* Playing Indicator */}
                {index === currentTrackIndex && isPlaying && !editMode && (
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gold rounded-full"
                        style={{
                          height: '16px',
                          animation: `audioBar ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!editMode && (
                  <button
                    onClick={() => selectTrack(index)}
                    className="p-2 hover:bg-gold/10 rounded-lg transition-colors"
                    title="Tocar"
                  >
                    <Play className="w-5 h-5 text-ethereal" />
                  </button>
                )}
                {editMode && (
                  <button
                    onClick={() => handleRemoveTrack(track.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {localPlaylist.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhuma música na playlist</p>
            {editMode && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Primeira Música
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card className="backdrop-blur-md bg-black/70 border-blue-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl text-white">Instruções</h3>
        </div>
        <div className="space-y-2 text-gray-400 text-sm">
          <p>• As músicas devem estar hospedadas em um servidor com HTTPS</p>
          <p>• Formatos suportados: MP3, OGG, WAV</p>
          <p>• A música atual será exibida na aba do navegador (Chrome/Edge)</p>
          <p>• Os jogadores podem controlar o volume através do ícone flutuante no site</p>
          <p>• URL de exemplo: https://seudominio.com/musicas/lorencia.mp3</p>
          <p>• Capa recomendada: 512x512px (PNG ou JPG)</p>
        </div>
      </Card>

      <style>{`
        @keyframes audioBar {
          from { height: 4px; opacity: 0.5; }
          to { height: 16px; opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
}