import {EventEmitter, Injectable} from '@angular/core';
import {User} from "./model/User";
import {Book} from "./model/Book";
import {MyListing} from "./model/MyListing";
import {BookOwner} from "./model/BookOwner";
import {WaitingList} from "./model/WaitingList";
import {WaitingListDetail} from "./model/WaitingListDetail";

@Injectable({
  providedIn: 'root'
})
export class FormResetService {
  resetBookFormEvent = new EventEmitter<Book>();
  resetUserFormEvent = new EventEmitter<User>();
  resetMyListingFormEvent = new EventEmitter<MyListing>();
  resetOwnerBookFormEvent = new EventEmitter<BookOwner>();
  resetWaitingListFormEvent = new EventEmitter<WaitingListDetail>();

  constructor() { }
}
