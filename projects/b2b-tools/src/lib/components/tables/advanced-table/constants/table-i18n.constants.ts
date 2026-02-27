import { TableI18n, TableLang } from '../types/table-i18n.type';

export const TABLE_I18N_EN: TableI18n = {
  noData: 'No data available',
  rowsPerPage: 'Rows per page',
  search: 'Search',
  clear: 'Clear',
  actions: 'Actions',
  previous: 'Previous',
  next: 'Next',
  showing: (from, to, total) => `Showing ${from}–${to} of ${total}`,
  filter: 'Filter by',
  empty: 'No results found.',
  seeImage: 'See image',
};

export const TABLE_I18N_ES: TableI18n = {
  noData: 'No hay información disponible',
  rowsPerPage: 'Filas por página',
  search: 'Buscar',
  clear: 'Limpiar',
  actions: 'Acciones',
  previous: 'Anterior',
  next: 'Siguiente',
  showing: (from: number, to: number, total: number) => `Mostrando ${from}–${to} de ${total}`,
  filter: 'Filtrar por',
  empty: 'No se encontraron resultados.',
  seeImage: 'Ver imagen',
};

export const TABLE_I18N_BY_LANG: Record<TableLang, TableI18n> = {
  EN: TABLE_I18N_EN,
  ES: TABLE_I18N_ES,
};

export const TABLE_LANG_DEFAULT: TableLang = 'EN';

export const TABLE_I18N_DEFAULT: TableI18n = TABLE_I18N_EN;
