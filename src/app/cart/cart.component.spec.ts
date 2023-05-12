import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CartServiceService } from '../products_service/cart-service.service';
import { JWTTokenServiceService } from '../products_service/jwttoken.service';
import { Router } from '@angular/router';


describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let router: Router;
  let cartService: CartServiceService;
  let jwtService: JWTTokenServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatSnackBarModule, MatTableModule ],
      declarations: [ CartComponent ],
            providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        CartServiceService,
        JWTTokenServiceService,
      ]

    })
    .compileComponents();

    // fixture = TestBed.createComponent(CartComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    cartService = TestBed.inject(CartServiceService);
    jwtService = TestBed.inject(JWTTokenServiceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the table data source with the cart items', () => {
    const cartItems = [{ ItemId: 1, Name: 'Item 1', Price: 10, Quantity: 2,Total: 20 }, { ItemId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }];
    spyOn(cartService, 'getCartItems').and.returnValue(cartItems);

    component.ngOnInit();

    expect(component.dataSource.data).toEqual(cartItems);
  });

  it('should remove an item from the cart', () => {
    const itemId = 1;
    spyOn(cartService, 'removeCartItemById');
    spyOn(cartService, 'getCartItems').and.returnValue([{ ItemId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }]);

    component.removeFromCart(itemId);

    expect(cartService.removeCartItemById).toHaveBeenCalledWith(itemId);
    expect(component.dataSource.data).toEqual([{ ItemId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }]);
  });

  it('should update the quantity of an item in the cart', () => {
    const itemId = 1;
    const event = { target: { value: 3 } };
    spyOn(cartService, 'updateCartItemById');
    spyOn(cartService, 'getCartItems').and.returnValue([{ ItemId: 1, Name: 'Item 1', Price: 10, Quantity: 3, Total: 30 }, { ItemId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }]);

    component.updateQuantity(itemId, event);

    expect(cartService.updateCartItemById).toHaveBeenCalledWith(itemId, event.target.value);
    expect(component.dataSource.data).toEqual([{ ItemId: 1, Name: 'Item 1', Price: 10, Quantity: 3, Total: 30 }, { ItemId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }]);
  });


  it('should call makeOrder method of cart service and update data source', () => {
    const cartItems = [{ ItemId: 1, Name: 'Item 1', Price: 10, Quantity: 2,Total: 20 }, { ItemId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }];
    spyOn(cartService, 'makeOrder');
    spyOn(cartService, 'getCartItems').and.returnValue(cartItems);
  
    component.makeOrder();
  
    expect(cartService.makeOrder).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(cartItems);
  });

  it('should return the correct total price of all cart items', () => {
    const cartItems = [{ ItemId: 1, Name: 'Item 1', Price: 10, Quantity: 2,Total: 20 }, { ItemId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }];
    spyOn(cartService, 'getCartItems').and.returnValue(cartItems);
  
    const totalPrice = component.getTotalPrice();
  
    expect(totalPrice).toEqual(35);
  });
  
  



  


});
