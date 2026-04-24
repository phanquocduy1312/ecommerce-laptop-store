import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DangNhap } from './dang-nhap';

describe('DangNhap', () => {
  let component: DangNhap;
  let fixture: ComponentFixture<DangNhap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DangNhap],
    }).compileComponents();

    fixture = TestBed.createComponent(DangNhap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
