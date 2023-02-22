import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserDTO} from "../../model/UserDTO";
import {BookDTO} from "../../model/BookDTO";
import {RentingPeriodDTO} from "../../model/RentingPeriodDTO";
import {DataService} from "../../data.service";
import {RentingTableDTO} from "../../model/RentingTableDTO";
import {formatDate} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {BookOwnerDTO} from "../../model/BookOwnerDTO";
import {WaitingListDTO} from "../../model/WaitingListDTO";

@Component({
  selector: 'app-add-renting-data',
  templateUrl: './add-renting-data.component.html',
  styleUrls: ['./add-renting-data.component.css']
})
export class AddRentingDataComponent implements OnInit {

  users: Array<UserDTO> = new Array<UserDTO>();
  books: Array<BookDTO> = new Array<BookDTO>();
  rentingPeriods: Array<RentingPeriodDTO> = new Array<RentingPeriodDTO>();
  newRentingPeriod: any = new RentingPeriodDTO();
  rentingTables: Array<RentingTableDTO> = new Array<RentingTableDTO>();
  bookOwnerList: Array<BookOwnerDTO> = new Array<BookOwnerDTO>();
  waitingLists: Array<WaitingListDTO> = new Array<WaitingListDTO>();
  newWaitingList: Array<WaitingListDTO> = new Array<WaitingListDTO>();
  message: string = '';
  role = '';
  isAdminUser = false;
  id = 0;

  @Input()
  newRentingTable: RentingTableDTO = new RentingTableDTO();

  @Output()
  dataChangeEvent = new EventEmitter();
  selectedDate = '';
  returnDate = new Date();
  returnDateString = '';

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.setupRoleAndId();
  }


  getData() {
    if (!this.selectedDate) {
      this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    }
    this.dataService.rentingPeriods.subscribe(
      next => {
        this.rentingPeriods = next;
      }
    );
    this.dataService.getUsers().subscribe(next => {
      if (!this.isAdminUser) {
        this.users = next.filter(user => user.userId == this.id);
      } else {
        this.users = next;
      }

    });
    this.dataService.getBooks().subscribe(next => this.books = next);
    this.newRentingTable.borrowedDate = new Date(this.selectedDate);
    this.dataService.rentingTables.subscribe(
      next => {
        this.rentingTables = next;
        for (let table of this.rentingTables) {
          this.dataService.getBookById(table.bookId).subscribe(book => {
              for (let i in this.books) {
                if (this.books[i].bookId == book.book_id) {
                  this.books.splice(Number(i), 1)
                }
              }
            }
          );
        }
      }
    );
  }

  clearDataFromAddForm() {
    this.newRentingTable.borrowedBy = 0;
    this.newRentingTable.bookId = 0
    this.newRentingTable.rentingPeriod = 0;
    window.location.reload()

  }

  addDays(id: number) {
    this.newRentingPeriod = this.rentingPeriods.find(element => element.id == id);
    const days = this.newRentingPeriod.rentingPeriod;
    this.returnDateString = '';
    this.returnDate = new Date();
    this.returnDate.setDate(this.returnDate.getDate() + days);
    this.returnDateString = formatDate(this.returnDate, 'yyyy-MM-dd', 'en-US');

  }


  onSubmit() {

    this.newRentingTable.rentingPeriod = this.newRentingPeriod.id;
    this.validateRentingTableCreation(this.newRentingTable);

  }

  validateRentingTableCreation(rentingTable: RentingTableDTO) {
    this.dataService.bookOwners.subscribe(
      next => {
        this.bookOwnerList = next.filter(element => element.bookId == rentingTable.bookId);
        if (!this.bookOwnerList) {
          return
        } else {
          this.dataService.waitingLists.subscribe(
            next => {
              this.waitingLists = next.filter(element => element.bookForReading == this.bookOwnerList[0].id);
              this.waitingLists = this.waitingLists.sort((a, b) => {
                if (a.id > b.id) {
                  return 1;
                } else if (a.id < b.id) {
                  return -1;
                }
                return 0;
              });
              for (let el of this.waitingLists) {
                if (el.userId == rentingTable.borrowedBy) {
                  this.newWaitingList.push(el);
                }
              }
              if (this.newWaitingList.length == 0) {
                this.message = "Sorry you cant borrow the book if you have not subscribed to the waiting list yet";
                return;
              } else if (this.waitingLists[0].userId != rentingTable.borrowedBy) {
                this.message = "Sorry it seems there are some users before you for this book. You have to wait your" +
                  " turn.";
                return;
              } else {
                this.dataService.addRentingTable(this.newRentingTable).subscribe(
                  (newRentingTable) => {
                    this.dataChangeEvent.emit();
                    this.router.navigate(['rentingTable']);
                  },error => this.message = error.error
                );
              }
            }
          );
        }

      }
    );
  }

  goToWaitingList() {
    this.router.navigate(['waitingList']);
  }

  closeAddRentingData() {
    window.location.replace("rentingTable")
  }

  setupRoleAndId() {
    this.dataService.getRole().subscribe(
      next => {
        this.role = next.role;
        if (this.role == 'admin') {

          this.isAdminUser = true;
        }
        this.dataService.getId().subscribe(
          next => {
            this.id = next.id;
            this.getData();

          }
        );
      }
    );

  };
}
