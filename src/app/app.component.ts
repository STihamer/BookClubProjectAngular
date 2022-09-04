import {Component, EventEmitter, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {LoginComponent} from "./login/login.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BookClubProject';

}
