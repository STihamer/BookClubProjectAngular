import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: Array<any> = new Array<any>();
  action: string = '';
  message = 'Loading dat ... please wait';
  loadingData = true;
  selectedUser: any;
  searchingUser: string = '';

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
        this.users = next.sort((a, b) => {
          if (a.user_id > b.user_id) {
            return 1;
          } else if (a.user_id < b.user_id) {
            return -1;
          }
          return 0;
        });
        console.log(this.users)
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
    this.router.navigate(['users'],
      {queryParams: {id: id, action: 'view'}})
  }

  findUserByUsername(username: string) {
    console.log()
    if (username === '') {
      this.dataService.users.subscribe(
        next => {
          this.users = next;
        })
    } else {
      this.dataService.users.subscribe(
        next => this.users = next.filter(
          user => user.username.toLowerCase()
            .indexOf(username.toLowerCase()) > -1))
      this.router.navigate(['users'],
        {queryParams: {username: username}})
    }
  }

  deleteSearchingByUsername() {
    this.router.navigate(['users']);
    this.dataService.users.subscribe(next => this.users = next);
    this.searchingUser = '';
  }
}
