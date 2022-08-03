
import {User} from "./User";
import {BookOwner} from "./BookOwner";

export class WaitingList {

  id: number = 0;
  user_id: number = new User().user_id;
  book_for_reading = new BookOwner().id;
  finished = false


  static fromHttp(waitingList: WaitingList): WaitingList {
    const newWaitingList = new WaitingList();
    newWaitingList.id = waitingList.id;
    newWaitingList.user_id = waitingList.user_id;
    newWaitingList.book_for_reading = waitingList.book_for_reading;
    newWaitingList.finished = waitingList.finished;

    return newWaitingList;
  }
}

