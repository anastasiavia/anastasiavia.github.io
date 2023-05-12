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

  constructor(protected _JWTTokenServiceService: JWTTokenServiceService) { }

  //встановлюємо інтервал,який буде запускатись кожну секунду та перевірятимемо чи дійсний токен
  ngOnInit(): void {
    setInterval(() => {
      const isExpired = this._JWTTokenServiceService.isLoggedIn();
      if (isExpired != this.isLoggedIn$.getValue()) {
        this.isLoggedIn$.next(isExpired);
      }
    }, 1000);

  }

  logout() {
    this._JWTTokenServiceService.logout();
    this.isLoggedIn$.next(false);
  }


}
