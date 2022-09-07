import {Component, OnInit} from '@angular/core';
import {RentingTable} from "../model/RentingTable";
import {DataService} from "../data.service";
import {RentingDataForScreen} from "../model/RentingDataForScreen";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {FormResetService} from "../form-reset.service";
import {filter} from "rxjs";
import {formatDate} from "@angular/common";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-renting-data',
  templateUrl: './renting-data.component.html',
  styleUrls: ['./renting-data.component.css']
})
export class RentingDataComponent implements OnInit {

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private formResetService: FormResetService,
              private authService: AuthService) {
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
  searchingBookTitle = '';
  searchingAuthorFirstName = '';
  searchingAuthorLastName = '';


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
            rentingDataForScreen.borrowerFirstName = user.firstName;
            rentingDataForScreen.borrowerLastName = user.lastName;
            rentingDataForScreen.borrowerUserName = user.username;
          });
          this.dataService.getBookById(element.book_id).subscribe(
            book => {
              rentingDataForScreen.bookTitle = book.bookTitle;
              rentingDataForScreen.authorFirstName = book.authorFirstName;
              rentingDataForScreen.authorLastName = book.authorLastName;
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
      if (this.action === 'searching') {
        this.router.navigate(['rentingTable'], {queryParams: {action: 'searching'}});
      }
      if (this.router.url === '/rentingTable') {
        this.getPreviousUrl();
        if (this.previousUrl.indexOf('/rentingTable?') == 0) {
          window.location.reload();
        }
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
    console.log(this.selectedRentingDetail);
    this.selectedRentingTable = this.rentingTables.find(element => element.id == this.selectedRentingDetail.rentingTableId);
    console.log(this.selectedRentingTable);
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
    this.selectedRentingTable = this.rentingTables.find(element => element.id == this.selectedRentingDetail.rentingTableId);
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


  deleteSearchingByBookTitle() {
    this.router.navigate(['rentingTable']);
    this.loadData();
    this.searchingBookTitle = '';
    this.searchingAuthorLastName = '';
    this.searchingAuthorFirstName = '';
  }

  creatingRentingDataForScreenListBySearching(bookTitle: string, authorFirstName: string, authorLastName: string) {
    this.rentingTables = [];
    this.rentingDataForScreenList = [];
    this.dataService.rentingTablesByTitleOrAuthorName(bookTitle, authorFirstName, authorLastName).subscribe(
      next => {
        this.rentingTables = next;
        if (this.rentingTables.length < 1) {
          window.location.reload();
        } else {
          this.router.navigate(["rentingTable"], {
            queryParams: {
              title: this.searchingBookTitle.replace(/\s/g, ""),
              authorFirstName: this.searchingAuthorFirstName.replace(/\s/g, ""),
              authorLastName: this.searchingAuthorLastName.replace(/\s/g, ""),
            }
          })
          this.createRentingDataForScreen(this.rentingTables)
        }
      }
    );
  }

  createRentingDataForScreen(rentingTables: Array<RentingTable>) {
    let id = 1;
    this.sortingRentingTables(rentingTables);
    for (let element of rentingTables) {
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
}
