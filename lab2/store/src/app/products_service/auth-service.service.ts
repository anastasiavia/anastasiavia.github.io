import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(private http: HttpClient) { }
  private baseUrl = 'http://127.0.0.1:4200';

  login(username: string, password: string) {
    return this.http.post(this.baseUrl + '/login', { username, password })

    // this.http.post<any>(`http://localhost:4200/login`, { username, password }).subscribe(response => {
    //   if (response && response.token) {
    //     localStorage.setItem('token', response.token);
    //     // redirect to main page
    //   }
    // }, error => {
    //   console.error(error);
    //   // handle error
    // });
  }
  createUser(user: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(`${this.baseUrl}/user`, user, httpOptions);
  }
  

}
