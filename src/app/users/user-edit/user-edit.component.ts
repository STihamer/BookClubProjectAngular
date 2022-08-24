import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from "../../model/User";
import {Subscription} from "rxjs";
import {DataService} from "../../data.service";
import {Router} from "@angular/router";
import {FormResetService} from "../../form-reset.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {


  @Input()
  user: User = new User();
  @Output()
  dataChangedEvent = new EventEmitter();

  formUser: User = new User();

  message: string = '';

  firstNameIsValid = false;
  lastNameIsValid = false;
  usernameIsValid = false;
  userAgeIsValid = false;
  userEmailIsValid = false;

  userResetSubscription: Subscription = new Subscription();

  constructor(private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.userResetSubscription = this.formResetService.resetUserFormEvent.subscribe(
      user => {
        this.user = user;
        this.initializeForm();
        console.log(this.user)
      }
    );
  }

  ngOnDestroy(): void {
    this.userResetSubscription.unsubscribe();
  }

  initializeForm() {
    this.formUser = Object.assign({}, this.user);
    this.checkIfFirstNameIsValid();
    this.checkIfLastNameIsValid();
    this.checkIfUsernameIsValid();
    this.checkIfUserAgeIsValid();
    this.checkIfUserEmailIsValid();
  }

  checkIfFirstNameIsValid() {

    if (this.formUser.first_name) {
      this.firstNameIsValid = this.formUser.first_name.trim().length > 0;
    } else {
      this.firstNameIsValid = false;
    }
  }

  checkIfLastNameIsValid() {
    if (this.formUser.last_name) {
      this.lastNameIsValid = this.formUser.last_name.trim().length > 0;
    } else {
      this.lastNameIsValid = false;
    }
  }

  checkIfUsernameIsValid() {
    if (this.formUser.username) {
      this.usernameIsValid = this.formUser.username.trim().length > 0;
    } else {
      this.usernameIsValid = false;
    }
  }

  checkIfUserAgeIsValid() {
    if (this.formUser.user_age) {
      this.userAgeIsValid = this.formUser.user_age > 17;
    } else {
      this.userAgeIsValid = false;
    }
  }

  checkIfUserEmailIsValid() {
    if (this.formUser.user_email) {
      this.userEmailIsValid = this.formUser.user_email.trim().length > 18;
    } else {
      this.userEmailIsValid = false;
    }
  }


  onSubmit() {

    this.dataService.updateUser(this.formUser, this.formUser.user_id).subscribe(
      (user) => {
        this.dataChangedEvent.emit();
        this.router.navigate(['users'], {queryParams: {action: 'view', id: user.user_id}});
      },
      error => this.message = (error.error)
    );
  }
}
