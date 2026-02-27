import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableI18n } from '../../types/table-i18n.type';
import { TABLE_I18N_DEFAULT } from '../../constants/table-i18n.constants';

@Component({
  selector: 'table-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-toolbar.component.html',
  styleUrls: ['./table-toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableToolbarComponent {
  // Inputs
  readonly enabled = input<boolean>(true);
  readonly query = input<string>('');
  readonly showClear = input<boolean>(true);
  readonly i18n = input<TableI18n>(TABLE_I18N_DEFAULT);

  // Outputs
  readonly queryChange = output<string>();
  readonly clear = output<void>();

  onInput(value: string) {
    this.queryChange.emit(value);
  }

  onClear() {
    this.clear.emit();
  }
}
