import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from "@angular/router";

import {ProfileComponent} from "./view/profile/profile.component";
import {RequestResetComponent} from "./view/password/request-reset/request-reset.component";
import {ResponseResetComponent} from "./view/password/response-reset/response-reset.component";
import {LoginComponent} from "./view/login/login.component";
import {SignupComponent} from "./view/signup/signup.component";
import {BeforeLoginService} from "./Services/before-login.service";
import {AfterLoginService} from "./Services/after-login.service";
import {PhoneComponent} from "./view/phone/phone.component";
import {LaptopComponent} from "./view/laptop/laptop.component";
import {VehicleComponent} from "./view/vehicle/vehicle.component";
import {HomeComponent} from "./view/home/home.component";
import {AboutComponent} from "./view/about/about.component";
import {ContactusComponent} from "./view/contactus/contactus.component";
import {CartComponent} from "./view/cart/cart.component";
import { PaymentComponent } from './view/payment/payment.component';
import { ItemDetailComponent } from './view/item-detail/item-detail.component';
import {PanelComponent} from "./admin/panel/panel.component";
import {DashboardComponent} from "./admin/dashboard/dashboard.component";

const routes: Routes = [
  {
    path:'admin',
    component: DashboardComponent,
    canActivate:[AfterLoginService]
  },
  // {
  //   path:' ',
  //   component:HomeComponent
  // },
  {
    path:'',
    component: HomeComponent,
    canActivate:[BeforeLoginService],
    children:[

    ]
  },
  {
    path:'login',
    component: LoginComponent,
    canActivate:[BeforeLoginService]
  },
  {
    path:'signup',
    component: SignupComponent,
    canActivate:[BeforeLoginService]
  },
  {
    path:'profile',
    component: ProfileComponent,
    canActivate:[AfterLoginService]
  },
  {
    path:'phone',
    component: PhoneComponent,
    canActivate:[AfterLoginService]
  },
  {
    path:'panel',
    component: PanelComponent,
    canActivate:[AfterLoginService]
  },
  {
    path:'about',
    component: AboutComponent,
    canActivate:[AfterLoginService]
  },
  {
    path:'cart',
    component: CartComponent,
    canActivate:[AfterLoginService]
  },
  {
    path:'payment',
    component: PaymentComponent,
    canActivate:[AfterLoginService]
  },
  {
    path:'item/:id',
    component: ItemDetailComponent,
    canActivate:[AfterLoginService]
  },
  {
    path:'contact',
    component: ContactusComponent,
    canActivate:[AfterLoginService]
  },
  {
    path:'laptop',
    component: LaptopComponent,
    canActivate:[AfterLoginService]
  },
  {
    path:'vehicle',
    component: VehicleComponent,
    canActivate:[AfterLoginService]
  },
 {
    path:'home',
    component: HomeComponent,
    canActivate:[AfterLoginService]
  },
  {
    path:'request-password-reset',
    component: RequestResetComponent,
    canActivate:[BeforeLoginService]
  },
  {
    path:'response-password-reset',
    component: ResponseResetComponent,
    canActivate:[BeforeLoginService]
  },

];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
