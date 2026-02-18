import { TemplateRef } from '@angular/core';

export type AdvancedTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

export interface AdvancedBadge {
  label: string;
  tone?: AdvancedTone;
}

export interface AdvancedHighlight {
  label: string;
  value: string;
  hint?: string;
}

export interface AdvancedAction {
  id: string;
  label: string;
  tone?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export type AdvancedTabKind = 'template' | 'text' | 'empty';

export type AdvancedDensity = 'compact' | 'comfortable';
export type AdvancedSize = 'sm' | 'md' | 'lg';

export interface AdvancedCardTab {
  id: string;
  label: string;
  kind: AdvancedTabKind;

  /** kind=text */
  text?: string;

  /** kind=template */
  templateId?: string;

  /** toolbar por tab */
  actions?: AdvancedTabAction[];

  /** badge pequeño opcional en tab */
  pill?: { label: string; tone?: AdvancedTone };
}

export interface AdvancedCardConfig {
  id: string;
  title: string;
  subtitle?: string;
  badge?: AdvancedBadge;

  highlights?: AdvancedHighlight[];
  summaryBlocks?: AdvancedSummaryBlock[];

  primaryCta?: { label: string };
  actions?: AdvancedAction[];
  tabs?: AdvancedCardTab[];
  defaultTabId?: string;
  expandMode?: AdvancedExpandMode; // default: 'inline'
  closeOnBackdrop?: boolean; // default: true (drawer/modal)
  density?: AdvancedDensity; // default: 'comfortable'
  size?: AdvancedSize; // default: 'md'
  data?: any;
}

export interface AdvancedSummaryBlock {
  title: string;
  rows: { label: string; value: string }[];
}

export interface AdvancedTabAction {
  id: string;
  label: string;
  tone?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export type AdvancedExpandMode = 'inline' | 'drawer' | 'modal';

export type AdvancedCardTemplateCtx = {
  /** The current card identifier (config.id) */
  cardId: string;

  /** The current active tab identifier (tab.id) */
  tabId: string;
};

export type AdvancedCardContentVm = {
  cardId: string;
  summaryBlocks?: AdvancedSummaryBlock[];
  tabs: AdvancedCardTab[];
  activeTabId: string | null;
  activeTab: AdvancedCardTab | null;
  templateRef: TemplateRef<AdvancedCardTemplateCtx> | null;
};
