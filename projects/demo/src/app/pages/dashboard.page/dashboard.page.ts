import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LangService } from '../../lang/lang.service';

@Component({
  selector: 'dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  readonly langService = inject(LangService);
}
