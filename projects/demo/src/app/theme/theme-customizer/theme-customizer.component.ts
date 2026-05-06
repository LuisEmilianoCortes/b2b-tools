import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { THEME_PRESETS, ThemeService, ThemeTokens } from '../theme.service';

@Component({
  selector: 'theme-customizer',
  standalone: true,
  templateUrl: './theme-customizer.component.html',
  styleUrl: './theme-customizer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeCustomizerComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly isOpen = signal(false);
  protected readonly presets = THEME_PRESETS;

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onColorChange(key: keyof ThemeTokens, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.themeService.updateToken(key, value);
  }

  onRadiusChange(key: 'radius' | 'radiusSm', event: Event): void {
    const px = (event.target as HTMLInputElement).value;
    this.themeService.updateToken(key, `${px}px`);
  }

  radiusPx(value: string): number {
    return parseInt(value, 10) || 0;
  }
}
