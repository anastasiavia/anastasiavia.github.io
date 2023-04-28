import { Component, OnInit } from '@angular/core';
import { ProductService } from '../products_service/products-service.service';

@Component({
  selector: 'app-allproducts',
  templateUrl: './allproducts.component.html',
  styleUrls: ['./allproducts.component.scss']
})
export class AllproductsComponent {
 products:any;
 constructor(private productservice: ProductService){}

 ngOnInit(){
  this.productservice.getAll().subscribe(res =>{
    this.products = res;
  })
 }

}
