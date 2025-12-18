import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, CheckCircle, XCircle, Save, Trash2, Plus, Edit } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface DownloadsConfig {
  active: number;
  show_client_downloads: number;
  show_patch_downloads: number;
  show_tool_downloads: number;
}

interface DownloadItem {
  download_id: number;
  download_title: string;
  download_description: string;
  download_link: string;
  download_size: number;
  download_type: number;
}

const downloadTypes = {
  1: 'Client',
  2: 'Patch',
  3: 'Tool',
};

export function DownloadsSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<DownloadsConfig>({
    active: 1,
    show_client_downloads: 1,
    show_patch_downloads: 1,
    show_tool_downloads: 1,
  });

  // Mock downloads list - would come from database in production
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      download_id: 1,
      download_title: 'MeuMU Client Full',
      download_description: 'Complete game client installation',
      download_link: 'https://example.com/client.zip',
      download_size: 1024.5,
      download_type: 1,
    },
    {
      download_id: 2,
      download_title: 'Patch v1.2.3',
      download_description: 'Latest game update',
      download_link: 'https://example.com/patch123.exe',
      download_size: 45.8,
      download_type: 2,
    },
    {
      download_id: 3,
      download_title: 'MU Helper Tool',
      download_description: 'Auto-hunting assistant',
      download_link: 'https://example.com/helper.zip',
      download_size: 12.3,
      download_type: 3,
    },
  ]);

  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const [newDownload, setNewDownload] = useState({
    title: '',
    description: '',
    link: '',
    size: '',
    type: '1',
  });

  const checkValue = (value: any): boolean => {
    return value !== '' && value !== null && value !== undefined;
  };

  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    const formData = new FormData(e.currentTarget);
    const settings: any = {};

    // Get all settings
    for (let i = 1; i <= 4; i++) {
      settings[`setting_${i}`] = formData.get(`setting_${i}`);
    }

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving Downloads Settings...');
      console.log('📄 XML Path: module_configs/downloads.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        show_client_downloads: Number(settings.setting_2),
        show_patch_downloads: Number(settings.setting_3),
        show_tool_downloads: Number(settings.setting_4),
      });

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        show_client_downloads: Number(settings.setting_2),
        show_patch_downloads: Number(settings.setting_3),
        show_tool_downloads: Number(settings.setting_4),
      });

      setMessage({
        type: 'success',
        text: 'Settings successfully saved.',
      });

      console.log('✅ Settings saved successfully');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setMessage({
        type: 'error',
        text: error.message,
      });
    }
  };

  const handleEditDownload = (downloadId: number, formData: FormData) => {
    setMessage({ type: null, text: '' });

    try {
      const title = formData.get(`downloads_edit_title_${downloadId}`) as string;
      const description = formData.get(`downloads_edit_desc_${downloadId}`) as string;
      const link = formData.get(`downloads_edit_link_${downloadId}`) as string;
      const size = formData.get(`downloads_edit_size_${downloadId}`) as string;
      const type = formData.get(`downloads_edit_type_${downloadId}`) as string;

      if (!title || !description || !link || !size || !type) {
        throw new Error('Missing data (complete all fields).');
      }

      console.log('💾 Updating Download...');
      console.log('🆔 Download ID:', downloadId);
      console.log('📦 Data:', { title, description, link, size, type });

      // Update download in state
      setDownloads(downloads.map(dl =>
        dl.download_id === downloadId
          ? {
              ...dl,
              download_title: title,
              download_description: description,
              download_link: link,
              download_size: parseFloat(size),
              download_type: parseInt(type),
            }
          : dl
      ));

      setMessage({
        type: 'success',
        text: 'Your download link has been successfully updated!',
      });

      console.log('✅ Download updated successfully');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setMessage({
        type: 'error',
        text: 'There was an error updating the download link.',
      });
    }
  };

  const handleDeleteDownload = (downloadId: number) => {
    setMessage({ type: null, text: '' });

    try {
      console.log('🗑️ Deleting Download...');
      console.log('🆔 Download ID:', downloadId);

      // Remove download from state
      setDownloads(downloads.filter(dl => dl.download_id !== downloadId));

      setMessage({
        type: 'success',
        text: 'Your download link has been successfully deleted!',
      });

      console.log('✅ Download deleted successfully');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setMessage({
        type: 'error',
        text: 'There was an error deleting the download link.',
      });
    }
  };

  const handleAddDownload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    try {
      if (!newDownload.title || !newDownload.description || !newDownload.link || !newDownload.size || !newDownload.type) {
        throw new Error('Missing data (complete all fields).');
      }

      console.log('➕ Adding New Download...');
      console.log('📦 Data:', newDownload);

      // Add new download to state
      const newId = Math.max(...downloads.map(d => d.download_id), 0) + 1;
      setDownloads([
        ...downloads,
        {
          download_id: newId,
          download_title: newDownload.title,
          download_description: newDownload.description,
          download_link: newDownload.link,
          download_size: parseFloat(newDownload.size),
          download_type: parseInt(newDownload.type),
        },
      ]);

      // Reset form
      setNewDownload({
        title: '',
        description: '',
        link: '',
        size: '',
        type: '1',
      });

      setMessage({
        type: 'success',
        text: 'Your download link has been successfully added!',
      });

      console.log('✅ Download added successfully');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setMessage({
        type: 'error',
        text: 'There was an error adding the download link.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Downloads Settings</h2>
      </div>

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
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                  message.type === 'success'
                    ? 'bg-green-500/20 border-green-500/50'
                    : 'bg-red-500/20 border-red-500/50'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    message.type === 'success' ? 'text-green-300' : 'text-red-300'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Form */}
      <form onSubmit={handleSettingsSubmit}>
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
          <table className="w-full">
            <tbody>
              {/* Status */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20" style={{ width: '40%' }}>
                  <div>
                    <div className="text-white font-medium mb-1">Status</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enable/disable the downloads module.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_1"
                        value="1"
                        defaultChecked={config.active === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_1"
                        value="0"
                        defaultChecked={config.active === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Client Downloads */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Client Downloads</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="1"
                        defaultChecked={config.show_client_downloads === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="0"
                        defaultChecked={config.show_client_downloads === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Patches Downloads */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Patches Downloads</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_3"
                        value="1"
                        defaultChecked={config.show_patch_downloads === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_3"
                        value="0"
                        defaultChecked={config.show_patch_downloads === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Show Tools Downloads */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Show Tools Downloads</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_4"
                        value="1"
                        defaultChecked={config.show_tool_downloads === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_4"
                        value="0"
                        defaultChecked={config.show_tool_downloads === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Submit Button */}
              <tr>
                <td colSpan={2} className="px-6 py-4 bg-black/20">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </form>

      {/* Divider */}
      <div className="border-t border-gray-700/30 my-8"></div>

      {/* Manage Downloads */}
      <div>
        <h3 className="text-2xl text-white mb-4">Manage Downloads</h3>

        {downloads.length > 0 ? (
          <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/30 bg-black/20">
                    <th className="px-4 py-3 text-left text-white font-medium">Title</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Description</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Link</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Size (MB)</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-white font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((download) => (
                    <tr key={download.download_id} className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          defaultValue={download.download_title}
                          name={`downloads_edit_title_${download.download_id}`}
                          className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          defaultValue={download.download_description}
                          name={`downloads_edit_desc_${download.download_id}`}
                          className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          defaultValue={download.download_link}
                          name={`downloads_edit_link_${download.download_id}`}
                          className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          defaultValue={download.download_size.toFixed(2)}
                          name={`downloads_edit_size_${download.download_id}`}
                          className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          defaultValue={download.download_type}
                          name={`downloads_edit_type_${download.download_id}`}
                          className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                        >
                          {Object.entries(downloadTypes).map(([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={(e) => {
                              const row = e.currentTarget.closest('tr');
                              if (row) {
                                const formData = new FormData();
                                row.querySelectorAll('input, select').forEach((input: any) => {
                                  formData.append(input.name, input.value);
                                });
                                handleEditDownload(download.download_id, formData);
                              }
                            }}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 text-sm"
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleDeleteDownload(download.download_id)}
                            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 text-sm"
                          >
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="backdrop-blur-lg bg-red-500/5 border-red-500/30 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center border bg-red-500/20 border-red-500/50 flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-red-300 text-sm">
                  You have not added any download link.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700/30 my-8"></div>

      {/* Add Download */}
      <div>
        <h3 className="text-2xl text-white mb-4">Add Download</h3>

        <form onSubmit={handleAddDownload}>
          <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/30 bg-black/20">
                    <th className="px-4 py-3 text-left text-white font-medium">Title</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Description</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Link</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Size (MB)</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700/30">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={newDownload.title}
                        onChange={(e) => setNewDownload({ ...newDownload, title: e.target.value })}
                        placeholder="e.g., MeuMU Client Full"
                        className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={newDownload.description}
                        onChange={(e) => setNewDownload({ ...newDownload, description: e.target.value })}
                        placeholder="e.g., Complete game client"
                        className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={newDownload.link}
                        onChange={(e) => setNewDownload({ ...newDownload, link: e.target.value })}
                        placeholder="https://example.com/file.zip"
                        className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={newDownload.size}
                        onChange={(e) => setNewDownload({ ...newDownload, size: e.target.value })}
                        placeholder="1024.5"
                        className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={newDownload.type}
                        onChange={(e) => setNewDownload({ ...newDownload, type: e.target.value })}
                        className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                      >
                        {Object.entries(downloadTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="px-4 py-4 bg-black/20">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Download
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </form>
      </div>

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <Download className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Downloads Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the Downloads module and manage game client, patches, and tool downloads.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Status:</strong> Enable or disable the entire downloads module</li>
              <li><strong>Show Client Downloads:</strong> Display game client downloads to visitors</li>
              <li><strong>Show Patches Downloads:</strong> Display game update patches to visitors</li>
              <li><strong>Show Tools Downloads:</strong> Display helper tools and utilities to visitors</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/downloads.xml</code></li>
              <li>Download links can be hosted on external file hosting services</li>
              <li>File size should be specified in megabytes (MB)</li>
              <li>Types: <strong>Client</strong> (full game), <strong>Patch</strong> (updates), <strong>Tool</strong> (utilities)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
