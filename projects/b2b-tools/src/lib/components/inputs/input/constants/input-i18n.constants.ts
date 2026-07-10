import { InputI18n, InputLang } from '../types/input-i18n.type';

export const INPUT_I18N_EN: InputI18n = {
  required: 'This field is required',
  email: 'Invalid email format',
  minlength: (length) => `Must be at least ${length} characters`,
  maxlength: (length) => `Must not exceed ${length} characters`,
  pattern: 'Invalid format',
  invalid: 'Invalid input',
  clearField: 'Clear field',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
};

export const INPUT_I18N_ES: InputI18n = {
  required: 'Este campo es obligatorio',
  email: 'Formato de correo inválido',
  minlength: (length) => `Debe tener al menos ${length} caracteres`,
  maxlength: (length) => `No debe exceder ${length} caracteres`,
  pattern: 'Formato inválido',
  invalid: 'Valor inválido',
  clearField: 'Limpiar campo',
  showPassword: 'Mostrar contraseña',
  hidePassword: 'Ocultar contraseña',
};

export const INPUT_I18N_BY_LANG: Record<InputLang, InputI18n> = {
  EN: INPUT_I18N_EN,
  ES: INPUT_I18N_ES,
};

export const INPUT_LANG_DEFAULT: InputLang = 'EN';

export const INPUT_I18N_DEFAULT: InputI18n = INPUT_I18N_EN;
