import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Book} from "../../model/Book";
import {DataService} from "../../data.service";
import {Router} from "@angular/router";
import {FormResetService} from "../../form-reset.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-book',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit, OnDestroy {


  @Input()
  book: Book = new Book();

  @Output()
  dataChangedEvent = new EventEmitter();
  formBook: Book = new Book();

  @Input()
  action: string = '';


  message: string = '';

  bookTitleIsValid = false;
  authorFNameIsValid = false;
  authorLNameIsValid = false;
  publishedYearIsValid = false;


  BookResetSubscription: Subscription = new Subscription();


  constructor(private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
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
    if (this.formBook.book_title) {
      this.bookTitleIsValid = this.formBook.book_title.trim().length > 0;
    } else {
      this.bookTitleIsValid = false;
    }
  }

  checkIfAuthorFNameIsValid() {
    if (this.formBook.author_fname) {
      this.authorFNameIsValid = this.formBook.author_fname.trim().length > 0;
    } else {
      this.authorFNameIsValid = false;
    }
  }

  checkIfAuthorLNameIsValid() {
    if (this.formBook.author_lname) {
      this.authorLNameIsValid = this.formBook.author_lname.trim().length > 0;
    } else {
      this.authorLNameIsValid = false;
    }
  }

  checkIfPublishedYearIsValid() {
    if (this.formBook.published) {
      this.publishedYearIsValid = this.formBook.published > 0;
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
    if (this.formBook.book_id < 1) {
      this.dataService.addBook(this.formBook).subscribe(
        (book) => {
          this.dataChangedEvent.emit();
          this.router.navigate(['books'], {queryParams: {action: 'view', id: book.book_id}});
        },
        error => this.message = 'Something went wrong and the data wasn\'t saved. You may want to try again.' + error.status
      );
    } else {
      this.dataService.updateBook(this.formBook, this.formBook.book_id).subscribe(
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
    this.dataService.deleteBook(this.formBook.book_id).subscribe(
      next => {
        this.dataChangedEvent.emit();
        this.router.navigate(['books']);
      }, error => this.message = 'Sorry, this user cannot be deleted at this time.'
    )
  }

}
