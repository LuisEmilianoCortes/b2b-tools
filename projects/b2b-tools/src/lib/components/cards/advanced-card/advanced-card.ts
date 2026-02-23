import {
  Component,
  computed,
  contentChildren,
  effect,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AdvancedAction,
  AdvancedCardConfig,
  AdvancedCardContentVm,
  AdvancedCardTab,
  AdvancedTabAction,
  AdvancedTone,
} from './types';
import { AdvancedCardTemplateDirective } from './directives/advanced-card.template.directive';
import { CardCompactComponent } from './components/card-compact/card-compact.component';
import { AdvancedCardOverlayComponent } from './components/advanced-card-overlay/advanced-card-overlay.component';
import { AdvancedCardInlineComponent } from './components/advanced-card-inline/advanced-card-inline.component';

@Component({
  selector: 'advanced-card',
  imports: [CardCompactComponent, AdvancedCardOverlayComponent, AdvancedCardInlineComponent],
  templateUrl: './advanced-card.html',
  styleUrls: ['./advanced-card.css', './styles/advanced-card.shared.style.css'],
  host: {
    '[class]': 'hostClass()',
  },
})
export class AdvancedCard {
  config = input.required<AdvancedCardConfig>();

  fullWidthOnExpand = input(true);
  stickyHeader = input(true);
  closeOnEsc = input(true);

  // ===== Outputs
  expandedChange = output<boolean>();
  action = output<{ actionId: string; cardId: string }>();
  tabChanged = output<{ tabId: string; cardId: string }>();
  tabAction = output<{ tabId: string; actionId: string; cardId: string }>();

  // ===== Projected templates (via directive)
  private projectedTemplates = contentChildren(AdvancedCardTemplateDirective, {
    descendants: true,
  });

  // ===== State
  readonly expanded = signal(false);
  readonly activeTabId = signal<string | null>(null);

  // ===== Computeds
  readonly cardId = computed(() => this.config().id);
  readonly expandMode = computed(() => this.config().expandMode ?? 'inline');
  readonly closeOnBackdrop = computed(() => this.config().closeOnBackdrop ?? true);

  readonly isInline = computed(() => this.expandMode() === 'inline');
  readonly isDrawer = computed(() => this.expandMode() === 'drawer');
  readonly isModal = computed(() => this.expandMode() === 'modal');

  readonly hasHighlights = computed(() => (this.config().highlights?.length ?? 0) > 0);
  readonly hasSummaryBlocks = computed(() => (this.config().summaryBlocks?.length ?? 0) > 0);

  readonly tabs = computed<AdvancedCardTab[]>(() => this.config().tabs ?? []);

  readonly activeTab = computed<AdvancedCardTab | null>(() => {
    const id = this.activeTabId();
    if (!id) return null;
    return this.tabs().find((t) => t.id === id) ?? null;
  });

  readonly templateMap = computed(() => {
    const map = new Map<string, AdvancedCardTemplateDirective>();
    for (const dir of this.projectedTemplates()) {
      map.set(dir.templateId(), dir);
    }
    return map;
  });

  readonly density = computed(() => this.config().density ?? 'comfortable');
  readonly size = computed(() => this.config().size ?? 'md');

  readonly hostClass = computed(() => {
    return `ac-host ac-density--${this.density()} ac-size--${this.size()}`;
  });

  readonly activeTemplateRef = computed(() => {
    const template = this.getActiveTemplate();
    // tip: puede ser TemplateRef<any>; lo normalizamos
    return (template?.templateRef ?? null) as any;
  });

  readonly contentVm = computed<AdvancedCardContentVm>(() => ({
    cardId: this.cardId(),
    summaryBlocks: this.config().summaryBlocks,
    tabs: this.tabs(),
    activeTabId: this.activeTabId(),
    activeTab: this.activeTab(),
    templateRef: this.activeTemplateRef(),
  }));

  // Effects
  notifyExpandenChangesEffect = effect(() => {
    this.expandedChange.emit(this.expanded());
  });

  initiActiveTabEffect = effect(() => {
    const tabs = this.tabs();
    if (!tabs.length) {
      this.activeTabId.set(null);
      return;
    }

    const preferred = this.config().defaultTabId;
    const current = this.activeTabId();
    const stillExists = current && tabs.some((t) => t.id === current);

    if (!stillExists) {
      const next =
        preferred && tabs.some((t) => t.id === preferred) ? preferred : (tabs[0]?.id ?? null);

      this.activeTabId.set(next);
    }
  });

  // ===== Actions
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

  // ===== Tabs
  selectTab(tabId: string): void {
    if (this.activeTabId() === tabId) return;
    this.activeTabId.set(tabId);
    this.tabChanged.emit({ tabId, cardId: this.cardId() });
  }

  onTabActionClick(tab: AdvancedCardTab, a: AdvancedTabAction): void {
    if (a.disabled) return;
    this.tabAction.emit({ tabId: tab.id, actionId: a.id, cardId: this.cardId() });
  }

  getActiveTemplate(): AdvancedCardTemplateDirective | null {
    const at = this.activeTab();
    if (!at || at.kind !== 'template' || !at.templateId) return null;
    return this.templateMap().get(at.templateId) ?? null;
  }

  // ===== Styling helpers
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

  // ===== Keyboard
  @HostListener('document:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent): void {
    if (!this.closeOnEsc()) return;
    if (ev.key === 'Escape') this.collapse();
  }

  onBackdropClick(): void {
    if (!this.closeOnBackdrop()) return;
    this.collapse();
  }
}
