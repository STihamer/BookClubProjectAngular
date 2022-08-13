import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {RentingDataForScreen} from "../../model/RentingDataForScreen";
import {RentingTable} from "../../model/RentingTable";
import {DataService} from "../../data.service";
import {Router} from "@angular/router";
import {FormResetService} from "../../form-reset.service";

@Component({
  selector: 'app-edit-renting-data',
  templateUrl: './edit-renting-data.component.html',
  styleUrls: ['./edit-renting-data.component.css']
})
export class EditRentingDataComponent implements OnInit, OnDestroy {

  extensionPeriod: number = 0;

  @Input()
  rentingDetail: RentingDataForScreen = new RentingDataForScreen();
  @Output()
  dataChangedEvent = new EventEmitter();

  @Output()
  closeEditComponent = new EventEmitter();
  rentingTableResetSubscription: Subscription = new Subscription();

  @Input()
  newRentingTable: RentingTable = new RentingTable();
  message = '';


  constructor(private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnDestroy(): void {
    this.rentingTableResetSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.rentingTableResetSubscription = this.formResetService.resetRentingTableFormEvent.subscribe(
      detail => {
        this.rentingDetail = detail;
      }
    );
  }


  closeEditRentingTable() {
    this.router.navigate(['rentingTable']);
    this.closeEditComponent.emit();
  }

  setExtensionPeriod(period: number) {
    this.extensionPeriod = period;
  }

  onSubmit() {
    this.newRentingTable.return_date_extended = true;
    this.dataService.updateRentingTableReturnDate(this.newRentingTable, this.newRentingTable.id, this.extensionPeriod).subscribe(
      (waiting) => {
        console.log(this.newRentingTable.return_date_extended);
        this.dataChangedEvent.emit();
        this.closeEditComponent.emit();
        this.router.navigate(['rentingTable']);
      },
    );
  }
}
