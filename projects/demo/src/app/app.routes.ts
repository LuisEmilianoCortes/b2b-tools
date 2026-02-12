import { Routes } from '@angular/router';
import { AdvancedTableDemoPage } from './pages/advanced-table-demo.page/advanced-table-demo.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'table' },
  { path: 'table', component: AdvancedTableDemoPage },
];
