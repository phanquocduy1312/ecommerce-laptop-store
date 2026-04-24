import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionLaptopGaming } from './section-laptop-gaming';

describe('SectionLaptopGaming', () => {
  let component: SectionLaptopGaming;
  let fixture: ComponentFixture<SectionLaptopGaming>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionLaptopGaming],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionLaptopGaming);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
