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
import {BooksNonRentedResponse} from "./model/BooksNonRentedResponse";
import {RentingPeriod} from "./model/RentingPeriod";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {

  }


  get users(): Observable<Array<User>> {
    return this.http.get<Array<User>>(environment.restUrl + '/api/users')
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
    return this.http.get<Array<Book>>(environment.restUrl + '/api/books')
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

    return this.http.put<User>(environment.restUrl + `/api/users/${id}`, user);
  }

  updateBook(book: Book, id: number): Observable<any> {

    return this.http.put<Book>(environment.restUrl + `/api/books/${id}`, book);
  }

  updateWaitingList(waitingList: WaitingList, id: number): Observable<WaitingList> {
    const param = new HttpParams()
      .set('finished', waitingList.finished)
    return this.http.put<WaitingList>(environment.restUrl + `/api/waitingLists/${id}?${param}`, waitingList);
  }

  updateRentingTableReturnDate(rentingTable: RentingTable, id: number, period: number, extension: boolean): Observable<RentingTable> {
    const param = new HttpParams()
      .set('period', period)
      .set('extended', extension)
    return this.http.put<RentingTable>(environment.restUrl + `/api/rentingTables/${id}?${param}`, rentingTable);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<User>(environment.restUrl + `/api/users/${id}`)
      .pipe(map(data => {
        return User.fromHttp(data);
      }))
  }

  getBookById(id: number): Observable<any> {
    return this.http.get<Book>(environment.restUrl + `/api/books/${id}`)
      .pipe(map(data => {
        return Book.fromHttp(data);
      }))
  }

  getBookOwnerById(id: number): Observable<any> {
    return this.http.get<BookOwner>(environment.restUrl + `/api/bookOwners/${id}`)
      .pipe(map(data => {
        return BookOwner.fromHttp(data);
      }))
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get<User>(environment.restUrl + `/api/users/${username}`)
      .pipe(map(data => {
        return User.fromHttp(data);
      }))
  }

  get myListing(): Observable<Array<MyListing>> {
    return this.http.get<Array<MyListing>>(environment.restUrl + '/api/myListings')
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
    return this.http.get<Array<BookOwner>>(environment.restUrl + '/api/bookOwners')
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
    return this.http.get<Array<WaitingList>>(environment.restUrl + '/api/waitingLists')
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
    return this.http.get<Array<RentingTable>>(environment.restUrl + '/api/rentingTables')
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

  get bookNonRented(): Observable<Array<BooksNonRentedResponse>> {
    return this.http.get<Array<BooksNonRentedResponse>>(environment.restUrl + '/api/booksNonRented')
      .pipe(
        map(data => {
          const booksNonRented = new Array<BooksNonRentedResponse>();
          for (const bookNonRented of data) {
            booksNonRented.push(BooksNonRentedResponse.fromHttp(bookNonRented));
          }
          return booksNonRented
        })
      );
  }

  get rentingPeriods(): Observable<Array<RentingPeriod>> {
    return this.http.get<Array<RentingPeriod>>(environment.restUrl + '/api/rentingPeriods')
      .pipe(
        map(data => {
          const rentingPeriods = new Array<RentingPeriod>();
          for (const rentingPeriod of data) {
            rentingPeriods.push(RentingPeriod.fromHttp(rentingPeriod));
          }
          return rentingPeriods
        })
      );
  }


  deleteBook(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/api/books/${id}`);
  }

  deleteMyListing(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/api/myListings/${id}`);
  }

  deleteOwnerBook(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/api/bookOwners/${id}`);
  }

  deleteWaitingListById(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/api/waitingLists/${id}`);
  }

  deleteRentingTableById(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/api/rentingTables/${id}`);
  }

  addBook(newBook: Book): Observable<Book> {
    const fullBook = {
      book_title: newBook.book_title, author_fname: newBook.author_fname,
      author_lname: newBook.author_lname, published: newBook.published
    };
    return this.http.post<Book>(environment.restUrl + '/api/books', fullBook);
  }

  addMyListing(myListing: MyListing): Observable<MyListing> {
    const params = new HttpParams()
      .set('reading_person', myListing.reading_person)
      .set('book_title', myListing.book_title);
    return this.http.post<MyListing>(environment.restUrl + `/api/myListings?${params}`, myListing);
  }

  addBookOwner(newBookOwner: BookOwner): Observable<BookOwner> {
    const fullBookOwner = {
      book_id: newBookOwner.book_id,
      user_id: newBookOwner.user_id
    };
    return this.http.post<BookOwner>(environment.restUrl + '/api/bookOwners', fullBookOwner);
  }

  addWaitingList(waitingList: WaitingList): Observable<WaitingList> {
    const params = new HttpParams()
      .set('user_id', waitingList.user_id)
      .set('finished', waitingList.finished)
      .set('book_for_reading', waitingList.book_for_reading);
    return this.http.post<WaitingList>(environment.restUrl + `/api/waitingLists?${params}`, waitingList);
  }

  addRentingTable(rentingTable: RentingTable): Observable<RentingTable> {
    const params = new HttpParams()
      .set('borrowed_by', rentingTable.borrowed_by)
      .set('book_id', rentingTable.book_id)
      .set('renting_period', rentingTable.renting_period);
    return this.http.post<RentingTable>(environment.restUrl + `/api/rentingTables?${params}`, rentingTable);
  }


}

