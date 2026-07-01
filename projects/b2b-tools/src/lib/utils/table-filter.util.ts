import { TableColumn, TableConfig } from '../components/tables/advanced-table/types/table.types';
import { getCellValue, valueToSearchableText } from './table-value.util';

function getColumnSearchMode<T>(col?: TableColumn<T>, config?: TableConfig): 'local' | 'server' {
  return col?.searchMode ?? config?.columnSearchMode ?? 'local';
}

export function filterRows<T extends Record<string, unknown>>(
  rows: T[],
  options: {
    globalQuery: string;
    columnQueries: Record<string, string>;
    colsForGlobal: TableColumn<T>[];
    colsAll: TableColumn<T>[];
    serverSearch?: boolean;
    config?: TableConfig;
  },
): T[] {
  const { globalQuery, columnQueries, colsForGlobal, colsAll, serverSearch, config } = options;
  const gq = globalQuery.trim().toLowerCase();

  return rows.filter((row) => {
    for (const [key, q] of Object.entries(columnQueries)) {
      const query = (q ?? '').trim().toLowerCase();
      if (!query) continue;

      const col = colsAll.find((c) => c.key === key);
      if (!col) continue;
      if (getColumnSearchMode(col, config) === 'server') continue;

      const text = valueToSearchableText(getCellValue(row, col), col.type).toLowerCase();
      if (!text.includes(query)) return false;
    }

    if (gq && !serverSearch) {
      let any = false;
      for (const col of colsForGlobal) {
        const text = valueToSearchableText(getCellValue(row, col), col.type).toLowerCase();
        if (text.includes(gq)) { any = true; break; }
      }
      if (!any) return false;
    }

    return true;
  });
}
