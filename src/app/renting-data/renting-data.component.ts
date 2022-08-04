import {Component, OnInit} from '@angular/core';
import {RentingTable} from "../model/RentingTable";
import {DataService} from "../data.service";

@Component({
  selector: 'app-renting-data',
  templateUrl: './renting-data.component.html',
  styleUrls: ['./renting-data.component.css']
})
export class RentingDataComponent implements OnInit {

  constructor(private dataService: DataService) {
  }

  rentingTables: Array<RentingTable> = new Array<RentingTable>();

  ngOnInit(): void {
    this.dataService.rentingTables.subscribe(
      next => {
        this.rentingTables = next;
        console.log(this.rentingTables);
      }
    )
  }
}
