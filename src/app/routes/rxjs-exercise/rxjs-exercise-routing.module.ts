import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RxjsExerciseIndexComponent } from './rxjs-exercise-index/rxjs-exercise-index.component';

const routes: Routes = [
  {
    path: '',
    component: RxjsExerciseIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RxjsExerciseRoutingModule { }
