import { User} from "./User";
import {BookDTO} from "./BookDTO";

export class MyListing {

  id: number = 0;
  reading_person: number = new User().user_id;
  book_title: number = new BookDTO().bookId;

  static fromHttp(myListing: MyListing): MyListing {
    const newMyListing = new MyListing();
    newMyListing.id = myListing.id;
    newMyListing.reading_person = myListing.reading_person;
    newMyListing.book_title = myListing.book_title;

    return newMyListing;
  }
}
