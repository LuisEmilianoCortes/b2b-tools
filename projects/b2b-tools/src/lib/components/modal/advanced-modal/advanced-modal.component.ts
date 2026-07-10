import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { ModalType } from '../types/modal.types';
import { AdvancedButtonComponent } from '../../buttons/advanced-button/advanced-button.component';
import {
  ADVANCED_MODAL_I18N_BY_LANG,
  ADVANCED_MODAL_LANG_DEFAULT,
} from './constants/advanced-modal-i18n.constants';
import { AdvancedModalI18n, AdvancedModalLang } from './types/advanced-modal-i18n.type';

@Component({
  selector: 'advanced-modal',
  imports: [AdvancedButtonComponent],
  templateUrl: './advanced-modal.component.html',
  styleUrl: './advanced-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedModalComponent {
  @Input() title = '';
  @Input() content = '';
  @Input() type: ModalType = 'INFO';
  @Input() confirmText?: string;
  @Input() cancelText?: string;
  @Input() showCancel = false;
  @Input() detailsAction?: () => void;
  @Input() detailsLabel?: string;

  @Input()
  set lang(value: AdvancedModalLang | undefined) {
    this._lang.set(value ?? ADVANCED_MODAL_LANG_DEFAULT);
  }

  @Input()
  set i18n(value: Partial<AdvancedModalI18n> | undefined) {
    this._override.set(value ?? {});
  }

  private _lang = signal<AdvancedModalLang>(ADVANCED_MODAL_LANG_DEFAULT);
  private _override = signal<Partial<AdvancedModalI18n>>({});

  readonly i18nCom = computed<AdvancedModalI18n>(() => ({
    ...ADVANCED_MODAL_I18N_BY_LANG[this._lang()],
    ...this._override(),
  }));

  get resolvedConfirmText(): string {
    return this.confirmText ?? this.i18nCom().confirm;
  }

  get resolvedCancelText(): string {
    return this.cancelText ?? this.i18nCom().cancel;
  }

  get resolvedDetailsLabel(): string {
    return this.detailsLabel ?? this.i18nCom().seeMore;
  }

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onDetails() {
    this.detailsAction?.();
  }

  getVariant(type: ModalType): 'primary' | 'danger' {
    return type === 'ERROR' ? 'danger' : 'primary';
  }
}
