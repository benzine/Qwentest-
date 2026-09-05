'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ContentBlock {
  id: string;
  key: string;
  section: string;
  type: string;
  data: any;
  order: number;
  isActive: boolean;
}

export default function ContentManager() {
  const { token } = useAuth();
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Partial<ContentBlock> | null>(null);

  useEffect(() => {
    fetchContentBlocks();
  }, []);

  const fetchContentBlocks = async () => {
    try {
      const res = await fetch('/api/admin/content', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setContentBlocks(data.contentBlocks || []);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingBlock) return;

    try {
      const method = editingBlock.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/content', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingBlock),
      });

      if (res.ok) {
        await fetchContentBlocks();
        setIsEditing(false);
        setEditingBlock(null);
      }
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content block?')) return;

    try {
      const res = await fetch(`/api/admin/content?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchContentBlocks();
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const sections = ['hero', 'about', 'services', 'process', 'case-studies', 'insights', 'team', 'contact'];
  const types = ['text', 'rich_text', 'image', 'video', 'config'];

  if (isLoading) {
    return <div className="text-white">Loading content blocks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-white">Content Blocks Manager</h2>
        <button
          onClick={() => {
            setEditingBlock({
              key: '',
              section: 'hero',
              type: 'text',
              data: {},
              order: 0,
              isActive: true,
            });
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
        >
          + Add Content Block
        </button>
      </div>

      {/* Content List */}
      <div className="grid gap-4">
        {contentBlocks.map((block) => (
          <div
            key={block.id}
            className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                    {block.section}
                  </span>
                  <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                    {block.type}
                  </span>
                  {!block.isActive && (
                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium text-white">{block.key}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {JSON.stringify(block.data).substring(0, 100)}...
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingBlock(block);
                    setIsEditing(true);
                  }}
                  className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(block.id)}
                  className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && editingBlock && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-serif text-white mb-4">
              {editingBlock.id ? 'Edit' : 'Create'} Content Block
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Key (unique identifier)</label>
                <input
                  type="text"
                  value={editingBlock.key || ''}
                  onChange={(e) => setEditingBlock({ ...editingBlock, key: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
                  placeholder="e.g., hero_title"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Section</label>
                <select
                  value={editingBlock.section || 'hero'}
                  onChange={(e) => setEditingBlock({ ...editingBlock, section: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
                >
                  {sections.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Type</label>
                <select
                  value={editingBlock.type || 'text'}
                  onChange={(e) => setEditingBlock({ ...editingBlock, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Order</label>
                <input
                  type="number"
                  value={editingBlock.order || 0}
                  onChange={(e) => setEditingBlock({ ...editingBlock, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Data (JSON format)
                </label>
                <textarea
                  value={JSON.stringify(editingBlock.data || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      setEditingBlock({ ...editingBlock, data: JSON.parse(e.target.value) });
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white font-mono text-sm h-40"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingBlock.isActive ?? true}
                  onChange={(e) => setEditingBlock({ ...editingBlock, isActive: e.target.checked })}
                  className="rounded bg-slate-700 border-white/10"
                />
                <label htmlFor="isActive" className="text-sm text-slate-300">Active</label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingBlock(null);
                }}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors"
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
