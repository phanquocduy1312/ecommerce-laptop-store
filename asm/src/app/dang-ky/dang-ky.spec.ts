import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DangKy } from './dang-ky';

describe('DangKy', () => {
  let component: DangKy;
  let fixture: ComponentFixture<DangKy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DangKy],
    }).compileComponents();

    fixture = TestBed.createComponent(DangKy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
