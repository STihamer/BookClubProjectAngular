export class RentingDataForScreen {

  id: number = 0;
  rentingTableId: number = 0;
  borrowerFirstName: string = '';
  borrowerLastName: string = '';
  borrowerUserName: string = '';
  bookTitle: string = '';
  authorFirstName: string = '';
  authorLastName: string = '';
  borrowed_date: Date = new Date();
  return_date: Date = new Date();
  return_date_extended = false;
}
