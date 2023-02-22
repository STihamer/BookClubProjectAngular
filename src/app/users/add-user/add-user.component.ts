import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {Router} from "@angular/router";
import {UserDTO} from "../../model/UserDTO";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  newUser: UserDTO = new UserDTO();
  message: string = '';
  firstNameIsValid = false;
  firstNameContainsNumber = false;
  firstNameLength = false;
  lastNameIsValid = false;
  lastNameContainsNumber = false;
  lastNameLength = false;
  userNameIsValid = false;
  userNameBeginsWithNumber = false;
  userNameLength = false;
  passwordIsValid = false;
  passwordContent = false;
  userEmailIsValid = false;
  userAgeIsValid = false;
  userAge: any = null;
  userRoleIsValid = false;
  errorMessage = '';

  constructor(private dataService: DataService,
              private router: Router) {
  }


  ngOnInit(): void {

  }

  submit() {
    this.newUser.userAge = this.userAge;
    this.dataService.addUser(this.newUser).subscribe(
      next => {
        this.message = "New user successfully added "

      },
      error => this.errorMessage = error.error
    )
  }

  closeAddUserComponent() {
    window.location.replace("users");

  }

  checkIfFirstNameIsValid() {
    const regExp: RegExp = new RegExp(/\d/)
    if (this.newUser.firstName) {
      if (this.newUser.firstName.match(regExp) != null) {
        this.firstNameContainsNumber = true;
        this.firstNameIsValid = false;
      }

    } else {
      this.firstNameIsValid = true;
      this.firstNameContainsNumber = false;
    }
    if (this.newUser.firstName.length <= 1) {
      this.firstNameIsValid = false;
      this.firstNameLength = true;
    } else {
      this.firstNameIsValid = true;
      this.firstNameLength = false;
    }
  }

  checkIfLastNameIsValid() {
    const regExp: RegExp = new RegExp(/\d/)
    if (this.newUser.lastName) {
      if (this.newUser.lastName.match(regExp) != null) {
        this.lastNameContainsNumber = true;
        this.lastNameIsValid = false;
      }

    } else {
      this.lastNameIsValid = true;
      this.lastNameContainsNumber = false;
    }
    if (this.newUser.lastName.length <= 1) {
      this.lastNameIsValid = false;
      this.lastNameLength = true;
    } else {
      this.lastNameIsValid = true;
      this.lastNameLength = false;
    }
  }

  checkIfUserNameIsValid() {
    const regExp: RegExp = new RegExp(/^\d/)
    if (this.newUser.username) {
      if (this.newUser.username.match(regExp) != null) {
        this.userNameBeginsWithNumber = true;
        this.userNameIsValid = false;
      } else {
        this.userNameBeginsWithNumber = false;
        this.userNameIsValid = true;

      }
    }
    if (this.newUser.username.length <= 1) {
      this.userNameIsValid = false;
      this.userNameLength = true;
    } else {
      this.userNameIsValid = true;
      this.userNameLength = false;
    }
  }

  checkIfPasswordIsValid() {
    const regExp: RegExp = new RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/)
    if (this.newUser.password) {
      if (this.newUser.password.match(regExp) == null) {
        this.passwordIsValid = false;
        this.passwordContent = false;
      } else {
        this.passwordContent = true;
        this.passwordIsValid = true;
      }
      if (this.newUser.password.length < 6) {
        this.passwordIsValid = false;
      }
    } else {
      this.passwordIsValid = true;
    }
  }

  checkIfEmailIsValid() {
    const regExp: RegExp = new RegExp(/^[a-z\d._\-]{3,25}@[a-z\d\-]{3,8}\.[a-z]{2,3}$/)
    if (this.newUser.userEmail) {
      if (this.newUser.userEmail.match(regExp) == null) {
        this.userEmailIsValid = false;
      } else {
        this.userEmailIsValid = true;
      }
    }
  }

  checkIfAgeIsValid() {
    this.newUser.userAge = this.userAge;
    if (this.newUser.userAge) {
      if (this.newUser.userAge < 18) {
        this.userAgeIsValid = false;
      } else {
        this.userAgeIsValid = true;
      }
    }
  }

  checkIfRoleIsValid() {
    if (!this.newUser.roleId) {
    } else {
      this.userRoleIsValid = true;
    }
  }

  clearDataFromNewUsersForm() {
    window.location.reload();
  }
}

