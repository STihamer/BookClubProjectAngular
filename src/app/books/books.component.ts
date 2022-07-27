import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {Book} from "../model/Book";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Array<Book> = new Array<Book>();


  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.books.subscribe(next =>{
      this.books = next;
      console.log(this.books);
    });
  }

}
