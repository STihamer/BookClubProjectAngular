import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { UsersComponent } from './users/users.component';
import { BooksComponent } from './books/books.component';
import { HomeComponent } from './home/home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { RentingDataComponent } from './renting-data/renting-data.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { BookOwnerComponent } from './users/book-owner/book-owner.component';
import { MyListingComponent } from './users/my-listing/my-listing.component';
import { WaitingListComponent } from './users/waiting-list/waiting-list.component';
import { AvailableBooksComponent } from './books/available-books/available-books.component';
import {HttpClientModule} from "@angular/common/http";
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';




@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    UsersComponent,
    BooksComponent,
    HomeComponent,
    RentingDataComponent,
    PageNotFoundComponent,
    BookOwnerComponent,
    MyListingComponent,
    WaitingListComponent,
    AvailableBooksComponent,
    UserEditComponent,
    UserDetailComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
