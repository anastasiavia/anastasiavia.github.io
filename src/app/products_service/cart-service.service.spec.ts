import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule,  HttpTestingController  } from '@angular/common/http/testing';
import { CartServiceService, Cart } from './cart-service.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { JWTTokenServiceService } from './jwttoken.service';
import { AuthServiceService } from './auth-service.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '../products_service/products-service.service';


describe('CartServiceService', () => {
  let service: CartServiceService;
  let jwtTokenService: JWTTokenServiceService;
  let restClientService: AuthServiceService;
  let httpMock: HttpTestingController;
  let productService: ProductService;



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule,  RouterTestingModule,],
      providers: [CartServiceService, JWTTokenServiceService, AuthServiceService, ProductService]
    });
    service = TestBed.inject(CartServiceService);
    productService = TestBed.inject(ProductService);
    restClientService = jasmine.createSpyObj('RestClientServiceService', ['getItemDetails']);
    service = TestBed.inject(CartServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty cart if Local Storage is empty', () =>{
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const result = service.getCartItems();
    expect(result).toEqual([]);
  });

  it('should return existing cart items', async () =>{
    const cartItems = [
      { ItemId: 1, Name: 'Item 1', Price: 10, Quantity: 2, Total: 20 } as Cart,
      { ItemId: 2, Name: 'Item 2', Price: 20, Quantity: 1, Total: 20 } as Cart,
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(cartItems));
    const result = service.getCartItems();
    expect(result).toEqual(cartItems);
  });


  it('should remove an item from the cart', () => {
    const itemId = 1;
    service.cartItems = [
      { ItemId: itemId, Name: 'Item 1', Price: 10, Quantity: 2, Total: 20 } as Cart,
      { ItemId: 2, Name: 'Item 2', Price: 20, Quantity: 1, Total: 20 } as Cart,
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(service.cartItems));
    spyOn(localStorage, 'setItem');
    service.removeCartItemById(itemId);
    expect(service.cartItems.length).toBe(1);
    expect(service.cartItems[0]).toEqual({
      ItemId: 2,
      Name: 'Item 2',
      Price: 20,
      Quantity: 1,
      Total: 20,
    } as Cart);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cartItems',
      JSON.stringify(service.cartItems)
    );
  });

  
  
  it('should handle an error when getting item details', async () => {
    const itemId = 1;
    const quantity = 2;
    const errorMessage = 'Error getting item details';
    spyOn(service['_restClientServiceService'], 'getItemDetails').and.returnValue(
      throwError({ error: errorMessage })
    );
    spyOn(service, 'openSnackBar');
    try {
      await service.addToCart(itemId, quantity);
    } catch (error) {
      expect(service.cartItems.length).toBe(0);
      expect(localStorage.getItem('cartItems')).toBeNull();
      expect(service.openSnackBar).toHaveBeenCalledWith('Error: ' + errorMessage);
      expect(error).toEqual({ error: errorMessage });
    }
  });

  it('should clean the cart', () => {
    spyOn(localStorage, 'removeItem');
    service.cartItems = [{ ItemId: 1, Name: 'Test Item', Price: 10, Quantity: 1, Total: 10 }];
    service.cleanCart();
    expect(service.cartItems.length).toBe(0);
    expect(localStorage.removeItem).toHaveBeenCalledWith('cartItems');
  });

  it('should update the quantity and total of a cart item', () => {
    const itemId = 1;
    const initialQuantity = 2;
    const updatedQuantity = 3;
    const mockCartItem = {
      ItemId: itemId,
      Name: 'Test Item',
      Price: 10,
      Quantity: initialQuantity,
      Total: initialQuantity * 10
    } as Cart;
    spyOn(service, 'getCartItems').and.returnValue([mockCartItem]);
    spyOn(localStorage, 'setItem');
    
    service.updateCartItemById(itemId, updatedQuantity);
  
    expect(mockCartItem.Quantity).toBe(updatedQuantity);
    expect(mockCartItem.Total).toBe(updatedQuantity * 10);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', JSON.stringify([mockCartItem]));
  });
  
  it('should not update a cart item if it is not found', () => {
    const itemId = 1;
    const updatedQuantity = 3;
    spyOn(service, 'getCartItems').and.returnValue([]);
    spyOn(localStorage, 'setItem');
  
    const result = service.updateCartItemById(itemId, updatedQuantity);
  
    expect(result).toBeUndefined();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should add an item to the cart', async () => {
    const itemId = 1;
    const quantity = 2;
    const itemDetails = { name: 'Item 1', price: 10 };
    const expectedCartItem = {
      ItemId: itemId,
      Name: 'Item 1',
      Price: 10,
      Quantity: quantity,
      Total: 20
    } as Cart;
  
    spyOn(service['_restClientServiceService'], 'getItemDetails').and.returnValue(
      of(itemDetails)
    );
    spyOn(service, 'openSnackBar');
    spyOn(localStorage, 'setItem');
  
    const result = await service.addToCart(itemId, quantity);
  
    expect(service.cartItems.length).toBe(1);
    expect(service.cartItems[0]).toEqual(expectedCartItem);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cartItems',
      JSON.stringify(service.cartItems)
    );
    expect(service.openSnackBar).toHaveBeenCalledWith('Item successfully added to cart!');
    expect(result).toEqual(service.cartItems);
  });

  it('should handle an error when the user is not logged in to make an order', async () => {
    spyOn(service['_JWTTokenServiceService'], 'getAccessToken').and.returnValue('');
    spyOn(service, 'openSnackBar');
    spyOn(service['route'], 'navigate');
  
    try {
      await service.makeOrder();
    } catch (error) {
      expect(service.openSnackBar).toHaveBeenCalledWith('You must be logged in to make an order!');
      expect(service['route'].navigate).not.toHaveBeenCalled();
      expect(error).toEqual('You must be logged in to make an order!');
    }
  });
  it('should handle an error when making an order', async () => {
    spyOn(service['_JWTTokenServiceService'], 'getAccessToken').and.returnValue('access_token');
    spyOn(service['_JWTTokenServiceService'], 'getUserId').and.returnValue('user_id');
    spyOn(service, 'getCartItems').and.returnValue([
      { ItemId: 1, Name: 'Item 1', Price: 10, Quantity: 2, Total: 20 } as Cart
    ]);
    spyOn(service['_restClientServiceService'], 'makeOrder').and.returnValue(
      throwError({ error: 'Error making an order' })
    );
    spyOn(service, 'openSnackBar');
    spyOn(service, 'cleanCart');
    spyOn(service['route'], 'navigate');
  
    try {
      await service.makeOrder();
      expect(service.openSnackBar).toHaveBeenCalledWith('Error: Error making an order');
      expect(service.cleanCart).toHaveBeenCalled();
      expect(service['route'].navigate).toHaveBeenCalledWith(['/store/inventory']);
    } catch (error) {
      expect(error).toEqual({ error: 'Error making an order' });
    }
  });
  
  
  
  
});
