import {EventEmitter, Injectable} from '@angular/core';
import {User} from "./model/User";
import {BookDTO} from "./model/BookDTO";
import {MyListing} from "./model/MyListing";
import {BookOwner} from "./model/BookOwner";
import {WaitingList} from "./model/WaitingList";
import {WaitingListDetail} from "./model/WaitingListDetail";
import {RentingDataForScreen} from "./model/RentingDataForScreen";

@Injectable({
  providedIn: 'root'
})
export class FormResetService {
  resetBookFormEvent = new EventEmitter<BookDTO>();
  resetUserFormEvent = new EventEmitter<User>();
  resetMyListingFormEvent = new EventEmitter<MyListing>();
  resetOwnerBookFormEvent = new EventEmitter<BookOwner>();
  resetWaitingListFormEvent = new EventEmitter<WaitingListDetail>();
  resetRentingTableFormEvent = new EventEmitter<RentingDataForScreen>();

  constructor() { }
}
