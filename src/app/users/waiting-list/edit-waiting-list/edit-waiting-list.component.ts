import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {WaitingListDetail} from "../../../model/WaitingListDetail";
import {DataService} from "../../../data.service";
import {Router} from "@angular/router";
import {FormResetService} from "../../../form-reset.service";
import {Subscription} from "rxjs";
import {WaitingList} from "../../../model/WaitingList";

@Component({
  selector: 'app-edit-waiting-list',
  templateUrl: './edit-waiting-list.component.html',
  styleUrls: ['./edit-waiting-list.component.css']
})
export class EditWaitingListComponent implements OnInit, OnDestroy {

  constructor(private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService) {
  }

  @Input()
  waitingDetail: WaitingListDetail = new WaitingListDetail();
  optionHidden = false;
  optionHideClassAddToOption = '';
  @Output()
  dataChangedEvent = new EventEmitter();

  @Output()
  closeEditComponent = new EventEmitter();
  waitingListResetSubscription: Subscription = new Subscription();

  @Input()
  newWaitingList: WaitingList = new WaitingList();
  message = '';
  formWaitingList: WaitingList = new WaitingList();

  ngOnInit(): void {

    this.waitingListResetSubscription = this.formResetService.resetWaitingListFormEvent.subscribe(
      detail => {
        this.waitingDetail = detail;
      }
    );

  }

  ngOnDestroy(): void {
    this.waitingListResetSubscription.unsubscribe();
  }

  selectOptionHidden() {
    this.optionHidden = true;
    this.optionHideClassAddToOption = 'optionHide';
  }

  onSubmit() {
    this.formWaitingList.id = this.newWaitingList.id
    this.formWaitingList.book_for_reading = this.newWaitingList.book_for_reading
    this.formWaitingList.finished = this.waitingDetail.underReading;

      this.dataService.updateWaitingList(this.formWaitingList, this.formWaitingList.id).subscribe(
        (waiting) => {
          this.dataChangedEvent.emit();
          this.router.navigate(['waitingList']);
        },
        error => this.message = 'Something went wrong and the data wasn\'t saved. You may want to try again.'
      );
    this.router.navigate(['waitingList']);
    this.closeEditComponent.emit();
    this.dataChangedEvent.emit();
  };

  closeEditWaitingList() {
    this.router.navigate(['waitingList']);
    this.closeEditComponent.emit();
  }
}
