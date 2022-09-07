import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UserDTO} from "../../../model/UserDTO";
import {BookDTO} from "../../../model/BookDTO";
import {DataService} from "../../../data.service";
import {Subscription} from "rxjs";
import {BookOwnerDTO} from "../../../model/BookOwnerDTO";
import {FormResetService} from "../../../form-reset.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-book-owner',
  templateUrl: './add-book-owner.component.html',
  styleUrls: ['./add-book-owner.component.css']
})
export class AddBookOwnerComponent implements OnInit, OnDestroy {

  users: Array<UserDTO> = new Array<UserDTO>();
  books: Array<BookDTO> = new Array<BookDTO>();
  myUser = new UserDTO();
  myBook = new BookDTO();
  action = '';
  errorMessage = '';
  successMessage = '';
  role = '';
  isAdminUser = false;
  id = 0;
  @Output()
  dataChangedEvent = new EventEmitter();

  @Input()
  newBookOwner: BookOwnerDTO = new BookOwnerDTO();
  bookOwnerResetSubscription: Subscription = new Subscription();

  constructor(private dataService: DataService,
              private formResetService: FormResetService,
              private router: Router) {
  }

  ngOnDestroy(): void {
    this.bookOwnerResetSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.setupRoleAndId();
    this.dataService.getBooks().subscribe(next => {
      this.books = next;
    });

    this.bookOwnerResetSubscription = this.formResetService.resetOwnerBookFormEvent.subscribe(
      bookOwner => {
        this.newBookOwner = bookOwner;

      }
    );
  }

  onSubmit() {
    this.newBookOwner.userId = this.myUser.userId;
    this.newBookOwner.bookId = this.myBook.bookId;
    this.dataService.addBookOwner(this.newBookOwner).subscribe(
      (bookOwner) => {
        this.successMessage = "New book owner data successfully added"

      }, error => {
        this.errorMessage = error.error
      }
    );
  }

  navigateToBookOwnersAfterSuccessfullyAdded() {
    this.dataChangedEvent.emit();
    this.router.navigate(['bookOwner']);
    window.location.reload();
    window.location.replace("bookOwner");
  }

  clearFormAfterBookOwnerInsertingFailed() {
    this.myUser = new UserDTO();
    this.myBook = new BookDTO();
    this.errorMessage = '';
  }

  setupRoleAndId() {
    this.dataService.getRole().subscribe(
      next => {
        this.role = next.role;
        if (this.role == 'admin') {
          this.isAdminUser = true;
        }
        this.dataService.getId().subscribe(
          next => {
            this.id = next.id;
            this.dataService.getUsers().subscribe(next => {
              if (this.role == 'admin') {
                this.users = next;
              } else {
                this.users = next.filter(user => user.userId == this.id);
              }
            });
          }
        );
      }
    );
  };
}
