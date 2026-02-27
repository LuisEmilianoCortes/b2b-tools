import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagerItem } from '../../types/table.types';
import { TABLE_I18N_DEFAULT } from '../../constants/table-i18n.constants';
import { TableI18n } from '../../types/table-i18n.type';

@Component({
  selector: 'table-pagination',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./table-pagination.component.css'],
  templateUrl: './table-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePaginationComponent {
  public readonly Math = Math;

  // Inputs
  readonly page = input<number>(1);
  readonly pageSize = input<number>(10);
  readonly pageCount = input<number>(1);
  readonly totalCount = input<number>(0);
  readonly pageSizeOptions = input<number[]>([10, 25, 50]);
  readonly pagerItems = input<PagerItem[]>([]);
  readonly i18n = input<TableI18n>(TABLE_I18N_DEFAULT);

  // Outputs
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly startItem = computed(() => {
    if (this.totalCount() <= 0) return 0;
    return (this.page() - 1) * this.pageSize() + 1;
  });

  readonly endItem = computed(() => {
    if (this.totalCount() <= 0) return 0;
    return Math.min(this.page() * this.pageSize(), this.totalCount());
  });

  goToPage(page: number) {
    const clamped = Math.max(1, Math.min(this.pageCount(), page));
    this.pageChange.emit(clamped);
  }

  prevPage() {
    this.goToPage(this.page() - 1);
  }

  nextPage() {
    this.goToPage(this.page() + 1);
  }

  onPageSizeSelect(size: number) {
    if (!Number.isFinite(size) || size <= 0) return;
    this.pageSizeChange.emit(size);
  }
}
