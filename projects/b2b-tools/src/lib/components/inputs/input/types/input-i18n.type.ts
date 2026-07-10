export type InputLang = 'EN' | 'ES';

export interface InputI18n {
  required: string;
  email: string;
  minlength: (length: number) => string;
  maxlength: (length: number) => string;
  pattern: string;
  invalid: string;
  clearField: string;
  showPassword: string;
  hidePassword: string;
}
