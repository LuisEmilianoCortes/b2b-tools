export interface SimpleHaders<T> {
  label: string;
  key: keyof T;
}

export type SortDirection = 'none' | 'asc' | 'desc';

export * from './simple-table-i18n.type';
