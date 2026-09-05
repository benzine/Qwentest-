import { create } from 'zustand';

interface ScrollState {
  scrollY: number;
  scrollVelocity: number;
  currentSection: string;
  isScrolling: boolean;
  setScrollY: (y: number) => void;
  setScrollVelocity: (velocity: number) => void;
  setCurrentSection: (section: string) => void;
  setIsScrolling: (scrolling: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollY: 0,
  scrollVelocity: 0,
  currentSection: 'hero',
  isScrolling: false,
  setScrollY: (y) => set({ scrollY: y }),
  setScrollVelocity: (velocity) => set({ scrollVelocity: velocity }),
  setCurrentSection: (section) => set({ currentSection: section }),
  setIsScrolling: (scrolling) => set({ isScrolling: scrolling }),
}));

interface UIState {
  cursorType: string;
  soundEnabled: boolean;
  reducedMotion: boolean;
  setCursorType: (type: string) => void;
  toggleSound: () => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  cursorType: 'default',
  soundEnabled: false,
  reducedMotion: false,
  setCursorType: (type) => set({ cursorType: type }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
}));
