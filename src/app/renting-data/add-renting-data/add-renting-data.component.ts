import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../model/User";
import {Book} from "../../model/Book";
import {RentingPeriod} from "../../model/RentingPeriod";
import {DataService} from "../../data.service";
import {RentingTable} from "../../model/RentingTable";
import {formatDate} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {BookOwner} from "../../model/BookOwner";
import {WaitingList} from "../../model/WaitingList";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-add-renting-data',
  templateUrl: './add-renting-data.component.html',
  styleUrls: ['./add-renting-data.component.css']
})
export class AddRentingDataComponent implements OnInit {

  users: Array<User> = new Array<User>();
  books: Array<Book> = new Array<Book>();
  rentingPeriods: Array<RentingPeriod> = new Array<RentingPeriod>();
  newRentingPeriod: any = new RentingPeriod();
  rentingTables: Array<RentingTable> = new Array<RentingTable>();
  bookOwnerList: Array<BookOwner> = new Array<BookOwner>();
  waitingLists: Array<WaitingList> = new Array<WaitingList>();
  newWaitingList: Array<WaitingList> = new Array<WaitingList>();
  message: string = '';
  @Input()
  newRentingTable: RentingTable = new RentingTable();

  @Output()
  dataChangeEvent = new EventEmitter();
  selectedDate = '';
  returnDate = new Date();
  returnDateString = '';

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getData();
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
    this.dataService.getUsers().subscribe(next => this.users = next);
    this.dataService.getBooks().subscribe(next => this.books = next);
    this.newRentingTable.borrowed_date = new Date(this.selectedDate);
    this.dataService.rentingTables.subscribe(
      next => {
        this.rentingTables = next;
        for (let table of this.rentingTables) {
          this.dataService.getBookById(table.book_id).subscribe(book => {
              for (let i in this.books) {
                if (this.books[i].book_id == book.book_id) {
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
    this.newRentingTable.borrowed_by = 0;
    this.newRentingTable.book_id = 0
    this.newRentingTable.renting_period = 0;
    window.location.reload()

  }

  addDays(id: number) {
    this.newRentingPeriod = this.rentingPeriods.find(element => element.id == id);
    const days = this.newRentingPeriod.renting_period;
    this.returnDateString = '';
    this.returnDate = new Date();
    this.returnDate.setDate(this.returnDate.getDate() + days);
    this.returnDateString = formatDate(this.returnDate, 'yyyy-MM-dd', 'en-US');

  }


  onSubmit() {

    this.newRentingTable.renting_period = this.newRentingPeriod.id;
    this.validateRentingTableCreation(this.newRentingTable);

  }

  validateRentingTableCreation(rentingTable: RentingTable) {
    this.dataService.bookOwners.subscribe(
      next => {
        this.bookOwnerList = next.filter(element => element.book_id == rentingTable.book_id);
        if (!this.bookOwnerList) {
          return
        } else {
          this.dataService.waitingLists.subscribe(
            next => {
              this.waitingLists = next.filter(element => element.book_for_reading == this.bookOwnerList[0].id);
              this.waitingLists = this.waitingLists.sort((a, b) => {
                if (a.id > b.id) {
                  return 1;
                } else if (a.id < b.id) {
                  return -1;
                }
                return 0;
              });
              for (let el of this.waitingLists) {
                if (el.user_id == rentingTable.borrowed_by) {
                  this.newWaitingList.push(el);
                }
              }
              if (this.newWaitingList.length == 0) {
                this.message = "Sorry you cant borrow the book if you have not subscribed to the waiting list yet";
                return;
              } else if (this.waitingLists[0].user_id != rentingTable.borrowed_by) {
                this.message = "Sorry it seems there are some users before you for this book. You have to wait your" +
                  " turn.";
                return;
              } else {
                this.dataService.addRentingTable(this.newRentingTable).subscribe(
                  (newRentingTable) => {
                    //window.location.reload();
                    console.log(this.newRentingTable);
                    //window.location.replace("rentingTable");
                    this.dataChangeEvent.emit();
                    this.router.navigate(['rentingTable']);

                  }
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

}
