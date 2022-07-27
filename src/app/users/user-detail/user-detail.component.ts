import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../model/User";
import {Router} from "@angular/router";
import {DataService} from "../../data.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  @Input()
  user: User = new User();

  @Output()
  dataChangedEvent = new EventEmitter();


  constructor(private router: Router,
              private dataService: DataService) { }

  ngOnInit(): void {
  }

  editUser() {
    this.router.navigate(['users'], {queryParams: {action: 'edit', id: this.user.user_id}})
  }
}
