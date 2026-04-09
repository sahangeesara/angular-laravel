import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NavbarComponent} from "./view/navbar/navbar.component";
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatGridListModule} from "@angular/material/grid-list";
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {LoginComponent } from './view/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {ProfileComponent} from "./view/profile/profile.component";
import {RequestResetComponent} from "./view/password/request-reset/request-reset.component";
import {ResponseResetComponent} from "./view/password/response-reset/response-reset.component";
import { SignupComponent } from './view/signup/signup.component';
import {MatTableModule} from "@angular/material/table";
import {ToastContainerModule, ToastrModule} from "ngx-toastr";
import { PhoneComponent } from './view/phone/phone.component';
import { LaptopComponent } from './view/laptop/laptop.component';
import { VehicleComponent } from './view/vehicle/vehicle.component';
import { HomeComponent } from './view/home/home.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTabsModule} from "@angular/material/tabs";
import {MaterialFileInputModule} from "ngx-material-file-input";
import {FooterComponent} from "./view/footer/footer.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { AboutComponent } from './view/about/about.component';
import { ContactusComponent } from './view/contactus/contactus.component';
import { CartComponent } from './view/cart/cart.component';
import { SidenavComponent } from './view/sidenav/sidenav.component';
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import { PanelComponent } from './admin/panel/panel.component';

import { DialogComponent } from './view/dialog/dialog.component';
import {DialogItemComponent} from "./view/dialog-item/dialog-item.component";
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ItemFormComponent } from './admin/item-form/item-form.component';
import { ItemTableComponent } from './admin/item-table/item-table.component';





@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        LoginComponent,
        ProfileComponent,
        RequestResetComponent,
        ResponseResetComponent,
        SignupComponent,
        PhoneComponent,
        LaptopComponent,
        VehicleComponent,
        HomeComponent,
        FooterComponent,
        AboutComponent,
        ContactusComponent,
        CartComponent,
        SidenavComponent,
        PanelComponent,
        DialogComponent,
        DialogItemComponent,
        DashboardComponent,
        ItemFormComponent,
        ItemTableComponent

    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatTableModule,
    ToastrModule.forRoot(),
    ToastContainerModule,
    MatSidenavModule,
    MatTabsModule,
    // AngularFileUploaderModule,
    // NgxMatFileInputModule
    MaterialFileInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
