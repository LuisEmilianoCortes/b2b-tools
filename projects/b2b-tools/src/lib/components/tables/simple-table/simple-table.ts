import { Component, computed, Input, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { SimpleHaders, SortDirection } from './types';
import {
  SIMPLE_TABLE_I18N_BY_LANG,
  SIMPLE_TABLE_LANG_DEFAULT,
} from './constants/simple-table-i18n.constants';
import { SimpleTableI18n, SimpleTableLang } from './types/simple-table-i18n.type';

@Component({
  selector: 'simple-table',
  imports: [],
  templateUrl: './simple-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './simple-table.css',
})
export class SimpleTable<T> {
  headers = input.required<SimpleHaders<T>[]>();
  data = input<T[]>([]);

  @Input()
  set lang(value: SimpleTableLang | undefined) {
    this._lang.set(value ?? SIMPLE_TABLE_LANG_DEFAULT);
  }

  @Input()
  set i18n(value: Partial<SimpleTableI18n> | undefined) {
    this._override.set(value ?? {});
  }

  private _lang = signal<SimpleTableLang>(SIMPLE_TABLE_LANG_DEFAULT);
  private _override = signal<Partial<SimpleTableI18n>>({});

  readonly i18nCom = computed<SimpleTableI18n>(() => ({
    ...SIMPLE_TABLE_I18N_BY_LANG[this._lang()],
    ...this._override(),
  }));

  sortState = signal<{ key: keyof T | null; direction: SortDirection }>({
    key: null,
    direction: 'none',
  });

  sortedData = computed(() => {
    const { key, direction } = this.sortState();
    const currentData = [...this.data()];

    if (!key || direction === 'none') return currentData;

    return currentData.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return 1;
      if (valueB == null) return -1;

      const numberA = Number(valueA);
      const numberB = Number(valueB);
      if (!isNaN(numberA) && !isNaN(numberB)) {
        return direction === 'asc' ? numberA - numberB : numberB - numberA;
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        return direction === 'asc'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }

      const aStr = String(valueA);
      const bStr = String(valueB);

      return direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  });

  sortBy(key: keyof T) {
    const current = this.sortState();

    if (current.key !== key) {
      this.sortState.set({ key, direction: 'asc' });
      return;
    }

    const next: Record<SortDirection, SortDirection> = {
      none: 'asc',
      asc: 'desc',
      desc: 'none',
    };

    this.sortState.set({ key, direction: next[current.direction] });
  }
}
