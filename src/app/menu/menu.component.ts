import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, DoCheck {
  userIsLoggedIn = false;
  setUsersMenuActive = '';
  setBooksMenuActive = '';
  setHomeMenuActive = '';
  setRentingMenuActive = '';
  isMenuHidden = true;

  constructor(private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute) {
  }

  ngDoCheck(): void {
    this.setMenuComponentRouting();
  }


  ngOnInit(): void {

    this.authService.rolesSetEvent.subscribe(
      next => {
        if (next) {
          this.userIsLoggedIn = true;
        }
      }
    );
  }

  navigateToUsers() {
    this.router.navigate(['users'])
  }

  navigateToBooks() {
    this.router.navigate(['books']);
  }

  navigateToHome() {
    this.router.navigate(['home']);

  }

  navigateToRentingData() {
    this.router.navigate(['rentingTable']);
  }

  navigateToBookOwner() {
    this.router.navigate(['bookOwner']);
  }

  navigateToMyListing() {
    this.router.navigate(['myListing']);
  }

  navigateToWaitingList() {
    this.router.navigate(['waitingList']);
  }

  navigateToNonRentedBooks() {
    this.router.navigate(['booksNonRented']);
  }

  navigateToLogin() {
    this.router.navigate(['login']);
  }

  logout() {
    this.authService.logout();
    this.navigateToHome();
    this.userIsLoggedIn = false;
  }

  setMenuComponentRouting() {
    this.route.queryParams.subscribe(params => {
      if (this.router.url === '/home') {
        this.setHomeMenuActive = 'active';
        this.isMenuHidden = false;
      } else {
        this.setHomeMenuActive = '';
      }
      if (this.router.url === '/users' || this.router.url === '/bookOwner'
        || this.router.url === '/myListing' || this.router.url === '/waitingList' || this.router.url.indexOf("users?") > -1) {
        this.setUsersMenuActive = 'active';
      } else {
        this.setUsersMenuActive = '';
      }
      if (this.router.url === '/books' || this.router.url === '/booksNonRented' || this.router.url.indexOf("books?") > -1) {
        this.setBooksMenuActive = 'active';
      } else {
        this.setBooksMenuActive = '';
      }
      if (this.router.url === '/rentingTable' || this.router.url.indexOf("rentingTable?") > -1) {
        this.setRentingMenuActive = 'active';
      } else {
        this.setRentingMenuActive = '';
      }

      if (this.router.url == '/') {
       this.isMenuHidden = false;
      }

      if ((this.router.url.indexOf("login") > -1) || this.router.url == '/registration') {
        this.isMenuHidden = true;
      }else{
        this.isMenuHidden = false;
      }
    });
  }
}
