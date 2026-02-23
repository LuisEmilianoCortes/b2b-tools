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

  hasBlocks = computed(() => (this.blocks()?.length ?? 0) > 0);
}
