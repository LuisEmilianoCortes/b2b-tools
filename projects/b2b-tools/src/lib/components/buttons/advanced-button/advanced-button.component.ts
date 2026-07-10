import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

@Component({
  selector: 'advanced-button',
  templateUrl: './advanced-button.component.html',
  styleUrl: './advanced-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-full-width]': 'fullWidth()' },
})
export class AdvancedButtonComponent {
  text = input<string>('');
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'ghost' | 'danger'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  icon = input<string>('');
  iconPosition = input<'left' | 'right'>('left');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  fullWidth = input<boolean>(false);

  clicked = output<void>();

  protected classes = computed(() =>
    [
      'ab-btn',
      `variant-${this.variant()}`,
      `size-${this.size()}`,
      this.loading() ? 'is-loading' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
