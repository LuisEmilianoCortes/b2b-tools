import { Component, computed, effect, input, signal } from '@angular/core';
import { AdvancedSummaryBlock, AdvancedTone } from '../../types';

@Component({
  selector: 'ac-card-summary',
  imports: [],
  templateUrl: './card-summary.component.html',
  styleUrls: ['./card-summary.component.css', '../../styles/advanced-card.shared.style.css'],
})
export class CardSummaryComponent {
  blocks = input<AdvancedSummaryBlock[] | undefined>(undefined);
  layout = input<'stacked' | 'inline'>('stacked');
  collapsibleVertical = input(false);

  readonly columnMax: number = 4;

  numBlocks = computed(() => this.blocks()?.length ?? 0);
  isSingle = computed(() => this.numBlocks() === 1);

  /** Vertical accordion — only in inline sidebar */
  isAccordion = computed(() => this.layout() === 'inline');

  /** Horizontal accordion — stacked with 2+ blocks */
  isHorizontalAccordion = computed(() => this.layout() === 'stacked' && this.numBlocks() > 1);

  /** Vertical collapse toggle — only when collapsibleVertical + stacked single block */
  showToggle = computed(
    () =>
      this.collapsibleVertical() &&
      this.layout() === 'stacked' &&
      this.numBlocks() > 0 &&
      !this.isHorizontalAccordion(),
  );

  // ─── Inline accordion state ────────────────────────────────────────────
  readonly openBlocks = signal<Set<string>>(new Set());

  // ─── Stacked tab mode state ────────────────────────────────────────────
  readonly activeBlock = signal<string>('');

  // ─── Stacked vertical toggle state ────────────────────────────────────
  readonly isStackedCollapsed = signal(false);

  constructor() {
    effect(() => {
      const blocks = this.blocks();
      if (blocks?.length) {
        this.openBlocks.set(new Set([blocks[0].title]));
        this.activeBlock.set(blocks[0].title);
      }
    });
  }

  // ─── Inline accordion helpers ──────────────────────────────────────────
  toggleBlock(title: string): void {
    this.openBlocks.update(set => {
      const next = new Set(set);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  isOpen(title: string): boolean {
    return this.openBlocks().has(title);
  }

  // ─── Tab mode helpers ──────────────────────────────────────────────────
  selectBlock(title: string): void {
    this.activeBlock.set(title);
  }

  isActiveBlock(title: string): boolean {
    return this.activeBlock() === title;
  }

  // ─── Vertical toggle helper ────────────────────────────────────────────
  toggleStacked(): void {
    this.isStackedCollapsed.update(v => !v);
  }

  // ─── Shared helpers ────────────────────────────────────────────────────
  rowBadgeClass(tone?: AdvancedTone): string {
    return `badge badge--${tone ?? 'neutral'}`;
  }

  templateStyle = computed(() => {
    if (this.layout() === 'inline') {
      return 'repeat(1, 1fr)';
    }
    return `repeat(${Math.min(this.numBlocks(), this.columnMax)}, 1fr)`;
  });
}
