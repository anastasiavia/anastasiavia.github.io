import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AllproductsComponent } from './allproducts/allproducts.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'store/inventory', component: AllproductsComponent},
  {path: 'item/:iditem', component: ProductComponent},
  {path: 'store/order', component: OrderComponent},
  { path: 'cart', component: CartComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  CommonModule,
  ReactiveFormsModule,],
  exports: [RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,],
})
export class AppRoutingModule { }
