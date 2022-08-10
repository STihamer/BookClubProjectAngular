export class RentingTable {
  id: number = 0;
  borrowed_by: number = 0;
  book_id: number = 0;
  borrowed_date: Date = new Date();
  renting_period: number = 0;
  return_date: Date = new Date();
  return_date_extended: boolean = false;

  static fromHttp(rentingTable: RentingTable): RentingTable {
    const newRentingTable = new RentingTable();
    newRentingTable.id = rentingTable.id;
    newRentingTable.borrowed_by = rentingTable.borrowed_by;
    newRentingTable.book_id = rentingTable.book_id;
    newRentingTable.borrowed_date = rentingTable.borrowed_date;
    newRentingTable.renting_period = rentingTable.renting_period;
    newRentingTable.return_date = rentingTable.return_date;
    newRentingTable.return_date_extended = rentingTable.return_date_extended;

    return newRentingTable;
  }
}

