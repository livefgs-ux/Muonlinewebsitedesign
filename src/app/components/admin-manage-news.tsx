import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Newspaper,
  Edit,
  Trash2,
  Calendar,
  User,
  Eye,
  Search,
  X,
  Save,
  Image as ImageIcon,
  AlertCircle,
  Home,
  Layout,
  Plus,
  Globe,
  RefreshCcw,
  CheckCircle,
  Hash,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useNews, NewsItem } from '../contexts/NewsContext';
import { AdminEditNews } from './admin-edit-news';
import { AddNewsTranslation } from './admincp/add-news-translation';
import { AdminEditNewsTranslation } from './admin-edit-news-translation';

interface NewsTranslation {
  news_id: number;
  news_language: string;
  news_title: string; // base64 encoded
  news_content: string; // base64 encoded
}

export function AdminManageNews() {
  const { news: allNews, deleteNews, updateNews } = useNews();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showDeleteTranslationConfirm, setShowDeleteTranslationConfirm] = useState<{newsId: number, language: string} | null>(null);
  const [addingTranslationFor, setAddingTranslationFor] = useState<number | null>(null);
  const [editingTranslation, setEditingTranslation] = useState<{newsId: number, language: string} | null>(null);
  const [showCacheSuccess, setShowCacheSuccess] = useState(false);

  // Mock translations data - in production, this would come from database
  const mockTranslations: { [newsId: string]: NewsTranslation[] } = {
    '1': [
      {
        news_id: 1,
        news_language: 'en',
        news_title: btoa('New Event: Castle Siege'),
        news_content: btoa('Castle Siege event is now live!'),
      },
      {
        news_id: 1,
        news_language: 'es',
        news_title: btoa('Nuevo Evento: Asedio del Castillo'),
        news_content: btoa('¡El evento Asedio del Castillo ya está en vivo!'),
      },
    ],
    '2': [
      {
        news_id: 2,
        news_language: 'en',
        news_title: btoa('Server Maintenance'),
        news_content: btoa('Server will be down for maintenance.'),
      },
    ],
  };

  // If editing a news, show the edit component
  if (editingNewsId !== null) {
    return <AdminEditNews newsId={editingNewsId} onBack={() => setEditingNewsId(null)} />;
  }

  // If adding translation, show the add translation component
  if (addingTranslationFor !== null) {
    return (
      <AddNewsTranslation
        newsId={addingTranslationFor.toString()}
        onBack={() => setAddingTranslationFor(null)}
      />
    );
  }

  // If editing translation, show the edit translation component
  if (editingTranslation !== null) {
    return (
      <AdminEditNewsTranslation
        newsId={editingTranslation.newsId}
        language={editingTranslation.language}
        onBack={() => setEditingTranslation(null)}
      />
    );
  }

  // Filter news by search term
  const filteredNews = allNews.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    console.log('🗑️ Deleting news:', id);
    console.log('Removing from database and cache...');
    deleteNews(id);
    setShowDeleteConfirm(null);
  };

  const handleDeleteTranslation = (newsId: number, language: string) => {
    console.log('🗑️ Deleting translation:');
    console.log('News ID:', newsId);
    console.log('Language:', language);
    console.log('Updating cache index...');
    setShowDeleteTranslationConfirm(null);
  };

  const handleUpdateCache = () => {
    console.log('🔄 Updating news cache...');
    console.log('Caching all news and updating index...');
    setShowCacheSuccess(true);
    setTimeout(() => {
      setShowCacheSuccess(false);
    }, 3000);
  };

  const handleEdit = (newsItem: NewsItem) => {
    const numericId = parseInt(newsItem.id);
    setEditingNewsId(numericId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', '');
  };

  const getTranslationsForNews = (newsId: string): NewsTranslation[] => {
    return mockTranslations[newsId] || [];
  };

  // Main list view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl text-white mb-2">Manage News</h1>
        <p className="text-gray-400">Edit or delete published news articles</p>
      </div>

      {/* Cache Success Message */}
      {showCacheSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="text-green-300 font-medium">News successfully cached</div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-lg bg-sky-500/5 border-sky-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total News</p>
              <p className="text-3xl text-sky-500 font-bold">{allNews.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-sky-500/20 flex items-center justify-center border border-sky-500/50">
              <Newspaper className="w-6 h-6 text-sky-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Published</p>
              <p className="text-3xl text-green-500 font-bold">
                {allNews.filter(n => n.status === 'published').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/50">
              <Eye className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Drafts</p>
              <p className="text-3xl text-yellow-500 font-bold">
                {allNews.filter(n => n.status === 'draft').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
              <Edit className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news by title, content or author..."
            className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none transition-colors"
          />
        </div>
      </Card>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <Card className="backdrop-blur-lg bg-gray-900/50 border-gray-700/50 p-12">
            <div className="text-center text-gray-400">
              <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No news found</p>
              <p className="text-sm mt-2">Try searching for another term</p>
            </div>
          </Card>
        ) : (
          filteredNews.map((item) => {
            const translations = getTranslationsForNews(item.id);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`backdrop-blur-lg border overflow-hidden ${
                  item.status === 'published'
                    ? 'bg-gray-900/50 border-sky-500/30'
                    : 'bg-yellow-500/5 border-yellow-500/30'
                }`}>
                  {/* Header with Title and Actions */}
                  <div className="border-b border-gray-700/50 bg-black/30 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <a
                        href={`/news/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl text-white font-semibold hover:text-sky-400 transition-colors flex items-center gap-2"
                      >
                        {item.title}
                        <Eye className="w-4 h-4 text-gray-500" />
                      </a>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setAddingTranslationFor(parseInt(item.id))}
                          size="sm"
                          variant="outline"
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Translation
                        </Button>
                        <Button
                          onClick={() => handleEdit(item)}
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 text-black"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => setShowDeleteConfirm(item.id)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Body with Info and Translations */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: News Info */}
                      <div>
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-700/30">
                            <tr>
                              <th className="text-left py-3 pr-4 text-gray-400 font-medium">News Id:</th>
                              <td className="py-3 text-white flex items-center gap-2">
                                <Hash className="w-4 h-4 text-gray-500" />
                                {item.id}
                              </td>
                            </tr>
                            <tr>
                              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Author:</th>
                              <td className="py-3 text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                {item.author}
                              </td>
                            </tr>
                            <tr>
                              <th className="text-left py-3 pr-4 text-gray-400 font-medium">Date:</th>
                              <td className="py-3 text-white flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                {formatDate(item.publishedAt)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Right: Translations */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="w-5 h-5 text-sky-400" />
                          <h4 className="text-white font-medium">Translations:</h4>
                        </div>
                        {translations.length > 0 ? (
                          <ul className="space-y-2">
                            {translations.map((translation) => (
                              <li
                                key={translation.news_language}
                                className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-gray-700/50 hover:border-sky-500/30 transition-all"
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-mono border border-red-500/30">
                                    {translation.news_language.toUpperCase()}
                                  </span>
                                  <span className="text-gray-300 text-sm">
                                    {atob(translation.news_title)}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => setEditingTranslation({
                                      newsId: translation.news_id,
                                      language: translation.news_language
                                    })}
                                    size="sm"
                                    variant="outline"
                                    className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10 text-xs"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => setShowDeleteTranslationConfirm({
                                      newsId: translation.news_id,
                                      language: translation.news_language
                                    })}
                                    size="sm"
                                    variant="outline"
                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-gray-500 text-sm italic py-3">
                            No translations available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-red-500/30 bg-red-500/5 p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg text-white font-semibold mb-2">Confirm Deletion</h4>
                          <p className="text-gray-400 text-sm mb-4">
                            Are you sure you want to delete the news "<strong className="text-white">{item.title}</strong>"? 
                            This action cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleDelete(item.id)}
                              size="sm"
                              className="bg-red-500 hover:bg-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Yes, Delete
                            </Button>
                            <Button
                              onClick={() => setShowDeleteConfirm(null)}
                              size="sm"
                              variant="outline"
                              className="border-gray-500 text-gray-400 hover:text-white"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Delete Translation Confirmation */}
                  {showDeleteTranslationConfirm && showDeleteTranslationConfirm.newsId === parseInt(item.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-red-500/30 bg-red-500/5 p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg text-white font-semibold mb-2">Delete Translation</h4>
                          <p className="text-gray-400 text-sm mb-4">
                            Are you sure you want to delete the <strong className="text-red-400">{showDeleteTranslationConfirm.language.toUpperCase()}</strong> translation?
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleDeleteTranslation(
                                showDeleteTranslationConfirm.newsId,
                                showDeleteTranslationConfirm.language
                              )}
                              size="sm"
                              className="bg-red-500 hover:bg-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Yes, Delete
                            </Button>
                            <Button
                              onClick={() => setShowDeleteTranslationConfirm(null)}
                              size="sm"
                              variant="outline"
                              className="border-gray-500 text-gray-400 hover:text-white"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Update Cache Button */}
      <Card className="backdrop-blur-lg bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-green-500/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50">
              <RefreshCcw className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Update News Cache</h3>
              <p className="text-gray-400 text-sm">Rebuild the news cache for improved performance</p>
            </div>
          </div>
          <Button
            onClick={handleUpdateCache}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            UPDATE NEWS CACHE
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
