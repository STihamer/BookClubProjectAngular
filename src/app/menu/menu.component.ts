import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  userIsLoggedIn = false;
  constructor(private router: Router,
              private authService: AuthService) {
  }



  ngOnInit(): void {
    this.authService.rolesSetEvent.subscribe(
      next => {
        if (next) {
          this.userIsLoggedIn = true;
        }
      }
    )
  }

  navigateToUsers() {
    this.router.navigate(['users'])
  }

  navigateToBooks() {
    this.router.navigate(['books']);
  }

  navigateToHome() {
    this.router.navigate(['']);
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

  logout() {
    this.authService.logout();
    this.navigateToHome();
    this.userIsLoggedIn = false;
  }
}
