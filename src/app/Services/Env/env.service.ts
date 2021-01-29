import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EnvService {

  API_URL = 'https://guesswatapp.herokuapp.com/';
  private _SERVER: string = 'https://localhost:3000/';

  backEnd = environment.api_url;

  constructor(
    public _HTTP: HttpClient,
    private _SOCKET: Socket
  ) { }

  pollServer(): Observable<any> {
    return this._HTTP
      .get(this._SERVER);
  }
  createAreana(title: string, userId: string): void {
    this._SOCKET.connect();
    this._SOCKET.emit('create_arena', { title: title, userId: userId });
  }
}
