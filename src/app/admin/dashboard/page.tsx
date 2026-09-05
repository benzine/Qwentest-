'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ContentManager from '@/components/admin/ContentManager';
import FormManager from '@/components/admin/FormManager';
import TranslationManager from '@/components/admin/TranslationManager';
import SettingsManager from '@/components/admin/SettingsManager';

type Tab = 'content' | 'forms' | 'translations' | 'settings';

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('content');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-serif text-white">Backoffice Admin</h1>
              <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                {user?.role}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">{user?.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-800/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'content', label: 'Content Blocks', icon: '📝' },
              { id: 'forms', label: 'Form Builder', icon: '📋' },
              { id: 'translations', label: 'Translations', icon: '🌐' },
              { id: 'settings', label: 'Site Settings', icon: '⚙️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'forms' && <FormManager />}
        {activeTab === 'translations' && <TranslationManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </main>
    </div>
  );
}
