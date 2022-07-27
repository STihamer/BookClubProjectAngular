import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToUsers() {
    this.router.navigate(['users'])
  }
  navigateToBooks(){
    this.router.navigate(['books']);
  }
  navigateToHome(){
    this.router.navigate(['']);
  }

  navigateToRentingData(){
    this.router.navigate(['rentingTable']);
  }
  navigateToBookOwner(){
    this.router.navigate(['bookOwner']);
  }

  navigateToMyListing(){
    this.router.navigate(['myListing']);
  }
  navigateToWaitingList(){
    this.router.navigate(['waitingList']);
  }

  navigateToNonRentedBooks(){
    this.router.navigate(['booksNonRented']);
  }

}
