import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../products_service/auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JWTTokenServiceService } from '../products_service/jwttoken.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { CartServiceService } from '../products_service/cart-service.service';


interface user {
  username: string
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  phone: string
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  user: any = {};

  constructor(
    protected restClientServiceService: AuthServiceService,
    protected _JWTTokenServiceService: JWTTokenServiceService,
    protected route: Router,
    protected _cartServiceService: CartServiceService
  ) { }

  formData = new FormGroup({
    username: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
  }
  
  onSubmit(form: any) {
    if (
      this.formData.controls.username.value === '' ||
      this.formData.controls.firstname.value === '' ||
      this.formData.controls.lastname.value === '' ||
      this.formData.controls.email.value === '' ||
      this.formData.controls.password.value === '' ||
      this.formData.controls.phone.value === ''
    ) {
      
      this._cartServiceService.openSnackBar("Please fill all fields!");
      return;
    }
  
    const user: user = {
      username: form.value.username,
      firstname: form.value.firstname,
      lastname: form.value.lastname,
      email: form.value.email,
      password: form.value.password,
      phone: form.value.phone
    };
    const token$ = this.restClientServiceService.register(user).pipe(
      map((response: any) => {
        return response.token;
      })
    );

    token$.toPromise().then((token: string) => {
      this._JWTTokenServiceService.setToken(token);
      this._cartServiceService.openSnackBar("You successfully registered!");
      this.route.navigate(['/']);
    }).catch((error: any) => {
      this._cartServiceService.openSnackBar("Error: " + error.error);
    });

}
}
