import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  readonly placeholder = input<string>('Buscar...');
  readonly showClear = input<boolean>(true);

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
