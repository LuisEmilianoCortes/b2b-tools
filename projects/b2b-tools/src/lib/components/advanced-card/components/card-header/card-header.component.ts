import { Component, input, output } from '@angular/core';
import { AdvancedAction, AdvancedBadge } from '../../types';

@Component({
  selector: 'ac-card-header',
  imports: [],
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.css', '../../styles/advanced-card.shared.style.css'],
})
export class CardHeaderComponent {
  variant = input<'inline' | 'panel'>('inline');

  title = input.required<string>();
  badge = input<AdvancedBadge | undefined>(undefined);
  actions = input<AdvancedAction[] | undefined>(undefined);

  sticky = input(false);
  badgeClass = input.required<(tone: any) => string>();

  actionClick = output<AdvancedAction>();
  close = output<void>();

  onAction(advancedAction: AdvancedAction): void {
    if (advancedAction.disabled) return;
    this.actionClick.emit(advancedAction);
  }

  onClose(): void {
    this.close.emit();
  }
}
