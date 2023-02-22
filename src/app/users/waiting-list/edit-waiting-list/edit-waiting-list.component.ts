import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {WaitingListDetail} from "../../../model/WaitingListDetail";
import {DataService} from "../../../data.service";
import {Router} from "@angular/router";
import {FormResetService} from "../../../form-reset.service";
import {Subscription} from "rxjs";
import {WaitingListDTO} from "../../../model/WaitingListDTO";

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
  newWaitingList: WaitingListDTO = new WaitingListDTO();
  message = '';
  formWaitingList: WaitingListDTO = new WaitingListDTO();

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
    this.formWaitingList.bookForReading = this.newWaitingList.bookForReading
    this.formWaitingList.finished = this.waitingDetail.underReading;

    this.dataService.updateWaitingList(this.formWaitingList, this.formWaitingList.id).subscribe(
      (waiting) => {

        this.dataChangedEvent.emit();
        this.closeEditComponent.emit();
        this.router.navigate(['waitingList']);
      },
    );
  };

  closeEditWaitingList() {
    this.router.navigate(['waitingList']);
    this.closeEditComponent.emit();
  }

}
