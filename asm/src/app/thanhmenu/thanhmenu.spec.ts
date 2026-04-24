import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thanhmenu } from './thanhmenu';

describe('Thanhmenu', () => {
  let component: Thanhmenu;
  let fixture: ComponentFixture<Thanhmenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Thanhmenu],
    }).compileComponents();

    fixture = TestBed.createComponent(Thanhmenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
