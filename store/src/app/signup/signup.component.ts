import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../products_service/auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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

  constructor(private userService: AuthServiceService) { }

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
    const user: user = {
      username: form.value.username,
      firstname: form.value.firstname,
      lastname: form.value.lastname,
      email: form.value.email,
      password: form.value.password,
      phone: form.value.phone
    };

}
}
