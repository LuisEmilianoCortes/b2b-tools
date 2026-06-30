import { effect, Injectable, signal } from '@angular/core';

export interface ThemeTokens {
  primary: string;
  primarySoft: string;
  surface: string;
  surface2: string;
  border: string;
  text: string;
  textSecondary: string;
  muted: string;
  danger: string;
  success: string;
  warning: string;
  radius: string;
  radiusSm: string;
  overlay: string;
  focusRing: string;
}

export interface ThemePreset {
  id: string;
  label: string;
  tokens: ThemeTokens;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'midnight',
    label: 'Oscuro',
    tokens: {
      primary: '#f97316',
      primarySoft: '#2d2d2d',
      surface: '#1e1e1e',
      surface2: '#252526',
      border: '#3c3c3c',
      text: '#d4d4d4',
      textSecondary: '#a6a6a6',
      muted: '#6e6e6e',
      danger: '#f87171',
      success: '#4ade80',
      warning: '#e2b93b',
      radius: '6px',
      radiusSm: '4px',
      overlay: 'rgba(0,0,0,0.6)',
      focusRing: '0 0 0 3px rgba(249,115,22,0.35)',
    },
  },
  {
    id: 'indigo',
    label: 'Indigo',
    tokens: {
      primary: '#2563eb',
      primarySoft: '#eff6ff',
      surface: '#ffffff',
      surface2: '#f8fafc',
      border: '#e2e8f0',
      text: '#0f172a',
      textSecondary: '#334155',
      muted: '#64748b',
      danger: '#dc2626',
      success: '#059669',
      warning: '#d97706',
      radius: '16px',
      radiusSm: '12px',
      overlay: 'rgba(15,23,42,0.5)',
      focusRing: '0 0 0 3px rgba(37,99,235,0.15)',
    },
  },
  {
    id: 'warm',
    label: 'Naranja',
    tokens: {
      primary: '#f58026',
      primarySoft: '#fff7ed',
      surface: '#fffaf5',
      surface2: '#fef3e2',
      border: '#fed7aa',
      text: '#1c1917',
      textSecondary: '#44403c',
      muted: '#78716c',
      danger: '#dc2626',
      success: '#059669',
      warning: '#b45309',
      radius: '18px',
      radiusSm: '12px',
      overlay: 'rgba(28,25,23,0.5)',
      focusRing: '0 0 0 3px rgba(245,128,38,0.20)',
    },
  },
  {
    id: 'ocean',
    label: 'Océano',
    tokens: {
      primary: '#0284c7',
      primarySoft: '#e0f2fe',
      surface: '#f0f9ff',
      surface2: '#e0f2fe',
      border: '#bae6fd',
      text: '#0c4a6e',
      textSecondary: '#075985',
      muted: '#0369a1',
      danger: '#dc2626',
      success: '#059669',
      warning: '#d97706',
      radius: '12px',
      radiusSm: '8px',
      overlay: 'rgba(12,74,110,0.5)',
      focusRing: '0 0 0 3px rgba(2,132,199,0.20)',
    },
  },
  {
    id: 'forest',
    label: 'Bosque',
    tokens: {
      primary: '#16a34a',
      primarySoft: '#f0fdf4',
      surface: '#f7fef9',
      surface2: '#dcfce7',
      border: '#bbf7d0',
      text: '#14532d',
      textSecondary: '#166534',
      muted: '#15803d',
      danger: '#dc2626',
      success: '#16a34a',
      warning: '#d97706',
      radius: '14px',
      radiusSm: '10px',
      overlay: 'rgba(20,83,45,0.5)',
      focusRing: '0 0 0 3px rgba(22,163,74,0.20)',
    },
  },
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _tokens = signal<ThemeTokens>(THEME_PRESETS[0].tokens);
  readonly tokens = this._tokens.asReadonly();
  readonly activePresetId = signal<string | null>('midnight');

  constructor() {
    effect(() => this.applyToRoot(this._tokens()));
  }

  applyPreset(id: string): void {
    const preset = THEME_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    this._tokens.set(preset.tokens);
    this.activePresetId.set(id);
  }

  updateToken<K extends keyof ThemeTokens>(key: K, value: string): void {
    this._tokens.update((t) => ({ ...t, [key]: value }));
    this.activePresetId.set(null);
  }

  reset(): void {
    this.applyPreset('midnight');
  }

  private applyToRoot(t: ThemeTokens): void {
    const r = document.documentElement;
    r.style.setProperty('--b2b-primary', t.primary);
    r.style.setProperty('--b2b-primary-soft', t.primarySoft);
    r.style.setProperty('--b2b-surface', t.surface);
    r.style.setProperty('--b2b-surface-2', t.surface2);
    r.style.setProperty('--b2b-border', t.border);
    r.style.setProperty('--b2b-text', t.text);
    r.style.setProperty('--b2b-text-secondary', t.textSecondary);
    r.style.setProperty('--b2b-muted', t.muted);
    r.style.setProperty('--b2b-danger', t.danger);
    r.style.setProperty('--b2b-success', t.success);
    r.style.setProperty('--b2b-warning', t.warning);
    r.style.setProperty('--b2b-radius', t.radius);
    r.style.setProperty('--b2b-radius-sm', t.radiusSm);
    r.style.setProperty('--b2b-overlay', t.overlay);
    r.style.setProperty('--b2b-focus-ring', t.focusRing);
  }
}
