import { Component, input, output } from '@angular/core';
import {
  AdvancedCardConfig,
  AdvancedCardContentVm,
  AdvancedAction,
  AdvancedTabAction,
} from '../../types';
import { CardHeaderComponent } from '../card-header/card-header.component';
import { AdvancedCardContentComponent } from '../advanced-card-content/advanced-card-content.component';

@Component({
  selector: 'ac-advanced-card-overlay',
  imports: [CardHeaderComponent, AdvancedCardContentComponent],
  templateUrl: './advanced-card-overlay.component.html',
  styleUrls: [
    './advanced-card-overlay.component.css',
    '../../styles/advanced-card.shared.style.css',
  ],
})
export class AdvancedCardOverlayComponent {
  config = input.required<AdvancedCardConfig>();
  mode = input.required<'drawer' | 'modal'>();
  closeOnBackdrop = input(true);

  badgeClass = input.required<(tone: any) => string>();
  viewModel = input.required<AdvancedCardContentVm>();

  actionClick = output<AdvancedAction>();
  close = output<void>();

  tabSelected = output<string>();
  tabAction = output<AdvancedTabAction>();

  onBackdrop(): void {
    if (this.closeOnBackdrop()) this.close.emit();
  }

  onAction(a: AdvancedAction) {
    this.actionClick.emit(a);
  }
}
