import { Component, input, output } from '@angular/core';
import {
  AdvancedCardConfig,
  AdvancedCardContentVm,
  AdvancedAction,
  AdvancedTabAction,
} from '../../types';
import { AdvancedCardContentComponent } from '../advanced-card-content/advanced-card-content.component';
import { CardHeaderComponent } from '../card-header/card-header.component';

@Component({
  selector: 'ac-advanced-card-inline',
  imports: [AdvancedCardContentComponent, CardHeaderComponent],
  templateUrl: './advanced-card-inline.component.html',
  styleUrls: [
    './advanced-card-inline.component.css',
    '../../styles/advanced-card.shared.style.css',
  ],
})
export class AdvancedCardInlineComponent {
  config = input.required<AdvancedCardConfig>();
  stickyHeader = input(false);
  fullWidth = input(false);

  badgeClass = input.required<(tone: any) => string>();
  viewModel = input.required<AdvancedCardContentVm>();

  actionClick = output<AdvancedAction>();
  close = output<void>();

  onAction(a: AdvancedAction) {
    this.actionClick.emit(a);
  }
  tabSelected = output<string>();
  tabAction = output<AdvancedTabAction>();
}
