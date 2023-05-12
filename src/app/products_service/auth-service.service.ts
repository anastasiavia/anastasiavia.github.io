import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {
  constructor(private http: HttpClient) { }
  baseUrl = 'http://127.0.0.1:4200';

  login(username: string, password: string) {
    return this.http.post(this.baseUrl + '/login', { username, password });
  }

  register(user: any) {
    return this.http.post(this.baseUrl + '/user', user);
  }

  getItemDetails(iditem: any) {
    return this.http.get(this.baseUrl + '/item/' + iditem.toString());
  }

  makeOrder(body: any, headers: any) {
    return this.http.post(this.baseUrl + '/store/order', body, { headers: headers });
  }
}
