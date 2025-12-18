import { motion } from 'motion/react';
import { Languages, Save, AlertCircle, CheckCircle, ArrowLeft, FileText, Globe } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface NewsTranslationData {
  news_id: number;
  news_language: string;
  news_title: string; // base64 encoded in DB
  news_content: string; // base64 encoded in DB
}

interface EditNewsTranslationProps {
  newsId: number;
  language: string;
  onBack: () => void;
}

export function AdminEditNewsTranslation({ newsId, language, onBack }: EditNewsTranslationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<NewsTranslationData>({
    news_id: newsId,
    news_language: language,
    news_title: '',
    news_content: '',
  });

  // Check if news cache directory is writable
  const [isCacheWritable, setIsCacheWritable] = useState(true);

  // Language display names
  const languageNames: Record<string, string> = {
    'en': 'English',
    'pt': 'Português',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'it': 'Italiano',
    'ru': 'Русский',
    'zh': '中文',
  };

  // Load news translation data
  useEffect(() => {
    const loadNewsTranslation = async () => {
      setIsLoading(true);
      
      // Simulate: Load news translation data from database
      setTimeout(() => {
        console.log('🌐 Loading news translation data:');
        console.log('News ID:', newsId);
        console.log('Language:', language);
        
        // Mock translation data - in production, this would come from database
        // In the real DB, title and content are base64 encoded
        const mockTranslation: NewsTranslationData = {
          news_id: newsId,
          news_language: language,
          // These would normally be base64 decoded from DB
          news_title: 'Gran Evento de Asedio al Castillo',
          news_content: `<h2>¡El Asedio al Castillo ha vuelto!</h2>
<p>El épico evento de <strong>Asedio al Castillo</strong> está de vuelta. Reúne a tu guild y prepárate para la batalla definitiva por el dominio.</p>
<h3>Detalles del Evento:</h3>
<ul>
  <li><strong>Fecha:</strong> Todos los sábados a las 20:00 hora del servidor</li>
  <li><strong>Ubicación:</strong> Castillo de MU</li>
  <li><strong>Recompensas:</strong> Ítems exclusivos, títulos y propiedad del castillo</li>
</ul>
<p>Solo la guild más fuerte reclamará la victoria y gobernará el castillo durante toda la semana. ¿Será tu guild el campeón?</p>
<p><em>¡Que ganen los mejores guerreros!</em></p>`,
        };
        
        setFormData(mockTranslation);
        setIsLoading(false);
      }, 500);
    };

    loadNewsTranslation();
  }, [newsId, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.news_title.trim()) {
      setErrorMessage('Title is required.');
      return;
    }

    if (!formData.news_content.trim()) {
      setErrorMessage('Content is required.');
      return;
    }

    // Check if cache directory is writable
    if (!isCacheWritable) {
      setErrorMessage('The news cache folder is not writable. Please check permissions.');
      return;
    }

    setIsSubmitting(true);

    // Simulate: Update news translation in database
    setTimeout(() => {
      console.log('💾 Updating News Translation:');
      console.log('News ID:', formData.news_id);
      console.log('Language:', formData.news_language);
      console.log('Title:', formData.news_title);
      console.log('Content:', formData.news_content);
      console.log('📦 Updating news cache...');

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
    setFormData({ ...formData, news_content: e.target.value });
  };

  // Simple HTML formatting buttons
  const insertTag = (tag: string) => {
    const textarea = document.getElementById('news_content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.news_content.substring(start, end);
    
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

    const before = formData.news_content.substring(0, start);
    const after = formData.news_content.substring(end);
    const updatedContent = before + newText + after;

    setFormData({ ...formData, news_content: updatedContent });

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
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-300">Loading translation data...</p>
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
          <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-xl border border-amber-500/30">
            <Languages className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl text-white">Edit News Translation</h1>
            <p className="text-amber-300/70 mt-1">
              Update translated news content for different languages
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
            <div className="text-green-300 font-medium">Translation updated successfully!</div>
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
        <Card className="bg-gradient-to-br from-amber-500/5 to-orange-600/5 border-amber-500/20 backdrop-blur-xl">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Language (readonly) */}
              <div>
                <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  Language:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-obsidian/50 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-300 font-medium">
                    {languageNames[formData.news_language] || formData.news_language}
                  </div>
                  <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <span className="text-amber-400 font-mono text-sm uppercase">{formData.news_language}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Language cannot be changed. Create a new translation to add other languages.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Title:
                </label>
                <input
                  type="text"
                  value={formData.news_title}
                  onChange={(e) => setFormData({ ...formData, news_title: e.target.value })}
                  className="w-full bg-obsidian/50 border border-amber-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  placeholder="Enter translated title..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Content:</label>
                
                {/* Simple HTML formatting toolbar */}
                <div className="flex flex-wrap gap-2 mb-3 p-3 bg-obsidian/30 border border-amber-500/20 rounded-lg">
                  <Button
                    type="button"
                    onClick={() => insertTag('bold')}
                    variant="outline"
                    className="bg-obsidian/50 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    <strong>B</strong>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('italic')}
                    variant="outline"
                    className="bg-obsidian/50 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    <em>I</em>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('h2')}
                    variant="outline"
                    className="bg-obsidian/50 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('h3')}
                    variant="outline"
                    className="bg-obsidian/50 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    H3
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('p')}
                    variant="outline"
                    className="bg-obsidian/50 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    ¶
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('ul')}
                    variant="outline"
                    className="bg-obsidian/50 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    List
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertTag('link')}
                    variant="outline"
                    className="bg-obsidian/50 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 text-xs px-3 py-1"
                    disabled={isSubmitting}
                  >
                    Link
                  </Button>
                </div>

                <textarea
                  id="news_content"
                  value={formData.news_content}
                  onChange={handleContentChange}
                  className="w-full bg-obsidian/50 border border-amber-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono text-sm"
                  placeholder="Enter translated content (HTML allowed)..."
                  rows={15}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-gray-400 text-xs mt-2">
                  You can use HTML tags for formatting. Select text and use the buttons above for quick formatting.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-6 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating Translation...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Save className="w-6 h-6" />
                      <span>Update News Translation</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border-blue-500/20 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Languages className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl text-blue-200">About Translations</h3>
            </div>
            <div className="text-blue-300/70 space-y-2 text-sm">
              <p>
                Translations allow you to provide news content in multiple languages. 
                Each translation is stored separately and displayed based on the user's language preference.
              </p>
              <p className="font-medium text-blue-300">
                Supported languages:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                {Object.entries(languageNames).map(([code, name]) => (
                  <div
                    key={code}
                    className={`px-3 py-2 rounded-lg border text-center ${
                      code === formData.news_language
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    }`}
                  >
                    <div className="font-mono text-xs uppercase mb-1">{code}</div>
                    <div className="text-xs">{name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
