import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnularFrequencySpectrumComponent } from './annular-frequency-spectrum.component';

describe('AnnularFrequencySpectrumComponent', () => {
  let component: AnnularFrequencySpectrumComponent;
  let fixture: ComponentFixture<AnnularFrequencySpectrumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnularFrequencySpectrumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnularFrequencySpectrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
