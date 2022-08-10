import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {BooksNonRentedResponse} from "../../model/BooksNonRentedResponse";

@Component({
  selector: 'app-available-books',
  templateUrl: './available-books.component.html',
  styleUrls: ['./available-books.component.css']
})
export class AvailableBooksComponent implements OnInit {
  booksNonRented: Array<BooksNonRentedResponse> = new Array<BooksNonRentedResponse>();

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    let id = 0;
    this.dataService.bookNonRented.subscribe(
      next => {
        this.booksNonRented = next;
        for(let book of this.booksNonRented){
          id ++;
          book.id = id;
        }
      }
    )
  }

}
