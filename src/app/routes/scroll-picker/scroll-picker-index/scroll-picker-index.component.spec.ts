import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollPickerIndexComponent } from './scroll-picker-index.component';

describe('ScrollPickerIndexComponent', () => {
  let component: ScrollPickerIndexComponent;
  let fixture: ComponentFixture<ScrollPickerIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollPickerIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollPickerIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
