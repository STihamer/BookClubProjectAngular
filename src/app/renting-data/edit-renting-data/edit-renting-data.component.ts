import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {RentingDataForScreen} from "../../model/RentingDataForScreen";
import {RentingTableDTO} from "../../model/RentingTableDTO";
import {DataService} from "../../data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormResetService} from "../../form-reset.service";

@Component({
  selector: 'app-edit-renting-data',
  templateUrl: './edit-renting-data.component.html',
  styleUrls: ['./edit-renting-data.component.css']
})
export class EditRentingDataComponent implements OnInit, OnDestroy {

  extensionPeriod: number = 0;
  action = '';
  message = '';
  extensionPeriodConsumed = 'It seems you have already extended the renting period of this books.'
  @Input()
  rentingDetail: RentingDataForScreen = new RentingDataForScreen();
  @Output()
  dataChangedEvent = new EventEmitter();
  isUsersRentingData = false;

  @Output()
  closeEditComponent = new EventEmitter();
  rentingTableResetSubscription: Subscription = new Subscription();

  @Input()
  newRentingTable: RentingTableDTO = new RentingTableDTO();


  constructor(private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService,
              private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.rentingTableResetSubscription.unsubscribe();
  }

  ngOnInit(): void {
    console.log(this.newRentingTable)
    this.getOwnerOfSelectedRentingData();
    this.rentingTableResetSubscription = this.formResetService.resetRentingTableFormEvent.subscribe(
      detail => {
        this.rentingDetail = detail;
      }
    );
    this.toManageRentingTableComponentRouting();
  }


  closeEditRentingTable() {
    this.router.navigate(['rentingTable']);
    this.closeEditComponent.emit();
  }

  setExtensionPeriod(period: number) {
    this.extensionPeriod = period;
  }

  onSubmit() {
    this.newRentingTable.returnDateExtended = true;
    this.dataService.updateRentingTableReturnDate(this.newRentingTable, this.newRentingTable.id, this.extensionPeriod).subscribe(
      (waiting) => {
        this.dataChangedEvent.emit();
        this.closeEditComponent.emit();
        this.router.navigate(['rentingTable']);
      },
    );
  }

  toManageRentingTableComponentRouting() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.action = params['action'];
      if (this.action === 'edit' && id) {
        if (this.rentingDetail.borrowerFirstName === '') {
          window.location.replace('rentingTable')
        }
      }
    })
  }

  getOwnerOfSelectedRentingData() {
    this.dataService.getRole().subscribe(
      role => {
        this.dataService.getId().subscribe(
          message => {console.log(message.id)
            if (role.role == 'admin') {
              this.isUsersRentingData = true;
            } else if (message.id == this.newRentingTable.borrowedBy) {
              this.isUsersRentingData = true;
            }
          }
        )
      }
    )
  }


}
