import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthServiceService } from '../products_service/auth-service.service';
import { JWTTokenServiceService } from '../products_service/jwttoken.service';
import { CartServiceService } from '../products_service/cart-service.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthServiceService;
  let tokenService: JWTTokenServiceService;
  let cartService: CartServiceService;
  let route: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatSnackBarModule, ReactiveFormsModule  ],
      declarations: [ LoginComponent ],
      providers: [
        AuthServiceService,
        JWTTokenServiceService,
        CartServiceService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(Router);
    authService = TestBed.inject(AuthServiceService);
    tokenService = TestBed.inject(JWTTokenServiceService);
    cartService = TestBed.inject(CartServiceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form and set token and navigate to home', fakeAsync(() => {
    spyOn(authService, 'login').and.returnValue(of({ token: 'test-token' }));
    spyOn(tokenService, 'setToken');
    spyOn(cartService, 'openSnackBar');
    spyOn(route, 'navigate');

    component.formData.setValue({
      username: 'test-username',
      password: 'test-password',
    });
    component.onSubmit(component.formData);

    tick();

    expect(authService.login).toHaveBeenCalledWith('test-username', 'test-password');
    expect(tokenService.setToken).toHaveBeenCalledWith('test-token');
    expect(cartService.openSnackBar).toHaveBeenCalledWith('You successfully logged in! ');
    expect(route.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should handle login error and show snackbar message', fakeAsync(() => {
    spyOn(authService, 'login').and.returnValue(throwError('error'));
    spyOn(cartService, 'openSnackBar');
    spyOn(route, 'navigate');

    component.formData.setValue({
      username: 'test-username',
      password: 'test-password',
    });
    component.onSubmit(component.formData);

    tick();

    expect(authService.login).toHaveBeenCalledWith('test-username', 'test-password');
    expect(cartService.openSnackBar).toHaveBeenCalledWith('Ooops! Try again ');
    expect(route.navigate).not.toHaveBeenCalled();
  }));
});
