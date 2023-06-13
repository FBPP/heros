import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlComponent } from './gl.component';

describe('GlComponent', () => {
  let component: GlComponent;
  let fixture: ComponentFixture<GlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
