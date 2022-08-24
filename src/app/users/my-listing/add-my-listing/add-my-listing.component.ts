import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DataService} from "../../../data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MyListing} from "../../../model/MyListing";
import {User} from "../../../model/User";
import {Book} from "../../../model/Book";
import {Subscription} from "rxjs";
import {FormResetService} from "../../../form-reset.service";
import {AuthService} from "../../../auth.service";

@Component({
  selector: 'app-add-my-listing',
  templateUrl: './add-my-listing.component.html',
  styleUrls: ['./add-my-listing.component.css']
})
export class AddMyListingComponent implements OnInit, OnDestroy {

  users: Array<User> = new Array<User>();
  books: Array<Book> = new Array<Book>();
  action = '';
  @Input()
  myNewListing: MyListing = new MyListing();
  myListingResetSubscription: Subscription = new Subscription();
  myUser = new User();
  myBook = new Book();

  @Output()
  dataChangedEvent = new EventEmitter();

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private formResetService: FormResetService,
              private authService:AuthService) {
  }

  ngOnDestroy(): void {
    this.myListingResetSubscription.unsubscribe();
  }

  ngOnInit(): void {

    console.log("Is working")
    this.dataService.getUsers().subscribe(next => {
      this.users = next;
    });
    this.dataService.getBooks().subscribe(next => this.books = next);
    this.myListingResetSubscription = this.formResetService.resetMyListingFormEvent.subscribe(
      myListing => {
        this.myNewListing = myListing;

      }
    );

  }

  onSubmit() {
    this.myNewListing.reading_person = this.myUser.user_id;
    this.myNewListing.book_title = this.myBook.book_id;
    this.dataService.addMyListing(this.myNewListing).subscribe(
      (myListing) => {
        window.location.reload();
        window.location.replace("myListing");
        this.dataChangedEvent.emit();
        this.router.navigate(['myListing']);

      }
    );
  }


}

