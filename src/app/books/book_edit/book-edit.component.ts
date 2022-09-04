import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BookDTO} from "../../model/BookDTO";
import {DataService} from "../../data.service";
import {Router} from "@angular/router";
import {FormResetService} from "../../form-reset.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-edit-book',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit, OnDestroy {


  @Input()
  book: BookDTO = new BookDTO();

  @Output()
  dataChangedEvent = new EventEmitter();
  formBook: BookDTO = new BookDTO();

  @Input()
  action: string = '';


  message: string = '';

  bookTitleIsValid = false;
  authorFNameIsValid = false;
  authorLNameIsValid = false;
  publishedYearIsValid = false;
  isAdminUser = false;

  BookResetSubscription: Subscription = new Subscription();


  constructor(private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.rolesSetEvent.subscribe(
      next => {
        if (next === 'admin') {
          this.isAdminUser = true;
        } else {
          this.isAdminUser = false;
        }
      }
    )
    this.initializeForm();
    this.formBook = Object.assign({}, this.book);
    this.BookResetSubscription = this.formResetService.resetBookFormEvent.subscribe(
      book => {
        this.book = book;
      }
    );
  }

  ngOnDestroy(): void {
    this.BookResetSubscription.unsubscribe();
  }

  checkIfBookTitleIsValid() {
    if (this.formBook.bookTitle) {
      this.bookTitleIsValid = this.formBook.bookTitle.trim().length > 0;
    } else {
      this.bookTitleIsValid = false;
    }
  }

  checkIfAuthorFNameIsValid() {
    if (this.formBook.authorFirstName) {
      this.authorFNameIsValid = this.formBook.authorFirstName.trim().length > 0;
    } else {
      this.authorFNameIsValid = false;
    }
  }

  checkIfAuthorLNameIsValid() {
    if (this.formBook.authorLastName) {
      this.authorLNameIsValid = this.formBook.authorLastName.trim().length > 0;
    } else {
      this.authorLNameIsValid = false;
    }
  }

  checkIfPublishedYearIsValid() {
    if (this.formBook.publishedYear) {
      this.publishedYearIsValid = this.formBook.publishedYear > 0;
    } else {
      this.publishedYearIsValid = false;
    }
  }

  initializeForm() {
    this.formBook = Object.assign({}, this.book);
    this.checkIfBookTitleIsValid();
    this.checkIfAuthorFNameIsValid();
    this.checkIfAuthorLNameIsValid();
    this.checkIfPublishedYearIsValid();
  }

  onSubmit() {
    this.message = 'saving...';
    if (this.formBook.bookId < 1) {
      this.dataService.addBook(this.formBook).subscribe(
        (book) => {
          this.dataChangedEvent.emit();
          this.router.navigate(['books'], {queryParams: {action: 'view', id: book.bookId}});
        },
        error => this.message = 'Something went wrong and the data wasn\'t saved. You may want to try again.' + error.status
      );
    } else {
      this.dataService.updateBook(this.formBook, this.formBook.bookId).subscribe(
        (book) => {
          this.dataChangedEvent.emit();
          this.router.navigate(['books']);
        },
        error => this.message = 'Something went wrong and the data wasn\'t saved. You may want to try again.'
      );
    }
  }

  deleteBook() {
    this.message = 'deleting';
    this.dataService.deleteBook(this.formBook.bookId).subscribe(
      next => {
        this.dataChangedEvent.emit();
        this.router.navigate(['books']);
      }, error => this.message = 'Sorry, this user cannot be deleted at this time.'
    )
  }

}
