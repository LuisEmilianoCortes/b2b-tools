import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeCustomizerComponent } from './theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeCustomizerComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('demo');
}
