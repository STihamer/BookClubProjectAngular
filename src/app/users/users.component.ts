import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {UserDTO} from "../model/UserDTO";

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
  isAdminUser = false;
  setUsersComponentCol = 'col-12';

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) {
  }


  ngOnInit(): void {
    this.dataService.getRole().subscribe(
      next => {
        if (next.role == 'admin') {
          this.isAdminUser = true;
        }
      }
    );
    this.loadData();

  }

  loadData() {
    this.dataService.getUsers().subscribe(
      next => {
        this.users = next.sort((a, b) => {
          if (a.userId > b.userId) {
            return 1;
          } else if (a.userId < b.userId) {
            return -1;
          }
          return 0;
        });
        this.loadingData = false;
        this.setUsersFrontendId(this.users);
        this.setUsersComponentRouting()

      }, errors => {
        this.message = 'An error occurred - please contact support';
      }
    )
  }

  setUser(id: number) {
    this.router.navigate(['users'],
      {queryParams: {id: id, action: 'view'}})
    this.setUsersComponentCol = 'col-6';
  }

  findUserByUsername(username: string) {
    if (username === '') {
      this.dataService.getUsers().subscribe(
        next => {
          this.users = next;
          this.setUsersFrontendId(this.users)
          this.router.navigate(["users"]);
        });
    } else {
      this.dataService.getUsers().subscribe(
        next => {
          this.users = next.filter(
            user => user.username.toLowerCase()
              .indexOf(username.toLowerCase()) > -1);
          this.setUsersFrontendId(this.users);

        }
      );
      this.setUsersFrontendId(this.users);
      this.setUsersComponentCol = 'col-12';
      this.router.navigate(['users'],
        {queryParams: {username: username}})
    }
  }

  deleteSearchingByUsername() {
    this.router.navigate(['users']);
    this.dataService.getUsers().subscribe(next => this.users = next);
    this.searchingUser = '';
  }

  navigateToAddPage() {
    this.action = 'add';
    this.router.navigate(['users'], {queryParams: {action: this.action}});
  }

  setUsersComponentRouting() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.action = params['action'];
      if (id) {
        this.selectedUser = this.users.find(user => user.userId === +id);
      }
      if (this.router.url === '/users') {
        this.setUsersComponentCol = 'col-12';
      }

      if (this.action === 'view') {

        this.setUsersComponentCol = 'col-6';
      }
    });
  }

  setUsersFrontendId(users: Array<UserDTO>) {
    let userIdForScreen = 1;
    for (let user of users) {
      user.orderIdInFrontend = userIdForScreen;
      userIdForScreen++;
    }
  }
}
