import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {Book} from "../model/Book";
import {ActivatedRoute, Router} from "@angular/router";

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

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadData()
  }

  setBook(id: number) {
    this.router.navigate(['books'], {queryParams: {id: id, action: 'view'}})
  }

  loadData() {
    this.dataService.books.subscribe(
      next => {
        this.books = next;
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

        });
      }, errors => {
        this.message = 'An error occurred - please contact support';
      }
    )
  }

  editBook() {
    this.bookHidden = true;
    this.router.navigate(['books'], {queryParams: {action: 'edit', id: this.selectedBook.book_id}})
  }

}
