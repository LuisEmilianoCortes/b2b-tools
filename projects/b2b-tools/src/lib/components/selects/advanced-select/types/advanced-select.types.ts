export interface AdvancedSelectOption<T = unknown> {
  id: string | number;
  label: string;
  disabled?: boolean;
  data?: T;
}

export interface AdvancedSelectConfig {
  multiple?: boolean;
  autocomplete?: boolean;
  enableModal?: boolean;
  modalTitle?: string;
  placeholder?: string;
  showLabel?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  maxSelectedItemsToShow?: number;
}
