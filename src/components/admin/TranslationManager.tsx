'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Translations {
  [key: string]: {
    EN?: string;
    FR?: string;
    ES?: string;
  };
}

const LANGUAGES = ['EN', 'FR', 'ES'] as const;
type Language = typeof LANGUAGES[number];

export default function TranslationManager() {
  const { token } = useAuth();
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [editingValues, setEditingValues] = useState<{ [key in Language]?: string }>({ EN: '', FR: '', ES: '' });

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      const res = await fetch('/api/admin/translations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setTranslations(data.translations || {});
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingKey) return;

    try {
      const translationsToSave = LANGUAGES.map((lang) => ({
        key: editingKey,
        language: lang,
        value: editingValues[lang] || '',
      })).filter(t => t.value);

      const res = await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ translations: translationsToSave }),
      });

      if (res.ok) {
        await fetchTranslations();
        setIsEditing(false);
        setEditingKey('');
        setEditingValues({ EN: '', FR: '', ES: '' });
      }
    } catch (error) {
      console.error('Failed to save translations:', error);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete translation key "${key}" for all languages?`)) return;

    try {
      for (const lang of LANGUAGES) {
        await fetch(`/api/admin/translations?key=${key}&language=${lang}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      await fetchTranslations();
    } catch (error) {
      console.error('Failed to delete translation:', error);
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading translations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-white">Translation Dictionary</h2>
        <button
          onClick={() => {
            setEditingKey('');
            setEditingValues({ EN: '', FR: '', ES: '' });
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
        >
          + Add Translation
        </button>
      </div>

      {/* Translation Table */}
      <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Key</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">English (EN)</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Français (FR)</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Español (ES)</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(translations).map(([key, values]) => (
              <tr key={key} className="border-b border-white/5 hover:bg-slate-700/30">
                <td className="px-4 py-3 text-sm font-mono text-amber-400">{key}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{values.EN || '-'}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{values.FR || '-'}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{values.ES || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setEditingKey(key);
                      setEditingValues({
                        EN: values.EN || '',
                        FR: values.FR || '',
                        ES: values.ES || '',
                      });
                      setIsEditing(true);
                    }}
                    className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(key)}
                    className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            
            {Object.keys(translations).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No translations yet. Click "Add Translation" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-serif text-white mb-4">
              {editingKey ? 'Edit' : 'Add'} Translation
            </h3>

            <div className="space-y-4">
              {!editingKey && (
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Translation Key (e.g., nav_home, hero_title)
                  </label>
                  <input
                    type="text"
                    value={editingKey}
                    onChange={(e) => setEditingKey(e.target.value.replace(/\s/g, '_').toLowerCase())}
                    className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white font-mono"
                    placeholder="e.g., contact_button"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-300 mb-1">English (EN)</label>
                <textarea
                  value={editingValues.EN || ''}
                  onChange={(e) => setEditingValues({ ...editingValues, EN: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Français (FR)</label>
                <textarea
                  value={editingValues.FR || ''}
                  onChange={(e) => setEditingValues({ ...editingValues, FR: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Español (ES)</label>
                <textarea
                  value={editingValues.ES || ''}
                  onChange={(e) => setEditingValues({ ...editingValues, ES: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingKey('');
                  setEditingValues({ EN: '', FR: '', ES: '' });
                }}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editingKey}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
