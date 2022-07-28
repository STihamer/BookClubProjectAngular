import {Component, OnInit} from '@angular/core';
import {Book} from "../../model/Book";

@Component({
  selector: 'app-edit-book',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  formBook: Book = new Book();

  constructor() {
  }

  ngOnInit(): void {
  }

}
