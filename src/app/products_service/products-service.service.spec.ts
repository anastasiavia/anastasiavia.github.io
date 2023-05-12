import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './products-service.service';

describe('ProductsServiceService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request to retrieve inventory items', () => {
    const mockResponse = [
      { id: 1, name: 'Item 1', price: 10 },
      { id: 2, name: 'Item 2', price: 20 }
    ];

    service.getAll().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://127.0.0.1:4200/store/inventory');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  
  it('should retrieve product details by item ID', () => {
    const itemId = '123';
    const mockProduct = { id: itemId, name: 'Product 1', price: 10 };

    service.getProductDetail(itemId).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`http://127.0.0.1:4200/item/${itemId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

});
