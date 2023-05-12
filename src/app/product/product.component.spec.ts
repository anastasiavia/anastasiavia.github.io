import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductComponent } from './product.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ProductService } from '../products_service/products-service.service';
import { CartServiceService } from '../products_service/cart-service.service';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productService: ProductService;
  let cartService: CartServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      declarations: [ProductComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ iditem: '1234' }) },
        },
        ProductService,
        CartServiceService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    cartService = TestBed.inject(CartServiceService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch product details when route params change', () => {
    const getProductDetailSpy = spyOn(productService, 'getProductDetail').and.returnValue(
      of({
        id: '1234',
        name: 'Product 1',
        description: 'This is product 1',
        price: 10,
        image: 'https://example.com/image.jpg',
      })
    );

    component.ngOnInit();

    expect(getProductDetailSpy).toHaveBeenCalledWith('1234');
    expect(component.itemDetails).toEqual({
      id: '1234',
      name: 'Product 1',
      description: 'This is product 1',
      price: 10,
      image: 'https://example.com/image.jpg',
    });
  });

});
