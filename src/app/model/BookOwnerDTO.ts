import {UserDTO} from "./UserDTO";
import {BookDTO} from "./BookDTO";

export class BookOwnerDTO {

  id: number = 0;
  bookId: number = new BookDTO().bookId;
  userId: number = new UserDTO().userId;


  static fromHttp(bookOwner: BookOwnerDTO): BookOwnerDTO {
    const newBookOwner = new BookOwnerDTO();
    newBookOwner.id = bookOwner.id;
    newBookOwner.bookId = bookOwner.bookId;
    newBookOwner.userId = bookOwner.userId;

    return newBookOwner;
  }
}
