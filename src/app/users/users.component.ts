import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {User} from "../model/User";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: Array<User> = new Array<User>();
  action: string = '';
  message = 'Loading dat ... please wait';
  loadingData = true;
  selectedUser: any;

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadData();

  }

  loadData() {
    this.dataService.users.subscribe(
      next => {
        this.users = next;
        this.loadingData = false;
        this.route.queryParams.subscribe(params => {
          const id = params['id'];
          this.action = params['action'];
          if (id) {
            this.selectedUser = this.users.find(user => user.user_id === +id);
          }

        });
      }, errors => {
        this.message = 'An error occurred - please contact support';
      }
    )
  }

  setUser(id: number) {
    this.router.navigate(['users'], {queryParams: {id: id, action: 'view'}})
  }
}
