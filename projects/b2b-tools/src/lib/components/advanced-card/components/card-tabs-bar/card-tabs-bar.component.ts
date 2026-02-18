import { Component, computed, input, output } from '@angular/core';
import { AdvancedCardTab, AdvancedTabAction } from '../../types';

@Component({
  selector: 'ac-card-tabs-bar',
  imports: [],
  templateUrl: './card-tabs-bar.component.html',
  styleUrls: ['./card-tabs-bar.component.css', '../../styles/advanced-card.shared.style.css'],
})
export class CardTabsBarComponent {
  tabs = input.required<AdvancedCardTab[]>();
  activeTabId = input.required<string | null>();

  badgeClass = input.required<(tone: any) => string>();

  tabSelected = output<string>();
  tabAction = output<AdvancedTabAction>();

  activeTab = computed(() => {
    const id = this.activeTabId();
    if (!id) return null;
    return this.tabs().find((tab) => tab.id === id) ?? null;
  });

  selectTab(id: string): void {
    this.tabSelected.emit(id);
  }

  clickAction(advancedTabAction: AdvancedTabAction): void {
    if (advancedTabAction.disabled) return;
    this.tabAction.emit(advancedTabAction);
  }
}
