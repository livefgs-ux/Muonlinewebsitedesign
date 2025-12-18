import { motion } from 'motion/react';
import { Database, HardDrive, Trash2, RefreshCw, AlertCircle, CheckCircle, Clock, Lock, Unlock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface CacheFile {
  file: string;
  size: number;
  edit: string;
  write: boolean;
}

export function AdminCacheManager() {
  const [isClearing, setIsClearing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data - in production, this would scan actual cache files
  const [cacheFiles, setCacheFiles] = useState<CacheFile[]>([
    {
      file: 'rankings.cache',
      size: 524288, // 512 KB
      edit: '2025-01-18 10:30:45',
      write: true,
    },
    {
      file: 'server_info.cache',
      size: 8192, // 8 KB
      edit: '2025-01-18 10:25:12',
      write: true,
    },
    {
      file: 'news.cache',
      size: 102400, // 100 KB
      edit: '2025-01-18 09:15:30',
      write: true,
    },
    {
      file: 'events.cache',
      size: 32768, // 32 KB
      edit: '2025-01-18 08:00:00',
      write: true,
    },
    {
      file: 'config.cache',
      size: 4096, // 4 KB
      edit: '2025-01-17 22:45:18',
      write: false,
    },
  ]);

  // Mock guild cache data
  const [guildCache, setGuildCache] = useState({
    count: 145,
    totalSize: 7340032, // ~7 MB
  });

  // Mock player cache data
  const [playerCache, setPlayerCache] = useState({
    count: 3842,
    totalSize: 41943040, // ~40 MB
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleClearCache = (file: string) => {
    if (!confirm(`Are you sure you want to clear the cache data for "${file}"?`)) {
      return;
    }

    setIsClearing(true);

    // Simulate: Clear cache file data
    setTimeout(() => {
      console.log('🗑️ Clear Cache:', file);
      
      // Update the cache file to show it's been cleared (size = 0, new edit time)
      setCacheFiles(cacheFiles.map(cache => 
        cache.file === file 
          ? { ...cache, size: 0, edit: new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            }).replace(/\//g, '-') }
          : cache
      ));

      setSuccessMessage(`Cache data cleared for "${file}".`);
      setShowSuccess(true);
      setIsClearing(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 800);
  };

  const handleDeleteGuildCache = () => {
    if (!confirm(`Are you sure you want to delete all ${guildCache.count} guild profile cache files?`)) {
      return;
    }

    setIsClearing(true);

    // Simulate: Delete all guild cache files
    setTimeout(() => {
      console.log('🗑️ Delete Guild Cache:', guildCache.count, 'files');
      
      setGuildCache({ count: 0, totalSize: 0 });

      setSuccessMessage('All guild profile cache files deleted successfully.');
      setShowSuccess(true);
      setIsClearing(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1200);
  };

  const handleDeletePlayerCache = () => {
    if (!confirm(`Are you sure you want to delete all ${playerCache.count} player profile cache files?`)) {
      return;
    }

    setIsClearing(true);

    // Simulate: Delete all player cache files
    setTimeout(() => {
      console.log('🗑️ Delete Player Cache:', playerCache.count, 'files');
      
      setPlayerCache({ count: 0, totalSize: 0 });

      setSuccessMessage('All player profile cache files deleted successfully.');
      setShowSuccess(true);
      setIsClearing(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1200);
  };

  const totalCacheSize = cacheFiles.reduce((sum, file) => sum + file.size, 0) + 
                         guildCache.totalSize + 
                         playerCache.totalSize;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-500/30">
          <Database className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl text-white">Cache Manager</h1>
          <p className="text-cyan-300/70 mt-1">
            Manage system cache files and optimize performance
          </p>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-green-300 font-medium">{successMessage}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-cyan-500/5 to-blue-600/5 border-cyan-500/20 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3">
              <Database className="w-10 h-10 text-cyan-400" />
              <div>
                <div className="text-cyan-300/70 text-sm">Total Cache Size</div>
                <div className="text-2xl text-white font-bold">{formatFileSize(totalCacheSize)}</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/5 to-pink-600/5 border-purple-500/20 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3">
              <HardDrive className="w-10 h-10 text-purple-400" />
              <div>
                <div className="text-purple-300/70 text-sm">Cache Files</div>
                <div className="text-2xl text-white font-bold">{cacheFiles.length}</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/5 to-red-600/5 border-orange-500/20 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-10 h-10 text-orange-400" />
              <div>
                <div className="text-orange-300/70 text-sm">Guild Caches</div>
                <div className="text-2xl text-white font-bold">{guildCache.count.toLocaleString()}</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-gradient-to-br from-green-500/5 to-emerald-600/5 border-green-500/20 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-10 h-10 text-green-400" />
              <div>
                <div className="text-green-300/70 text-sm">Player Caches</div>
                <div className="text-2xl text-white font-bold">{playerCache.count.toLocaleString()}</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Cache Files Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-cyan-500/5 to-blue-600/5 border-cyan-500/20 backdrop-blur-xl">
          <div className="p-6">
            <h2 className="text-xl text-cyan-200 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Cache Files
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-500/20">
                    <th className="text-left py-3 px-4 text-cyan-300/70 font-medium">Cache File</th>
                    <th className="text-left py-3 px-4 text-cyan-300/70 font-medium">Size</th>
                    <th className="text-left py-3 px-4 text-cyan-300/70 font-medium">Last Modification</th>
                    <th className="text-left py-3 px-4 text-cyan-300/70 font-medium">Writable</th>
                    <th className="text-right py-3 px-4 text-cyan-300/70 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cacheFiles.map((cache, index) => (
                    <motion.tr
                      key={cache.file}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-cyan-400" />
                          <span className="text-white font-mono text-sm">{cache.file}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-cyan-300/90 font-mono text-sm">
                          {formatFileSize(cache.size)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-cyan-300/70">
                          <Clock className="w-4 h-4" />
                          <span className="font-mono text-sm">{cache.edit}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {cache.write ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                            <Unlock className="w-3 h-3" />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs">
                            <Lock className="w-3 h-3" />
                            Not Writable
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          onClick={() => handleClearCache(cache.file)}
                          disabled={isClearing || !cache.write}
                          variant="outline"
                          className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear Data
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Guild and Player Cache */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Guild Profiles Cache */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/5 to-pink-600/5 border-purple-500/20 backdrop-blur-xl">
            <div className="p-6">
              <h3 className="text-xl text-purple-200 mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Guild Profiles Cache
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-purple-500/20">
                  <span className="text-purple-300/70">Cache Files:</span>
                  <span className="text-white font-bold">{guildCache.count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-purple-500/20">
                  <span className="text-purple-300/70">Total Files Size:</span>
                  <span className="text-white font-bold">{formatFileSize(guildCache.totalSize)}</span>
                </div>
                {guildCache.count > 0 && (
                  <div className="pt-3">
                    <Button
                      onClick={handleDeleteGuildCache}
                      disabled={isClearing}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClearing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Guild Profiles Cache</span>
                        </div>
                      )}
                    </Button>
                  </div>
                )}
                {guildCache.count === 0 && (
                  <div className="text-center py-6 text-purple-400/50">
                    <RefreshCw className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No guild cache files</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Player Profiles Cache */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="bg-gradient-to-br from-green-500/5 to-emerald-600/5 border-green-500/20 backdrop-blur-xl">
            <div className="p-6">
              <h3 className="text-xl text-green-200 mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Player Profiles Cache
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-green-500/20">
                  <span className="text-green-300/70">Cache Files:</span>
                  <span className="text-white font-bold">{playerCache.count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-green-500/20">
                  <span className="text-green-300/70">Total Files Size:</span>
                  <span className="text-white font-bold">{formatFileSize(playerCache.totalSize)}</span>
                </div>
                {playerCache.count > 0 && (
                  <div className="pt-3">
                    <Button
                      onClick={handleDeletePlayerCache}
                      disabled={isClearing}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClearing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Player Profiles Cache</span>
                        </div>
                      )}
                    </Button>
                  </div>
                )}
                {playerCache.count === 0 && (
                  <div className="text-center py-6 text-green-400/50">
                    <RefreshCw className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No player cache files</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border-blue-500/20 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl text-blue-200">About Cache Management</h3>
            </div>
            <div className="text-blue-300/70 space-y-2 text-sm">
              <p className="font-medium text-blue-300">
                Cache files improve performance by storing frequently accessed data:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>System Cache:</strong> Rankings, news, events, and server information</li>
                <li><strong>Guild Profiles:</strong> Cached guild information for faster loading</li>
                <li><strong>Player Profiles:</strong> Cached player/character data</li>
                <li>Clear cache files when data appears outdated or incorrect</li>
                <li>Cache files are automatically regenerated when needed</li>
              </ul>
              <p className="text-blue-400 mt-4">
                💡 <strong>Tip:</strong> Clear caches after database updates or when troubleshooting display issues.
              </p>
              <p className="text-blue-400">
                ⚠️ <strong>Note:</strong> Non-writable cache files require file permission changes on the server.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
