import { Component, signal } from '@angular/core';
import { AdvancedCard, AdvancedCardConfig, AdvancedCardTemplateDirective } from 'b2b-tools';

@Component({
  selector: 'advanced-card-demo',
  imports: [AdvancedCard, AdvancedCardTemplateDirective],
  templateUrl: './advanced-card-demo.page.html',
  styleUrl: './advanced-card-demo.page.css',
})
export class AdvancedCardDemoPage {
  mode: 'inline' | 'drawer' | 'modal' = 'drawer';

  cardConfiguration = signal<AdvancedCardConfig[] | null>(null);

  cardConfig: AdvancedCardConfig = {
    id: 'ENT-001',
    title: 'Generic Entity',
    subtitle: 'Quick overview (domain-agnostic)',
    badge: { label: 'Active', tone: 'success' },

    density: 'comfortable',
    size: 'lg',
    expandMode: 'drawer',
    closeOnBackdrop: true,

    highlights: [
      { label: 'Amount', value: '$150,000', hint: 'USD' },
      { label: 'Records', value: '420' },
      { label: 'Last Update', value: 'Today' },
    ],

    summaryBlocks: [
      {
        title: 'General',
        rows: [
          { label: 'ID', value: 'ENT-001' },
          { label: 'Type', value: 'A' },
          { label: 'Segment', value: 'B2B' },
        ],
      },
      {
        title: 'Operations',
        rows: [
          { label: 'Status', value: 'OK' },
          { label: 'Risk Level', value: 'Low' },
          { label: 'Owner', value: 'Team X' },
        ],
      },
      {
        title: 'KPIs',
        rows: [
          { label: 'SLA', value: '98%' },
          { label: 'Errors', value: '2' },
          { label: 'Tickets', value: '17' },
        ],
      },
      {
        title: 'Metadata',
        rows: [
          { label: 'Created At', value: '2026-02-10' },
          { label: 'Updated At', value: '2026-02-17' },
          { label: 'Version', value: 'v1' },
        ],
      },
    ],

    actions: [
      { id: 'refresh', label: 'Refresh', tone: 'primary' },
      { id: 'export', label: 'Export', tone: 'secondary' },
      { id: 'delete', label: 'Delete', tone: 'danger' },
    ],

    tabs: [
      {
        id: 't1',
        label: 'Payments',
        kind: 'template',
        templateId: 'payments',
        actions: [{ id: 'exportPayments', label: 'Export', tone: 'secondary' }],
      },
      {
        id: 't2',
        label: 'Products',
        kind: 'template',
        templateId: 'products',
      },
      {
        id: 't3',
        label: 'Activity',
        kind: 'template',
        templateId: 'activity',
        pill: { label: '12', tone: 'neutral' },
      },
    ],

    defaultTabId: 't1',
  };

  setMode(mode: 'inline' | 'drawer' | 'modal') {
    this.mode = mode;
    this.cardConfig = {
      ...this.cardConfig,
      expandMode: mode,
    };
  }

  onHeaderAction(ev: { actionId: string; cardId: string }) {
    console.log('HEADER ACTION', ev);
  }

  onTabChanged(ev: { tabId: string; cardId: string }) {
    console.log('TAB CHANGED', ev);
  }

  onTabAction(ev: { tabId: string; actionId: string; cardId: string }) {
    console.log('TAB ACTION', ev);
  }
}
