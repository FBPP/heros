import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordImgComponent } from './record-img.component';

describe('RecordImgComponent', () => {
  let component: RecordImgComponent;
  let fixture: ComponentFixture<RecordImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
