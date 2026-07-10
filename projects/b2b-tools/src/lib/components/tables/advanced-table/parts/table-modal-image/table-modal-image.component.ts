import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TABLE_I18N_DEFAULT } from '../../constants/table-i18n.constants';
import { TableI18n } from '../../types/table-i18n.type';

@Component({
  selector: 'table-modal-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-modal-image.component.html',
  styleUrls: ['./table-modal-image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableModalImageComponent {
  readonly open = input<boolean>(false);
  readonly src = input<string>('');
  readonly alt = input<string>('');
  readonly i18n = input<TableI18n>(TABLE_I18N_DEFAULT);

  readonly close = output<void>();

  onClose() {
    this.close.emit();
  }
}
