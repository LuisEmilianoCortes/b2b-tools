import {
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  Output,
  Signal,
  signal,
  effect,
  inject,
  DestroyRef,
  untracked,
  ChangeDetectionStrategy,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdvancedSelectOption, AdvancedSelectConfig } from './types/advanced-select.types';
import {
  ADVANCED_SELECT_I18N_BY_LANG,
  ADVANCED_SELECT_LANG_DEFAULT,
} from './constants/advanced-select-i18n.constants';
import { AdvancedSelectI18n, AdvancedSelectLang } from './types/advanced-select-i18n.type';

@Component({
  selector: 'advanced-select',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './advanced-select.component.html',
  styleUrl: './advanced-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdvancedSelectComponent),
      multi: true,
    },
  ],
})
export class AdvancedSelectComponent<T = unknown>
  implements OnInit, OnChanges, ControlValueAccessor
{
  private destroyRef = inject(DestroyRef);

  id = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  options = input<AdvancedSelectOption<T>[]>([]);
  config = input<AdvancedSelectConfig>({});
  control = input<FormControl<any> | undefined>(undefined);
  value = input<any | any[] | undefined>(undefined);

  @Input()
  set lang(value: AdvancedSelectLang | undefined) {
    this._lang.set(value ?? ADVANCED_SELECT_LANG_DEFAULT);
  }

  @Input()
  set i18n(value: Partial<AdvancedSelectI18n> | undefined) {
    this._override.set(value ?? {});
  }

  private _lang = signal<AdvancedSelectLang>(ADVANCED_SELECT_LANG_DEFAULT);
  private _override = signal<Partial<AdvancedSelectI18n>>({});

  readonly i18nCom = computed<AdvancedSelectI18n>(() => ({
    ...ADVANCED_SELECT_I18N_BY_LANG[this._lang()],
    ...this._override(),
  }));

  @Output() selectionChange = new EventEmitter<
    AdvancedSelectOption<T> | AdvancedSelectOption<T>[]
  >();
  @Output() valueChange = new EventEmitter<any | any[]>();

  searchTerm = signal('');
  selectedOptions = signal<AdvancedSelectOption<T>[]>([]);
  isDropdownOpen = signal(false);
  isModalOpen = signal(false);
  isFormDisabled = signal(false);

  modalSearchTerm = signal('');
  modalTempSelected = signal<AdvancedSelectOption<T>[]>([]);

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  activeConfig: Signal<Required<AdvancedSelectConfig>> = computed(() => {
    const userConfig = this.config();
    return {
      multiple: userConfig.multiple ?? false,
      autocomplete: userConfig.autocomplete ?? false,
      enableModal: userConfig.enableModal ?? false,
      modalTitle: userConfig.modalTitle ?? this.i18nCom().modalTitle,
      placeholder: userConfig.placeholder ?? this.i18nCom().placeholder,
      showLabel: userConfig.showLabel ?? false,
      disabled: userConfig.disabled || this.isFormDisabled(),
      clearable: userConfig.clearable ?? true,
      maxSelectedItemsToShow: userConfig.maxSelectedItemsToShow ?? 2,
    };
  });

  selectedIds: Signal<Set<string | number>> = computed(() => {
    return new Set(this.selectedOptions().map((opt) => opt.id));
  });

  modalTempSelectedIds: Signal<Set<string | number>> = computed(() => {
    return new Set(this.modalTempSelected().map((opt) => opt.id));
  });

  filteredOptions: Signal<AdvancedSelectOption<T>[]> = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const allOptions = this.options();
    if (!term) return allOptions;
    return allOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) || String(opt.id).toLowerCase().includes(term),
    );
  });

  filteredModalOptions: Signal<AdvancedSelectOption<T>[]> = computed(() => {
    const term = this.modalSearchTerm().trim().toLowerCase();
    const allOptions = this.options();
    if (!term) return allOptions;
    return allOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) || String(opt.id).toLowerCase().includes(term),
    );
  });

  displayText: Signal<string> = computed(() => {
    const selected = this.selectedOptions();
    if (selected.length === 0) return '';
    if (!this.activeConfig().multiple) return selected[0].label;

    const maxShow = this.activeConfig().maxSelectedItemsToShow;
    const showing = selected
      .slice(0, maxShow)
      .map((opt) => opt.label)
      .join(', ');
    const extra = selected.length - maxShow;
    return extra > 0 ? `${showing} (+${extra} ${this.i18nCom().more})` : showing;
  });

  syncExternalInputsEffect = effect(() => {
    const val = this.value();

    if (val !== undefined) {
      untracked(() => this.syncLocalStateWithValue(val));
    }
  });

  ngOnInit(): void {
    this.setupFormControlBinding();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      const val = this.control()?.value ?? this.value();
      if (val !== undefined) {
        this.syncLocalStateWithValue(val);
      }
    }
  }

  writeValue(val: any): void {
    this.syncLocalStateWithValue(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isFormDisabled.set(isDisabled);
  }

  toggleDropdown(): void {
    if (this.activeConfig().disabled) return;
    this.isDropdownOpen.update((prev) => !prev);
    if (this.isDropdownOpen()) {
      this.searchTerm.set('');
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
    this.onTouched();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onModalSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.modalSearchTerm.set(value);
  }

  selectOption(option: AdvancedSelectOption<T>): void {
    if (option.disabled || this.activeConfig().disabled) return;

    const isMultiple = this.activeConfig().multiple;

    if (isMultiple) {
      this.selectedOptions.update((prev) => {
        const alreadySelected = prev.some((item) => item.id === option.id);
        return alreadySelected ? prev.filter((item) => item.id !== option.id) : [...prev, option];
      });
    } else {
      this.selectedOptions.set([option]);
      this.closeDropdown();
    }

    this.emitChanges();
  }

  deselectOption(option: AdvancedSelectOption<T>, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.activeConfig().disabled) return;

    this.selectedOptions.update((prev) => prev.filter((item) => item.id !== option.id));
    this.emitChanges();
  }

  clearSelection(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.activeConfig().disabled) return;

    this.selectedOptions.set([]);
    this.emitChanges();
  }

  openModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.activeConfig().disabled) return;

    this.modalTempSelected.set([...this.selectedOptions()]);
    this.modalSearchTerm.set('');
    this.isModalOpen.set(true);
    this.closeDropdown();
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.onTouched();
  }

  toggleModalOption(option: AdvancedSelectOption<T>): void {
    if (option.disabled) return;
    const isMultiple = this.activeConfig().multiple;

    if (isMultiple) {
      this.modalTempSelected.update((prev) => {
        const alreadySelected = prev.some((item) => item.id === option.id);
        return alreadySelected ? prev.filter((item) => item.id !== option.id) : [...prev, option];
      });
    } else {
      this.modalTempSelected.set([option]);
    }
  }

  confirmModalSelection(): void {
    this.selectedOptions.set([...this.modalTempSelected()]);
    this.emitChanges();
    this.closeModal();
  }

  private setupFormControlBinding(): void {
    const ctrl = this.control();
    if (ctrl) {
      this.syncLocalStateWithValue(ctrl.value);
      ctrl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
        this.syncLocalStateWithValue(val);
      });
    }
  }

  private syncLocalStateWithValue(val: any): void {
    const allOptions = this.options();
    if (val === null || val === undefined || val === '') {
      this.selectedOptions.set([]);
      return;
    }

    if (Array.isArray(val)) {
      const strVal = val.map(String);
      const matched = allOptions.filter((opt) => strVal.includes(String(opt.id)));
      this.selectedOptions.set(matched);
    } else {
      const matched = allOptions.find((opt) => String(opt.id) === String(val));
      this.selectedOptions.set(matched ? [matched] : []);
    }
  }

  private emitChanges(): void {
    const selected = this.selectedOptions();
    const isMultiple = this.activeConfig().multiple;

    if (isMultiple) {
      this.selectionChange.emit(selected);
    } else {
      this.selectionChange.emit(selected.length > 0 ? selected[0] : undefined);
    }

    const rawVal = isMultiple
      ? selected.map((opt) => opt.id)
      : selected.length > 0
        ? selected[0].id
        : null;

    this.valueChange.emit(rawVal);

    this.onChange(rawVal);
    this.onTouched();

    const ctrl = this.control();
    if (ctrl && ctrl.value !== rawVal) {
      ctrl.setValue(rawVal, { emitEvent: false });
      ctrl.markAsDirty();
      ctrl.markAsTouched();
    }
  }
}
