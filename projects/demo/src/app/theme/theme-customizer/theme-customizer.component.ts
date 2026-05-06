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

  overlayHex(rgba: string): string {
    const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return '#000000';
    return `#${parseInt(m[1]).toString(16).padStart(2, '0')}${parseInt(m[2]).toString(16).padStart(2, '0')}${parseInt(m[3]).toString(16).padStart(2, '0')}`;
  }

  overlayAlpha(rgba: string): number {
    const m = rgba.match(/,\s*([\d.]+)\)/);
    return m ? parseFloat(m[1]) : 0.5;
  }

  onOverlayColorChange(event: Event): void {
    const hex = (event.target as HTMLInputElement).value;
    const alpha = this.overlayAlpha(this.themeService.tokens().overlay);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    this.themeService.updateToken('overlay', `rgba(${r},${g},${b},${alpha})`);
  }

  onOverlayOpacityChange(event: Event): void {
    const alpha = parseFloat((event.target as HTMLInputElement).value);
    const m = this.themeService.tokens().overlay.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return;
    this.themeService.updateToken('overlay', `rgba(${m[1]},${m[2]},${m[3]},${alpha})`);
  }
}
