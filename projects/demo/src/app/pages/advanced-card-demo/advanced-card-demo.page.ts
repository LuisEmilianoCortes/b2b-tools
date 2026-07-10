import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { AdvancedCard, AdvancedCardConfig, AdvancedCardTemplateDirective } from 'b2b-tools';

@Component({
  selector: 'advanced-card-demo',
  imports: [AdvancedCard, AdvancedCardTemplateDirective],
  templateUrl: './advanced-card-demo.page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './advanced-card-demo.page.css',
})
export class AdvancedCardDemoPage {
  mode: 'inline' | 'drawer' | 'modal' = 'drawer';

  cardConfiguration = signal<AdvancedCardConfig[] | null>(null);

  longValuesCardConfig: AdvancedCardConfig = {
    id: 'ENT-002',
    title: 'Long Values — Highlights & Summary',
    subtitle: 'Values wrap down instead of being cut off',
    expandMode: 'inline',
    highlights: [
      { label: 'Account Balance', value: '$12,450,980.75', hint: 'MXN' },
      { label: 'Reference', value: 'TRX-2026-00984512-ABCDEF' },
      { label: 'Beneficiary', value: 'Importadora-y-Exportadora-Internacional-SA-de-CV' },
    ],
    summaryBlocks: [
      {
        title: 'Detail',
        rows: [
          { label: 'Full Legal Name', value: 'Importadora y Exportadora Internacional del Norte SA de CV' },
          { label: 'Folio / Reference', value: 'TRX-2026-00984512-ABCDEF-GHIJKL' },
          { label: 'Description', value: 'Pago de servicios correspondientes al ejercicio fiscal 2026 período enero-marzo' },
          { label: 'Amount', value: '$12,450,980.75', kind: 'number' },
        ],
      },
    ],
  };

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
          { label: 'ID', value: 'ENT-001' },
          { label: 'Type', value: 'A' },
          { label: 'Segment', value: 'B2B' },
          { label: 'ID', value: 'ENT-001' },
          { label: 'Type', value: 'A' },
          { label: 'Segment', value: 'B2B' },
          { label: 'ID', value: 'ENT-001' },
          { label: 'Type', value: 'A' },
          { label: 'Segment', value: 'B2B' },
          { label: 'ID', value: 'ENT-001' },
          { label: 'Type', value: 'A' },
          { label: 'Segment', value: 'B2B' },
        ],
      },
      {
        title: 'Operations',
        rows: [
          { label: 'Status', value: 'OK', kind: 'badge', tone: 'success', icon: '⚡' },
          { label: 'Risk Level', value: 'Low', kind: 'badge', tone: 'neutral', icon: '🛡' },
          { label: 'Owner', value: 'Team X', icon: '👤' },
        ],
      },
      {
        title: 'KPIs',
        rows: [
          { label: 'SLA', value: '98%', kind: 'number' },
          { label: 'Errors', value: '2', kind: 'number' },
          { label: 'Tickets', value: '17', kind: 'number' },
        ],
      },
      {
        title: 'Metadata',
        rows: [
          { label: 'Created At', value: '2026-02-10', kind: 'date' },
          { label: 'Updated At', value: '2026-02-17', kind: 'date' },
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
    contentLayout: 'stacked',
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
