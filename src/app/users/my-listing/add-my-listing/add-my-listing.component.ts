import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DataService} from "../../../data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MyListingDTO} from "../../../model/MyListingDTO";
import {UserDTO} from "../../../model/UserDTO";
import {BookDTO} from "../../../model/BookDTO";
import {Subscription} from "rxjs";
import {FormResetService} from "../../../form-reset.service";
import {AuthService} from "../../../auth.service";

@Component({
  selector: 'app-add-my-listing',
  templateUrl: './add-my-listing.component.html',
  styleUrls: ['./add-my-listing.component.css']
})
export class AddMyListingComponent implements OnInit, OnDestroy {

  users: Array<UserDTO> = new Array<UserDTO>();
  books: Array<BookDTO> = new Array<BookDTO>();
  action = '';
  @Input()
  myNewListing: MyListingDTO = new MyListingDTO();
  myListingResetSubscription: Subscription = new Subscription();
  myUser = new UserDTO();
  myBook = new BookDTO();

  @Output()
  dataChangedEvent = new EventEmitter();
  errorMessage = '';

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private formResetService: FormResetService) {
  }

  ngOnDestroy(): void {
    this.myListingResetSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.dataService.getUsers().subscribe(next => {
      this.users = next;
    });
    this.dataService.getRole().subscribe(
      next => {
        if (next.role != 'admin') {
          this.dataService.getId().subscribe(
            message => {
              this.users = this.users.filter(user => user.userId == message.id);
            }
          )
        }
      }
    )
    this.dataService.getBooks().subscribe(next => this.books = next);
    this.myListingResetSubscription = this.formResetService.resetMyListingFormEvent.subscribe(
      myListing => {
        this.myNewListing = myListing;

      }
    );

  }

  onSubmit() {
    this.myNewListing.readingPerson = this.myUser.userId;
    this.myNewListing.bookTitle = this.myBook.bookId;
    this.dataService.addMyListing(this.myNewListing).subscribe(
      (myListing) => {
        window.location.reload();
        window.location.replace("myListing");
        this.dataChangedEvent.emit();
        this.router.navigate(['myListing']);
      }, error => {
        this.errorMessage = (error.error)
      }
    );
  }

  closeErrorMessage() {
    window.location.replace("myListing?action=add");
  }

  closeAddMyListing() {
    window.location.replace("myListing")
  }
}

