import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSale } from './section-sale';

describe('SectionSale', () => {
  let component: SectionSale;
  let fixture: ComponentFixture<SectionSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionSale],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionSale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
