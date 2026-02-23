import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tables.page',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tables.page.html',
  styleUrl: './tables.page.css',
})
export class TablesPage {}
