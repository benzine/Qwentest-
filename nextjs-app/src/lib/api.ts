import { Module, Section, PageLayout } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080/wp-json/headless-builder/v1';
const SITE_URL = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const nonce = (window as unknown as Record<string, string>)?.headlessBuilderConfig?.nonce || '';
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-WP-Nonce': nonce,
    ...options?.headers,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}

export const api = {
  // Pages
  async getPage(pageId: number) {
    return fetchApi<{ id: number; title: string; slug: string; status: string; layout: PageLayout }>(`/pages/${pageId}`);
  },
  
  async updatePage(pageId: number, data: { layout?: PageLayout; title?: string; status?: string }) {
    return fetchApi<{ id: number; layout: PageLayout }>(`/pages/${pageId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Sections
  async createSection(pageId: number, section: Omit<Section, 'id'>) {
    return fetchApi<{ section: Section; layout: PageLayout }>('/sections', {
      method: 'POST',
      body: JSON.stringify({ pageId, section }),
    });
  },
  
  async updateSection(pageId: number, sectionId: string, section: Partial<Section>) {
    return fetchApi<{ section: Section; layout: PageLayout }>(`/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify({ pageId, section }),
    });
  },
  
  async deleteSection(pageId: number, sectionId: string) {
    return fetchApi<{ layout: PageLayout }>(`/sections/${sectionId}`, {
      method: 'DELETE',
      body: JSON.stringify({ pageId }),
    });
  },
  
  // Images
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    const nonce = (window as unknown as Record<string, string>)?.headlessBuilderConfig?.nonce || '';
    
    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      headers: {
        'X-WP-Nonce': nonce,
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Image upload failed');
    }
    
    return data;
  },
  
  // Global blocks
  async getGlobalBlocks() {
    return fetchApi<Array<{ id: number; title: string; data: Record<string, unknown> }>>('/global-blocks');
  },
  
  // Section templates
  async getSectionTemplates() {
    return fetchApi<Array<{ 
      id: number; 
      title: string; 
      description: string; 
      data: Section; 
      thumbnail: string;
      category: string;
    }>>('/section-templates');
  },
  
  // Translations
  async getTranslations(lang: string, namespace?: string) {
    const params = new URLSearchParams({ lang });
    if (namespace) params.append('namespace', namespace);
    return fetchApi<{ language: string; translations: Record<string, string> }>(`/translations?${params}`);
  },
  
  async translateText(text: string, targetLang: string, sourceLang?: string) {
    return fetchApi<{ original: string; translated: string; sourceLang: string; targetLang: string }>('/translations/translate', {
      method: 'POST',
      body: JSON.stringify({ text, targetLang, sourceLang: sourceLang || 'auto' }),
    });
  },
  
  async getSupportedLanguages() {
    return fetchApi<{ languages: Record<string, string>; default: string }>('/translations/languages');
  },
};

// Helper to convert absolute URLs to relative paths
export function urlToRelative(url: string): string {
  if (!url || typeof url !== 'string') return url;
  
  if (url.startsWith('http') || url.startsWith('//')) {
    if (url.startsWith(SITE_URL)) {
      return url.replace(SITE_URL + '/', '');
    }
  }
  
  return url;
}

// Helper to convert relative paths to absolute URLs
export function relativeToUrl(relativePath: string): string {
  if (!relativePath || typeof relativePath !== 'string') return relativePath;
  
  if (relativePath.startsWith('http') || relativePath.startsWith('//')) {
    return relativePath;
  }
  
  return `${SITE_URL}/${relativePath}`;
}

// Image path helper - ensures all images use relative paths
export function getImagePath(path: string): string {
  if (!path) return '';
  
  // If it's already a relative path starting with images/, return as is
  if (path.startsWith('images/')) {
    return path;
  }
  
  // Convert absolute URL to relative
  return urlToRelative(path);
}
