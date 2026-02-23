import { Component, computed, input, output } from '@angular/core';
import { AdvancedCardConfig } from '../../types';

@Component({
  selector: 'lib-card-compact',
  imports: [],
  templateUrl: './card-compact.component.html',
  styleUrls: ['./card-compact.component.css', '../../styles/advanced-card.shared.style.css'],
})
export class CardCompactComponent {
  configuration = input.required<AdvancedCardConfig>();
  expanded = input.required<boolean>();
  badgeClass = input.required<(tone: any) => string>();

  expand = output<void>();

  hasHighlights = computed(() => (this.configuration().highlights?.length ?? 0) > 0);

  onExpand(): void {
    this.expand.emit();
  }
}
