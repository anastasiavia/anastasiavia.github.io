import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../products_service/auth-service.service';
import { JwttokenService } from '../products_service/jwttoken.service';
import { map } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoggedIn = false;
  formData = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })
  constructor(private loginService: AuthServiceService, private jwttokenservice: JwttokenService) { }

  onSubmit(data: any) {
    let token = null;
    this.loginService.login(data.value.username, data.value.password).toPromise()
      .then(
        (response: any) => { // Success
          console.log(response);
          token = response.token.toString;
          this.jwttokenservice.setToken(token);
          this.isLoggedIn = true;
        }
      );
  }

}
function resolve() {
  throw new Error('Function not implemented.');
}

