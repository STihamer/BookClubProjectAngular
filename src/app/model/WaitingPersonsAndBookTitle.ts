export class WaitingPersonsAndBookTitle {
  id: number = 0;
  first_name: string = '';
  last_name: string = '';
  book_id: number = 0;
  book_title = '';

  static fromHttp(waitingPersonsAndBookTitle: WaitingPersonsAndBookTitle): WaitingPersonsAndBookTitle {
    const newWaitingPersonsAndBookTitle = new WaitingPersonsAndBookTitle();
    newWaitingPersonsAndBookTitle.id = waitingPersonsAndBookTitle.id;
    newWaitingPersonsAndBookTitle.first_name = waitingPersonsAndBookTitle.first_name;
    newWaitingPersonsAndBookTitle.last_name = waitingPersonsAndBookTitle.last_name;
    newWaitingPersonsAndBookTitle.book_title = waitingPersonsAndBookTitle.book_title;
    return newWaitingPersonsAndBookTitle;
  }
}
