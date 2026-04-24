import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sp } from './sp';

describe('Sp', () => {
  let component: Sp;
  let fixture: ComponentFixture<Sp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sp],
    }).compileComponents();

    fixture = TestBed.createComponent(Sp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
