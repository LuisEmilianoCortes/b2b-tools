import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard.page/dashboard.page';
import { AdvancedCardDemoPage } from './pages/advanced-card-demo/advanced-card-demo.page';
import { AdvancedButtonDemoPage } from './pages/advanced-button-demo/advanced-button-demo.page';

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'tables',
        loadChildren: () => import('./routes/table.route').then((r) => r.routerTable),
      },

      {
        path: 'advanced-card',
        component: AdvancedCardDemoPage,
      },
      {
        path: 'advanced-button',
        component: AdvancedButtonDemoPage,
      },
      { path: '', pathMatch: 'full', redirectTo: 'tables' },
    ],
  },

  { path: '**', redirectTo: '' },
];
