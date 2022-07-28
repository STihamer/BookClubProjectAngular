import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {MyListing} from "../../model/myListing";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonBookListing} from "../../model/PersonBookListing";

@Component({
  selector: 'app-my-listing',
  templateUrl: './my-listing.component.html',
  styleUrls: ['./my-listing.component.css']
})
export class MyListingComponent implements OnInit {

  myListings: Array<MyListing> = new Array<MyListing>();
  action: string = '';
  selectedMyListing: any = new MyListing();
  PersonsListingList: Array<PersonBookListing> = new Array<PersonBookListing>();

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {

    this.dataService.myListing.subscribe(
      next => {
        this.myListings = next;
        let id = 1;

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
          this.PersonsListingList.push(bookReader);
          console.log(bookReader)
        }

      });

  }
}
