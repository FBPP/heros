import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalClockIndexComponent } from './digital-clock-index.component';

describe('DigitalClockIndexComponent', () => {
  let component: DigitalClockIndexComponent;
  let fixture: ComponentFixture<DigitalClockIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalClockIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalClockIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
