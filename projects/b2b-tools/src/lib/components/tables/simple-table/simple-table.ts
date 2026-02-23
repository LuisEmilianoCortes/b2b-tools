import { Component, computed, input, signal } from '@angular/core';
import { SimpleHaders, SortDirection } from './types';

@Component({
  selector: 'simple-table',
  imports: [],
  templateUrl: './simple-table.html',
  styleUrl: './simple-table.css',
})
export class SimpleTable<T> {
  headers = input.required<SimpleHaders<T>[]>();
  data = input<T[]>([]);

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
