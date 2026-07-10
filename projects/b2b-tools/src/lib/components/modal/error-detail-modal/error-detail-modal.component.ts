import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { HttpErrorData } from '../types/modal.types';
import { AdvancedButtonComponent } from '../../buttons/advanced-button/advanced-button.component';
import {
  ERROR_DETAIL_MODAL_I18N_BY_LANG,
  ERROR_DETAIL_MODAL_LANG_DEFAULT,
} from './constants/error-detail-modal-i18n.constants';
import { ErrorDetailModalI18n, ErrorDetailModalLang } from './types/error-detail-modal-i18n.type';

@Component({
  selector: 'advanced-error-detail-modal',
  imports: [AdvancedButtonComponent],
  templateUrl: './error-detail-modal.component.html',
  styleUrl: './error-detail-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDetailModalComponent {
  @Input() httpData?: HttpErrorData;
  @Input() rawError?: unknown;
  @Output() close = new EventEmitter<void>();

  @Input()
  set lang(value: ErrorDetailModalLang | undefined) {
    this._lang.set(value ?? ERROR_DETAIL_MODAL_LANG_DEFAULT);
  }

  @Input()
  set i18n(value: Partial<ErrorDetailModalI18n> | undefined) {
    this._override.set(value ?? {});
  }

  private _lang = signal<ErrorDetailModalLang>(ERROR_DETAIL_MODAL_LANG_DEFAULT);
  private _override = signal<Partial<ErrorDetailModalI18n>>({});

  readonly i18nCom = computed<ErrorDetailModalI18n>(() => ({
    ...ERROR_DETAIL_MODAL_I18N_BY_LANG[this._lang()],
    ...this._override(),
  }));

  showAdvanced = signal(false);

  toggleAdvanced(): void {
    this.showAdvanced.update((v) => !v);
  }

  onClose(): void {
    this.close.emit();
  }

  formatJson(data: unknown): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }

  get statusClass(): string {
    const s = this.httpData?.status ?? 0;
    if (s >= 500) return 'badge-server';
    if (s >= 400) return 'badge-client';
    if (s >= 300) return 'badge-redirect';
    return 'badge-ok';
  }
}
