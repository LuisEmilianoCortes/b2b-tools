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

export interface AdvancedCardConfig {
  id: string;
  title: string;
  subtitle?: string;
  badge?: AdvancedBadge;

  highlights?: AdvancedHighlight[]; // compact key info
  summaryBlocks?: AdvancedSummaryBlock[]; // expanded top row blocks

  primaryCta?: { label: string }; // compact CTA
  actions?: AdvancedAction[]; // expanded header actions
}

export interface AdvancedSummaryBlock {
  title: string;
  rows: { label: string; value: string }[];
}
