import {Component, OnInit} from '@angular/core';
import {SidenavService} from "./Services/sidenav.service";
import {AuthService} from "./Services/auth.service";
import {Router} from "@angular/router";
import {TokenService} from "./Services/token.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public loggedIn : boolean | undefined;
  title = 'client';
  constructor(public navService:SidenavService,
              private auth:AuthService,
              private router:Router,
              private token: TokenService,
    ) {}

  isSideNavOpen: boolean = false;
  logout(event:MouseEvent){
    event.preventDefault();
    this.token.remove();
    this.auth.changeAuthStatus(false);
    this.router.navigateByUrl('/login');
  }
  ngOnInit(): void {
    this.auth.authStatus.subscribe(value => this.loggedIn = value);
    this.isSideNavOpen = this.navService.getSideNavState();
  }
}
