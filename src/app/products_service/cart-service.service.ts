import { Injectable } from '@angular/core';
import { JWTTokenServiceService } from './jwttoken.service';
import { AuthServiceService } from './auth-service.service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

export interface Cart {
  ItemId: number;
  Name: string;
  Price: number;
  Quantity: number;
  Total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  cartItems: Cart[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    protected _restClientServiceService: AuthServiceService,
    protected _JWTTokenServiceService: JWTTokenServiceService,
    protected route: Router,
    protected _snackBar: MatSnackBar
  ) { }

  getCartItems(): Cart[] {
    const cartItemsJson = localStorage.getItem("cartItems");
    if (cartItemsJson) {
      return JSON.parse(cartItemsJson);
    } else {
      return [];
    }
  }

  async addToCart(itemId: number, quantity: number): Promise<any[]> {
    this.cartItems = this.getCartItems();
    let cartItem = this.cartItems?.find((item: any) => item.ItemId === itemId);
    if (cartItem) {
      this.openSnackBar("Element already in cart!");
      return Promise.resolve(this.cartItems);
    } else {
      return this._restClientServiceService.getItemDetails(itemId)
        .toPromise()
        .then((response: any) => { 
          cartItem = {
            ItemId: itemId,
            Name: response.name,
            Price: response.price,
            Quantity: quantity,
            Total: response.price * quantity
          } as Cart;
          this.cartItems.push(cartItem);
          localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
          this.openSnackBar("Item successfully added to cart!");
          return this.cartItems;
        })
        .catch((error: any) => {
          this.openSnackBar("Error: " + error.error);
          return Promise.reject(error);
        });
    }
  }
  removeCartItemById(itemId: number) {
    this.cartItems = this.getCartItems();
    const index = this.cartItems.findIndex((item: any) => item.ItemId == itemId);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
    }
  }

  updateCartItemById(itemId: number, quantity: number) {
    this.cartItems = this.getCartItems();
    let cartItem = this.cartItems.find((item: any) => item.ItemId === itemId);
    if (cartItem) {
      cartItem.Quantity = quantity;
      cartItem.Total = cartItem.Quantity * cartItem.Price;
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      return Promise.resolve(this.cartItems);
    }
    return;
  }


  cleanCart() {
    this.cartItems = [];
    localStorage.removeItem("cartItems");
  }
  


  async makeOrder() {
    const access_token = this._JWTTokenServiceService.getAccessToken();
    if (access_token != "" && access_token != undefined) {
      this.cartItems = this.getCartItems();
      const userId = this._JWTTokenServiceService.getUserId();
      const items = this.cartItems.map(item => {
        return {
          idItem: item.ItemId,
          quantity: item.Quantity
        }
      });

      const requestBody = {
        idUser: userId,
        idStatus: 4,
        items: items
      };

      let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      };

      return await this._restClientServiceService.makeOrder(requestBody, headers)
        .toPromise()
        .then((response: any) => {
          this.openSnackBar("Your order has been successfully placed");
          this.cleanCart();
          this.route.navigate(['/store/inventory'])
          return Promise.resolve(response);
        })
        .catch((error: any) => {
          this.openSnackBar("Error: " + error.error);
          return Promise.reject(error);
        });
    }
      this.openSnackBar("You must be logged in to make an order!");
      return Promise.reject("You must be logged in to make an order!");
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 4200,
    });
  }
}


