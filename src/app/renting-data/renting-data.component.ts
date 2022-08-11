import {Component, OnInit} from '@angular/core';
import {RentingTable} from "../model/RentingTable";
import {DataService} from "../data.service";
import {RentingDataForScreen} from "../model/RentingDataForScreen";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {FormResetService} from "../form-reset.service";
import {filter} from "rxjs";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-renting-data',
  templateUrl: './renting-data.component.html',
  styleUrls: ['./renting-data.component.css']
})
export class RentingDataComponent implements OnInit {

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private formResetService: FormResetService) {
  }

  rentingTables: Array<RentingTable> = new Array<RentingTable>();
  rentingDataForScreenList: Array<RentingDataForScreen> = new Array<RentingDataForScreen>();
  selectedRentingDetail: any = new RentingDataForScreen();
  selectedRentingTable: any = new RentingTable();
  action = '';
  option = '';
  searching = '';
  previousUrl = '';
  currentUrl = '';
  selectedDate = '';
  switchSearchInput = false;

  ngOnInit(): void {

    this.loadData();
  }

  loadData() {
    this.rentingTables = [];
    this.rentingDataForScreenList = [];
    this.creatingRentingDataForScreenList();
    this.toManageRentingTableComponentRouting();
  }

  creatingRentingDataForScreenList() {
    this.dataService.rentingTables.subscribe(
      next => {
        let id = 1;
        this.rentingTables = next;
        this.sortingRentingTables(this.rentingTables);
        for (let element of this.rentingTables) {
          const rentingDataForScreen: RentingDataForScreen = new RentingDataForScreen();
          this.dataService.getUserById(element.borrowed_by).subscribe(user => {
            rentingDataForScreen.borrowerFirstName = user.first_name;
            rentingDataForScreen.borrowerLastName = user.last_name;
            rentingDataForScreen.borrowerUserName = user.username;
          });
          this.dataService.getBookById(element.book_id).subscribe(
            book => {
              rentingDataForScreen.bookTitle = book.book_title;
              rentingDataForScreen.authorFirstName = book.author_fname;
              rentingDataForScreen.authorLastName = book.author_lname;
            }
          );
          rentingDataForScreen.borrowed_date = element.borrowed_date;
          rentingDataForScreen.return_date = element.return_date;
          rentingDataForScreen.id = id++;
          rentingDataForScreen.rentingTableId = element.id;
          rentingDataForScreen.return_date_extended = element.return_date_extended;
          this.rentingDataForScreenList.push(rentingDataForScreen);
        }
      }
    );
  }

  toManageRentingTableComponentRouting() {
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params['date'];
      if (!this.selectedDate) {
        this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      }
      const id = params['id'];
      this.action = params['action'];
      this.option = params['option'];
      this.searching = params['searching'];
      if (this.option === 'option') {
        this.router.navigate(['rentingTable'], {queryParams: {action: 'add', option: 'option'}});
      }
      if (this.router.url === '/rentingTable') {
        this.getPreviousUrl();
        if (this.previousUrl.indexOf('/rentingTable?') == 0) {
          window.location.reload();
        }
      }
      if (this.action === 'edit' && id) {
        this.router.navigate(['rentingTable'], {queryParams: {action: 'edit', id: id}});
      }
      if (this.action === 'delete' && id) {
        this.router.navigate(['rentingTable'], {queryParams: {action: 'delete', id: id}});
      }
    });
  }

  getPreviousUrl() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
    })
  }

  editRentingList(id: number) {
    this.router.navigate(['rentingTable'], {queryParams: {action: 'edit', id: id}});
    this.selectedRentingDetail = this.rentingDataForScreenList.find(element => element.id === +id);
    this.selectedRentingTable = this.rentingTables.find(element => element.id = this.selectedRentingDetail.rentingTableId);

  }

  sortingRentingTables(rentingTables: Array<RentingTable>) {
    rentingTables = rentingTables.sort(
      (a, b) => {
        if (a.id > b.id) {
          return 1;
        } else if (a.id < b.id) {
          return -1;
        }
        return 0;
      });
  }

  setDeleteRentingData(id: number) {
    this.router.navigate(['rentingTable'], {queryParams: {action: 'delete', id: id}});
    this.selectedRentingDetail = this.rentingDataForScreenList.find(element => element.id === +id);
    this.selectedRentingTable = this.rentingTables.find(element => element.id = this.selectedRentingDetail.rentingTableId);
  }

  closeModal() {
    this.router.navigate(['rentingTable']);
  }

  onSubmit() {
    this.dataService.deleteRentingTableById(this.selectedRentingDetail.rentingTableId).subscribe(
      next => {
        window.location.reload();
        window.location.replace('rentingTable')
      }
    )

  }

  addRentingTable() {
    this.selectedRentingTable = new RentingTable();
    this.router.navigate(['rentingTable'], {queryParams: {action: 'add'}});
    this.formResetService.resetMyListingFormEvent.emit(this.selectedRentingTable);
  }

  findData(myNewRentingText: string) {
    this.router.navigate(['rentingTable'],
      {queryParams: {searching: myNewRentingText}});
    this.rentingDataForScreenList = this.rentingDataForScreenList.filter
    (element => (element.bookTitle.toLowerCase().indexOf(myNewRentingText.toLowerCase()) > -1));
    if (myNewRentingText === '') {
      this.router.navigate(['rentingTable']);
    }

  }

  deleteSearchingByBookTitle() {
    this.router.navigate(['rentingTable']);
    this.loadData();
    this.searching = '';
  }

  switchInputGroup() {
    if (!this.switchSearchInput) {
      this.switchSearchInput = true;
    } else {
      this.switchSearchInput = false;
    }
  }

  findDataByName(myNewRentingText: string) {
    this.router.navigate(['rentingTable'],
      {queryParams: {searching: myNewRentingText}});
    this.rentingDataForScreenList = this.rentingDataForScreenList.filter
    (element => (element.borrowerFirstName.toLowerCase().indexOf(myNewRentingText.toLowerCase()) > -1)
      || (element.borrowerLastName.toLowerCase().indexOf(myNewRentingText.toLowerCase())>-1));
    if (myNewRentingText === '') {
      this.router.navigate(['rentingTable']);
    }

  }
}
