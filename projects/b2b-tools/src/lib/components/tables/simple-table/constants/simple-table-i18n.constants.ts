import { SimpleTableI18n, SimpleTableLang } from '../types/simple-table-i18n.type';

export const SIMPLE_TABLE_I18N_EN: SimpleTableI18n = {
  noData: 'No data found.',
};

export const SIMPLE_TABLE_I18N_ES: SimpleTableI18n = {
  noData: 'Datos no localizados.',
};

export const SIMPLE_TABLE_I18N_BY_LANG: Record<SimpleTableLang, SimpleTableI18n> = {
  EN: SIMPLE_TABLE_I18N_EN,
  ES: SIMPLE_TABLE_I18N_ES,
};

export const SIMPLE_TABLE_LANG_DEFAULT: SimpleTableLang = 'EN';

export const SIMPLE_TABLE_I18N_DEFAULT: SimpleTableI18n = SIMPLE_TABLE_I18N_EN;
