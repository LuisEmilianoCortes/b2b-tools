import { Pipe, PipeTransform } from '@angular/core';
import { TableColumn } from '../components/tables/advanced-table/types/table.types';
import { TimeZoneInfo, TIME_ZONES } from '../components/tables/advanced-table/types/time-zone.types';
import { getDisplayText } from './table-format.util';

@Pipe({ name: 'tableCellFormat', standalone: true, pure: true })
export class TableCellFormatPipe implements PipeTransform {
  transform<T>(value: unknown, col: TableColumn<T>, row: T, tz: TimeZoneInfo = TIME_ZONES.MEXICO_CITY): string {
    return getDisplayText(value, col, row, tz);
  }
}
