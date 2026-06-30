import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdvancedTable } from './advanced-table.component';
import { TableColumn, TableColumnSearchEvent } from './types/table.types';

type Row = { id: number; name: string; age: number };

const SERVER_COL: TableColumn<Row> = { key: 'name', label: 'Nombre', type: 'string', searchMode: 'server' };
const LOCAL_COL: TableColumn<Row> = { key: 'age', label: 'Edad', type: 'integer', searchMode: 'local' };

function setup() {
  const fixture = TestBed.createComponent(AdvancedTable<Row>);
  const cmp = fixture.componentInstance;

  fixture.componentRef.setInput('columns', [SERVER_COL, LOCAL_COL]);
  fixture.componentRef.setInput('config', { columnFilters: true });

  const emitted: TableColumnSearchEvent[] = [];
  cmp.columnSearchChange.subscribe((e) => emitted.push(e));

  return { cmp, emitted };
}

describe('AdvancedTable – column search debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not emit before 300 ms have elapsed', () => {
    const { cmp, emitted } = setup();

    cmp.setColumnQuery('name', 'foo');
    vi.advanceTimersByTime(299);

    expect(emitted).toHaveLength(0);
  });

  it('emits exactly once at the 300 ms boundary', () => {
    const { cmp, emitted } = setup();

    cmp.setColumnQuery('name', 'foo');
    vi.advanceTimersByTime(300);

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual({ attribute: 'name', value: 'foo' });
  });

  it('debounces rapid keystrokes — only the last value is emitted', () => {
    const { cmp, emitted } = setup();

    cmp.setColumnQuery('name', 'f');
    vi.advanceTimersByTime(100);
    cmp.setColumnQuery('name', 'fo');
    vi.advanceTimersByTime(100);
    cmp.setColumnQuery('name', 'foo');
    vi.advanceTimersByTime(300);

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual({ attribute: 'name', value: 'foo' });
  });

  it('does not emit for columns with searchMode: local', () => {
    const { cmp, emitted } = setup();

    cmp.setColumnQuery('age', '25');
    vi.advanceTimersByTime(500);

    expect(emitted).toHaveLength(0);
  });

  it('emits the correct event for each successive search after a full debounce window', () => {
    const { cmp, emitted } = setup();

    cmp.setColumnQuery('name', 'foo');
    vi.advanceTimersByTime(300);
    cmp.setColumnQuery('name', 'bar');
    vi.advanceTimersByTime(300);

    expect(emitted).toHaveLength(2);
    expect(emitted[1]).toEqual({ attribute: 'name', value: 'bar' });
  });

  it('still debounces when the second call arrives just before the window closes', () => {
    const { cmp, emitted } = setup();

    cmp.setColumnQuery('name', 'foo');
    vi.advanceTimersByTime(250); // window NOT yet closed
    cmp.setColumnQuery('name', 'bar'); // resets the timer
    vi.advanceTimersByTime(299); // still 1 ms short of the new window

    expect(emitted).toHaveLength(0);

    vi.advanceTimersByTime(1); // completes the 300 ms from the second call

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual({ attribute: 'name', value: 'bar' });
  });

  it('respects searchDebounceMs from config — does not emit before the configured window', () => {
    const fixture = TestBed.createComponent(AdvancedTable<Row>);
    const cmp = fixture.componentInstance;
    fixture.componentRef.setInput('columns', [SERVER_COL]);
    fixture.componentRef.setInput('config', { columnFilters: true, searchDebounceMs: 800 });

    const emitted: TableColumnSearchEvent[] = [];
    cmp.columnSearchChange.subscribe((e) => emitted.push(e));

    cmp.setColumnQuery('name', 'foo');
    vi.advanceTimersByTime(799);
    expect(emitted).toHaveLength(0);

    vi.advanceTimersByTime(1);
    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual({ attribute: 'name', value: 'foo' });
  });
});
