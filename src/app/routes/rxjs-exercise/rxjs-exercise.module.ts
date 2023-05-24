import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RxjsExerciseRoutingModule } from './rxjs-exercise-routing.module';
import { RxjsExerciseIndexComponent } from './rxjs-exercise-index/rxjs-exercise-index.component';


@NgModule({
  declarations: [
    RxjsExerciseIndexComponent
  ],
  imports: [
    CommonModule,
    RxjsExerciseRoutingModule
  ]
})
export class RxjsExerciseModule { }
