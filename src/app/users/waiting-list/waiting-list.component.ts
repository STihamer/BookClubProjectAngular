import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {WaitingList} from "../../model/WaitingList";
import {WaitingListDetail} from "../../model/WaitingListDetail";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {FormResetService} from "../../form-reset.service";
import {filter} from "rxjs";
import {WaitingPersonsAndBookTitle} from "../../model/WaitingPersonsAndBookTitle";

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {
  waitingLists: Array<WaitingList> = new Array<WaitingList>();
  waitingListDetailList: Array<WaitingListDetail> = new Array<WaitingListDetail>();
  selectedWaitingListDetail: any = new WaitingListDetail();
  setWaitingListComponentCol = 'col-12';
  selectedWaitingList: any = new WaitingList()
  action = '';
  option = '';
  searching: string = '';
  textSearching: string = '';
  previousUrl = '';
  currentUrl = '';
  waitingPerson: any = new WaitingPersonsAndBookTitle();
  waitingPersonList: Array<WaitingPersonsAndBookTitle> = new Array<WaitingPersonsAndBookTitle>();

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.getPreviousUrl();
    this.waitingListDetailList = [];
    this.dataService.waitingLists.subscribe(
      next => {
        let id = 1;
        this.waitingLists = next.sort((a, b) => {
          if (a.id > b.id) {
            return 1;
          } else if (a.id < b.id) {
            return -1;
          }
          return 0;

        });

        this.createWaitingListDetailList(this.waitingLists, id);
        this.toManageBookOwnerRouting();
      }
    )
  }

  createWaitingListDetailList(newWaitingLists: Array<WaitingList>, id: number) {
    for (let el of newWaitingLists) {
      const waitingListDetail: WaitingListDetail = new WaitingListDetail()
      waitingListDetail.waitingListId = el.id;
      this.dataService.getUserById(el.user_id).subscribe(next => {
        waitingListDetail.readerFirstName = next.first_name;
        waitingListDetail.readerLastName = next.last_name;
        waitingListDetail.readerUsername = next.username;

      });
      this.dataService.getBookOwnerById(el.book_for_reading).subscribe(next => {
        waitingListDetail.ownerId = next.user_id;
        waitingListDetail.bookId = next.book_id;
        this.dataService.getUserById(waitingListDetail.ownerId).subscribe(next => {
          waitingListDetail.ownerFirstName = next.first_name;
          waitingListDetail.ownerLastName = next.last_name;
          waitingListDetail.ownerUsername = next.username;
        });
        this.dataService.getBookById(waitingListDetail.bookId).subscribe(
          next => {
            waitingListDetail.bookTitle = next.book_title;

          }
        )
      });

      waitingListDetail.id = id++;
      waitingListDetail.underReading = el.finished;
      this.waitingListDetailList.push(waitingListDetail);
    }

  }

  toManageBookOwnerRouting() {
    this.route.queryParams.subscribe(params => {
      const idBook = params['idBook'];
      this.action = params['action'];
      this.option = params['option'];
      this.searching = params['searching'];
      if (this.option === 'option' && idBook) {
        this.router.navigate(['waitingList'], {queryParams: {action: 'add', option: 'option', idBook:idBook}});
      }
      if (this.router.url === '/waitingList') {
        this.getPreviousUrl();
        if (this.previousUrl.indexOf('/waitingList?') == 0) {
          window.location.reload();
        }
      }
      if (this.action === 'edit' && this.setWaitingListComponentCol === 'col-12') {
        window.location.replace('waitingList');
      }
    });
  }

  editWaitingList(id: number) {
    this.setWaitingListComponentCol = 'col-9'
    this.router.navigate(['waitingList'], {queryParams: {action: 'edit', id: id}});
    this.selectedWaitingListDetail = this.waitingListDetailList.find(detail => detail.id === +id);
    this.selectedWaitingList = this.waitingLists.find(waiting => waiting.id = this.selectedWaitingListDetail.waitingListId);

  }

  editWaitingPersonsAndBookTitles(id: number) {
    this.router.navigate(['waitingList'], {queryParams: {action: 'searchByName', id: id}});
    this.selectedWaitingListDetail = this.waitingListDetailList.find(detail => detail.id === +id);
    this.waitingPerson.first_name = this.selectedWaitingListDetail.readerFirstName;
    this.waitingPerson.last_name = this.selectedWaitingListDetail.readerLastName;
    this.dataService.getWaitingPersonsAndBookTitle(this.waitingPerson).subscribe(next => {
      let id = 1;
      this.waitingPersonList = next;
      for (let person of this.waitingPersonList) {
        person.id = id++;
      }
    });

  }

  setWaitingListToOriginalCol() {
    this.setWaitingListComponentCol = 'col-12';
  }

  addWaitingList() {
    this.selectedWaitingList = new WaitingList();
    this.router.navigate(['waitingList'], {queryParams: {action: 'add'}});
    this.formResetService.resetMyListingFormEvent.emit(this.selectedWaitingList);
  }


  findData(myNewListingText: string) {
    this.router.navigate(['waitingList'],
      {queryParams: {searching: myNewListingText}});
    this.waitingListDetailList = this.waitingListDetailList.filter
    (element => (element.bookTitle.toLowerCase().indexOf(myNewListingText.toLowerCase()) > -1));
    if (myNewListingText === '') {
      this.router.navigate(['waitingList']);
    }

  }

  deleteSearchingByBookTitleAndUsername() {
    this.router.navigate(['waitingList']);
    this.loadData();
    this.textSearching = '';
  }

  onSubmit() {
    this.dataService.deleteWaitingListById(this.selectedWaitingListDetail.waitingListId).subscribe(
      next => {
        window.location.reload();
        window.location.replace('waitingList')
      }
    )

  }

  setDeleteWaitingList(id: number) {
    this.router.navigate(['waitingList'], {queryParams: {action: 'delete', id: id}});
    this.selectedWaitingListDetail = this.waitingListDetailList.find(detail => detail.id === +id);
    this.selectedWaitingList = this.waitingLists.find(waiting => waiting.id === this.selectedWaitingListDetail.waitingListId);
  }

  getPreviousUrl() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
    })
  }

  closeModal() {
    this.router.navigate(['waitingList']);
  }

}

