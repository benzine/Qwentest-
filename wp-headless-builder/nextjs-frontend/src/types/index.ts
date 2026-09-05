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

export interface UserPermissions {
  canEditDesign: boolean;
  canEditContent: boolean;
  canPublish: boolean;
  isAdmin: boolean;
  canUploadFiles: boolean;
}

export interface UserInfo {
  userId: number;
  username: string;
  displayName: string;
  email: string;
  role: string;
  roles: string[];
  permissions: UserPermissions;
}

export interface TranslationStrings {
  [key: string]: string;
}

export interface DevicePreview {
  type: 'desktop' | 'tablet' | 'mobile';
  width: number;
  label: string;
}

export const DEVICE_PREVIEWS: DevicePreview[] = [
  { type: 'desktop', width: 1440, label: 'Desktop' },
  { type: 'tablet', width: 768, label: 'Tablet' },
  { type: 'mobile', width: 375, label: 'Mobile' },
];

export type ViewMode = 'full-page' | 'isolated-section';

export type FontSize = 'normal' | 'large' | 'larger';

export interface BuilderConfig {
  apiUrl: string;
  siteUrl: string;
  imagesUrl: string;
  nonce: string;
  userId: number;
  userRole: string;
  canEdit: boolean;
  canPublish: boolean;
  canManageOptions: boolean;
  postId: number | null;
}

declare global {
  interface Window {
    headlessBuilderConfig?: BuilderConfig;
  }
}
