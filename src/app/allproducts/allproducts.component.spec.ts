import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AllproductsComponent } from './allproducts.component';

describe('AllproductsComponent', () => {
  let component: AllproductsComponent;
  let fixture: ComponentFixture<AllproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatSnackBarModule ],
      declarations: [ AllproductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
