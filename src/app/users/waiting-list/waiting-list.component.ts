import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {WaitingList} from "../../model/WaitingList";
import {WaitingListDetail} from "../../model/WaitingListDetail";
import {ActivatedRoute, Router} from "@angular/router";
import {Book} from "../../model/Book";
import {BookOwner} from "../../model/BookOwner";
import {User} from "../../model/User";
import {FormResetService} from "../../form-reset.service";

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {
  waitingLists: Array<WaitingList> = new Array<WaitingList>();
  waitingListDetailList: Array<WaitingListDetail> = new Array<WaitingListDetail>();
  selectedWaitingListDetail: any = new WaitingListDetail();
  action = '';
  setMyListingComponentCol = 'col-12';
  selectedBookOwner: any = new BookOwner();
  selectedUser: any = new User()
  selectedBook: any = new Book()
  selectedWaitingList: any = new WaitingList()
  option = '';

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.loadData();

  }

  loadData() {
    this.dataService.waitingLists.subscribe(
      next => {
        let id = 1;
        this.waitingLists = next;
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

      });
      this.dataService.getBookOwnerById(el.book_for_reading).subscribe(next => {
        waitingListDetail.ownerId = next.user_id;
        waitingListDetail.bookId = next.book_id;
        this.dataService.getUserById(waitingListDetail.ownerId).subscribe(next => {
          waitingListDetail.ownerFirstName = next.first_name;
          waitingListDetail.ownerLastName = next.last_name;
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
      const id = params['id'];
      this.action = params['action'];
      this.option = params['option'];
      if (this.option === 'option') {
        this.router.navigate(['waitingList'],{queryParams: {action: 'add', option: 'option'}});
      }

      if (id) {
        this.router.navigate(['waitingList'],
          {queryParams: {action: 'edit', id: id}});
        this.selectedWaitingListDetail = this.waitingListDetailList.find(detail => detail.id === +id);
      }

    });
  }

  editWaitingList(id: number) {
    this.setMyListingComponentCol = 'col-9'
    this.router.navigate(['waitingList'], {queryParams: {action: 'edit', id: id}});
    this.selectedWaitingListDetail = this.waitingListDetailList.find(detail => detail.id === +id);
  }

  setWaitingListToOriginalCol() {
    this.setMyListingComponentCol = 'col-12';
  }

  addWaitingList() {
    this.selectedWaitingList = new WaitingList();
    this.router.navigate(['waitingList'], {queryParams: {action: 'add'}});
    this.formResetService.resetMyListingFormEvent.emit(this.selectedWaitingList);
  }
}
