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
  public isTokenExpired$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(protected _JWTTokenServiceService: JWTTokenServiceService) { }

  ngOnInit(): void {
    setInterval(() => {
      const isExpired = this._JWTTokenServiceService.isTokenExpired();
      if (isExpired != this.isTokenExpired$.getValue()) {
        this.isTokenExpired$.next(isExpired);
      }
    }, 1000);

  }

  logout() {
    this._JWTTokenServiceService.logout();
    this.isTokenExpired$.next(true);
  }


}
