import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { HttpErrorData } from '../types/modal.types';
import { AdvancedButtonComponent } from '../../buttons/advanced-button/advanced-button.component';

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
