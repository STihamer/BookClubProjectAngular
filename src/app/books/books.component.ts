import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {BookDTO} from "../model/BookDTO";
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
  books: Array<BookDTO> = new Array<BookDTO>();
  selectedBook: any = new BookDTO();
  action: string = '';
  message: string = '';
  bookHidden = false;
  searchingBook: string = '';
  nonRentedBooks: Array<BooksNonRentedResponse> = new Array<BooksNonRentedResponse>();
  returnDate = '';
  findBookAvailability: FindBookByTitleOrAuthorIfAvailable = new FindBookByTitleOrAuthorIfAvailable();
  ifBookIsRented: BooksNonRentedResponse = new BooksNonRentedResponse();
  isAdminUser = false;

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private formResetService: FormResetService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.returnDate = '';
    this.authService.rolesSetEvent.subscribe(
      next => {
        this.isAdminUser = next === 'admin';
      }
    )
    this.loadData()
  }

  setBook(id: number) {
    this.router.navigate(['books'], {queryParams: {id: id, action: 'view'}})
    this.selectedBook = this.books.find(book => book.bookId === +id);
    this.getBookAvailabilityByUsernameAndTitle(id)
  }

  loadData() {
    this.dataService.getBooks().subscribe(
      next => {

        this.books = next.sort((a, b) => {
          if (a.bookId > b.bookId) {
            return 1;
          } else if (a.bookId < b.bookId) {
            return -1;
          }
          return 0;
        });
        this.booksComponentRouting();

      }, () => {
        this.message = 'An error occurred - please contact support';
      }
    )
  }

  editBook() {
    this.bookHidden = true;
    this.router.navigate(['books'],
      {queryParams: {action: 'edit', id: this.selectedBook.bookId}})
  }

  deleteSearchingByTitle() {
    this.router.navigate(['books']);
    this.dataService.getBooks().subscribe(next => this.books = next);
    this.searchingBook = '';
  }

  addBook() {
    this.selectedBook = new BookDTO();
    this.router.navigate(['books'], {queryParams: {action: 'add'}});
    this.formResetService.resetBookFormEvent.emit(this.selectedBook);
    this.bookHidden = true;
  }

  getBookAvailabilityByUsernameAndTitle(id: number) {
    this.dataService.getBookById(id).subscribe(next => this.selectedBook = next)
    this.dataService.bookNonRented.subscribe(
      next => {
        this.nonRentedBooks = next;
        this.ifBookIsRented = this.nonRentedBooks
          .filter(element => element.book_id == this.selectedBook.bookId)[0];
        if (!this.ifBookIsRented) {
          this.findBookAvailability.book_title = this.selectedBook.bookTitle;
          this.findBookAvailability.book_id = this.selectedBook.bookId;
          this.findBookAvailability.author_fname = this.selectedBook.authorFirstName;
          this.findBookAvailability.author_lname = this.selectedBook.authorLastName;
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
  }

  findBookByTitleOrByAuthorName(searching: string) {
    if (searching.length < 3) {
      this.router.navigate(['books']);
      this.dataService.getBooks().subscribe(
        next => {
          this.books = next.sort((a, b) => {
            if (a.bookTitle > b.bookTitle) {
              return 1;
            } else if (a.bookTitle < b.bookTitle) {
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

  booksComponentRouting() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.action = params['action'];
      if (!this.action || this.action === 'view') {
        this.bookHidden = false;
        this.router.navigate(['books']);
      }
      if (id) {
        this.selectedBook = this.books.find(book => book.bookId === +id);
      }
      if (this.action === 'edit' && id) {
        this.bookHidden = true;
        this.router.navigate(['books'],
          {queryParams: {action: 'edit', id: this.selectedBook.bookId}})
      }
      if (this.action === "add") {
        this.router.navigate(['books'], {queryParams: {action: 'add'}});
        this.bookHidden = true;
      }
    });
  }
  closeAddBook(){
    this.bookHidden = false;
    this.router.navigate(['books']);
  }
}
