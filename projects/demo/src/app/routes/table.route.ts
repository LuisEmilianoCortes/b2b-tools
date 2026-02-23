import { Routes } from '@angular/router';
import { TablesPage } from '../pages/tables/tables.page';
import { SimpleTableDemoPage } from '../pages/simple-table-demo/simple-table-demo.page';
import { AdvancedTableDemoPage } from '../pages/advanced-table-demo/advanced-table-demo.page';

export const routerTable: Routes = [
  {
    path: '',
    component: TablesPage,
    children: [
      {
        path: 'simple-table',
        component: SimpleTableDemoPage,
      },
      {
        path: 'advanced-table',
        component: AdvancedTableDemoPage,
      },
      { path: '', pathMatch: 'full', redirectTo: 'simple-table' },
    ],
  },
];
