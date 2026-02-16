import { Component, computed, effect, HostListener, input, output, signal } from '@angular/core';
import { AdvancedAction, AdvancedCardConfig, AdvancedTone } from './types';

@Component({
  selector: 'advanced-card',
  imports: [],
  templateUrl: './advanced-card.html',
  styleUrl: './advanced-card.css',
})
export class AdvancedCard {
  // Inputs (signals)
  config = input.required<AdvancedCardConfig>();

  // Controls (Fase 1)
  fullWidthOnExpand = input(true);
  stickyHeader = input(true);
  closeOnEsc = input(true);

  // Outputs
  expandedChange = output<boolean>();
  action = output<{ actionId: string; cardId: string }>();

  // State (signals)
  readonly expanded = signal(false);

  // Computeds
  readonly cardId = computed(() => this.config().id);
  readonly hasHighlights = computed(() => (this.config().highlights?.length ?? 0) > 0);
  readonly hasSummaryBlocks = computed(() => (this.config().summaryBlocks?.length ?? 0) > 0);

  constructor() {
    effect(() => {
      // Notifica al exterior
      this.expandedChange.emit(this.expanded());
    });
  }

  toggleExpand(): void {
    this.expanded.update((v) => !v);
  }

  expand(): void {
    if (!this.expanded()) this.expanded.set(true);
  }

  collapse(): void {
    if (this.expanded()) this.expanded.set(false);
  }

  onActionClick(a: AdvancedAction): void {
    if (a.disabled) return;
    this.action.emit({ actionId: a.id, cardId: this.cardId() });
  }

  badgeClass(tone: AdvancedTone | undefined): string {
    switch (tone) {
      case 'success':
        return 'badge badge--success';
      case 'warning':
        return 'badge badge--warning';
      case 'danger':
        return 'badge badge--danger';
      case 'primary':
        return 'badge badge--primary';
      default:
        return 'badge badge--neutral';
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent): void {
    if (!this.closeOnEsc()) return;
    if (ev.key === 'Escape') this.collapse();
  }
}
