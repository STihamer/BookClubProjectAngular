import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../model/User";
import {Book} from "../../model/Book";
import {RentingPeriod} from "../../model/RentingPeriod";
import {DataService} from "../../data.service";
import {RentingTable} from "../../model/RentingTable";
import {formatDate} from "@angular/common";
import {Router} from "@angular/router";

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
  @Input()
  newRentingTable: RentingTable = new RentingTable();

  @Output()
  dataChangeEvent = new EventEmitter();
  selectedDate = '';
  returnDate = new Date();
  returnDateString = '';

  constructor(private dataService: DataService,
              private router: Router) {
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
    this.dataService.users.subscribe(next => this.users = next);
    this.dataService.books.subscribe(next => this.books = next);
    this.newRentingTable.borrowed_date = new Date(this.selectedDate);
  }

  clearDataFromAddForm() {
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
    this.dataService.addRentingTable(this.newRentingTable).subscribe(
      (newRentingTable) => {
        window.location.reload();
        console.log(this.newRentingTable);
        window.location.replace("rentingTable");
        this.dataChangeEvent.emit();
        this.router.navigate(['rentingTable']);

      }
    );
  }

}
