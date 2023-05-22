import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignupComponent } from './signup.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { CartServiceService } from '../products_service/cart-service.service';
import { JWTTokenServiceService } from '../products_service/jwttoken.service';
import { AuthServiceService } from '../products_service/auth-service.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let _cartServiceService: CartServiceService;
  let _JWTTokenServiceService: JWTTokenServiceService;
  let _restClientServiceService: AuthServiceService;
  let route: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule, ReactiveFormsModule],
      declarations: [SignupComponent],
      providers: [
        AuthServiceService,
        JWTTokenServiceService,
        CartServiceService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    _cartServiceService = TestBed.inject(CartServiceService);
    _JWTTokenServiceService = TestBed.inject(JWTTokenServiceService);
    _restClientServiceService = TestBed.inject(AuthServiceService);
    route = TestBed.inject(Router);
    spyOn(_cartServiceService, 'openSnackBar');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the form invalid when empty fields are submitted', () => {
    const form = component.formData;
    form.controls.username.setValue('');
    form.controls.firstname.setValue('');
    form.controls.lastname.setValue('');
    form.controls.email.setValue('');
    form.controls.password.setValue('');
    form.controls.phone.setValue('');

    expect(form.valid).toBeFalsy();
  });

  it('should call openSnackBar() method when form is submitted with empty fields', () => {
    // spyOn(_cartServiceService, 'openSnackBar');
    const form = component.formData;
    form.controls.username.setValue('');
    form.controls.firstname.setValue('');
    form.controls.lastname.setValue('');
    form.controls.email.setValue('');
    form.controls.password.setValue('');
    form.controls.phone.setValue('');

    component.onSubmit(form);

    expect(_cartServiceService.openSnackBar).toHaveBeenCalledWith('Please fill all fields!');
  });

  it('should mark the form valid when all fields are filled in correctly', () => {
    const form = component.formData;
    form.controls.username.setValue('johndoe');
    form.controls.firstname.setValue('John');
    form.controls.lastname.setValue('Doe');
    form.controls.email.setValue('johndoe@example.com');
    form.controls.password.setValue('password123');
    form.controls.phone.setValue('1234567890');
  
    expect(form.valid).toBeTruthy();
  });

  it('should call the register method with the correct user data when the form is submitted with valid data', fakeAsync(() => {
    const form = component.formData;
    form.controls.username.setValue('johndoe');
    form.controls.firstname.setValue('John');
    form.controls.lastname.setValue('Doe');
    form.controls.email.setValue('johndoe@example.com');
    form.controls.password.setValue('password123');
    form.controls.phone.setValue('1234567890');
  
    spyOn(_restClientServiceService, 'register').and.returnValue(of({ token: 'some_token' }));
  
    component.onSubmit(form);
    tick();
  
    expect(_restClientServiceService.register).toHaveBeenCalledWith({
      username: 'johndoe',
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: '1234567890'
    });
  }));
  it('should call the setToken method with the token returned by the register method when the form is submitted with valid data', async () => {
    const form = component.formData;
    form.controls.username.setValue('johndoe');
    form.controls.firstname.setValue('John');
    form.controls.lastname.setValue('Doe');
    form.controls.email.setValue('johndoe@example.com');
    form.controls.password.setValue('password123');
    form.controls.phone.setValue('1234567890');
  
    const token = 'some_token';
    spyOn(_restClientServiceService, 'register').and.returnValue(of({ token }));
    spyOn(_JWTTokenServiceService, 'setToken');
  
    await component.onSubmit(form);
  
    expect(_JWTTokenServiceService.setToken).toHaveBeenCalledWith(token);
  });

  it('should call openSnackBar() method with the correct error message when registration fails', fakeAsync(() => {
    const form = component.formData;
    form.controls.username.setValue('johndoe');
    form.controls.firstname.setValue('John');
    form.controls.lastname.setValue('Doe');
    form.controls.email.setValue('johndoe@example.com');
    form.controls.password.setValue('password123');
    form.controls.phone.setValue('1234567890');

    const errorMessage = 'Error registering user';
    spyOn(_restClientServiceService, 'register').and.returnValue(throwError({ error: errorMessage }));

    component.onSubmit(form);
    tick();

    expect(_cartServiceService.openSnackBar).toHaveBeenCalledWith(`Error: ${errorMessage}`);
  }));


  it('should navigate to the home page after successful registration', fakeAsync(() => {
    const form = component.formData;
    form.controls.username.setValue('johndoe');
    form.controls.firstname.setValue('John');
    form.controls.lastname.setValue('Doe');
    form.controls.email.setValue('johndoe@example.com');
    form.controls.password.setValue('password123');
    form.controls.phone.setValue('1234567890');

    const token = 'some_token';
    spyOn(_restClientServiceService, 'register').and.returnValue(of({ token }));
    spyOn(_JWTTokenServiceService, 'setToken');

    component.onSubmit(form);
    tick();

    expect(route.navigate).toHaveBeenCalledWith(['/']);
  }));

});

   
