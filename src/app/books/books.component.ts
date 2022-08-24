import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {Book} from "../model/Book";
import {ActivatedRoute, Router} from "@angular/router";
import {FormResetService} from "../form-reset.service";
import {BooksNonRentedResponse} from "../model/BooksNonRentedResponse";
import {FindBookByTitleOrAuthorIfAvailable} from "../model/FindBookByTitleOrAuthorIfAvailable";
import {formatDate} from "@angular/common";
import {AuthService} from "../auth.service";

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
  nonRentedBooks: Array<BooksNonRentedResponse> = new Array<BooksNonRentedResponse>();
  returnDate = '';
  findBookAvailability: FindBookByTitleOrAuthorIfAvailable = new FindBookByTitleOrAuthorIfAvailable();
  ifBookIsRented: BooksNonRentedResponse = new BooksNonRentedResponse();


  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private formResetService: FormResetService,
              private authService: AuthService) {
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
    this.dataService.getBooks().subscribe(
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
      this.dataService.getBooks().subscribe(
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
      this.dataService.getBooks().subscribe(
        next => this.books = next.filter(
          book => book.book_title.toLowerCase()
            .indexOf(title.toLowerCase()) > -1));
      this.router.navigate(['books'],
        {queryParams: {action: title}})
    }
  }

  deleteSearchingByTitle() {
    this.router.navigate(['books']);
    this.dataService.getBooks().subscribe(next => this.books = next);
    this.searchingBook = '';
  }

  addBook() {
    this.selectedBook = new Book();
    this.router.navigate(['books'], {queryParams: {action: 'add'}});
    this.formResetService.resetBookFormEvent.emit(this.selectedBook);
    this.bookHidden = true;
  }

  getBookAvailabilityByUsernameAndTitle(id: number) {
    this.dataService.getBookById(id).subscribe(next => this.selectedBook = next)
    this.dataService.bookNonRented.subscribe(
      next => {
        this.nonRentedBooks = next;
        this.ifBookIsRented = this.nonRentedBooks.filter(element => element.book_id == this.selectedBook.book_id)[0];
        if (!this.ifBookIsRented) {
          this.findBookAvailability.book_title = this.selectedBook.book_title;
          this.findBookAvailability.book_id = this.selectedBook.book_id;
          this.findBookAvailability.author_fname = this.selectedBook.author_fname;
          this.findBookAvailability.author_lname = this.selectedBook.author_lname;
          this.dataService.getBookByAuthorNameOrBookTitle(this.findBookAvailability).subscribe(
            next => {
              this.findBookAvailability.return_date = next[0].return_date;
              this.returnDate = formatDate((this.findBookAvailability.return_date), 'yyyy-MM-dd', 'en-US');
            }
          );

        } else {
          this.returnDate = '';
        }
      }
    );
  }

  closeModal() {
    this.router.navigate(['books']);
    window.location.reload();
  }

  findBookByTitleOrByAuthorName(searching: string) {
    if (searching.length < 3) {
      this.router.navigate(['books']);
      this.dataService.getBooks().subscribe(
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
      this.router.navigate(['books'],
        {queryParams: {action: this.searchingBook}});
      this.dataService.findBookByTitleOrByAuthorName(searching).subscribe(
        next => {
          this.books = next;
        }
      );

    }

  }
}
