import { Component, input, output } from '@angular/core';
import { AdvancedCardContentVm, AdvancedTabAction } from '../../types';
import { CardSummaryComponent } from '../card-summary/card-summary.component';
import { CardTabContentComponent } from '../card-tab-content/card-tab-content.component';
import { CardTabsBarComponent } from '../card-tabs-bar/card-tabs-bar.component';

@Component({
  selector: 'ac-advanced-card-content',
  imports: [CardSummaryComponent, CardTabsBarComponent, CardTabContentComponent],
  templateUrl: './advanced-card-content.component.html',
  styleUrls: [
    './advanced-card-content.component.css',
    '../../styles/advanced-card.shared.style.css',
  ],
})
export class AdvancedCardContentComponent {
  viewModel = input.required<AdvancedCardContentVm>();

  badgeClass = input.required<(tone: any) => string>();

  tabSelected = output<string>();
  tabAction = output<AdvancedTabAction>();

  onSelect(id: string) {
    this.tabSelected.emit(id);
  }
  onAction(a: AdvancedTabAction) {
    this.tabAction.emit(a);
  }
}
