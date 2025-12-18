import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileArchive,
  Info,
  Settings,
  Plug,
  Folder,
  FileText,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function ImportPlugin() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  // Plugin system status - would come from config in production
  const pluginSystemEnabled = true;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Validate file type (should be .zip)
    const validExtensions = ['.zip', '.rar'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setMessage({
        type: 'error',
        text: 'Invalid file type. Please upload a .zip or .rar file.',
      });
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setMessage({
        type: 'error',
        text: 'File size exceeds 50MB limit.',
      });
      return;
    }

    setSelectedFile(file);
    setMessage({ type: null, text: '' });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleInstall = async () => {
    if (!selectedFile) {
      setMessage({
        type: 'error',
        text: 'Please select a file to upload.',
      });
      return;
    }

    console.log('📦 Installing plugin...');
    console.log('File name:', selectedFile.name);
    console.log('File size:', (selectedFile.size / 1024).toFixed(2), 'KB');
    console.log('File type:', selectedFile.type);

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate plugin installation
    setTimeout(() => {
      console.log('✅ Extracting plugin files...');
      console.log('📁 Validating plugin structure...');
      console.log('⚙️ Installing plugin...');
      console.log('🔧 Registering plugin...');
      
      setIsUploading(false);
      setMessage({
        type: 'success',
        text: `Plugin "${selectedFile.name}" has been successfully installed! You can now activate it from the Plugins Manager.`,
      });
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 2500);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">Import Plugin</h1>
        <p className="text-gray-400">Upload and install new plugins</p>
      </div>

      {/* Plugin System Warning */}
      {!pluginSystemEnabled && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/50 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/50 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-orange-300 font-semibold mb-2">WARNING</h3>
              <p className="text-orange-300/80 text-sm mb-3">
                The plugin system is not currently enabled. To enable it please change your{' '}
                <a
                  href="?module=website_settings"
                  className="text-orange-200 underline hover:text-orange-100 transition-colors"
                >
                  website settings
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <AnimatePresence>
        {message.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl p-6 border ${
              message.type === 'success'
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50'
                : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                message.type === 'success'
                  ? 'bg-green-500/20 border-green-500/50'
                  : 'bg-red-500/20 border-red-500/50'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${
                  message.type === 'success' ? 'text-green-300' : 'text-red-300'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Section */}
      <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 p-8">
        <div className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="text-white font-medium mb-3 block">Select Plugin File</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
                isDragging
                  ? 'border-sky-500 bg-sky-500/10'
                  : 'border-gray-600 bg-black/30 hover:border-sky-500/50 hover:bg-sky-500/5'
              }`}
            >
              <input
                id="file-input"
                type="file"
                accept=".zip,.rar"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 border border-sky-500/50">
                  <Upload className="w-8 h-8 text-sky-400" />
                </div>
                <h3 className="text-white font-medium mb-2">
                  {isDragging ? 'Drop file here' : 'Choose file or drag it here'}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Support for .zip and .rar files (max 50MB)
                </p>
                <Button
                  type="button"
                  className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Folder className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            </div>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/30 border border-sky-500/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center border border-sky-500/50">
                    <FileArchive className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    const fileInput = document.getElementById('file-input') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Installing plugin...</span>
                <span className="text-sky-400 font-medium">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-sky-500 to-blue-500"
                />
              </div>
            </motion.div>
          )}

          {/* Install Button */}
          <div className="flex justify-end pt-4 border-t border-gray-700/50">
            <Button
              onClick={handleInstall}
              disabled={!selectedFile || isUploading || !pluginSystemEnabled}
              className={`${
                selectedFile && !isUploading && pluginSystemEnabled
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plug className="w-4 h-4 mr-2" />
              {isUploading ? 'Installing...' : 'Install Plugin'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Important Info */}
      <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50 flex-shrink-0">
            <Info className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-yellow-300 font-semibold mb-2">Important Information</h3>
            <p className="text-yellow-300/70 text-sm mb-3">
              Make sure you upload all the plugin files before importing it.
            </p>
            <ul className="text-yellow-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Plugin files should be uploaded to the <code className="bg-black/50 px-2 py-1 rounded text-xs">plugins/</code> directory</li>
              <li>The plugin package should include all necessary files and configuration</li>
              <li>Make sure the plugin is compatible with your WebEngine CMS version</li>
              <li>After installation, activate the plugin from the Plugins Manager</li>
              <li>Some plugins may require additional configuration after installation</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Installation Steps */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-4">Installation Process</h3>
            <div className="space-y-3">
              {[
                {
                  step: '1',
                  title: 'Upload Plugin Files',
                  description: 'Upload the plugin folder to the plugins/ directory via FTP',
                },
                {
                  step: '2',
                  title: 'Import Plugin Package',
                  description: 'Upload the plugin package (.zip) using the form above',
                },
                {
                  step: '3',
                  title: 'Automatic Installation',
                  description: 'The system will extract, validate and register the plugin',
                },
                {
                  step: '4',
                  title: 'Activate Plugin',
                  description: 'Go to Plugins Manager to activate and configure the plugin',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-black/30 border border-blue-500/20"
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/50 flex-shrink-0">
                    <span className="text-blue-400 font-semibold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
