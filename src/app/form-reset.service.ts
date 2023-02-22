import {EventEmitter, Injectable} from '@angular/core';
import {UserDTO} from "./model/UserDTO";
import {BookDTO} from "./model/BookDTO";
import {MyListingDTO} from "./model/MyListingDTO";
import {BookOwnerDTO} from "./model/BookOwnerDTO";
import {WaitingListDTO} from "./model/WaitingListDTO";
import {WaitingListDetail} from "./model/WaitingListDetail";
import {RentingDataForScreen} from "./model/RentingDataForScreen";

@Injectable({
  providedIn: 'root'
})
export class FormResetService {
  resetBookFormEvent = new EventEmitter<BookDTO>();
  resetUserFormEvent = new EventEmitter<UserDTO>();
  resetMyListingFormEvent = new EventEmitter<MyListingDTO>();
  resetOwnerBookFormEvent = new EventEmitter<BookOwnerDTO>();
  resetWaitingListFormEvent = new EventEmitter<WaitingListDetail>();
  resetRentingTableFormEvent = new EventEmitter<RentingDataForScreen>();

  constructor() { }
}
