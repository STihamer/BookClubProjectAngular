import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {BooksNonRentedResponse} from "../../model/BooksNonRentedResponse";
import {Router} from "@angular/router";

@Component({
  selector: 'app-available-books',
  templateUrl: './available-books.component.html',
  styleUrls: ['./available-books.component.css']
})
export class AvailableBooksComponent implements OnInit {
  booksNonRented: Array<BooksNonRentedResponse> = new Array<BooksNonRentedResponse>();
  searchingText = '';

  constructor(private dataService: DataService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getNonRentedBooks();
  }

  findBookByTitle(searching: string) {
    let id = 0;
    if (searching.length < 1) {
      this.router.navigate(['booksNonRented']);
      this.dataService.bookNonRented.subscribe(
        next => {
          this.booksNonRented = next.sort((a, b) => {
            if (a.book_title > b.book_title) {
              return 1;
            } else if (a.book_title < b.book_title) {
              return -1;
            }
            return 0;
          });
          for (let book of this.booksNonRented) {
            id++;
            book.id = id;
          }
        });
    } else {
      this.router.navigate(['booksNonRented'],
        {queryParams: {action: this.searchingText}});
      this.dataService.bookNonRented.subscribe(
        next => {
          this.booksNonRented = next.filter(book => book.book_title.toLowerCase().indexOf(searching.toLowerCase()) > -1).sort(
            (a, b) => {
              if (a.book_title > b.book_title) {
                return 1;
              } else if (a.book_title < b.book_title) {
                return -1;
              }
              return 0;
            });
          for (let book of this.booksNonRented) {
            id++;
            book.id = id;
          }
        }
      )
    }
  }

  cleanSearchingText() {
    this.searchingText = '';
    this.getNonRentedBooks();
  }

  getNonRentedBooks() {
    let id = 0;
    this.dataService.bookNonRented.subscribe(
      next => {
        this.booksNonRented = next.sort((a, b) => {
          if (a.book_title > b.book_title) {
            return 1;
          } else if (a.book_title < b.book_title) {
            return -1;
          }
          return 0;
        });
        for (let book of this.booksNonRented) {
          id++;
          book.id = id;
        }
      }
    );
  }
}
