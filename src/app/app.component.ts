import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JWTTokenServiceService } from './products_service/jwttoken.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'store';
  toggleNavbar = true;
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public intervalId: any;

  constructor(protected _JWTTokenServiceService: JWTTokenServiceService) { }

  //встановлюємо інтервал,який буде запускатись кожну секунду та перевірятимемо чи дійсний токен
  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      const isExpired = this._JWTTokenServiceService.isLoggedIn();
      if (isExpired != this.isLoggedIn$.getValue()) {
        this.isLoggedIn$.next(isExpired);
      }
    }, 1000);

  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  logout() {
    this._JWTTokenServiceService.logout();
    this.isLoggedIn$.next(false);
  }


}
