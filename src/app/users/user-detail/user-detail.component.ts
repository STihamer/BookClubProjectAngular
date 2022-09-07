import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserDTO} from "../../model/UserDTO";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../auth.service";
import {DataService} from "../../data.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  isAdminUser = false;
  @Input()
  user: UserDTO = new UserDTO();
  @Output()
  dataChangedEvent = new EventEmitter();


  constructor(private router: Router,
              private authService: AuthService,
              private dataService: DataService) {
  }

  ngOnInit(): void {

    this.dataService.getRole().subscribe(
      next => {
        if (next.role === 'admin') {
          this.isAdminUser = true;
        }
      }
    );
  }

  editUser() {
    this.router.navigate(['users'], {queryParams: {action: 'edit', id: this.user.userId}})
  }
}
