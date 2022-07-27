import {EventEmitter, Injectable} from '@angular/core';
import {User} from "./model/User";
import {Book} from "./model/Book";

@Injectable({
  providedIn: 'root'
})
export class FormResetService {
  resetBookFormEvent = new EventEmitter<Book>();
  resetUserFormEvent = new EventEmitter<User>();

  constructor() { }
}
