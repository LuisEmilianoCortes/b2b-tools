import { TableColumn } from '../components/tables/advanced-table/types/table.types';
import { TimeZoneInfo } from '../components/tables/advanced-table/types/time-zone.types';

/** Parses ISO date-only strings (YYYY-MM-DD) in local time to avoid UTC shift. */
export function parseLocalDate(str: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(str);
}

export function formatCurrency(value: number, locale: string, currency: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return String(value);
  }
}

export function formatDate(
  date: Date,
  locale: string,
  fmt?: 'short' | 'medium' | 'long' | Intl.DateTimeFormatOptions,
): string {
  if (!fmt) return date.toLocaleDateString(locale);
  const opts: Intl.DateTimeFormatOptions =
    typeof fmt === 'string' ? { dateStyle: fmt as Intl.DateTimeFormatOptions['dateStyle'] } : fmt;
  return date.toLocaleDateString(locale, opts);
}

export function formatDateTime(
  date: Date,
  locale: string,
  fmt?: 'short' | 'medium' | 'long' | Intl.DateTimeFormatOptions,
): string {
  if (!fmt) return date.toLocaleString(locale);
  const opts: Intl.DateTimeFormatOptions =
    typeof fmt === 'string'
      ? { dateStyle: fmt as Intl.DateTimeFormatOptions['dateStyle'], timeStyle: fmt as Intl.DateTimeFormatOptions['timeStyle'] }
      : fmt;
  return date.toLocaleString(locale, opts);
}

export function getDisplayText<T>(
  value: unknown,
  col: TableColumn<T>,
  row: T,
  tz: TimeZoneInfo,
): string {
  if (col.formatter) {
    try {
      return col.formatter(value, row);
    } catch {
      return '';
    }
  }

  switch (col.type) {
    case 'string':
      return value == null ? '' : String(value);

    case 'integer':
    case 'decimal':
    case 'currency': {
      const num = Number(value);
      if (!Number.isFinite(num)) return value == null ? '' : String(value);
      if (col.type === 'currency') {
        return formatCurrency(num, tz.locale, col.options?.currency ?? tz.currency);
      }
      return String(num);
    }

    case 'date':
    case 'datetime': {
      const dateObj = value instanceof Date ? value : parseLocalDate(String(value));
      if (Number.isNaN(dateObj.getTime())) return value == null ? '' : String(value);
      if (col.type === 'datetime') return formatDateTime(dateObj, tz.locale, col.options?.dateTimeFormat);
      return formatDate(dateObj, tz.locale, col.options?.dateFormat);
    }

    case 'boolean':
      return value ? 'Sí' : 'No';

    default:
      return value == null ? '' : String(value);
  }
}
