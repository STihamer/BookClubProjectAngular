import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  faCoffee = faCoffee;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToBooks(){
    this.router.navigate(['books']);
  }
  navigateToUsers(){
    this.router.navigate(['users']);
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
  navigateToAvailableBooks(){
    this.router.navigate(['booksNonRented']);
  }
}
