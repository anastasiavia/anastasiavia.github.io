import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private http: HttpClient) { }
  baseUrl = 'http://127.0.0.1:4200'

  getAll() {
    return this.http.get('http://127.0.0.1:4200/store/inventory');
  }

  getProductDetail(itemId: string){
    return this.http.get(this.baseUrl + '/item/' + itemId);

  }
}

