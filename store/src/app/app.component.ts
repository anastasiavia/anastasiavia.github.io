  import { Component } from '@angular/core';
  import { Router } from '@angular/router';
  import { ActivatedRoute } from '@angular/router';

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent {
    title = 'store';
    isLoggedIn: boolean = false;
    constructor(private router: Router) {}

    login() {
      this.router.navigate(['/login']);
    }

    signup(){
      this.router.navigate(['/signup'])
    }
    logout(){
      this.isLoggedIn = false;
    }
  }
