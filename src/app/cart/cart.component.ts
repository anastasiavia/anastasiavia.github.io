import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthServiceService } from '../products_service/auth-service.service';
import { JWTTokenServiceService } from '../products_service/jwttoken.service';
import { Router } from '@angular/router';
import { CartServiceService } from '../products_service/cart-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'price', 'quantity', 'total', 'remove'];
  totalCost: number = 0
  items: any = this._cartServiceService.getCartItems()

  constructor(
    protected restClientServiceService: AuthServiceService,
    protected _JWTTokenServiceService: JWTTokenServiceService,
    protected route: Router,
    protected _cartServiceService: CartServiceService,
  ) { }

  ngOnInit(): void {
    this.dataSource.data = this._cartServiceService.getCartItems();
    
  }

  removeFromCart(itemId: number) {
    this._cartServiceService.removeCartItemById(itemId);
    this.dataSource.data = this._cartServiceService.getCartItems();
  }

  updateQuantity(ItemId: any, event: any) {
    this._cartServiceService.updateCartItemById(ItemId, event.target.value);
    this.dataSource.data = this._cartServiceService.getCartItems();
  }

  makeOrder() {
    this._cartServiceService.makeOrder();
    this._cartServiceService.cleanCart();
    this.dataSource.data = this._cartServiceService.getCartItems();
  } 
  getTotalPrice(): number {
    let totalPrice = 0;
    const cartItems = this._cartServiceService.getCartItems();

    for (const item of cartItems) {
      totalPrice += item.Total;
    }

    return totalPrice;
  }

}
