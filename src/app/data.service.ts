import {Injectable} from '@angular/core';
import {UserDTO} from "./model/UserDTO";
import {map, Observable} from "rxjs";
import {environment} from "../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BookDTO} from "./model/BookDTO";
import {MyListing} from "./model/MyListing";
import {BookOwnerDTO} from "./model/BookOwnerDTO";
import {WaitingList} from "./model/WaitingList";
import {RentingTable} from "./model/RentingTable";
import {BooksNonRentedResponse} from "./model/BooksNonRentedResponse";
import {RentingPeriod} from "./model/RentingPeriod";
import {WaitingPersonsAndBookTitle} from "./model/WaitingPersonsAndBookTitle";
import {FindBookByTitleOrAuthorIfAvailable} from "./model/FindBookByTitleOrAuthorIfAvailable";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {

  }


  getUsers(): Observable<Array<UserDTO>> {
    return this.http.get<Array<UserDTO>>(environment.restUrl + '/api/users', {withCredentials: true})
      .pipe(
        map(data => {
          const users = new Array<UserDTO>();
          for (const user of data) {
            users.push(UserDTO.fromHttp(user));
          }
          return users
        })
      );
  }

  getBooks(): Observable<Array<BookDTO>> {

    return this.http.get<Array<BookDTO>>(environment.restUrl + '/api/books', {withCredentials: true})
      .pipe(
        map(data => {
          const books = new Array<BookDTO>();
          for (const book of data) {
            books.push(BookDTO.fromHttp(book));
          }
          return books
        })
      );
  }


  updateUser(user: UserDTO, id: number): Observable<any> {

    return this.http.put<UserDTO>(environment.restUrl + `/api/users/${id}`, user, {withCredentials: true});
  }

  updateBook(book:BookDTO, id: number): Observable<any> {

    return this.http.put<BookDTO>(environment.restUrl + `/api/books/${id}`, book,{withCredentials: true});
  }

  updateWaitingList(waitingList: WaitingList, id: number): Observable<WaitingList> {
    const param = new HttpParams()
      .set('finished', waitingList.finished)
    return this.http.put<WaitingList>(environment.restUrl + `/api/waitingLists/${id}?${param}`, waitingList,{withCredentials: true});
  }

  updateRentingTableReturnDate(rentingTable: RentingTable, id: number, period: number): Observable<RentingTable> {
    const param = new HttpParams()
      .set('period', period)
    return this.http.put<RentingTable>(environment.restUrl + `/api/rentingTables/${id}?${param}`, rentingTable,{withCredentials: true});
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<UserDTO>(environment.restUrl + `/api/users/${id}`, {withCredentials: true})
      .pipe(map(data => {
        return UserDTO.fromHttp(data);
      }))
  }

  getBookById(id: number): Observable<any> {
    return this.http.get<BookDTO>(environment.restUrl + `/api/books/${id}`,{withCredentials: true})
      .pipe(map(data => {
        return BookDTO.fromHttp(data);
      }))
  }

  getBookOwnerById(id: number): Observable<any> {
    return this.http.get<BookOwnerDTO>(environment.restUrl + `/api/bookOwners/${id}`,{withCredentials: true})
      .pipe(map(data => {
        return BookOwnerDTO.fromHttp(data);
      }))
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get<UserDTO>(environment.restUrl + `/api/users/${username}`,{withCredentials: true})
      .pipe(map(data => {
        return UserDTO.fromHttp(data);
      }))
  }

  getMyListing(): Observable<Array<MyListing>> {
    return this.http.get<Array<MyListing>>(environment.restUrl + '/api/myListings', {withCredentials: true})
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

  get bookOwners(): Observable<Array<BookOwnerDTO>> {
    return this.http.get<Array<BookOwnerDTO>>(environment.restUrl + '/api/bookOwners',{withCredentials: true})
      .pipe(
        map(data => {
          const bookOwners = new Array<BookOwnerDTO>();
          for (const bookOwner of data) {
            bookOwners.push(BookOwnerDTO.fromHttp(bookOwner));
          }
          return bookOwners
        })
      );
  }

  get waitingLists(): Observable<Array<WaitingList>> {
    return this.http.get<Array<WaitingList>>(environment.restUrl + '/api/waitingLists',{withCredentials: true})
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
    return this.http.get<Array<RentingTable>>(environment.restUrl + '/api/rentingTables', {withCredentials: true})
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
    return this.http.get<Array<BooksNonRentedResponse>>(environment.restUrl + '/api/booksNonRented',{withCredentials: true})
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

  rentingTablesByTitleOrAuthorName(bookTitle: string, authorFirstName: string, authorLastName: string): Observable<Array<RentingTable>> {
    const params = new HttpParams()
      .set('book_title', bookTitle)
      .set('author_fname', authorFirstName)
      .set('author_lname', authorLastName)
    return this.http.get<Array<RentingTable>>(environment.restUrl + `/api/rentingTables/findBooksByTitleOrAuthorName?${params}`,{withCredentials: true})
      .pipe(
        map(data => {
          const foundBooks = new Array<RentingTable>();
          for (const foundBook of data) {
            foundBooks.push(RentingTable.fromHttp(foundBook));
          }
          return foundBooks
        })
      );
  }

  findBookByTitleOrByAuthorName(searching: string): Observable<Array<BookDTO>> {
    const params = new HttpParams()
      .set('searching', searching)
    return this.http.get<Array<BookDTO>>(environment.restUrl + `/api/books/findBooksByTitleOrAuthorName?${params}`,{withCredentials: true})
      .pipe(
        map(data => {
          const foundBooks = new Array<BookDTO>();
          for (const foundBook of data) {
            foundBooks.push(BookDTO.fromHttp(foundBook));
          }
          return foundBooks
        })
      );
  }

  get rentingPeriods(): Observable<Array<RentingPeriod>> {
    return this.http.get<Array<RentingPeriod>>(environment.restUrl + '/api/rentingPeriods',{withCredentials: true})
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

  getWaitingPersonsAndBookTitle(waitingPerson: WaitingPersonsAndBookTitle): Observable<Array<WaitingPersonsAndBookTitle>> {
    const params = new HttpParams()
      .set('first_name', waitingPerson.first_name)
      .set('last_name', waitingPerson.last_name)
    return this.http.get<Array<WaitingPersonsAndBookTitle>>(environment.restUrl + `/api/waitingPersonsAndBookTitle?${params}`,{withCredentials: true})
      .pipe(
        map(data => {
          const waitingPersonsAndBookTitle = new Array<WaitingPersonsAndBookTitle>();
          for (const waitingPersonAndBookTitle of data) {
            waitingPersonsAndBookTitle.push(WaitingPersonsAndBookTitle.fromHttp(waitingPersonAndBookTitle));
          }
          return waitingPersonsAndBookTitle
        })
      );
  }

  getBookByAuthorNameOrBookTitle(bookByAuthorAndTitle: FindBookByTitleOrAuthorIfAvailable): Observable<Array<FindBookByTitleOrAuthorIfAvailable>> {
    const params = new HttpParams()
      .set('book_title', bookByAuthorAndTitle.book_title)
      .set('first_name', bookByAuthorAndTitle.author_fname)
      .set('last_name', bookByAuthorAndTitle.author_lname)
    return this.http.get<Array<FindBookByTitleOrAuthorIfAvailable>>(environment.restUrl + `/api/bookAvailabilityByAuthorOrTitle?${params}`,{withCredentials: true})
      .pipe(
        map(data => {
          const availableBooksByTitle = new Array<FindBookByTitleOrAuthorIfAvailable>();
          for (const availableBookByTitle of data) {
            availableBooksByTitle.push(FindBookByTitleOrAuthorIfAvailable.fromHttp(availableBookByTitle));
          }
          return availableBooksByTitle;
        })
      );
  }


  deleteBook(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/api/books/${id}`,{withCredentials: true});
  }

  deleteMyListing(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/api/myListings/${id}`,{withCredentials: true});
  }

  deleteOwnerBook(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/api/bookOwners/${id}`,{withCredentials: true});
  }

  deleteWaitingListById(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/api/waitingLists/${id}`,{withCredentials: true});
  }

  deleteRentingTableById(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + `/api/rentingTables/${id}`,{withCredentials: true});
  }

  addUser(user: UserDTO): Observable<UserDTO> {
    const params = new HttpParams()
      .set('first_name', user.firstName)
      .set('last_name', user.lastName)
      .set('user_age', user.userAge)
      .set('username', user.username)
      .set('user_email', user.userEmail)
      .set('user_password', user.password)
      .set('role_id', user.roleId);
    return this.http.post<UserDTO>(environment.restUrl + `/api/users?${params}`, user,{withCredentials: true});
  }

  registerUser(user: UserDTO): Observable<UserDTO> {
    const params = new HttpParams()
      .set('first_name', user.firstName)
      .set('last_name', user.lastName)
      .set('user_age', user.userAge)
      .set('username', user.username)
      .set('user_email', user.userEmail)
      .set('user_password', user.password)
      .set('role_id', user.roleId);
    return this.http.post<UserDTO>(environment.restUrl + `/api/users/registration?${params}`, user,{withCredentials: true});
  }

  addBook(newBook: BookDTO): Observable<BookDTO> {
    const fullBook = {
      bookTitle: newBook.bookTitle, authorFirstName: newBook.authorFirstName,
      authorLastName: newBook.authorLastName, publishedYear: newBook.publishedYear
    };
    return this.http.post<BookDTO>(environment.restUrl + '/api/books', fullBook,{withCredentials: true});
  }

  addMyListing(myListing: MyListing): Observable<MyListing> {
    const params = new HttpParams()
      .set('reading_person', myListing.reading_person)
      .set('book_title', myListing.book_title);
    return this.http.post<MyListing>(environment.restUrl + `/api/myListings?${params}`, myListing,{withCredentials: true});
  }

  addBookOwner(newBookOwner: BookOwnerDTO): Observable<BookOwnerDTO> {
    const fullBookOwner = {
      bookId: newBookOwner.bookId,
      userId: newBookOwner.userId
    };
    return this.http.post<BookOwnerDTO>(environment.restUrl + '/api/bookOwners', fullBookOwner,{withCredentials: true});
  }

  addWaitingList(waitingList: WaitingList): Observable<WaitingList> {
    const params = new HttpParams()
      .set('user_id', waitingList.user_id)
      .set('finished', waitingList.finished)
      .set('book_for_reading', waitingList.book_for_reading);
    return this.http.post<WaitingList>(environment.restUrl + `/api/waitingLists?${params}`, waitingList,{withCredentials: true});
  }


  addRentingTable(rentingTable: RentingTable): Observable<RentingTable> {
    const params = new HttpParams()
      .set('borrowed_by', rentingTable.borrowed_by)
      .set('book_id', rentingTable.book_id)
      .set('renting_period', rentingTable.renting_period);
    return this.http.post<RentingTable>(environment.restUrl + `/api/rentingTables?${params}`, rentingTable,{withCredentials: true});
  }

  validateUser(name: string, password: string): Observable<{ result: string }> {
    const authData = btoa(`${name}:${password}`);
    const headers = new HttpHeaders().append('Authorization', 'Basic ' + authData);
    return this.http.get<{ result: string }>(environment.restUrl + '/api/basicAuth/validate', {
      headers: headers,
      withCredentials: true
    })
  }

  getRole(): Observable<{ role: string }> {
    const headers = new HttpHeaders().append("X-Requested-With", "XMLHttpRequest");
    return this.http.get<{ role: string }>(environment.restUrl + '/api/users/currentUserRole', {headers,
      withCredentials: true
    });
  }

  getId(): Observable<{ id: number }> {
    return this.http.get<{ id: number }>(environment.restUrl + '/api/users/currentUserId', {withCredentials: true});
  }
  logout(): Observable<string>{
      return this.http.get<string>(environment.restUrl + '/api/users/logout', {
      withCredentials: true
    });
  }
}

