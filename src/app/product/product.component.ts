import { Component, OnInit } from '@angular/core';
import {ProductService} from '../products_service/products-service.service'
import { ActivatedRoute } from '@angular/router';
import { CartServiceService } from '../products_service/cart-service.service';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  itemId: string = "";
  params: any
  itemDetails: Product | undefined;

  constructor( public _ProductService: ProductService, private route: ActivatedRoute,  private _cartServiceService: CartServiceService
){}

  ngOnInit(): void{
      this.route.params.subscribe(res => {        
          this.itemId = res['iditem'];
          if (this.itemId){
            this._ProductService.getProductDetail(this.itemId)
          .subscribe((responce: any) => {
            this.itemDetails = responce;

          })     
        }
      })
  }
  



}
