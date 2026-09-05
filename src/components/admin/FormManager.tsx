'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FormConfig {
  id: string;
  name: string;
  fields: any[];
  isActive: boolean;
  _count?: { submissions: number };
}

const defaultFieldTypes = ['text', 'email', 'textarea', 'select', 'multiselect', 'checkbox', 'number', 'date'];

export default function FormManager() {
  const { token } = useAuth();
  const [forms, setForms] = useState<FormConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingForm, setEditingForm] = useState<Partial<FormConfig> | null>(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await fetch('/api/admin/forms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setForms(data.forms || []);
      }
    } catch (error) {
      console.error('Failed to fetch forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingForm) return;

    try {
      const method = editingForm.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/forms', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editingForm,
          fields: editingForm.fields || [],
        }),
      });

      if (res.ok) {
        await fetchForms();
        setIsEditing(false);
        setEditingForm(null);
      }
    } catch (error) {
      console.error('Failed to save form:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;

    try {
      const res = await fetch(`/api/admin/forms?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchForms();
      }
    } catch (error) {
      console.error('Failed to delete form:', error);
    }
  };

  const addField = () => {
    if (!editingForm) return;
    
    const newField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      options: [], // For select/multiselect
      placeholder: '',
      helpText: '',
      conditionalLogic: null, // { fieldId: 'xxx', operator: 'equals', value: 'yyy' }
    };

    setEditingForm({
      ...editingForm,
      fields: [...(editingForm.fields || []), newField],
    });
  };

  const updateField = (index: number, updates: any) => {
    if (!editingForm || !editingForm.fields) return;
    
    const newFields = [...editingForm.fields];
    newFields[index] = { ...newFields[index], ...updates };
    setEditingForm({ ...editingForm, fields: newFields });
  };

  const removeField = (index: number) => {
    if (!editingForm || !editingForm.fields) return;
    
    const newFields = editingForm.fields.filter((_, i) => i !== index);
    setEditingForm({ ...editingForm, fields: newFields });
  };

  if (isLoading) {
    return <div className="text-white">Loading forms...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-white">Form Builder</h2>
        <button
          onClick={() => {
            setEditingForm({
              name: '',
              fields: [],
              isActive: true,
            });
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
        >
          + Create Form
        </button>
      </div>

      {/* Forms List */}
      <div className="grid gap-4">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  {!form.isActive && (
                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                      Inactive
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {form._count?.submissions || 0} submissions
                  </span>
                </div>
                <h3 className="text-lg font-medium text-white">{form.name}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {form.fields.length} fields
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingForm(form);
                    setIsEditing(true);
                  }}
                  className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(form.id)}
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
      {isEditing && editingForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-serif text-white mb-4">
              {editingForm.id ? 'Edit' : 'Create'} Form
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Form Name</label>
                <input
                  type="text"
                  value={editingForm.name || ''}
                  onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
                  placeholder="e.g., Contact Form"
                />
              </div>

              {/* Fields Editor */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm text-slate-300">Form Fields</label>
                  <button
                    onClick={addField}
                    className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                  >
                    + Add Field
                  </button>
                </div>

                <div className="space-y-3">
                  {editingForm.fields?.map((field, index) => (
                    <div
                      key={field.id || index}
                      className="bg-slate-700/50 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-amber-400">Field {index + 1}</span>
                        <button
                          onClick={() => removeField(index)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Label</label>
                          <input
                            type="text"
                            value={field.label || ''}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-600 border border-white/10 rounded text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Type</label>
                          <select
                            value={field.type || 'text'}
                            onChange={(e) => updateField(index, { type: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-600 border border-white/10 rounded text-white text-sm"
                          >
                            {defaultFieldTypes.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Placeholder</label>
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(index, { placeholder: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-600 border border-white/10 rounded text-white text-sm"
                          />
                        </div>

                        <div className="flex items-end pb-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required || false}
                              onChange={(e) => updateField(index, { required: e.target.checked })}
                              className="rounded bg-slate-600 border-white/10"
                            />
                            <span className="text-sm text-slate-300">Required</span>
                          </label>
                        </div>
                      </div>

                      {(field.type === 'select' || field.type === 'multiselect') && (
                        <div className="mt-3">
                          <label className="block text-xs text-slate-400 mb-1">
                            Options (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={(field.options || []).join(', ')}
                            onChange={(e) => updateField(index, { 
                              options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            })}
                            className="w-full px-2 py-1 bg-slate-600 border border-white/10 rounded text-white text-sm"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {(!editingForm.fields || editingForm.fields.length === 0) && (
                    <p className="text-sm text-slate-400 text-center py-4">
                      No fields yet. Click "Add Field" to get started.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="formIsActive"
                  checked={editingForm.isActive ?? true}
                  onChange={(e) => setEditingForm({ ...editingForm, isActive: e.target.checked })}
                  className="rounded bg-slate-700 border-white/10"
                />
                <label htmlFor="formIsActive" className="text-sm text-slate-300">Form Active</label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingForm(null);
                }}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors"
              >
                Save Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
