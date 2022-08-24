import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../model/User";
import {Router} from "@angular/router";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  isAdminUser = false;
  @Input()
  user: User = new User();

  @Output()
  dataChangedEvent = new EventEmitter();


  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.authService.getRole() === 'admin') {
      this.isAdminUser = true;
    }
  }

  editUser() {
    this.router.navigate(['users'], {queryParams: {action: 'edit', id: this.user.user_id}})
  }
}
