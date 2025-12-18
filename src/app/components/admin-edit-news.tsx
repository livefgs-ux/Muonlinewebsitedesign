import { motion } from 'motion/react';
import { Newspaper, Save, AlertCircle, CheckCircle, ArrowLeft, User, Calendar, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface NewsData {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string; // ISO format: YYYY-MM-DD HH:mm
}

interface EditNewsProps {
  newsId: number;
  onBack: () => void;
}

export function AdminEditNews({ newsId, onBack }: EditNewsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<NewsData>({
    id: newsId,
    title: '',
    content: '',
    author: '',
    date: '',
  });

  // Check if news cache directory is writable
  const [isCacheWritable, setIsCacheWritable] = useState(true);

  // Load news data
  useEffect(() => {
    const loadNewsData = async () => {
      setIsLoading(true);
      
      // Simulate: Load news data from database
      setTimeout(() => {
        console.log('📰 Loading news data for ID:', newsId);
        
        // Mock news data - in production, this would come from database
        const mockNews: NewsData = {
          id: newsId,
          title: 'Grand Castle Siege Event',
          content: `<h2>Castle Siege Returns!</h2>
<p>The epic <strong>Castle Siege</strong> event is back! Gather your guild and prepare for the ultimate battle for dominance.</p>
<h3>Event Details:</h3>
<ul>
  <li><strong>Date:</strong> Every Saturday at 20:00 Server Time</li>
  <li><strong>Location:</strong> Castle of MU</li>
  <li><strong>Rewards:</strong> Exclusive items, titles, and castle ownership</li>
</ul>
<p>Only the strongest guild will claim victory and rule the castle for the entire week. Will your guild be the champion?</p>
<p><em>May the best warriors win!</em></p>`,
          author: 'GameMaster',
          date: '2025-01-18 14:30',
        };
        
        setFormData(mockNews);
        setIsLoading(false);
      }, 500);
    };

    loadNewsData();
  }, [newsId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.title.trim()) {
      setErrorMessage('Title is required.');
      return;
    }

    if (!formData.content.trim()) {
      setErrorMessage('Content is required.');
      return;
    }

    if (!formData.author.trim()) {
      setErrorMessage('Author is required.');
      return;
    }

    if (!formData.date.trim()) {
      setErrorMessage('News date is required.');
      return;
    }

    // Validate date format (YYYY-MM-DD HH:mm)
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateRegex.test(formData.date)) {
      setErrorMessage('Invalid date format. Use: YYYY-MM-DD HH:mm (e.g., 2025-01-18 14:30)');
      return;
    }

    // Check if cache directory is writable
    if (!isCacheWritable) {
      setErrorMessage('The news cache folder is not writable. Please check permissions.');
      return;
    }

    setIsSubmitting(true);

    // Simulate: Update news in database
    setTimeout(() => {
      console.log('💾 Updating News:');
      console.log('ID:', formData.id);
      console.log('Title:', formData.title);
      console.log('Content:', formData.content);
      console.log('Author:', formData.author);
      console.log('Date:', formData.date);
      console.log('📦 Updating news cache...');
      console.log('📑 Updating news cache index...');

      setShowSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setShowSuccess(false);
        // Redirect back to manage news
        setTimeout(() => {
          onBack();
        }, 500);
      }, 1500);
    }, 1000);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, content: e.target.value });
  };

  // Simple HTML formatting buttons
  const insertTag = (tag: string) => {
    const textarea = document.getElementById('news_content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let newText = '';
    let cursorPos = start;

    switch (tag) {
      case 'bold':
        newText = `<strong>${selectedText || 'bold text'}</strong>`;
        cursorPos = start + 8;
        break;
      case 'italic':
        newText = `<em>${selectedText || 'italic text'}</em>`;
        cursorPos = start + 4;
        break;
      case 'h2':
        newText = `<h2>${selectedText || 'Heading 2'}</h2>`;
        cursorPos = start + 4;
        break;
      case 'h3':
        newText = `<h3>${selectedText || 'Heading 3'}</h3>`;
        cursorPos = start + 4;
        break;
      case 'ul':
        newText = `<ul>\n  <li>${selectedText || 'List item'}</li>\n</ul>`;
        cursorPos = start + 10;
        break;
      case 'link':
        newText = `<a href="https://example.com">${selectedText || 'link text'}</a>`;
        cursorPos = start + 9;
        break;
      case 'p':
        newText = `<p>${selectedText || 'paragraph'}</p>`;
        cursorPos = start + 3;
        break;
      default:
        return;
    }

    const before = formData.content.substring(0, start);
    const after = formData.content.substring(end);
    const updatedContent = before + newText + after;

    setFormData({ ...formData, content: updatedContent });

    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-300">Loading news data...</p>
        </div>
      </div>
    );
  }

  if (!isCacheWritable) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-red-300 font-medium mb-1">Cache Directory Error</h3>
                <p className="text-red-300/70 text-sm">
                  The news cache folder is not writable. Please check file permissions.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-gray-500/10 border-gray-500/30 text-gray-300 hover:bg-gray-500/20 hover:border-gray-500/50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl border border-blue-500/30">
            <Newspaper className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl text-white">Edit News</h1>
            <p className="text-blue-300/70 mt-1">
              Update news article information
            </p>
          </div>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-gray-500/10 border-gray-500/30 text-gray-300 hover:bg-gray-500/20 hover:border-gray-500/50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
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
            <div className="text-green-300 font-medium">News updated successfully!</div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="text-red-300 font-medium">{errorMessage}</div>
          </div>
        </motion.div>
      )}

      {/* Edit Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border-blue-500/20 backdrop-blur-xl">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Title:
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter news title..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Content:</label>
                
                {/* Simple HTML formatting toolbar */}
                <div className="flex flex-wrap gap-2 mb-3 p-3 bg-obsidian/30 border border-blue-500/20 rounded-lg">
                  <Button
                    type="button"
                    onClick={() => insertTag('bold')}
                    variant="outline"
                    className="bg-obsidian/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    <strong>B</strong>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('italic')}
                    variant="outline"
                    className="bg-obsidian/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    <em>I</em>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('h2')}
                    variant="outline"
                    className="bg-obsidian/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('h3')}
                    variant="outline"
                    className="bg-obsidian/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    H3
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('p')}
                    variant="outline"
                    className="bg-obsidian/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    ¶
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('ul')}
                    variant="outline"
                    className="bg-obsidian/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    List
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('link')}
                    variant="outline"
                    className="bg-obsidian/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    Link
                  </Button>
                </div>

                <textarea
                  id="news_content"
                  value={formData.content}
                  onChange={handleContentChange}
                  className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
                  placeholder="Enter news content (HTML allowed)..."
                  rows={15}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-gray-400 text-xs mt-2">
                  You can use HTML tags for formatting. Select text and use the buttons above for quick formatting.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Author */}
                <div>
                  <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Author:
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter author name..."
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* News Date */}
                <div>
                  <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    News Date:
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                    placeholder="YYYY-MM-DD HH:mm"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Format: YYYY-MM-DD HH:mm (e.g., 2025-01-18 14:30)
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating News...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Save className="w-6 h-6" />
                      <span>Update News</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
