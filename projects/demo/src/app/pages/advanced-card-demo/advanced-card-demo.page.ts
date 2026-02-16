import { Component } from '@angular/core';
import { AdvancedCard, AdvancedCardConfig } from 'b2b-tools';

@Component({
  selector: 'advanced-card-demo',
  imports: [AdvancedCard],
  templateUrl: './advanced-card-demo.page.html',
  styleUrl: './advanced-card-demo.page.css',
})
export class AdvancedCardDemoPage {
  onCardAction(event: { actionId: string; cardId: string }) {
    throw new Error('Method not implemented.');
  }

  cardConfig: AdvancedCardConfig = {
    id: 'X-001',
    title: 'Entidad XYZ',
    subtitle: 'Resumen rápido',
    badge: { label: 'Activo', tone: 'success' },
    highlights: [
      { label: 'Monto', value: '$125,000', hint: 'MXN' },
      { label: 'Registros', value: '850' },
      { label: 'Última act.', value: 'Hoy' },
    ],
    summaryBlocks: [
      {
        title: 'General',
        rows: [
          { label: 'ID', value: 'X-001' },
          { label: 'Tipo', value: 'A' },
        ],
      },
      {
        title: 'Riesgo',
        rows: [
          { label: 'Score', value: 'B' },
          { label: 'Bandera', value: 'OK' },
        ],
      },
    ],
    actions: [
      { id: 'refresh', label: 'Actualizar', tone: 'primary' },
      { id: 'export', label: 'Exportar', tone: 'secondary' },
    ],
    primaryCta: { label: 'Ver detalle' },
  };
}
