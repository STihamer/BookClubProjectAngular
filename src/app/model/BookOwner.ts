import {User} from "./User";
import {BookDTO} from "./BookDTO";

export class BookOwner {

  id: number = 0;
  book_id: number = new BookDTO().bookId;
  user_id: number = new User().user_id;


  static fromHttp(bookOwner: BookOwner): BookOwner {
    const newBookOwner = new BookOwner();
    newBookOwner.id = bookOwner.id;
    newBookOwner.book_id = bookOwner.book_id;
    newBookOwner.user_id = bookOwner.user_id;

    return newBookOwner;
  }
}
