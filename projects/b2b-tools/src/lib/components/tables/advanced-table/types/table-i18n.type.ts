export type TableLang = 'EN' | 'ES';

export interface TableI18n {
  noData: string;
  rowsPerPage: string;
  showing: (from: number, to: number, total: number) => string;
  search: string;
  clear: string;
  actions: string;
  previous?: string;
  next?: string;
  filter: string;
  empty: string;
  seeImage: string;
  refresh: string;
  autoRefresh: string;
  refreshOff: string;
  columns: string;
  resetColumns: string;
  allColumnsVisible: string;
  refreshCustom?: string;
  refreshSeconds?: string;
  refreshMinutes?: string;
  showAll: string;
}
