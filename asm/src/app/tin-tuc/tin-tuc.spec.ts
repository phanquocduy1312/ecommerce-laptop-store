import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinTuc } from './tin-tuc';

describe('TinTuc', () => {
  let component: TinTuc;
  let fixture: ComponentFixture<TinTuc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TinTuc],
    }).compileComponents();

    fixture = TestBed.createComponent(TinTuc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
