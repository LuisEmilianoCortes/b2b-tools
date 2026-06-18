import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  AdvancedTable,
  TableActionEvent,
  TableColumn,
  TableConfig,
  TablePaginationChange,
} from 'b2b-tools';

type UserRow = {
  id: number;
  name: string;
  age: number;
  salary: number;
  createdAt: string;
  lastLoginAt: string;
  avatarUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  profileUrl: string;
};

@Component({
  selector: 'app-advanced-table-demo',
  imports: [AdvancedTable],
  templateUrl: './advanced-table-demo.page.html',
  styleUrl: './advanced-table-demo.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedTableDemoPage {
  // Feature toggles
  readonly ftSearch = signal(true);
  readonly ftFilters = signal(true);
  readonly ftSelectable = signal(false);
  readonly ftRefresh = signal(true);
  readonly ftAutoRefresh = signal(true);
  readonly ftCustomInterval = signal(true);
  readonly ftPagination = signal(true);
  readonly ftColumnVisibility = signal(true);
  readonly ftCache = signal(true);

  // Event signal values
  readonly evRefresh = signal('—');
  readonly evRowClick = signal('—');
  readonly evAction = signal('—');
  readonly evSelection = signal('—');
  readonly evPage = signal('—');

  // Pulse activations
  readonly activeRefresh = signal(false);
  readonly activeRowClick = signal(false);
  readonly activeAction = signal(false);
  readonly activeSelection = signal(false);
  readonly activePage = signal(false);

  readonly config = computed<TableConfig>(() => ({
    globalSearch: this.ftSearch(),
    columnFilters: this.ftFilters(),
    selectable: this.ftSelectable(),
    selectionMode: 'multiple',
    pagination: { enabled: this.ftPagination(), pageSize: 10, pageSizeOptions: [10, 25, 50] },
    scroll: { mode: 'none' },
    emptyText: 'No results',
    rowIdKey: 'id',
    refresh: {
      enabled: this.ftRefresh(),
      autoRefresh: this.ftAutoRefresh(),
      intervals: [5, 10, 30, 60],
      allowCustomInterval: this.ftCustomInterval(),
      defaultInterval: this.ftCustomInterval() ? 120 : undefined,
    },
    columnVisibility: this.ftColumnVisibility(),
    cache: this.ftCache()
      ? { enabled: true as const, key: 'b2b-adv-table-demo' }
      : { enabled: false as const },
  }));

  columns: TableColumn<UserRow>[] = [
    {
      key: 'avatarUrl',
      label: 'Avatar',
      type: 'image',
      size: 'SM',
      options: { image: { hidden: true, openInModal: true } },
    },
    { key: 'name', label: 'Name', type: 'string', size: 'AUTO', sortable: true, filterable: true },
    {
      key: 'age',
      label: 'Age',
      type: 'integer',
      size: 'SM',
      sortable: true,
      align: 'right',
      filterable: true,
    },
    {
      key: 'salary',
      label: 'Salary',
      type: 'currency',
      size: 'MD',
      sortable: true,
      align: 'right',
    },
    {
      key: 'createdAt',
      label: 'Created (short)',
      type: 'date',
      size: 'MD',
      sortable: true,
      filterable: true,
      options: { dateFormat: 'short' },
    },
    {
      key: 'createdAt',
      label: 'Created (medium)',
      type: 'date',
      size: 'MD',
      sortable: true,
      options: { dateFormat: 'medium' },
    },
    {
      key: 'createdAt',
      label: 'Created (long)',
      type: 'date',
      size: 'LG',
      sortable: true,
      options: { dateFormat: 'long' },
    },
    {
      key: 'createdAt',
      label: 'Created (custom)',
      type: 'date',
      size: 'MD',
      sortable: true,
      options: { dateFormat: { day: '2-digit', month: '2-digit', year: '2-digit' } },
    },
    {
      key: 'lastLoginAt',
      label: 'Last Login (short)',
      type: 'datetime',
      size: 'MD',
      sortable: true,
      options: { dateTimeFormat: 'short' },
    },
    {
      key: 'lastLoginAt',
      label: 'Last Login (medium)',
      type: 'datetime',
      size: 'LG',
      sortable: true,
      options: { dateTimeFormat: 'medium' },
    },
    {
      key: 'lastLoginAt',
      label: 'Last Login (long)',
      type: 'datetime',
      size: 'XL',
      sortable: true,
      options: { dateTimeFormat: 'long' },
    },
    {
      key: 'lastLoginAt',
      label: 'Last Login (custom)',
      type: 'datetime',
      size: 'LG',
      sortable: true,
      options: {
        dateTimeFormat: {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
      },
    },
    {
      key: 'status',
      label: 'Status',
      type: 'status',
      size: 'SM',
      filterable: true,
      options: { status: { classMap: { ACTIVE: 'success', INACTIVE: 'error' } } },
    },
    {
      key: 'profileUrl',
      label: 'Profile',
      type: 'link',
      size: 'AUTO',
      options: { link: { target: '_blank' } },
    },
    {
      key: 'actions',
      label: 'Actions',
      type: 'actions',
      size: 'SM',
      align: 'center',
      actions: [
        { id: 'edit', label: 'Edit', icon: 'edit', tooltip: 'Edit', variant: 'default' },
        { id: 'delete', label: 'Delete', icon: 'delete', tooltip: 'Delete', variant: 'danger' },
      ],
    },
  ];

  rows: UserRow[] = [
    {
      id: 1,
      name: 'Luis Emiliano Cortés Camacho',
      age: 31,
      salary: 55000,
      createdAt: '2025-10-01',
      lastLoginAt: '2026-06-09T08:14:32',
      avatarUrl: 'https://picsum.photos/200',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/1',
    },
    {
      id: 2,
      name: 'Ana Martínez López',
      age: 28,
      salary: 42000,
      createdAt: '2025-11-10',
      lastLoginAt: '2026-06-08T23:45:10',
      avatarUrl: 'https://picsum.photos/201',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/2',
    },
    {
      id: 3,
      name: 'Carlos Hernández Ruiz',
      age: 35,
      salary: 62000,
      createdAt: '2025-09-18',
      lastLoginAt: '2026-06-10T07:02:55',
      avatarUrl: 'https://picsum.photos/202',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/3',
    },
    {
      id: 4,
      name: 'María Fernanda Gómez',
      age: 24,
      salary: 32000,
      createdAt: '2025-12-02',
      lastLoginAt: '2026-06-07T15:30:00',
      avatarUrl: 'https://picsum.photos/203',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/4',
    },
    {
      id: 5,
      name: 'Jorge Luis Ramírez',
      age: 41,
      salary: 78000,
      createdAt: '2024-07-21',
      lastLoginAt: '2026-05-29T11:18:44',
      avatarUrl: 'https://picsum.photos/204',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/5',
    },
    {
      id: 6,
      name: 'Paola Sánchez Torres',
      age: 29,
      salary: 39000,
      createdAt: '2025-08-14',
      lastLoginAt: '2026-06-09T19:55:21',
      avatarUrl: 'https://picsum.photos/205',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/6',
    },
    {
      id: 7,
      name: 'Ricardo Morales Díaz',
      age: 33,
      salary: 48000,
      createdAt: '2025-06-05',
      lastLoginAt: '2026-06-10T06:40:03',
      avatarUrl: 'https://picsum.photos/206',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/7',
    },
    {
      id: 8,
      name: 'Valeria Ortega Cruz',
      age: 22,
      salary: 25000,
      createdAt: '2025-11-28',
      lastLoginAt: '2026-06-05T13:22:17',
      avatarUrl: 'https://picsum.photos/207',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/8',
    },
    {
      id: 9,
      name: 'Fernando Castillo Vega',
      age: 38,
      salary: 67000,
      createdAt: '2024-12-15',
      lastLoginAt: '2026-06-09T09:11:59',
      avatarUrl: 'https://picsum.photos/208',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/9',
    },
    {
      id: 10,
      name: 'Daniela Pérez Flores',
      age: 26,
      salary: 36000,
      createdAt: '2025-10-22',
      lastLoginAt: '2026-06-08T17:47:30',
      avatarUrl: 'https://picsum.photos/209',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/10',
    },
    {
      id: 11,
      name: 'Miguel Ángel Navarro',
      age: 45,
      salary: 82000,
      createdAt: '2023-05-30',
      lastLoginAt: '2026-05-15T10:05:48',
      avatarUrl: 'https://picsum.photos/210',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/11',
    },
    {
      id: 12,
      name: 'Sofía Mendoza Ríos',
      age: 27,
      salary: 41000,
      createdAt: '2025-09-09',
      lastLoginAt: '2026-06-10T08:58:12',
      avatarUrl: 'https://picsum.photos/211',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/12',
    },
    {
      id: 13,
      name: 'Alejandro Cruz Peña',
      age: 34,
      salary: 53000,
      createdAt: '2025-03-17',
      lastLoginAt: '2026-06-09T21:33:07',
      avatarUrl: 'https://picsum.photos/212',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/13',
    },
    {
      id: 14,
      name: 'Karla Jiménez Soto',
      age: 21,
      salary: 22000,
      createdAt: '2025-12-20',
      lastLoginAt: '2026-06-03T14:19:52',
      avatarUrl: 'https://picsum.photos/213',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/14',
    },
    {
      id: 15,
      name: 'Héctor Iván Luna',
      age: 39,
      salary: 71000,
      createdAt: '2024-10-08',
      lastLoginAt: '2026-06-10T07:25:41',
      avatarUrl: 'https://picsum.photos/214',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/15',
    },
    {
      id: 16,
      name: 'Brenda Aguilar Núñez',
      age: 30,
      salary: 45000,
      createdAt: '2025-07-11',
      lastLoginAt: '2026-06-08T12:04:29',
      avatarUrl: 'https://picsum.photos/215',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/16',
    },
    {
      id: 17,
      name: 'Iván Torres Molina',
      age: 36,
      salary: 60000,
      createdAt: '2024-11-03',
      lastLoginAt: '2026-06-01T16:50:15',
      avatarUrl: 'https://picsum.photos/216',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/17',
    },
    {
      id: 18,
      name: 'Lucía Paredes Cano',
      age: 23,
      salary: 28000,
      createdAt: '2025-11-01',
      lastLoginAt: '2026-06-10T05:37:44',
      avatarUrl: 'https://picsum.photos/217',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/18',
    },
    {
      id: 19,
      name: 'Oscar Villegas Rocha',
      age: 42,
      salary: 76000,
      createdAt: '2023-09-19',
      lastLoginAt: '2026-04-22T09:43:08',
      avatarUrl: 'https://picsum.photos/218',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/19',
    },
    {
      id: 20,
      name: 'Camila Estrada León',
      age: 25,
      salary: 34000,
      createdAt: '2025-10-30',
      lastLoginAt: '2026-06-09T18:26:53',
      avatarUrl: 'https://picsum.photos/219',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/20',
    },
    {
      id: 21,
      name: 'Roberto Salinas Fuentes',
      age: 48,
      salary: 88000,
      createdAt: '2022-04-12',
      lastLoginAt: '2026-06-10T07:59:36',
      avatarUrl: 'https://picsum.photos/220',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/21',
    },
    {
      id: 22,
      name: 'Andrea Lozano Rivas',
      age: 32,
      salary: 52000,
      createdAt: '2025-05-07',
      lastLoginAt: '2026-06-08T20:14:22',
      avatarUrl: 'https://picsum.photos/221',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/22',
    },
    {
      id: 23,
      name: 'Diego Carrillo Méndez',
      age: 27,
      salary: 38000,
      createdAt: '2025-08-26',
      lastLoginAt: '2026-06-06T11:08:47',
      avatarUrl: 'https://picsum.photos/222',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/23',
    },
    {
      id: 24,
      name: 'Natalia Rojas Beltrán',
      age: 34,
      salary: 56000,
      createdAt: '2024-06-18',
      lastLoginAt: '2026-06-09T14:52:19',
      avatarUrl: 'https://picsum.photos/223',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/24',
    },
    {
      id: 25,
      name: 'Eduardo Neri Campos',
      age: 29,
      salary: 41000,
      createdAt: '2025-09-02',
      lastLoginAt: '2026-06-10T06:17:05',
      avatarUrl: 'https://picsum.photos/224',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/25',
    },
    {
      id: 26,
      name: 'Renata Solís Quintana',
      age: 22,
      salary: 24000,
      createdAt: '2025-12-11',
      lastLoginAt: '2026-05-28T22:39:58',
      avatarUrl: 'https://picsum.photos/225',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/26',
    },
    {
      id: 27,
      name: 'Francisco Ledezma Ortiz',
      age: 37,
      salary: 65000,
      createdAt: '2024-02-09',
      lastLoginAt: '2026-06-09T10:03:31',
      avatarUrl: 'https://picsum.photos/226',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/27',
    },
    {
      id: 28,
      name: 'Paulina Vera Montoya',
      age: 31,
      salary: 47000,
      createdAt: '2025-04-15',
      lastLoginAt: '2026-06-08T15:41:14',
      avatarUrl: 'https://picsum.photos/227',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/28',
    },
    {
      id: 29,
      name: 'Sergio Padilla Cortés',
      age: 44,
      salary: 79000,
      createdAt: '2023-08-01',
      lastLoginAt: '2026-06-02T08:28:43',
      avatarUrl: 'https://picsum.photos/228',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/29',
    },
    {
      id: 30,
      name: 'Mónica Castañeda Gil',
      age: 26,
      salary: 35000,
      createdAt: '2025-10-05',
      lastLoginAt: '2026-06-09T16:07:27',
      avatarUrl: 'https://picsum.photos/229',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/30',
    },
    {
      id: 31,
      name: 'Raúl Benítez Zamora',
      age: 40,
      salary: 72000,
      createdAt: '2024-09-27',
      lastLoginAt: '2026-06-10T05:54:09',
      avatarUrl: 'https://picsum.photos/230',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/31',
    },
    {
      id: 32,
      name: 'Liliana Rosas Ponce',
      age: 28,
      salary: 43000,
      createdAt: '2025-06-30',
      lastLoginAt: '2026-06-08T13:35:52',
      avatarUrl: 'https://picsum.photos/231',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/32',
    },
    {
      id: 33,
      name: 'Tomás Hidalgo Peralta',
      age: 35,
      salary: 61000,
      createdAt: '2024-01-14',
      lastLoginAt: '2026-06-07T18:21:38',
      avatarUrl: 'https://picsum.photos/232',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/33',
    },
    {
      id: 34,
      name: 'Elena Muñoz Calderón',
      age: 23,
      salary: 27000,
      createdAt: '2025-11-19',
      lastLoginAt: '2026-06-10T07:48:16',
      avatarUrl: 'https://picsum.photos/233',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/34',
    },
    {
      id: 35,
      name: 'Julián Ochoa Reyes',
      age: 46,
      salary: 85000,
      createdAt: '2022-12-03',
      lastLoginAt: '2026-05-20T12:13:04',
      avatarUrl: 'https://picsum.photos/234',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/35',
    },
    {
      id: 36,
      name: 'Pamela Figueroa Salgado',
      age: 30,
      salary: 46000,
      createdAt: '2025-03-22',
      lastLoginAt: '2026-06-09T22:06:47',
      avatarUrl: 'https://picsum.photos/235',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/36',
    },
    {
      id: 37,
      name: 'Emilio Rentería Solano',
      age: 34,
      salary: 54000,
      createdAt: '2024-05-16',
      lastLoginAt: '2026-06-10T06:32:25',
      avatarUrl: 'https://picsum.photos/236',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/37',
    },
    {
      id: 38,
      name: 'Claudia Nieto Vargas',
      age: 27,
      salary: 39000,
      createdAt: '2025-08-08',
      lastLoginAt: '2026-06-04T17:59:01',
      avatarUrl: 'https://picsum.photos/237',
      status: 'INACTIVE',
      profileUrl: 'https://example.com/u/38',
    },
    {
      id: 39,
      name: 'Mauricio Acosta Belén',
      age: 43,
      salary: 74000,
      createdAt: '2023-10-25',
      lastLoginAt: '2026-06-09T11:44:39',
      avatarUrl: 'https://picsum.photos/238',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/39',
    },
    {
      id: 40,
      name: 'Regina Palma Escobedo',
      age: 24,
      salary: 30000,
      createdAt: '2025-12-01',
      lastLoginAt: '2026-06-08T09:27:18',
      avatarUrl: 'https://picsum.photos/239',
      status: 'ACTIVE',
      profileUrl: 'https://example.com/u/40',
    },
  ];

  onRefresh() {
    const t = new Date();
    this.evRefresh.set(
      t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    );
    this.flash(this.activeRefresh);
  }

  onRowClick(row: UserRow) {
    this.evRowClick.set(row.name.split(' ').slice(0, 2).join(' '));
    this.flash(this.activeRowClick);
  }

  onAction(ev: TableActionEvent<UserRow>) {
    this.evAction.set(`${ev.actionId} · ${ev.row.name.split(' ')[0]}`);
    this.flash(this.activeAction);
  }

  onSelection(ids: Array<string | number>) {
    this.evSelection.set(
      ids.length === 0 ? '—' : `${ids.length} row${ids.length === 1 ? '' : 's'}`,
    );
    this.flash(this.activeSelection);
  }

  onPageChange(ev: TablePaginationChange) {
    this.evPage.set(`Page ${ev.page} · ${ev.pageSize}/pg`);
    this.flash(this.activePage);
  }

  private flash(sig: { set: (v: boolean) => void }) {
    sig.set(true);
    setTimeout(() => sig.set(false), 1400);
  }
}
