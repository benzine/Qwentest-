import { create } from 'zustand';

export interface Module {
  id: string;
  type: string;
  content: Record<string, unknown>;
  styles?: Record<string, unknown>;
}

export interface Section {
  id: string;
  type: string;
  adminLabel: string;
  isVisible: boolean;
  deviceVisibility: string[];
  layout: Record<string, unknown>;
  modules: Module[];
}

export interface PageLayout {
  sections: Section[];
  header: Record<string, unknown>;
  footer: Record<string, unknown>;
  settings: Record<string, unknown>;
}

interface BuilderState {
  // Page data
  pageId: number | null;
  pageTitle: string;
  layout: PageLayout | null;
  
  // Selection state
  selectedSectionId: string | null;
  selectedModuleId: string | null;
  selectedElementPath: string[];
  
  // View state
  viewMode: 'full-page' | 'isolated-section';
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  isDarkMode: boolean;
  
  // Edit state
  isEditing: boolean;
  editHistory: PageLayout[];
  historyIndex: number;
  autoSaveEnabled: boolean;
  lastSavedAt: Date | null;
  
  // Language & Accessibility
  currentLanguage: string;
  fontSize: 'normal' | 'large' | 'larger';
  highContrast: boolean;
  reducedMotion: boolean;
  
  // Actions
  setPageId: (id: number) => void;
  setPageTitle: (title: string) => void;
  setLayout: (layout: PageLayout) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  addSection: (section: Section) => void;
  deleteSection: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;
  duplicateSection: (sectionId: string) => void;
  
  setSelectedSection: (sectionId: string | null) => void;
  setSelectedModule: (moduleId: string | null) => void;
  setSelectedElement: (path: string[]) => void;
  
  setViewMode: (mode: 'full-page' | 'isolated-section') => void;
  setDevicePreview: (device: 'desktop' | 'tablet' | 'mobile') => void;
  toggleDarkMode: () => void;
  
  updateModule: (sectionId: string, moduleId: string, updates: Partial<Module>) => void;
  addModule: (sectionId: string, module: Module) => void;
  deleteModule: (sectionId: string, moduleId: string) => void;
  moveModule: (sectionId: string, moduleId: string, direction: 'up' | 'down') => void;
  
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  
  setLanguage: (lang: string) => void;
  setFontSize: (size: 'normal' | 'large' | 'larger') => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  
  setIsEditing: (editing: boolean) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setLastSavedAt: (date: Date | null) => void;
}

