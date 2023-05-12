import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AllproductsComponent } from './allproducts.component';
import { ProductService } from '../products_service/products-service.service';
import { CartServiceService } from '../products_service/cart-service.service';
import { of } from 'rxjs';

describe('AllproductsComponent', () => {
  let component: AllproductsComponent;
  let fixture: ComponentFixture<AllproductsComponent>;
  let productService: ProductService;
  let cartService: CartServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatSnackBarModule ],
      declarations: [ AllproductsComponent ],
      providers: [ProductService, CartServiceService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllproductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    cartService = TestBed.inject(CartServiceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on initialization', () => {
    const mockProducts = [{ ItemId: 1, Name: 'Product 1' }, { ItemId: 2, Name: 'Product 2' }];
    spyOn(productService, 'getAll').and.returnValue(of(mockProducts));
  
    component.ngOnInit();
  
    expect(productService.getAll).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });
  
  
});
