import { AdvancedModalI18n, AdvancedModalLang } from '../types/advanced-modal-i18n.type';

export const ADVANCED_MODAL_I18N_EN: AdvancedModalI18n = {
  confirm: 'Accept',
  cancel: 'Cancel',
  seeMore: 'See more',
};

export const ADVANCED_MODAL_I18N_ES: AdvancedModalI18n = {
  confirm: 'Aceptar',
  cancel: 'Cancelar',
  seeMore: 'Ver más',
};

export const ADVANCED_MODAL_I18N_BY_LANG: Record<AdvancedModalLang, AdvancedModalI18n> = {
  EN: ADVANCED_MODAL_I18N_EN,
  ES: ADVANCED_MODAL_I18N_ES,
};

export const ADVANCED_MODAL_LANG_DEFAULT: AdvancedModalLang = 'EN';

export const ADVANCED_MODAL_I18N_DEFAULT: AdvancedModalI18n = ADVANCED_MODAL_I18N_EN;
