import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdvancedInputComponent } from 'b2b-tools';

@Component({
  selector: 'app-advanced-input-demo',
  imports: [AdvancedInputComponent, ReactiveFormsModule],
  templateUrl: './advanced-input-demo.page.html',
  styleUrl: './advanced-input-demo.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedInputDemoPage {
  readonly mainTheme = signal<'dark' | 'light'>('light');
  readonly brandTheme = signal<'dark' | 'light'>('dark');

  readonly name = signal('');
  readonly password = signal('');

  readonly emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  readonly bioControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(120)],
  });
}
