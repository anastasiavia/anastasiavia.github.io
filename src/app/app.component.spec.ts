import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JWTTokenServiceService } from './products_service/jwttoken.service';
import { BehaviorSubject } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let jwtTokenService: JWTTokenServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        JWTTokenServiceService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    jwtTokenService = TestBed.inject(JWTTokenServiceService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'store'`, () => {
    expect(component.title).toEqual('store');
  });


  it('should call logout method', () => {
    spyOn(jwtTokenService, 'logout');
    component.logout();
    expect(jwtTokenService.logout).toHaveBeenCalled();
  });
  // it('should update isLoggedIn$ BehaviorSubject with true', fakeAsync(() => {
  //   // Spy on the setTimeout function
  //   const setTimeoutSpy = spyOn(window, 'setTimeout');
  
  //   // Set up the test data and call the component method being tested
  //   spyOn(jwtTokenService, 'isLoggedIn').and.returnValue(true);
  //   component.ngOnInit();
  
  //   // Advance the fakeAsync clock by 1000 ms to simulate the passage of time
  //   tick(1000);
  
  //   // Check that the isLoggedIn$ BehaviorSubject has been updated correctly
  //   expect(component.isLoggedIn$.getValue()).toBeTrue();
  
  //   // Call the setTimeout function inside the tick function
  //   tick(0);
  
  //   // Check that the setTimeout function has been called with the expected arguments
  //   expect(setTimeoutSpy).toHaveBeenCalledWith(jasmine.any(Function), 0);
  
  //   // Call the ngOnDestroy method to clean up the component after the test is finished
  //   component.ngOnDestroy();
  // }));
  
  
  
  
  
  

  it('should update isLoggedIn$ BehaviorSubject with false', fakeAsync(() => {
    // Set the initial state of the isLoggedIn$ BehaviorSubject to true
    component.isLoggedIn$ = new BehaviorSubject<boolean>(true);

    // Call the logout method
    component.logout();

    // Simulate the passage of time to allow the periodic timer to run
    tick(1000);

    // Expect the isLoggedIn$ BehaviorSubject to be updated with false
    expect(component.isLoggedIn$.getValue()).toBe(false);
  }));
  it('should do something asynchronously', fakeAsync(() => {
    // test code here
    tick(500);
    // assertions here
  }));
  
  afterEach(() => {
    component.ngOnDestroy();
  });
  

});
