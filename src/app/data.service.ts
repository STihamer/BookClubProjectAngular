import {Injectable} from '@angular/core';
import {User} from "./model/User";
import {map, Observable} from "rxjs";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Book} from "./model/Book";

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
          const books= new Array<Book>();
          for (const book of data) {
            books.push(Book.fromHttp(book));
          }
          return books
        })
      );
  }



  updateUser(user: User, id: number): Observable<any> {

    return this.http.put<User>(environment.restUrl + `/users/${id}`,user);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<User>(environment.restUrl + `/users/${id}`)
      .pipe(map(data => {
        return User.fromHttp(data);
      }))
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get<User>(environment.restUrl + `/users/${username}`)
      .pipe(map(data => {
        return User.fromHttp(data);
      }))
  }

  private correctedUser(user: User) {
    return {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      user_age: user.user_age,
      username: user.username,
      user_email: user.user_email
    }
  }
}

