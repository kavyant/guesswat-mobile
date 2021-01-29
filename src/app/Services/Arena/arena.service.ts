import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observer } from 'rxjs';
import { EnvService } from '../Env/env.service';

@Injectable({
  providedIn: 'root'
})
export class ArenaService {
  observer: Observer<any>;

  constructor(
    private http: HttpClient,
    private envservice: EnvService
  ) { }

  getArena(arenaTitle) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(`${this.envservice.backEnd}api/arena/findbytitle`, { title: arenaTitle }, {
      headers
    }).pipe(map(arena => {
      return arena;
    }));
  }


  createArena(arenaTitle, userId) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(`${this.envservice.backEnd}api/arena/create`, { title: arenaTitle, owner: userId }, {
      headers
    }).pipe(map(arena => {
      return arena;
    }));
  }
}