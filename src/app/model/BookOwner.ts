import {User} from "./User";
import {Book} from "./Book";

export class BookOwner {

  id: number = 0;
  book_id: number = new Book().book_id;
  user_id: number = new User().user_id;


  static fromHttp(bookOwner: BookOwner): BookOwner {
    const newBookOwner = new BookOwner();
    newBookOwner.id = bookOwner.id;
    newBookOwner.book_id = bookOwner.book_id;
    newBookOwner.user_id = bookOwner.user_id;

    return newBookOwner;
  }
}
