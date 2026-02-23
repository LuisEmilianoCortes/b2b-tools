import { Directive, TemplateRef, input } from '@angular/core';

@Directive({
  selector: '[advancedCardTemplate]',
  standalone: true,
})
export class AdvancedCardTemplateDirective {
  templateId = input.required<string>({ alias: 'advancedCardTemplate' });

  constructor(public readonly templateRef: TemplateRef<any>) {}
}
