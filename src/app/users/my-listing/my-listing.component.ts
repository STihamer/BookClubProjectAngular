import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {MyListingDTO} from "../../model/MyListingDTO";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonBookListing} from "../../model/PersonBookListing";
import {FormResetService} from "../../form-reset.service";


@Component({
  selector: 'app-my-listing',
  templateUrl: './my-listing.component.html',
  styleUrls: ['./my-listing.component.css']
})
export class MyListingComponent implements OnInit {

  myListings: Array<MyListingDTO> = new Array<MyListingDTO>();
  action: string = '';
  selectedMyListing: any = new MyListingDTO();
  searchListing: string = '';
  personsListingList: Array<PersonBookListing> = new Array<PersonBookListing>();
  selectedPersonListing: PersonBookListing = new PersonBookListing();
  myListingComponentHidden = false;
  searching: string = '';
  role = '';
  id = 0;

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private resetService: FormResetService) {
  }


  ngOnInit(): void {
    this.setupRoleAndId();
  }

  loadData() {
    this.personsListingList = [];
    this.myListings = [];

    this.dataService.getMyListing().subscribe(
      next => {
        let id = 1
        if (this.role == 'admin') {
          this.myListings = next;
        } else {
          this.myListings = next.filter(element => element.readingPerson == this.id);
        }
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
    this.selectedMyListing = new MyListingDTO();
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

  createPersonsListingList(myListings: Array<MyListingDTO>, id: number) {

    for (let el of this.myListings) {
      const bookReader: PersonBookListing = new PersonBookListing()
      this.dataService.getUserById(el.readingPerson).subscribe(next => {
        bookReader.firstName = next.firstName;
        bookReader.lastName = next.lastName;

      });
      this.dataService.getBookById(el.bookTitle).subscribe(next => {
        bookReader.bookTitle = next.bookTitle;

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

  setupRoleAndId() {
    this.dataService.getRole().subscribe(
      next => {
        this.role = next.role;
        this.dataService.getId().subscribe(
          next => {
            this.id = next.id;
            this.loadData();
          }
        )}
    );

  }
}
