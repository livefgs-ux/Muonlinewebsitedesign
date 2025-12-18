import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import {
  Newspaper,
  Save,
  AlertCircle,
  User,
  FileText,
  CheckCircle,
  Home,
  Layout,
} from 'lucide-react';
import { useNews } from '../contexts/NewsContext';

export function AdminPublishNews() {
  const { addNews } = useNews();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Administrator');
  const [imageUrl, setImageUrl] = useState('');
  const [publishToNews, setPublishToNews] = useState(true);
  const [publishToHome, setPublishToHome] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cacheWritable] = useState(true); // Simulate News::isNewsDirWritable()
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert('Please fill in all required fields (Title and Content)');
      return;
    }

    if (!publishToNews && !publishToHome) {
      alert('Please select at least one location to publish (News Section or Home Page)');
      return;
    }

    setIsSubmitting(true);

    // Simulate: 
    // $News->addNews($_POST['news_title'],$_POST['news_content'],$_POST['news_author'],0);
    // $News->cacheNews();
    // $News->updateNewsCacheIndex();
    
    setTimeout(() => {
      // Build publishTo array based on selections
      const publishTo: ('news' | 'home')[] = [];
      if (publishToNews) publishTo.push('news');
      if (publishToHome) publishTo.push('home');

      // Add news to global state
      addNews({
        title,
        content,
        author,
        language: 'en',
        imageUrl: imageUrl || undefined,
        publishTo,
      });

      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Reset form
      setTitle('');
      setContent('');
      setAuthor('Administrator');
      setImageUrl('');
      setPublishToNews(true);
      setPublishToHome(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  if (!cacheWritable) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl text-white mb-2">Publish News</h1>
          <p className="text-gray-400">Create and publish news for your players</p>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">Publish News</h1>
        <p className="text-gray-400">Create and publish news for your players</p>
      </div>

      {/* Form */}
      <Card className="backdrop-blur-lg bg-sky-500/5 border-sky-500/30 p-8">
        <form onSubmit={handlePublish} className="space-y-6">
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
              placeholder="Enter news title..."
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
              placeholder="Write your news content here...&#10;&#10;You can use multiple lines and formatting."
              required
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-gray-500 text-sm">{content.length} characters</p>
              <p className="text-gray-500 text-sm">
                💡 Tip: In the real system, a rich text editor (CKEditor) would be available here
              </p>
            </div>
          </div>

          {/* Author */}
          <div>
            <label htmlFor="news_author" className="block text-gray-300 mb-2">
              Author:
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                id="news_author"
                name="news_author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-black/40 border border-sky-500/30 rounded-lg text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                placeholder="Author name..."
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="news_image_url" className="block text-gray-300 mb-2">
              Image URL:
            </label>
            <input
              type="text"
              id="news_image_url"
              name="news_image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-sky-500/30 rounded-lg text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
              placeholder="Enter image URL..."
            />
          </div>

          {/* Publish Locations */}
          <div>
            <label className="block text-gray-300 mb-3">
              <Layout className="w-5 h-5 inline-block mr-2 text-sky-400" />
              Publish To:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* News Section */}
              <label
                htmlFor="publish_to_news"
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  publishToNews
                    ? 'bg-sky-500/10 border-sky-500/50 shadow-lg shadow-sky-500/20'
                    : 'bg-black/20 border-gray-600/30 hover:border-gray-500/50'
                }`}
              >
                <input
                  type="checkbox"
                  id="publish_to_news"
                  name="publish_to_news"
                  checked={publishToNews}
                  onChange={(e) => setPublishToNews(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-400 text-sky-500 focus:ring-sky-500 focus:ring-offset-0 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-sky-400" />
                    <span className="text-white font-semibold">News Section</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Display in the dedicated news page
                  </p>
                </div>
              </label>

              {/* Home Page */}
              <label
                htmlFor="publish_to_home"
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  publishToHome
                    ? 'bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                    : 'bg-black/20 border-gray-600/30 hover:border-gray-500/50'
                }`}
              >
                <input
                  type="checkbox"
                  id="publish_to_home"
                  name="publish_to_home"
                  checked={publishToHome}
                  onChange={(e) => setPublishToHome(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-400 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-semibold">Home Page</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Featured on the main landing page
                  </p>
                </div>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              💡 Select at least one location to publish your content
            </p>
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
                Publishing...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Publish
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
            <p className="text-sky-400 font-semibold">Publishing Process:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>News will be added to the database</li>
              <li>Cache files will be updated automatically</li>
              <li>News index will be regenerated</li>
              <li>You will be redirected to the Manage News section</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Success Message */}
      {showSuccess && (
        <Card className="backdrop-blur-lg bg-green-500/10 border-green-500/30 p-6">
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">News published successfully!</p>
              <p className="text-sm mt-1">Redirecting to Manage News...</p>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
}