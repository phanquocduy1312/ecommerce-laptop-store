import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LienHe } from './lien-he';

describe('LienHe', () => {
  let component: LienHe;
  let fixture: ComponentFixture<LienHe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LienHe],
    }).compileComponents();

    fixture = TestBed.createComponent(LienHe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
