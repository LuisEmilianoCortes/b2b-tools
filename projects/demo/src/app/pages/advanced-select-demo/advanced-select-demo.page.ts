import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AdvancedSelectComponent, AdvancedSelectConfig, AdvancedSelectOption } from 'b2b-tools';
import { LangService } from '../../lang/lang.service';

interface Country {
  code: string;
  name: string;
}

const COUNTRIES: Country[] = [
  { code: 'MX', name: 'Mexico' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Peru' },
  { code: 'ES', name: 'Spain' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
];

@Component({
  selector: 'app-advanced-select-demo',
  imports: [AdvancedSelectComponent],
  templateUrl: './advanced-select-demo.page.html',
  styleUrl: './advanced-select-demo.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedSelectDemoPage {
  readonly langService = inject(LangService);
  readonly mainTheme = signal<'dark' | 'light'>('light');
  readonly brandTheme = signal<'dark' | 'light'>('dark');

  readonly options = computed<AdvancedSelectOption<Country>[]>(() =>
    COUNTRIES.map((country) => ({ id: country.code, label: country.name, data: country })),
  );

  readonly singleValue = signal<string | null>('MX');
  readonly multipleValue = signal<string[]>(['MX', 'BR']);
  readonly modalValue = signal<string[]>([]);

  readonly singleConfig: AdvancedSelectConfig = {
    placeholder: 'Select a country',
    showLabel: true,
    autocomplete: true,
  };

  readonly multipleConfig: AdvancedSelectConfig = {
    multiple: true,
    placeholder: 'Select countries',
    showLabel: true,
    autocomplete: true,
    maxSelectedItemsToShow: 3,
  };

  readonly modalConfig: AdvancedSelectConfig = {
    multiple: true,
    placeholder: 'Search from the full catalog',
    showLabel: true,
    autocomplete: true,
    enableModal: true,
    modalTitle: 'Country Catalog',
  };

  readonly evSelectionChange = signal('—');

  onSelectionChange(value: unknown): void {
    const label = Array.isArray(value)
      ? (value as AdvancedSelectOption<Country>[]).map((opt) => opt.label).join(', ') || '(cleared)'
      : (value as AdvancedSelectOption<Country> | undefined)?.label ?? '(cleared)';
    this.evSelectionChange.set(label);
  }
}
