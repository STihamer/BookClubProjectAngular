export class RentingTableDTO {
  id: number = 0;
  borrowedBy: number = 0;
  bookId: number = 0;
  borrowedDate: Date = new Date();
  rentingPeriod: number = 0;
  returnDate: Date = new Date();
  returnDateExtended: boolean = false;

  static fromHttp(rentingTable: RentingTableDTO): RentingTableDTO {
    const newRentingTable = new RentingTableDTO();
    newRentingTable.id = rentingTable.id;
    newRentingTable.borrowedBy = rentingTable.borrowedBy;
    newRentingTable.bookId = rentingTable.bookId;
    newRentingTable.borrowedDate = rentingTable.borrowedDate;
    newRentingTable.rentingPeriod = rentingTable.rentingPeriod;
    newRentingTable.returnDate = rentingTable.returnDate;
    newRentingTable.returnDateExtended = rentingTable.returnDateExtended;

    return newRentingTable;
  }
}

