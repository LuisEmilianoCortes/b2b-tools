import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tables.page',
  imports: [RouterOutlet],
  templateUrl: './tables.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './tables.page.css',
})
export class TablesPage {}
