import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  readonly close = output<void>();

  onClose() {
    this.close.emit();
  }
}
