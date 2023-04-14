import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { HeroesComponent } from "./heroes/heroes.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HeroDetailComponent } from "./hero-detail/hero-detail.component";

const routes: Routes = [
    { path: "heroes", component: HeroesComponent },
    { path: "dashboard", component: DashboardComponent },
    { path: 'detail/:id', component: HeroDetailComponent },
    { path: "webgl", loadChildren: () => import("./routes/webgl/webgl.module").then(m => m.WebglModule)},
    { path: 'digital-clock-index', loadChildren: () => import("./routes/digital-clock/digital-clock.module").then(m => m.DigitalClockModule) },
    { path: '', redirectTo: "digital-clock-index", pathMatch: 'full' },
    
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
