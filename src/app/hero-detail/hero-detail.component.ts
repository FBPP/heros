import { Component, OnInit, Input } from '@angular/core';
import { Hero } from "../hero";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { HeroService } from "../hero.service";

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
    @Input() hero!: Hero | undefined
    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private heroService: HeroService
    ) { }

    ngOnInit(): void {
        this.getHero();
    }
    getHero() {
        const t = this.route.snapshot.paramMap.get("id");
        if(t == null) return;
        const id = +t;
        this.heroService.getHero(id).subscribe(hero => this.hero = hero);
    }
    goBack(): void {
        this.location.back();
    }
    save(): void {
        if(typeof this.hero == "undefined") return;
        this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
    }
}
