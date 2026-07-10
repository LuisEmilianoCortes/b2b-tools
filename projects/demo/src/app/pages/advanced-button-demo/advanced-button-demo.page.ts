import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AdvancedButtonComponent } from 'b2b-tools';

@Component({
  selector: 'app-advanced-button-demo',
  imports: [AdvancedButtonComponent],
  templateUrl: './advanced-button-demo.page.html',
  styleUrl: './advanced-button-demo.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedButtonDemoPage {
  readonly mainTheme = signal<'dark' | 'light'>('light');
  readonly brandTheme = signal<'dark' | 'light'>('dark');

  readonly loading = signal(false);
  readonly evClicked = signal('—');

  onClick(label: string): void {
    this.evClicked.set(label);
  }

  simulateLoading(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1500);
  }
}
