import { Injectable } from '@angular/core';
import { Hero } from "./hero";
import { HEROES } from "./mock-heroes";
import { from, Observable, of } from "rxjs";
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HeroService {
    private heroesUrl = "api/heroes";
    private httpOptions = {
        headers: new HttpHeaders({"Contant-Type": "application/json"})
    };
    constructor( private http: HttpClient,
        private messageService: MessageService) { }

    private handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            console.log(error);
            this.log(`${operation} faild ${error.message}`);
            return of(result as T);
        }
    }
    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl).pipe(
            tap(_ => this.log("fetch heroes")),
            catchError(this.handleError<Hero[]>('getHeroes', []))
          );
    }
    getHero(id: number): Observable<Hero | undefined> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url).pipe(
            tap(_ => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }
    private log(message: string) {
        this.messageService.addMessage(`HeroService: ${message}`);
    }
    updateHero(hero: Hero): Observable<any> {
        return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
            tap(_ => this.log(`update hero id=${hero.id}`)),
            catchError(this.handleError<Hero[]>("updateHero"))
        );
    }
    addHero(hero: Hero) {
        return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
            tap((newHero: Hero) => this.log(`add hero w/ id=${newHero.id}`)),
            catchError(this.handleError<Hero>("addHero"))
        )
    }
    deleteHero(hero: Hero | number): Observable<Hero> {
        const id = typeof hero == "number" ? hero : hero.id;
        const url = `${this.heroesUrl}/${id}`;
        return this.http.delete<Hero>(url, this.httpOptions).pipe(
            tap(_ => this.log(`delete hero id=${id}`)),
            catchError(this.handleError<Hero>("deleteHero"))
        );
    }
    searchHeroes(term: string): Observable<Hero[]> {
        if(!term.trim()) return of([]);
        else {
            return this.http.get<Hero []>(`${this.heroesUrl}/?name=${term}`).pipe(
                tap(x => x.length ? this.log(`found heroes match ${term}`) : this.log(`no heroes match ${term}`)),
                catchError(this.handleError<Hero []>("searchHeroes", []))
            )
        }
    }
}
