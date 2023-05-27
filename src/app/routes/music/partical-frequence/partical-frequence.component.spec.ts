import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticalFrequenceComponent } from './partical-frequence.component';

describe('ParticalFrequenceComponent', () => {
  let component: ParticalFrequenceComponent;
  let fixture: ComponentFixture<ParticalFrequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticalFrequenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticalFrequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
