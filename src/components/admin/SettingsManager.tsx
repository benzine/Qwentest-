'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SiteSettings {
  id: string;
  siteName: string;
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  accessibilityHighContrast: boolean;
  accessibilityReducedMotion: boolean;
}

export default function SettingsManager() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings || getDefaultSettings());
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getDefaultSettings = (): SiteSettings => ({
    id: 'singleton',
    siteName: 'Consulting Firm',
    primaryColor: '#0f172a',
    accentColor: '#d4af37',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    accessibilityHighContrast: false,
    accessibilityReducedMotion: false,
  });

  if (isLoading) {
    return <div className="text-white">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-white">Site Settings</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {isSaving ? (
            <>
              <span>Saving...</span>
            </>
          ) : saved ? (
            <>
              <span>✓ Saved!</span>
            </>
          ) : (
            <>
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6">
        {/* Branding */}
        <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Branding</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Site Name</label>
              <input
                type="text"
                value={settings?.siteName || ''}
                onChange={(e) => setSettings({ ...settings!, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Colors</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings?.primaryColor || '#0f172a'}
                  onChange={(e) => setSettings({ ...settings!, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings?.primaryColor || '#0f172a'}
                  onChange={(e) => setSettings({ ...settings!, primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-white/10 rounded text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Accent Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings?.accentColor || '#d4af37'}
                  onChange={(e) => setSettings({ ...settings!, accentColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings?.accentColor || '#d4af37'}
                  onChange={(e) => setSettings({ ...settings!, accentColor: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-white/10 rounded text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Typography</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Heading Font</label>
              <select
                value={settings?.fontHeading || 'Playfair Display'}
                onChange={(e) => setSettings({ ...settings!, fontHeading: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
              >
                <option value="Playfair Display">Playfair Display</option>
                <option value="Cormorant Garamond">Cormorant Garamond</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Lora">Lora</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Body Font</label>
              <select
                value={settings?.fontBody || 'Inter'}
                onChange={(e) => setSettings({ ...settings!, fontBody: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded text-white"
              >
                <option value="Inter">Inter</option>
                <option value="Manrope">Manrope</option>
                <option value="DM Sans">DM Sans</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Accessibility Defaults</h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.accessibilityHighContrast || false}
                onChange={(e) => setSettings({ ...settings!, accessibilityHighContrast: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-700 border-white/10"
              />
              <div>
                <span className="text-sm text-slate-300">High Contrast Mode</span>
                <p className="text-xs text-slate-400">Enable higher contrast colors by default</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.accessibilityReducedMotion || false}
                onChange={(e) => setSettings({ ...settings!, accessibilityReducedMotion: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-700 border-white/10"
              />
              <div>
                <span className="text-sm text-slate-300">Reduced Motion</span>
                <p className="text-xs text-slate-400">Minimize animations for users sensitive to motion</p>
              </div>
            </label>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Live Preview</h3>
          
          <div 
            className="p-4 rounded-lg border border-white/10"
            style={{
              backgroundColor: settings?.primaryColor,
              color: '#ffffff',
            }}
          >
            <h4 
              className="text-xl mb-2"
              style={{ fontFamily: settings?.fontHeading }}
            >
              {settings?.siteName}
            </h4>
            <p 
              className="text-sm opacity-80"
              style={{ fontFamily: settings?.fontBody }}
            >
              This is a preview of your typography settings. The heading uses your selected serif font, 
              while this text uses your selected sans-serif font.
            </p>
            <button
              className="mt-3 px-4 py-2 rounded text-sm font-medium transition-transform hover:scale-105"
              style={{ backgroundColor: settings?.accentColor, color: '#000000' }}
            >
              Sample Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