const initialState = {
  pageId: null,
  pageTitle: '',
  layout: null,
  
  selectedSectionId: null,
  selectedModuleId: null,
  selectedElementPath: [],
  
  viewMode: 'full-page' as const,
  devicePreview: 'desktop' as const,
  isDarkMode: false,
  
  isEditing: false,
  editHistory: [],
  historyIndex: -1,
  autoSaveEnabled: true,
  lastSavedAt: null,
  
  currentLanguage: 'en',
  fontSize: 'normal' as const,
  highContrast: false,
  reducedMotion: false,
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  ...initialState,
  
  setPageId: (id) => set({ pageId: id }),
  
  setPageTitle: (title) => set({ pageTitle: title }),
  
  setLayout: (layout) => {
    set({ layout });
    get().saveToHistory();
  },
  
  updateSection: (sectionId, updates) => {
    const { layout } = get();
    if (!layout) return;
    
    const newSections = layout.sections.map((section) =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    
    set({ layout: { ...layout, sections: newSections } });
    get().saveToHistory();
  },
  
  addSection: (section) => {
    const { layout } = get();
    if (!layout) return;
    
    set({ layout: { ...layout, sections: [...layout.sections, section] } });
    get().saveToHistory();
  },
  
  deleteSection: (sectionId) => {
    const { layout } = get();
    if (!layout) return;
    
    set({
      layout: {
        ...layout,
        sections: layout.sections.filter((s) => s.id !== sectionId),
      },
      selectedSectionId: layout.selectedSectionId === sectionId ? null : layout.selectedSectionId,
    });
    get().saveToHistory();
  },
  
  moveSection: (sectionId, direction) => {
    const { layout } = get();
    if (!layout) return;
    
    const index = layout.sections.findIndex((s) => s.id === sectionId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= layout.sections.length) return;
    
    const newSections = [...layout.sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    
    set({ layout: { ...layout, sections: newSections } });
    get().saveToHistory();
  },
  
  duplicateSection: (sectionId) => {
    const { layout } = get();
    if (!layout) return;
    
    const sectionToDuplicate = layout.sections.find((s) => s.id === sectionId);
    if (!sectionToDuplicate) return;
    
    const duplicatedSection = {
      ...sectionToDuplicate,
      id: `sec_${Date.now()}`,
      adminLabel: `${sectionToDuplicate.adminLabel} (Copy)`,
    };
    
    const index = layout.sections.findIndex((s) => s.id === sectionId);
    const newSections = [
      ...layout.sections.slice(0, index + 1),
      duplicatedSection,
      ...layout.sections.slice(index + 1),
    ];
    
    set({ layout: { ...layout, sections: newSections } });
    get().saveToHistory();
  },
  
  setSelectedSection: (sectionId) => set({ selectedSectionId: sectionId }),
  
  setSelectedModule: (moduleId) => set({ selectedModuleId: moduleId }),
  
  setSelectedElement: (path) => set({ selectedElementPath: path }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setDevicePreview: (device) => set({ devicePreview: device }),
  
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  updateModule: (sectionId, moduleId, updates) => {
    const { layout } = get();
    if (!layout) return;
    
    const newSections = layout.sections.map((section) => {
      if (section.id !== sectionId) return section;
      
      const newModules = section.modules.map((module) =>
        module.id === moduleId ? { ...module, ...updates } : module
      );
      
      return { ...section, modules: newModules };
    });
    
    set({ layout: { ...layout, sections: newSections } });
    get().saveToHistory();
  },
  
  addModule: (sectionId, module) => {
    const { layout } = get();
    if (!layout) return;
    
    const newSections = layout.sections.map((section) => {
      if (section.id !== sectionId) return section;
      return { ...section, modules: [...section.modules, module] };
    });
    
    set({ layout: { ...layout, sections: newSections } });
    get().saveToHistory();
  },
  
  deleteModule: (sectionId, moduleId) => {
    const { layout } = get();
    if (!layout) return;
    
    const newSections = layout.sections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        modules: section.modules.filter((m) => m.id !== moduleId),
      };
    });
    
    set({ layout: { ...layout, sections: newSections } });
    get().saveToHistory();
  },
  
  moveModule: (sectionId, moduleId, direction) => {
    const { layout } = get();
    if (!layout) return;
    
    const sectionIndex = layout.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return;
    
    const section = layout.sections[sectionIndex];
    const moduleIndex = section.modules.findIndex((m) => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const newIndex = direction === 'up' ? moduleIndex - 1 : moduleIndex + 1;
    if (newIndex < 0 || newIndex >= section.modules.length) return;
    
    const newModules = [...section.modules];
    [newModules[moduleIndex], newModules[newIndex]] = [newModules[newIndex], newModules[moduleIndex]];
    
    const newSections = [...layout.sections];
    newSections[sectionIndex] = { ...section, modules: newModules };
    
    set({ layout: { ...layout, sections: newSections } });
    get().saveToHistory();
  },
  
  saveToHistory: () => {
    const { layout, editHistory, historyIndex } = get();
    if (!layout) return;
    
    const newHistory = editHistory.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(layout)));
    
    // Limit history to 50 entries
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({
      editHistory: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
  
  undo: () => {
    const { editHistory, historyIndex, layout } = get();
    if (historyIndex <= 0 || !layout) return;
    
    const newIndex = historyIndex - 1;
    set({
      layout: JSON.parse(JSON.stringify(editHistory[newIndex])),
      historyIndex: newIndex,
    });
  },
  
  redo: () => {
    const { editHistory, historyIndex, layout } = get();
    if (historyIndex >= editHistory.length - 1 || !layout) return;
    
    const newIndex = historyIndex + 1;
    set({
      layout: JSON.parse(JSON.stringify(editHistory[newIndex])),
      historyIndex: newIndex,
    });
  },
  
  setLanguage: (lang) => set({ currentLanguage: lang }),
  
  setFontSize: (size) => set({ fontSize: size }),
  
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  
  toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
  
  setIsEditing: (editing) => set({ isEditing: editing }),
  
  setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),
  
  setLastSavedAt: (date) => set({ lastSavedAt: date }),
}));
