import { Routes } from '@angular/router';
import { AdvancedTableDemoPage } from './pages/advanced-table-demo.page/advanced-table-demo.page';
import { DashboardPage } from './pages/dashboard.page/dashboard.page';
import { AdvancedCardDemoPage } from './pages/advanced-card-demo/advanced-card-demo.page';

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      { path: 'table', component: AdvancedTableDemoPage },
      { path: 'card', component: AdvancedCardDemoPage },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'table' },
];
