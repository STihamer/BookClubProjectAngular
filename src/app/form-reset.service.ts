import {EventEmitter, Injectable} from '@angular/core';
import {User} from "./model/User";
import {Book} from "./model/Book";
import {MyListing} from "./model/MyListing";
import {BookOwner} from "./model/BookOwner";

@Injectable({
  providedIn: 'root'
})
export class FormResetService {
  resetBookFormEvent = new EventEmitter<Book>();
  resetUserFormEvent = new EventEmitter<User>();
  resetMyListingFormEvent = new EventEmitter<MyListing>();
  resetOwnerBookFormEvent = new EventEmitter<BookOwner>();

  constructor() { }
}
