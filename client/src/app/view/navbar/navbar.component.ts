import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../Services/auth.service";
import {Router} from "@angular/router";
import {TokenService} from "../../Services/token.service";
import {MatSidenav} from "@angular/material/sidenav";
import {SidenavService} from "../../Services/sidenav.service";
import {ViewportRuler} from "@angular/cdk/overlay";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import { CartStateService } from '../../Services/cart-state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  sidenav?: MatSidenav;
  public loggedIn : boolean | undefined;
  isMenuOpen : boolean = false;
  deviceWidth=0;
  cartCount: number = 0;
  constructor(
    private auth:AuthService,
    private router:Router,
    private token: TokenService,
    private navService:SidenavService,
    private viewportRuler: ViewportRuler,
    private breakpointObserver: BreakpointObserver,
    private cartState: CartStateService
  ) {
    this.breakpointObserver.observe(["(max-width: 992px)"]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.isMenuOpen=true;
      } else {
       this.isMenuOpen=false;
      }
    });
  }
  ngOnInit() {
    this.auth.authStatus.subscribe(value => this.loggedIn =value);
    this.cartState.itemCount$.subscribe(count => this.cartCount = count);
    // this.openMenu();
  }
  logout(event:MouseEvent){
    event.preventDefault();
    this.token.remove();
    this.auth.changeAuthStatus(false);
    this.router.navigateByUrl('/login');
  }
  toggleSideNav() {
    this.navService.toggleSideNav();
  }

//   openMenu() {
//     let isMenuVisible=false
//     // console.log( this.navService.setMenuState());
//     // this.isMenuOpen= this.navService.setMenuState();
//     const viewportSize = this.viewportRuler.getViewportSize();
//     console.log(viewportSize);
//   if (this.deviceWidth<960){
//     isMenuVisible=  true;
//   }
// console.log(isMenuVisible);
//   }
}
