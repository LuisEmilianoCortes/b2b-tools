import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AdvancedButtonComponent,
  AdvancedModalComponent,
  ErrorDetailModalComponent,
  HttpErrorData,
  ModalType,
} from 'b2b-tools';
import { LangService } from '../../lang/lang.service';

@Component({
  selector: 'app-advanced-modal-demo',
  imports: [AdvancedButtonComponent, AdvancedModalComponent, ErrorDetailModalComponent],
  templateUrl: './advanced-modal-demo.page.html',
  styleUrl: './advanced-modal-demo.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedModalDemoPage {
  readonly langService = inject(LangService);
  readonly mainTheme = signal<'dark' | 'light'>('light');
  readonly brandTheme = signal<'dark' | 'light'>('dark');

  readonly activeType = signal<ModalType | null>(null);
  readonly showErrorDetail = signal(false);
  readonly evResult = signal('—');

  readonly sampleError: HttpErrorData = {
    status: 500,
    statusText: 'Internal Server Error',
    url: '/api/v1/orders/1042',
    message: 'Unexpected token in JSON payload',
    payload: { orderId: 1042, action: 'approve' },
    error: { code: 'ERR_JSON_PARSE', trace: ['handler.ts:42', 'service.ts:118'] },
  };

  open(type: ModalType): void {
    this.activeType.set(type);
  }

  close(): void {
    this.activeType.set(null);
  }

  onConfirm(): void {
    this.evResult.set('confirmed');
    this.close();
  }

  onCancel(): void {
    this.evResult.set('cancelled');
    this.close();
  }
}
