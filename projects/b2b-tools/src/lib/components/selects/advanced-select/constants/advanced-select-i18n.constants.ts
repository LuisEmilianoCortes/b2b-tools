import { AdvancedSelectI18n, AdvancedSelectLang } from '../types/advanced-select-i18n.type';

export const ADVANCED_SELECT_I18N_EN: AdvancedSelectI18n = {
  modalTitle: 'Advanced Selection',
  placeholder: 'Select an option',
  removeOption: 'Remove option',
  moreOptions: 'See more options',
  more: 'more',
  clearSelection: 'Clear selection',
  advancedSearch: 'Advanced search',
  searchPlaceholder: 'Type to search...',
  noResults: 'No results found',
  advancedSearchPlaceholder: 'Type to search across the full list...',
  advancedSearchAction: 'Advanced search...',
  select: 'Select',
  idCode: 'ID / Code',
  descriptionOption: 'Description / Option',
  noModalResults: 'No options found for your search.',
  selected: 'selected',
  cancel: 'Cancel',
  confirmSelection: 'Confirm Selection',
};

export const ADVANCED_SELECT_I18N_ES: AdvancedSelectI18n = {
  modalTitle: 'Selección avanzada',
  placeholder: 'Selecciona una opción',
  removeOption: 'Quitar opción',
  moreOptions: 'Ver más opciones',
  more: 'más',
  clearSelection: 'Limpiar selección',
  advancedSearch: 'Búsqueda avanzada',
  searchPlaceholder: 'Escribe para buscar...',
  noResults: 'No se encontraron resultados',
  advancedSearchPlaceholder: 'Escribe para buscar en toda la lista...',
  advancedSearchAction: 'Búsqueda avanzada...',
  select: 'Seleccionar',
  idCode: 'ID / Código',
  descriptionOption: 'Descripción / Opción',
  noModalResults: 'No se encontraron opciones para tu búsqueda.',
  selected: 'seleccionados',
  cancel: 'Cancelar',
  confirmSelection: 'Confirmar selección',
};

export const ADVANCED_SELECT_I18N_BY_LANG: Record<AdvancedSelectLang, AdvancedSelectI18n> = {
  EN: ADVANCED_SELECT_I18N_EN,
  ES: ADVANCED_SELECT_I18N_ES,
};

export const ADVANCED_SELECT_LANG_DEFAULT: AdvancedSelectLang = 'EN';

export const ADVANCED_SELECT_I18N_DEFAULT: AdvancedSelectI18n = ADVANCED_SELECT_I18N_EN;
