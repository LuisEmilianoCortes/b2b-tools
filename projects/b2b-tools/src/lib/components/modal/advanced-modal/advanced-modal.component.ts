import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalType } from '../types/modal.types';
import { AdvancedButtonComponent } from '../../buttons/advanced-button/advanced-button.component';

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
  @Input() confirmText = 'Accept';
  @Input() cancelText = 'Cancel';
  @Input() showCancel = false;
  @Input() detailsAction?: () => void;
  @Input() detailsLabel = 'See more';

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
