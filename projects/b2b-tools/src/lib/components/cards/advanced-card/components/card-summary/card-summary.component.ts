import { Component, computed, input } from '@angular/core';
import { AdvancedSummaryBlock } from '../../types';

@Component({
  selector: 'ac-card-summary',
  imports: [],
  templateUrl: './card-summary.component.html',
  styleUrls: ['./card-summary.component.css', '../../styles/advanced-card.shared.style.css'],
})
export class CardSummaryComponent {
  blocks = input<AdvancedSummaryBlock[] | undefined>(undefined);
  layout = input<'stacked' | 'inline'>('stacked');

  readonly columnMax: number = 4;

  numBlocks = computed(() => this.blocks()?.length ?? 0);

  templateStyle = computed(() => {
    if (this.layout() === 'inline') {
      return 'repeat(1, 1fr)';
    }
    return `repeat(${Math.min(this.numBlocks(), this.columnMax)}, 1fr)`;
  });
}
