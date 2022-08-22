import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  message: string = '';
  name: string = '';
  password: string = '';
  subscription: Subscription = new Subscription();

  constructor(private authService: AuthService,
              private route: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.authService.authenticationResultEvent.subscribe(
      result => {
        if (result) {
          console.log(result);
          const url = this.activatedRoute.snapshot.queryParams['requested'];
          this.route.navigateByUrl(url);
        } else {
          this.message = 'Your username or password was not recognised - try again.';
        }
      }
    )
  }

  onSubmit() {

    this.authService.authenticate(this.name, this.password);
  }
}
