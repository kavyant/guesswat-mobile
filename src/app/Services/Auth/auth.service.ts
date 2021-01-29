// import { Injectable } from '@angular/core';
// import { HttpHeaders, HttpClient } from '@angular/common/http';
// import { map } from 'rxjs/operators';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { EnvService } from '../Env/env.service';
// import { User } from 'src/app/Models';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private currentUserSubject: BehaviorSubject<User>;
//   public currentUser: Observable<User>;
//   isLoggedIn = false;

//   constructor(
//     private http: HttpClient,
//     private envservice: EnvService
//   ) {
//     this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
//     this.currentUser = this.currentUserSubject.asObservable();

//   }

//   public get currentUserValue(): User {
//     return this.currentUserSubject.value;
//   }

//   login(email, password) {
//     //console.log(config.baseUrl);
//     let headers = new HttpHeaders();
//     headers = headers.set('Content-Type', 'application/json; charset=utf-8');
//     return this.http.post<any>(`${this.envservice.API_URL}auth/login`, { email, password }, {
//       headers
//     })
//       .pipe(map(user => {
//         // store user details and jwt token in local storage to keep user logged in between page refreshes
//         localStorage.setItem('currentUser', JSON.stringify(user));
//         this.currentUserSubject.next(user);
//         return user;

//       }));

//   }

//   signup(firstname, lastname, email, password) {
//     let headers = new HttpHeaders();
//     headers = headers.set('Content-Type', 'application/json; charset=utf-8');
//     return this.http.post<any>(`${this.envservice.API_URL}auth/register`, { firstname, lastname, email, password }, {
//       headers
//     })
//       .pipe(map(user => {
//         return user;

//       }));

//   }

//   logout() {
//     // remove user from local storage and set current user to null
//     localStorage.removeItem('currentUser');
//     this.currentUserSubject.next(null);
//   }

// }
