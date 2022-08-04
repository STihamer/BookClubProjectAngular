import {Injectable} from '@angular/core';
import {User} from "./model/User";
import {map, Observable} from "rxjs";
import {environment} from "../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Book} from "./model/Book";
import {MyListing} from "./model/MyListing";
import {BookOwner} from "./model/BookOwner";
import {WaitingList} from "./model/WaitingList";
import {RentingTable} from "./model/RentingTable";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {

  }


  get users(): Observable<Array<User>> {
    return this.http.get<Array<User>>(environment.restUrl + '/users')
      .pipe(
        map(data => {
          const users = new Array<User>();
          for (const user of data) {
            users.push(User.fromHttp(user));
          }
          return users
        })
      );
  }

  get books(): Observable<Array<Book>> {
    return this.http.get<Array<Book>>(environment.restUrl + '/books')
      .pipe(
        map(data => {
          const books = new Array<Book>();
          for (const book of data) {
            books.push(Book.fromHttp(book));
          }
          return books
        })
      );
  }


  updateUser(user: User, id: number): Observable<any> {

    return this.http.put<User>(environment.restUrl + `/users/${id}`, user);
  }

  updateBook(book: Book, id: number): Observable<any> {

    return this.http.put<Book>(environment.restUrl + `/books/${id}`, book);
  }

  updateWaitingList(waitingList: WaitingList, id:number): Observable<WaitingList> {
    const param = new HttpParams()
      .set('finished', waitingList.finished)
    return this.http.put<WaitingList>(environment.restUrl + `/waitingList/${id}?${param}`, waitingList);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<User>(environment.restUrl + `/users/${id}`)
      .pipe(map(data => {
        return User.fromHttp(data);
      }))
  }

  getBookById(id: number): Observable<any> {
    return this.http.get<Book>(environment.restUrl + `/books/${id}`)
      .pipe(map(data => {
        return Book.fromHttp(data);
      }))
  }
  getBookOwnerById(id: number): Observable<any> {
    return this.http.get<BookOwner>(environment.restUrl + `/bookOwner/${id}`)
      .pipe(map(data => {
        return BookOwner.fromHttp(data);
      }))
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get<User>(environment.restUrl + `/users/${username}`)
      .pipe(map(data => {
        return User.fromHttp(data);
      }))
  }

  get myListing(): Observable<Array<MyListing>> {
    return this.http.get<Array<MyListing>>(environment.restUrl + '/myListing')
      .pipe(
        map(data => {
          const myListings = new Array<MyListing>();
          for (const myListing of data) {
            myListings.push(MyListing.fromHttp(myListing));
          }
          return myListings
        })
      );
  }
  get bookOwners(): Observable<Array<BookOwner>> {
    return this.http.get<Array<BookOwner>>(environment.restUrl + '/bookOwner')
      .pipe(
        map(data => {
          const bookOwners = new Array<BookOwner>();
          for (const bookOwner of data) {
            bookOwners.push(BookOwner.fromHttp(bookOwner));
          }
          return bookOwners
        })
      );
  }

  get waitingLists(): Observable<Array<WaitingList>> {
    return this.http.get<Array<WaitingList>>(environment.restUrl + '/waitingList')
      .pipe(
        map(data => {
          const waitingLists = new Array<WaitingList>();
          for (const waitingList of data) {
            waitingLists.push(WaitingList.fromHttp(waitingList));
          }
          return waitingLists
        })
      );
  }

  get rentingTables(): Observable<Array<RentingTable>> {
    return this.http.get<Array<RentingTable>>(environment.restUrl + '/rentingTable')
      .pipe(
        map(data => {
          const rentingTables = new Array<RentingTable>();
          for (const rentingTable of data) {
            rentingTables.push(RentingTable.fromHttp(rentingTable));
          }
          return rentingTables
        })
      );
  }
  deleteBook(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/books/${id}`);
  }

  deleteMyListing(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/myListing/${id}`);
  }

  deleteOwnerBook(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/bookOwner/${id}`);
  }

  deleteWaitingList(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/waitingList/${id}`);
  }

  addBook(newBook: Book): Observable<Book> {
    const fullBook = {
      book_title: newBook.book_title, author_fname: newBook.author_fname,
      author_lname: newBook.author_lname, published: newBook.published
    };
    return this.http.post<Book>(environment.restUrl + '/books', fullBook);
  }

  addMyListing(myListing: MyListing): Observable<MyListing> {
    const params = new HttpParams()
      .set('reading_person', myListing.reading_person)
      .set('book_title', myListing.book_title);
    return this.http.post<MyListing>(environment.restUrl + `/myListing?${params}`, myListing);
  }

  addBookOwner(newBookOwner: BookOwner): Observable<BookOwner> {
    const fullBookOwner = {
      book_id: newBookOwner.book_id,
      user_id: newBookOwner.user_id
    };
    return this.http.post<BookOwner>(environment.restUrl + '/bookOwner', fullBookOwner);
  }
  addWaitingList(waitingList: WaitingList): Observable<WaitingList> {
    const params = new HttpParams()
      .set('user_id', waitingList.user_id)
      .set('finished', waitingList.finished)
      .set('book_for_reading', waitingList.book_for_reading);
    console.log(params.toString())
    return this.http.post<WaitingList>(environment.restUrl + `/waitingList?${params}`, waitingList);
  }


}

