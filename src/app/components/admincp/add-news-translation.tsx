import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Languages,
  Save,
  AlertCircle,
  FileText,
  Globe,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface NewsData {
  news_id: number;
  news_title: string;
  news_content: string;
  news_author: string;
  news_date: string;
  language: string;
}

// Mock news data
const mockNewsData: NewsData = {
  news_id: 1,
  news_title: 'Server Update - New Content Available',
  news_content: 'We are excited to announce a major server update with new content, including new maps, items, and events. Join now and experience the new features!',
  news_author: 'Administrator',
  news_date: '2025-01-18',
  language: 'en',
};

// Available languages (excluding default)
const availableLanguages = [
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
];

interface AddNewsTranslationProps {
  newsId?: string;
  onBack?: () => void;
}

export function AddNewsTranslation({ newsId, onBack }: AddNewsTranslationProps) {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cacheWritable] = useState(true); // Simulate News::isNewsDirWritable()
  const [error, setError] = useState('');

  // Load news data
  useEffect(() => {
    if (newsId) {
      // Simulate loading news data
      setTimeout(() => {
        setNewsData(mockNewsData);
        setTitle(mockNewsData.news_title);
        setContent(mockNewsData.news_content);
      }, 300);
    }
  }, [newsId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedLanguage) {
      setError('Please select a language');
      return;
    }

    if (!title || !content) {
      setError('Please fill in all required fields (Title and Content)');
      return;
    }

    setIsSubmitting(true);

    // Simulate:
    // $News->setId($_POST['news_id']);
    // $News->setLanguage($_POST['news_language']);
    // $News->setTitle($_POST['news_title']);
    // $News->setContent($_POST['news_content']);
    // $News->addNewsTransation();
    // $News->updateNewsCacheIndex();
    // redirect(1, 'admincp/?module=managenews');

    setTimeout(() => {
      alert(
        `✅ Translation added successfully!\n\nNews ID: ${newsData?.news_id}\nLanguage: ${selectedLanguage}\n\nRedirecting to Manage News...`
      );
      setIsSubmitting(false);
      // In real implementation, would redirect to managenews
      if (onBack) onBack();
    }, 1000);
  };

  if (!newsId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl text-white mb-2">Add News Translation</h1>
          <p className="text-gray-400">Translate news to different languages</p>
        </div>

        <Card className="backdrop-blur-lg bg-yellow-500/10 border-yellow-500/30 p-6">
          <div className="flex items-center gap-3 text-yellow-400">
            <AlertCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">No news selected</p>
              <p className="text-sm mt-1">Please select a news article from the Manage News section.</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!cacheWritable) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl text-white mb-2">Add News Translation</h1>
          <p className="text-gray-400">Translate news to different languages</p>
        </div>

        <Card className="backdrop-blur-lg bg-red-500/10 border-red-500/30 p-6">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">The news cache folder is not writable.</p>
              <p className="text-sm mt-1">Please check folder permissions on the server.</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!newsData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl text-white mb-2">Add News Translation</h1>
          <p className="text-gray-400">Loading news data...</p>
        </div>
        <Card className="backdrop-blur-lg bg-gray-900/50 border-gray-700/50 p-12">
          <div className="text-center text-gray-400">
            <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mx-auto mb-4" />
            <p>Loading news data...</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-white mb-2">Add News Translation</h1>
          <p className="text-gray-400">Translate news to different languages</p>
        </div>
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-500 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Manage News
          </Button>
        )}
      </div>

      {/* Original News Info */}
      <Card className="backdrop-blur-lg bg-violet-500/5 border-violet-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <h3 className="text-lg text-violet-400 font-semibold">Original News (English)</h3>
            <p className="text-gray-400 text-sm">News ID: {newsData.news_id}</p>
          </div>
        </div>

        <div className="space-y-3 bg-black/30 border border-violet-500/20 rounded-lg p-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Title:</p>
            <p className="text-white font-medium">{newsData.news_title}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Content:</p>
            <p className="text-gray-300 text-sm">{newsData.news_content}</p>
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-violet-500/20">
            <span className="text-gray-400 text-sm">
              Author: <span className="text-gray-300">{newsData.news_author}</span>
            </span>
            <span className="text-gray-400 text-sm">
              Date: <span className="text-gray-300">{newsData.news_date}</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="backdrop-blur-lg bg-red-500/10 border-red-500/30 p-4">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Translation Form */}
      <Card className="backdrop-blur-lg bg-sky-500/5 border-sky-500/30 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
            <Languages className="w-5 h-5 text-sky-500" />
          </div>
          <h3 className="text-xl text-sky-400 font-semibold">Translation</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden news_id field (simulated) */}
          <input type="hidden" value={newsData.news_id} />

          {/* Language Selection */}
          <div>
            <label htmlFor="news_language" className="block text-gray-300 mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Language:
            </label>
            <select
              id="news_language"
              name="news_language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-sky-500/30 rounded-lg text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
              required
            >
              <option value="">Select a language ...</option>
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.code})
                </option>
              ))}
            </select>
            <p className="text-gray-500 text-sm mt-2">
              Select the language for this translation
            </p>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="news_title" className="block text-gray-300 mb-2">
              Title:
            </label>
            <input
              type="text"
              id="news_title"
              name="news_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-sky-500/30 rounded-lg text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
              placeholder="Enter translated title..."
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="news_content" className="block text-gray-300 mb-2">
              Content:
            </label>
            <textarea
              id="news_content"
              name="news_content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-black/40 border border-sky-500/30 rounded-lg text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all resize-none"
              placeholder="Write the translated content here..."
              required
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-gray-500 text-sm">{content.length} characters</p>
              <p className="text-gray-500 text-sm">
                💡 Tip: Translate the content while keeping the same meaning and tone
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Adding Translation...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Add News Translation
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-sky-500/5 border-sky-500/30 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2 text-sm text-gray-400">
            <p className="text-sky-400 font-semibold">Translation Process:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Translation will be added to the database with the selected language</li>
              <li>News cache will be updated automatically</li>
              <li>News index will be regenerated</li>
              <li>Users will see the news in their selected language</li>
              <li>Original news remains unchanged</li>
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
