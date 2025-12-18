import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Trash2,
  Save,
  Plus,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  Eye,
  EyeOff,
  ExternalLink,
  Link as LinkIcon,
  Users,
  UserCheck,
  Globe,
  Hash,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface NavbarElement {
  id: string;
  active: boolean;
  type: 'internal' | 'external';
  phrase: string;
  link: string;
  visibility: 'user' | 'guest' | 'always';
  newtab: boolean;
  order: number;
}

export function NavigationMenu() {
  const [navbarElements, setNavbarElements] = useState<NavbarElement[]>([
    {
      id: '0',
      active: true,
      type: 'internal',
      phrase: 'lang_home',
      link: '',
      visibility: 'always',
      newtab: false,
      order: 1
    },
    {
      id: '1',
      active: true,
      type: 'internal',
      phrase: 'lang_news',
      link: 'news',
      visibility: 'always',
      newtab: false,
      order: 2
    },
    {
      id: '2',
      active: true,
      type: 'internal',
      phrase: 'lang_downloads',
      link: 'downloads',
      visibility: 'always',
      newtab: false,
      order: 3
    },
    {
      id: '3',
      active: true,
      type: 'internal',
      phrase: 'lang_rankings',
      link: 'rankings',
      visibility: 'always',
      newtab: false,
      order: 4
    },
    {
      id: '4',
      active: true,
      type: 'internal',
      phrase: 'lang_usercp',
      link: 'usercp',
      visibility: 'user',
      newtab: false,
      order: 5
    },
    {
      id: '5',
      active: true,
      type: 'external',
      phrase: 'Discord',
      link: 'https://discord.gg/yourserver',
      visibility: 'always',
      newtab: true,
      order: 6
    },
  ]);

  const [newElement, setNewElement] = useState<Omit<NavbarElement, 'id'>>({
    active: true,
    type: 'internal',
    phrase: '',
    link: '',
    visibility: 'always',
    newtab: false,
    order: 10,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showMessage = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleDelete = (id: string) => {
    console.log('🗑️ Deleting navbar element:', id);
    setNavbarElements(prev => prev.filter(el => el.id !== id));
    console.log('Saving navbar.json...');
    showMessage('success', 'Changes successfully saved!');
  };

  const handleSave = (element: NavbarElement) => {
    console.log('💾 Saving navbar element:', element);
    
    // Validate
    if (!element.phrase.trim()) {
      showMessage('error', 'Please fill all the form fields.');
      return;
    }

    // Update element
    setNavbarElements(prev => {
      const updated = prev.map(el => el.id === element.id ? element : el);
      // Sort by order
      return updated.sort((a, b) => a.order - b.order);
    });

    console.log('Encoding navbar.json...');
    console.log('Writing to file...');
    showMessage('success', 'Changes successfully saved!');
  };

  const handleAddNew = () => {
    console.log('➕ Adding new navbar element:', newElement);

    // Validate
    if (!newElement.phrase.trim()) {
      showMessage('error', 'Please fill all the form fields.');
      return;
    }

    const newId = Date.now().toString();
    const elementToAdd: NavbarElement = {
      ...newElement,
      id: newId,
    };

    setNavbarElements(prev => {
      const updated = [...prev, elementToAdd];
      // Sort by order
      return updated.sort((a, b) => a.order - b.order);
    });

    // Reset form
    setNewElement({
      active: true,
      type: 'internal',
      phrase: '',
      link: '',
      visibility: 'always',
      newtab: false,
      order: 10,
    });

    console.log('Encoding navbar.json...');
    console.log('Writing to file...');
    showMessage('success', 'Navbar successfully updated!');
  };

  const sortedElements = [...navbarElements].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">Navigation Menu</h1>
        <p className="text-gray-400">Manage navigation bar links and order</p>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div className="text-green-300 font-medium">{successMessage}</div>
            </div>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div className="text-red-300 font-medium">{errorMessage}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Elements</p>
              <p className="text-3xl text-blue-500 font-bold">{navbarElements.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
              <Menu className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active</p>
              <p className="text-3xl text-green-500 font-bold">
                {navbarElements.filter(el => el.active).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/50">
              <Eye className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-gray-500/5 border-gray-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Hidden</p>
              <p className="text-3xl text-gray-500 font-bold">
                {navbarElements.filter(el => !el.active).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-500/20 flex items-center justify-center border border-gray-500/50">
              <EyeOff className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Table */}
      <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50 bg-black/30">
                <th className="px-4 py-3 text-left text-gray-400 font-medium w-12"></th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium w-24">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Order
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Link Type</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Link</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Phrase</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Visibility</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">New Tab</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium w-24"></th>
              </tr>
            </thead>
            <tbody>
              {sortedElements.map((element) => (
                <NavbarRow
                  key={element.id}
                  element={element}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              ))}

              {/* Add New Row */}
              <tr className="border-t-4 border-green-500/30 bg-green-500/5">
                <td colSpan={9} className="px-4 py-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl text-white font-semibold">Add New Element</h3>
                  </div>
                </td>
              </tr>
              <tr className="bg-green-500/5 border-b border-green-500/30">
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newElement.order}
                    onChange={(e) => setNewElement({ ...newElement, order: parseInt(e.target.value) || 0 })}
                    className="w-20 bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={newElement.active}
                        onChange={() => setNewElement({ ...newElement, active: true })}
                        className="text-green-500 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-300">Show</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!newElement.active}
                        onChange={() => setNewElement({ ...newElement, active: false })}
                        className="text-gray-500 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-300">Hide</span>
                    </label>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={newElement.type}
                    onChange={(e) => setNewElement({ ...newElement, type: e.target.value as 'internal' | 'external' })}
                    className="bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  >
                    <option value="internal">internal</option>
                    <option value="external">external</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={newElement.link}
                    onChange={(e) => setNewElement({ ...newElement, link: e.target.value })}
                    placeholder="rankings/resets"
                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 placeholder-gray-600"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={newElement.phrase}
                    onChange={(e) => setNewElement({ ...newElement, phrase: e.target.value })}
                    placeholder="lang_phrase_x"
                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 placeholder-gray-600"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={newElement.visibility}
                    onChange={(e) => setNewElement({ ...newElement, visibility: e.target.value as 'user' | 'guest' | 'always' })}
                    className="bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  >
                    <option value="user">user</option>
                    <option value="guest">guest</option>
                    <option value="always">always</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={newElement.newtab}
                        onChange={() => setNewElement({ ...newElement, newtab: true })}
                        className="text-green-500 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-300">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!newElement.newtab}
                        onChange={() => setNewElement({ ...newElement, newtab: false })}
                        className="text-gray-500 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-300">No</span>
                    </label>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Button
                    onClick={handleAddNew}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <Menu className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Navigation Menu Configuration</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              <strong>Configuration File:</strong> <code className="bg-black/50 px-2 py-1 rounded text-xs">configs/navbar.json</code>
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Order:</strong> Display order of menu items (lower numbers appear first)</li>
              <li><strong>Status:</strong> Show (visible) or Hide (hidden) the menu item</li>
              <li><strong>Link Type:</strong> Internal (site pages) or External (full URLs)</li>
              <li><strong>Phrase:</strong> Language phrase key for multi-language support</li>
              <li><strong>Visibility:</strong> User (logged in only), Guest (logged out only), Always (everyone)</li>
              <li><strong>New Tab:</strong> Whether to open the link in a new browser tab</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Individual Navbar Row Component
function NavbarRow({
  element,
  onSave,
  onDelete,
}: {
  element: NavbarElement;
  onSave: (element: NavbarElement) => void;
  onDelete: (id: string) => void;
}) {
  const [editedElement, setEditedElement] = useState<NavbarElement>(element);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasChanges = JSON.stringify(editedElement) !== JSON.stringify(element);

  return (
    <>
      <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
        <td className="px-4 py-3 text-center">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-8 h-8 rounded bg-red-500/20 border border-red-500/50 flex items-center justify-center hover:bg-red-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </td>
        <td className="px-4 py-3">
          <input
            type="number"
            value={editedElement.order}
            onChange={(e) => setEditedElement({ ...editedElement, order: parseInt(e.target.value) || 0 })}
            className="w-20 bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
          />
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={editedElement.active}
                onChange={() => setEditedElement({ ...editedElement, active: true })}
                className="text-green-500 focus:ring-green-500"
              />
              <span className="text-sm text-gray-300">Show</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!editedElement.active}
                onChange={() => setEditedElement({ ...editedElement, active: false })}
                className="text-gray-500 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-300">Hide</span>
            </label>
          </div>
        </td>
        <td className="px-4 py-3">
          <select
            value={editedElement.type}
            onChange={(e) => setEditedElement({ ...editedElement, type: e.target.value as 'internal' | 'external' })}
            className="bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
          >
            <option value="internal">internal</option>
            <option value="external">external</option>
          </select>
        </td>
        <td className="px-4 py-3">
          <div className="relative">
            <input
              type="text"
              value={editedElement.link}
              onChange={(e) => setEditedElement({ ...editedElement, link: e.target.value })}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
            />
            {editedElement.type === 'external' && (
              <ExternalLink className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <input
            type="text"
            value={editedElement.phrase}
            onChange={(e) => setEditedElement({ ...editedElement, phrase: e.target.value })}
            className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
          />
        </td>
        <td className="px-4 py-3">
          <select
            value={editedElement.visibility}
            onChange={(e) => setEditedElement({ ...editedElement, visibility: e.target.value as 'user' | 'guest' | 'always' })}
            className="bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
          >
            <option value="user">user</option>
            <option value="guest">guest</option>
            <option value="always">always</option>
          </select>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={editedElement.newtab}
                onChange={() => setEditedElement({ ...editedElement, newtab: true })}
                className="text-sky-500 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-300">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!editedElement.newtab}
                onChange={() => setEditedElement({ ...editedElement, newtab: false })}
                className="text-gray-500 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-300">No</span>
            </label>
          </div>
        </td>
        <td className="px-4 py-3">
          <Button
            onClick={() => onSave(editedElement)}
            size="sm"
            disabled={!hasChanges}
            className={`${
              hasChanges
                ? 'bg-sky-600 hover:bg-sky-700 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </td>
      </tr>

      {/* Delete Confirmation Row */}
      {showDeleteConfirm && (
        <tr className="border-b border-red-500/30 bg-red-500/5">
          <td colSpan={9} className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-white font-medium">Delete this navigation element?</p>
                  <p className="text-gray-400 text-sm">
                    This will remove "<span className="text-red-400">{element.phrase}</span>" from the navigation menu.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    onDelete(element.id);
                    setShowDeleteConfirm(false);
                  }}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  size="sm"
                  variant="outline"
                  className="border-gray-500 text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
