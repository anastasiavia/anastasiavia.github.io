import { Component, OnInit } from '@angular/core';
import { ProductService } from '../products_service/products-service.service';
import { CartServiceService } from '../products_service/cart-service.service';

@Component({
  selector: 'app-allproducts',
  templateUrl: './allproducts.component.html',
  styleUrls: ['./allproducts.component.scss']
})
export class AllproductsComponent {
 products:any;
 constructor(private productservice: ProductService, private _cartServiceService: CartServiceService){}

 ngOnInit(){
  this.productservice.getAll().subscribe(res =>{
    this.products = res;
  })
 }
 addToCartFromShop(itemId: number): void {
  this._cartServiceService.addToCart(itemId, 1);
}

}
