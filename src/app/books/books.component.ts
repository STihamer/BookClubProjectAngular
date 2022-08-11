import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {Book} from "../model/Book";
import {ActivatedRoute, Router} from "@angular/router";
import {FormResetService} from "../form-reset.service";
import {FindBookByTitleOrAuthorIfAvailable} from "../model/FindBookByTitleOrAuthorIfAvailable";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Array<Book> = new Array<Book>();
  selectedBook: any = new Book();
  action: string = '';
  message: string = '';
  bookHidden = false;
  searchingBook: string = '';
  findBookAvailabilityByTitleAndUsername: FindBookByTitleOrAuthorIfAvailable = new FindBookByTitleOrAuthorIfAvailable();
  returnDate = '';

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.returnDate = '';
    this.loadData()
  }

  setBook(id: number) {
    this.router.navigate(['books'], {queryParams: {id: id, action: 'view'}})
    this.selectedBook = this.books.find(book => book.book_id === +id);
    this.getBookAvailabilityByUsernameAndTitle(id)
  }

  loadData() {
    this.dataService.books.subscribe(
      next => {
        this.books = next.sort((a, b) => {
          if (a.book_id > b.book_id) {
            return 1;
          } else if (a.book_id < b.book_id) {
            return -1;
          }
          return 0;
        });
        this.route.queryParams.subscribe(params => {
          const id = params['id'];
          this.action = params['action'];
          if (!this.action || this.action === 'view') {
            this.bookHidden = false;
            this.router.navigate(['books']);
          }
          if (id) {
            this.selectedBook = this.books.find(book => book.book_id === +id);
          }
          if (this.action === 'edit' && id) {
            this.bookHidden = true;
            this.router.navigate(['books'],
              {queryParams: {action: 'edit', id: this.selectedBook.book_id}})
          }
        });
      }, errors => {
        this.message = 'An error occurred - please contact support';
      }
    )
  }

  editBook() {
    this.bookHidden = true;
    this.router.navigate(['books'],
      {queryParams: {action: 'edit', id: this.selectedBook.book_id}})
  }

  findBookByTitle(title: string) {
    if (title === '') {
      this.dataService.books.subscribe(
        next => {
          this.books = next.sort((a, b) => {
            if (a.book_title > b.book_title) {
              return 1;
            } else if (a.book_title < b.book_title) {
              return -1;
            }
            return 0;
          });
        })
    } else {
      this.dataService.books.subscribe(
        next => this.books = next.filter(
          book => book.book_title.toLowerCase()
            .indexOf(title.toLowerCase()) > -1));
      this.router.navigate(['books'],
        {queryParams: {action: title}})
    }
  }

  deleteSearchingByTitle() {
    this.router.navigate(['books']);
    this.dataService.books.subscribe(next => this.books = next);
    this.searchingBook = '';
  }

  addBook() {
    this.selectedBook = new Book();
    this.router.navigate(['books'], {queryParams: {action: 'add'}});
    this.formResetService.resetBookFormEvent.emit(this.selectedBook);
    this.bookHidden = true;
  }

  getBookAvailabilityByUsernameAndTitle(id: number) {
    this.returnDate = '';
    this.dataService.getBookById(id).subscribe(next => this.selectedBook = next);
    this.findBookAvailabilityByTitleAndUsername.book_title = this.selectedBook.book_title;
    this.findBookAvailabilityByTitleAndUsername.author_fname = this.selectedBook.author_fname;
    this.findBookAvailabilityByTitleAndUsername.author_lname = this.selectedBook.author_lname;
    this.dataService.getBookByAuthorNameOrBookTitle(this.findBookAvailabilityByTitleAndUsername).subscribe(next => {

      if (next[0].return_date !== undefined || null) {
        this.findBookAvailabilityByTitleAndUsername.return_date = next[0].return_date;
        this.returnDate = formatDate((this.findBookAvailabilityByTitleAndUsername.return_date), 'yyyy-MM-dd', 'en-US');
      } else {
        this.findBookAvailabilityByTitleAndUsername.return_date = new Date();
      }
    });
  }

  closeModal() {
    this.router.navigate(['books']);
    window.location.reload();
  }
}
