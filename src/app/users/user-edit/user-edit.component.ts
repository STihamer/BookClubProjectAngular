import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UserDTO} from "../../model/UserDTO";
import {Subscription} from "rxjs";
import {DataService} from "../../data.service";
import {Router} from "@angular/router";
import {FormResetService} from "../../form-reset.service";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {


  @Input()
  user: UserDTO = new UserDTO();
  @Output()
  dataChangedEvent = new EventEmitter();

  formUser: UserDTO = new UserDTO();

  message: string = '';

  firstNameIsValid = false;
  lastNameIsValid = false;
  usernameIsValid = false;
  userAgeIsValid = false;
  userEmailIsValid = false;
  @Input()
  isAdminUser = false;
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

    if (this.formUser.firstName) {
      this.firstNameIsValid = this.formUser.firstName.trim().length > 0;
    } else {
      this.firstNameIsValid = false;
    }
  }

  checkIfLastNameIsValid() {
    if (this.formUser.lastName) {
      this.lastNameIsValid = this.formUser.lastName.trim().length > 0;
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
    if (this.formUser.userAge) {
      this.userAgeIsValid = this.formUser.userAge > 17;
    } else {
      this.userAgeIsValid = false;
    }
  }

  checkIfUserEmailIsValid() {
    if (this.formUser.userEmail) {
      this.userEmailIsValid = this.formUser.userEmail.trim().length > 18;
    } else {
      this.userEmailIsValid = false;
    }
  }


  onSubmit() {

    this.dataService.updateUser(this.formUser, this.formUser.userId).subscribe(
      (user) => {
        this.dataChangedEvent.emit();
        this.router.navigate(['users'], {queryParams: {action: 'view', id: this.formUser.userId}});
      },
      error => this.message = (error.error)
    );
  }
}
