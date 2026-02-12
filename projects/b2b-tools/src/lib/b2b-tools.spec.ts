import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTools } from './b2b-tools';

describe('B2bTools', () => {
  let component: B2bTools;
  let fixture: ComponentFixture<B2bTools>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [B2bTools]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2bTools);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
