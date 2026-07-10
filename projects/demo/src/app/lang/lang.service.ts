import { Injectable, signal } from '@angular/core';

export type AppLang = 'EN' | 'ES';

@Injectable({ providedIn: 'root' })
export class LangService {
  readonly lang = signal<AppLang>('EN');

  toggle(): void {
    this.lang.update((l) => (l === 'EN' ? 'ES' : 'EN'));
  }
}
