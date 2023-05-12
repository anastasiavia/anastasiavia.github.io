import { TestBed } from '@angular/core/testing';
import { AuthServiceService } from './auth-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthServiceService', () => {
  let service: AuthServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthServiceService]
    });
    service = TestBed.inject(AuthServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should make a login request', () => {
    const username = 'testuser';
    const password = 'testpassword';
    const expectedResponse = { token: 'testtoken' };

    service.login(username, password).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne('http://127.0.0.1:4200/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username, password });
    req.flush(expectedResponse);
  });

  it('should make a register request', () => {
    const user = { username: 'testuser', password: 'testpassword' };
    const expectedResponse = { message: 'User registered successfully' };

    service.register(user).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne('http://127.0.0.1:4200/user');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush(expectedResponse);
  });

  it('should make an item details request', () => {
    const iditem = 123;
    const expectedResponse = { itemId: 123, name: 'Test Item', price: 10.99 };

    service.getItemDetails(iditem).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne('http://127.0.0.1:4200/item/123');
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should make a make order request', () => {
    const body = { idUser: 'testuser', idStatus: 4, items: [{ idItem: 123, quantity: 2 }] };
    const headers = { Authorization: 'Bearer testtoken' };
    const expectedResponse = { orderId: 456 };

    service.makeOrder(body, headers).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne('http://127.0.0.1:4200/store/order');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    expect(req.request.headers.get('Authorization')).toBe('Bearer testtoken');
    req.flush(expectedResponse);
  });
});

