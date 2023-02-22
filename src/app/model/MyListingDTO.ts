import { UserDTO} from "./UserDTO";
import {BookDTO} from "./BookDTO";

export class MyListingDTO {

  id: number = 0;
  readingPerson: number = new UserDTO().userId;
  bookTitle: number = new BookDTO().bookId;

  static fromHttp(myListing: MyListingDTO): MyListingDTO {
    const newMyListing = new MyListingDTO();
    newMyListing.id = myListing.id;
    newMyListing.readingPerson = myListing.readingPerson;
    newMyListing.bookTitle = myListing.bookTitle;

    return newMyListing;
  }
}
