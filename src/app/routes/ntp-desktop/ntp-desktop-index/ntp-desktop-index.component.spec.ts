import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NtpDesktopIndexComponent } from './ntp-desktop-index.component';

describe('NtpDesktopIndexComponent', () => {
  let component: NtpDesktopIndexComponent;
  let fixture: ComponentFixture<NtpDesktopIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NtpDesktopIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NtpDesktopIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
