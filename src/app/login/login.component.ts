import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../products_service/auth-service.service';
import { JWTTokenServiceService } from '../products_service/jwttoken.service';
import { CartServiceService } from '../products_service/cart-service.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  formData = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    protected restClientServiceService: AuthServiceService,
    protected _JWTTokenServiceService: JWTTokenServiceService,
    protected route: Router,
    protected _cartServiceService: CartServiceService,
  ) { }

  onSubmit(data: any) {
    const username = data.value.username;
    const password = data.value.password;

    const token$ = this.restClientServiceService.login(username, password).pipe(
      map((response: any) => {
        return response.token;
      })
    );

    token$.toPromise().then((token: string) => {
      this._JWTTokenServiceService.setToken(token);
      this._cartServiceService.openSnackBar("You successfully logged in!");
      this.route.navigate(['/']);
    }).catch((error: any) => {
      this._cartServiceService.openSnackBar("Ooops! Try again ");
    });
  }
}

