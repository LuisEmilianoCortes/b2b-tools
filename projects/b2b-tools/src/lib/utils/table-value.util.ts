import { CellDataType, TableColumn } from '../components/tables/advanced-table/types/table.types';

export function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value.replace(/,/g, '').trim());
  return Number.NaN;
}

export function toDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

export function compareValues(a: unknown, b: unknown, type: CellDataType): number {
  const aNil = a == null || a === '';
  const bNil = b == null || b === '';
  if (aNil && bNil) return 0;
  if (aNil) return 1;
  if (bNil) return -1;

  switch (type) {
    case 'integer':
    case 'decimal':
    case 'currency': {
      const na = toNumber(a);
      const nb = toNumber(b);
      if (!Number.isFinite(na) && !Number.isFinite(nb)) return 0;
      if (!Number.isFinite(na)) return 1;
      if (!Number.isFinite(nb)) return -1;
      return na === nb ? 0 : na < nb ? -1 : 1;
    }
    case 'date':
    case 'datetime': {
      const da = toDate(a);
      const db = toDate(b);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      const ta = da.getTime();
      const tb = db.getTime();
      return ta === tb ? 0 : ta < tb ? -1 : 1;
    }
    case 'boolean':
      return (a === true ? 1 : 0) - (b === true ? 1 : 0);
    default:
      return String(a).toLowerCase().localeCompare(String(b).toLowerCase(), 'es');
  }
}

export function getCellValue<T>(row: T, col: TableColumn<T>): unknown {
  try {
    return col.valueGetter ? col.valueGetter(row) : (row as Record<string, unknown>)?.[col.key];
  } catch {
    return undefined;
  }
}

export function valueToSearchableText(value: unknown, type: CellDataType): string {
  if (value == null) return '';
  if (type === 'image') return '';
  if (type === 'boolean') return value === true ? 'si true yes 1' : 'no false 0';
  return String(value);
}
