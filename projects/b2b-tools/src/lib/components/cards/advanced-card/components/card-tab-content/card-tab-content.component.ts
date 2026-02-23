import { Component, input, TemplateRef } from '@angular/core';
import { AdvancedCardTab, AdvancedCardTemplateCtx } from '../../types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ac-card-tab-content',
  imports: [NgTemplateOutlet],
  templateUrl: './card-tab-content.component.html',
  styleUrls: ['./card-tab-content.component.css', '../../styles/advanced-card.shared.style.css'],
})
export class CardTabContentComponent {
  activeTab = input.required<AdvancedCardTab | null>();
  cardId = input.required<string>();

  /**
   * Función que resuelve el TemplateRef para el tab actual.
   * (La lógica real sigue en el root: getActiveTemplate())
   */
  templateRef = input<TemplateRef<AdvancedCardTemplateCtx> | null>(null);
}
