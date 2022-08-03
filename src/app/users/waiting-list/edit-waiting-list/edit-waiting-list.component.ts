import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {WaitingListDetail} from "../../../model/WaitingListDetail";
import {DataService} from "../../../data.service";
import {Router} from "@angular/router";
import {FormResetService} from "../../../form-reset.service";
import {Subscription} from "rxjs";

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
    console.log(this.waitingDetail);
    this.router.navigate(['waitingList']);
    this.closeEditComponent.emit();
  };

  closeEditWaitingList() {
    this.router.navigate(['waitingList']);
    this.closeEditComponent.emit();
  }
}
