import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsExerciseIndexComponent } from './rxjs-exercise-index.component';

describe('RxjsExerciseIndexComponent', () => {
  let component: RxjsExerciseIndexComponent;
  let fixture: ComponentFixture<RxjsExerciseIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RxjsExerciseIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RxjsExerciseIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
