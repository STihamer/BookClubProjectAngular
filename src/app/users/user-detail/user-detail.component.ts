import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserDTO} from "../../model/UserDTO";
import {Router} from "@angular/router";
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
  errorMessage = '';
  role = '';
  id = 0;

  constructor(private router: Router,
              private authService: AuthService,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.setupRoleAndId();
  }

  editUser() {
    this.router.navigate(['users'], {queryParams: {action: 'edit', id: this.user.userId}})
  }

  deleteUser(id: number) {
    this.dataService.deleteUser(id).subscribe(
      next => {
        console.log(next.errorMessage);
        this.dataChangedEvent.emit();
        window.location.reload();
        window.location.replace("/users")
      }, error => this.errorMessage =(error.error)
    );
  }

  setupRoleAndId() {
    this.dataService.getRole().subscribe(
      next => {
        this.role = next.role;
        if (this.role == 'admin') {
          this.isAdminUser = true;
        }
        this.dataService.getId().subscribe(
          next => {
            this.id = next.id;
          }
        );
      }
    );
  };

  closeErrorMessage(){
    window.location.reload();
  }
  closeUserDetail(){
    this.router.navigate(["users"]);
  }
}
