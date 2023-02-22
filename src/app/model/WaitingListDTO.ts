
import {UserDTO} from "./UserDTO";
import {BookOwnerDTO} from "./BookOwnerDTO";

export class WaitingListDTO {

  id: number = 0;
  userId: number = 0;
  bookForReading = 0;
  finished = false


  static fromHttp(waitingList: WaitingListDTO): WaitingListDTO {
    const newWaitingList = new WaitingListDTO();
    newWaitingList.id = waitingList.id;
    newWaitingList.userId = waitingList.userId;
    newWaitingList.bookForReading = waitingList.bookForReading;
    newWaitingList.finished = waitingList.finished;

    return newWaitingList;
  }
}

