import { ErrorDetailModalI18n, ErrorDetailModalLang } from '../types/error-detail-modal-i18n.type';

export const ERROR_DETAIL_MODAL_I18N_EN: ErrorDetailModalI18n = {
  title: 'Error Detail',
  close: 'Close',
  code: 'Code',
  endpoint: 'Endpoint',
  message: 'Message',
  payload: 'Payload',
  serverResponse: 'Server response',
  fullError: 'Full error',
  viewFullData: 'View full data',
  hideFullData: 'Hide full data',
};

export const ERROR_DETAIL_MODAL_I18N_ES: ErrorDetailModalI18n = {
  title: 'Detalle del error',
  close: 'Cerrar',
  code: 'Código',
  endpoint: 'Endpoint',
  message: 'Mensaje',
  payload: 'Payload',
  serverResponse: 'Respuesta del servidor',
  fullError: 'Error completo',
  viewFullData: 'Ver datos completos',
  hideFullData: 'Ocultar datos completos',
};

export const ERROR_DETAIL_MODAL_I18N_BY_LANG: Record<ErrorDetailModalLang, ErrorDetailModalI18n> = {
  EN: ERROR_DETAIL_MODAL_I18N_EN,
  ES: ERROR_DETAIL_MODAL_I18N_ES,
};

export const ERROR_DETAIL_MODAL_LANG_DEFAULT: ErrorDetailModalLang = 'EN';

export const ERROR_DETAIL_MODAL_I18N_DEFAULT: ErrorDetailModalI18n = ERROR_DETAIL_MODAL_I18N_EN;
