import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard.page/dashboard.page';
import { AdvancedCardDemoPage } from './pages/advanced-card-demo/advanced-card-demo.page';
import { AdvancedSelectDemoPage } from './pages/advanced-select-demo/advanced-select-demo.page';
import { AdvancedInputDemoPage } from './pages/advanced-input-demo/advanced-input-demo.page';
import { AdvancedButtonDemoPage } from './pages/advanced-button-demo/advanced-button-demo.page';
import { AdvancedModalDemoPage } from './pages/advanced-modal-demo/advanced-modal-demo.page';

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
        path: 'advanced-select',
        component: AdvancedSelectDemoPage,
      },
      {
        path: 'advanced-input',
        component: AdvancedInputDemoPage,
      },
      {
        path: 'advanced-button',
        component: AdvancedButtonDemoPage,
      },
      {
        path: 'advanced-modal',
        component: AdvancedModalDemoPage,
      },
      { path: '', pathMatch: 'full', redirectTo: 'tables' },
    ],
  },

  { path: '**', redirectTo: '' },
];
