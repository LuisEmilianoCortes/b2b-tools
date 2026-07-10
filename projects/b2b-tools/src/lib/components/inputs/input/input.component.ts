import {
  Component,
  OnInit,
  Optional,
  Self,
  input,
  model,
  signal,
  inject,
  computed,
  ChangeDetectorRef,
  DestroyRef,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { INPUT_I18N_BY_LANG, INPUT_LANG_DEFAULT } from './constants/input-i18n.constants';
import { InputI18n, InputLang } from './types/input-i18n.type';

let nextId = 0;

@Component({
  selector: 'advanced-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './input.component.css',
})
export class AdvancedInputComponent implements ControlValueAccessor, OnInit {
  id = input<string>(`input-${nextId++}`);
  name = input<string>('');
  type = input<string>('text');
  placeholder = input<string>(' ');
  label = input<string>('');
  helperText = input<string>('');
  theme = input<'primary' | 'secondary' | 'accent'>('primary');
  clearable = input<boolean>(false);
  readonly = input<boolean>(false);
  icon = input<string>('');
  suffixIcon = input<string>('');
  loading = input<boolean>(false);
  showCounter = input<boolean>(false);
  maxLength = input<number | undefined>(undefined);

  @Input()
  set lang(value: InputLang | undefined) {
    this._lang.set(value ?? INPUT_LANG_DEFAULT);
  }

  @Input()
  set i18n(value: Partial<InputI18n> | undefined) {
    this._override.set(value ?? {});
  }

  private _lang = signal<InputLang>(INPUT_LANG_DEFAULT);
  private _override = signal<Partial<InputI18n>>({});

  readonly i18nCom = computed<InputI18n>(() => ({
    ...INPUT_I18N_BY_LANG[this._lang()],
    ...this._override(),
  }));

  value = model<string>('');

  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();
  @Output() clearEvent = new EventEmitter<void>();

  isDisabled = signal<boolean>(false);
  isFocused = signal<boolean>(false);
  isPasswordVisible = signal<boolean>(false);

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (this.ngControl?.control) {
      this.ngControl.control.statusChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.cdr.markForCheck();
        });
    }
  }

  get hasError(): boolean {
    const control = this.ngControl?.control;
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  get errorMessage(): string | null {
    const control = this.ngControl?.control;
    if (!control || !control.errors || !(control.dirty || control.touched)) return null;

    const errors = control.errors;
    const i18n = this.i18nCom();
    if (errors['required']) return i18n.required;
    if (errors['email']) return i18n.email;
    if (errors['minlength']) {
      return i18n.minlength(errors['minlength'].requiredLength);
    }
    if (errors['maxlength']) {
      return i18n.maxlength(errors['maxlength'].requiredLength);
    }
    if (errors['pattern']) return i18n.pattern;

    const firstKey = Object.keys(errors)[0];
    return typeof errors[firstKey] === 'string' ? errors[firstKey] : i18n.invalid;
  }

  get currentInputType(): string {
    if (this.type() === 'password') {
      return this.isPasswordVisible() ? 'text' : 'password';
    }
    return this.type();
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value.set(value || '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const val = inputEl.value;
    this.value.set(val);
    this.onChange(val);
  }

  onInputFocus(event: FocusEvent): void {
    if (this.isDisabled()) return;
    this.isFocused.set(true);
    this.focusEvent.emit(event);
  }

  onInputBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this.onTouched();
    this.blurEvent.emit(event);
  }

  togglePasswordVisibility(): void {
    if (this.isDisabled()) return;
    this.isPasswordVisible.update((v) => !v);
  }

  clearValue(inputEl: HTMLInputElement): void {
    if (this.isDisabled()) return;
    this.value.set('');
    this.onChange('');
    inputEl.value = '';
    inputEl.focus();
    this.clearEvent.emit();
    this.cdr.markForCheck();
  }
}
