import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule,  HttpTestingController  } from '@angular/common/http/testing';
import { CartServiceService, Cart } from './cart-service.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { JWTTokenServiceService } from './jwttoken.service';
import { AuthServiceService } from './auth-service.service';
import { RouterTestingModule } from '@angular/router/testing';


describe('CartServiceService', () => {
  let service: CartServiceService;
  let jwtTokenService: JWTTokenServiceService;
  let restClientService: AuthServiceService;
  let httpMock: HttpTestingController;



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule,  RouterTestingModule,],
      providers: [CartServiceService, JWTTokenServiceService, AuthServiceService]
    });
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

  // it('should add an item to the cart', async () => {
  //   const itemId = 1;
  //   const quantity = 2;
  //   const mockItem = { name: 'Test Item', price: 10 };
  //   spyOn(service['_restClientServiceService'], 'getItemDetails').and.returnValue(
  //     of(mockItem)
  //   );
  //   spyOn(service, 'openSnackBar');
  //   const result = await service.addToCart(itemId, quantity);
  //   expect(service.cartItems.length).toBe(1);
  //   expect(service.cartItems[0]).toEqual({
  //     ItemId: itemId,
  //     Name: mockItem.name,
  //     Price: mockItem.price,
  //     Quantity: quantity,
  //     Total: mockItem.price * quantity,
  //   } as Cart);
  //   expect(localStorage.getItem('cartItems')).toBe(JSON.stringify(service.cartItems));
  //   expect(service.openSnackBar).toHaveBeenCalledWith('Item successfully added to cart!');
  //   expect(result).toEqual(service.cartItems);
  // });
  
  // it('should not add an item to the cart if it already exists', async () => {
  //   const itemId = 1;
  //   const quantity = 2;
  //   const existingItem = {
  //     ItemId: itemId,
  //     Name: 'Test Item',
  //     Price: 10,
  //     Quantity: 2,
  //     Total: 20,
  //   } as Cart;
  //   spyOn(service, 'getCartItems').and.returnValue([existingItem]);
  //   spyOn(service['_restClientServiceService'], 'getItemDetails');
  //   spyOn(service, 'openSnackBar');
  //   const result = await service.addToCart(itemId, quantity);
  //   expect(service.cartItems.length).toBe(1);
  //   expect(service.cartItems[0]).toEqual(existingItem);
  //   expect(localStorage.getItem('cartItems')).toBe(JSON.stringify(service.cartItems));
  //   expect(service.openSnackBar).toHaveBeenCalledWith('Element already in cart!');
  //   expect(result).toEqual(service.cartItems);
  // });
  
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


  // afterEach(() => {
  //   httpMock.verify();
  // });

  // it('should make an order', async () => {
  //   // Mock JWTTokenService
  //   spyOn(service['_JWTTokenServiceService'], 'getAccessToken').and.returnValue('access_token');
  //   spyOn(service['_JWTTokenServiceService'], 'getUserId').and.returnValue('user_id');

  //   // Mock getCartItems()
  //   spyOn(service, 'getCartItems').and.returnValue([
  //     { ItemId: 1, Name: 'Item 1', Price: 10, Quantity: 2, Total: 20 },
  //     { ItemId: 2, Name: 'Item 2', Price: 20, Quantity: 1, Total: 20 }
  //   ]);

  //   // Mock makeOrder() API endpoint
  //   const requestBody = {
  //     idUser: 'user_id',
  //     idStatus: 4,
  //     items: [
  //       { idItem: 1, quantity: 2 },
  //       { idItem: 2, quantity: 1 }
  //     ]
  //   };
  //   const expectedResponse = { orderId: 123 };
  //   const req = httpMock.expectOne('https://example.com/api/make-order');
  //   expect(req.request.method).toBe('POST');
  //   expect(req.request.headers.get('Content-Type')).toBe('application/json');
  //   expect(req.request.headers.get('Authorization')).toBe('Bearer access_token');
  //   req.flush(expectedResponse);

  //   // Call makeOrder() and verify the response
  //   const response = await service.makeOrder();
  //   expect(response).toEqual(expectedResponse);
  //   expect(service['cartItems']).toEqual([]);
  //   expect(service['_snackBar'].open).toHaveBeenCalledWith('Your order has been successfully placed', 'OK', { duration: 3000 });
  //   expect(service['route'].navigate).toHaveBeenCalledWith(['/store/inventory']);
  // });

  // it('should reject the order if user is not logged in', async () => {
  //   // Mock getAccessToken() to return an empty string
  //   spyOn(service['_JWTTokenServiceService'], 'getAccessToken').and.returnValue('');
  //   // Mock getUserId() to return undefined
  //   spyOn(service['_JWTTokenServiceService'], 'getUserId').and.returnValue(undefined);
  
  //   // Call makeOrder() and verify the rejection
  //   try {
  //     await service.makeOrder();
  //   } catch (error) {
  //     expect(error).toBe('You must be logged in to make an order!');
  //     expect(service['_snackBar'].open).toHaveBeenCalledWith('You must be logged in to make an order!', 'OK', { duration: 3000 });
  //     expect(service['route'].navigate).not.toHaveBeenCalled();
  //   }
  // });
  

  
  
  
  

});
