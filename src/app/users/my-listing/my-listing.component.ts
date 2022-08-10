import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {MyListing} from "../../model/MyListing";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonBookListing} from "../../model/PersonBookListing";
import {FormResetService} from "../../form-reset.service";

@Component({
  selector: 'app-my-listing',
  templateUrl: './my-listing.component.html',
  styleUrls: ['./my-listing.component.css']
})
export class MyListingComponent implements OnInit {

  myListings: Array<MyListing> = new Array<MyListing>();
  action: string = '';
  selectedMyListing: any = new MyListing();
  searchListing: string = '';
  personsListingList: Array<PersonBookListing> = new Array<PersonBookListing>();
  selectedPersonListing: PersonBookListing = new PersonBookListing();
  myListingComponentHidden = false;
  searching: string = '';

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private resetService: FormResetService) {
  }


  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.personsListingList = [];
    this.myListings = [];

    this.dataService.myListing.subscribe(
      next => {
        let id = 1
        this.myListings = next;
        this.createPersonsListingList(this.myListings, id);
        this.toManageMyListingRouting();

      });
  }

  findData(myNewListingText: string) {
    this.router.navigate(['myListing'],
      {queryParams: {searching: myNewListingText}})
    this.personsListingList = this.personsListingList.filter
    (element => (element.firstName.toLowerCase().indexOf(myNewListingText.toLowerCase()) > -1)
      || (element.lastName.toLowerCase().indexOf(myNewListingText.toLowerCase()) > -1));
    if (myNewListingText === '') {
      this.router.navigate(['myListing']);
    }

  }

  setMyListing(id: number) {
    this.router.navigate(['myListing'], {queryParams: {action: 'edit', id: id}})
  }

  deleteMyListing() {
    this.dataService.deleteMyListing(this.selectedMyListing[0].id).subscribe(
      next => {
        this.router.navigate(['myListing']);
        window.location.reload();
        window.location.replace('myListing');
      }
    )
  }

  addMyListing() {
    this.myListingComponentHidden = true;
    this.selectedMyListing = new MyListing();
    this.router.navigate(['myListing'], {queryParams: {action: 'add'}});
    this.resetService.resetMyListingFormEvent.emit(this.selectedMyListing);
  }

  deleteSearchingByFirstNameOrBookTitle() {
    this.router.navigate(['myListing']);
    this.loadData();
    this.searchListing = '';
  }

  sortingMyListing() {
    this.personsListingList.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      } else if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
  }

  createPersonsListingList(myListings: Array<MyListing>, id: number) {
    for (let el of this.myListings) {
      const bookReader: PersonBookListing = new PersonBookListing()
      this.dataService.getUserById(el.reading_person).subscribe(next => {
        bookReader.firstName = next.first_name;
        bookReader.lastName = next.last_name;

      });
      this.dataService.getBookById(el.book_title).subscribe(next => {
        bookReader.bookTitle = next.book_title;

      });
      bookReader.id = id++;
      bookReader.myListingId = el.id;

      this.personsListingList.push(bookReader);
      this.sortingMyListing();
    }
  }

  toManageMyListingRouting() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.action = params['action'];
      this.searching = params['searching'];
      if (!this.action && !this.searching) {
        this.router.navigate(['myListing']);
        this.myListingComponentHidden = false;
      } else if (this.action === 'edit') {
        this.router.navigate(['myListing'], {queryParams: {action: 'edit'}});
      } else if (this.action === 'add') {
        this.router.navigate(['myListing'], {queryParams: {action: 'add'}});
        this.myListingComponentHidden = true;
      }
      if (id) {
        // @ts-ignore
        this.selectedPersonListing = this.personsListingList.find(listing => listing.id === +id);
        this.selectedMyListing = this.myListings.filter(el => el.id === this.selectedPersonListing.myListingId);
      }
    });
  }

  closeModal() {
    this.router.navigate(['myListing']);
  }
}
