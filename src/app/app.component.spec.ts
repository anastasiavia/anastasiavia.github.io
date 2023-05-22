import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from '@angular/core/testing';
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

  afterEach(() => {
    clearInterval(component.intervalId); // Clear the interval timer

    fixture.destroy();
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

  it('should update isLoggedIn$ BehaviorSubject based on JWTTokenServiceService.isLoggedIn', fakeAsync(() => {
    // Set the initial state of the isLoggedIn$ BehaviorSubject to true
    component.isLoggedIn$ = new BehaviorSubject<boolean>(true);

    // Mock the isLoggedIn method to return different values
    spyOn(jwtTokenService, 'isLoggedIn').and.returnValues(false, false, true, true, true);

    // Trigger ngOnInit
    component.ngOnInit();

    // Simulate the passage of time
    tick(1000);

    // Expect the isLoggedIn$ BehaviorSubject to be updated correctly
    expect(component.isLoggedIn$.getValue()).toBe(false);

    tick(1000);
    expect(component.isLoggedIn$.getValue()).toBe(false);

    tick(1000);
    expect(component.isLoggedIn$.getValue()).toBe(true);

    tick(1000);
    expect(component.isLoggedIn$.getValue()).toBe(true);

    tick(1000);
    expect(component.isLoggedIn$.getValue()).toBe(true);

    // Flush any remaining timers
    flush();

    // Ensure there are no more pending timers
    expect(() => {
      discardPeriodicTasks();
    }).not.toThrowError('1 periodic timer(s) still in the queue');
  }));
});
