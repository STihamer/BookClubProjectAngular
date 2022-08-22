import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./users/users.component";
import {BooksComponent} from "./books/books.component";
import {HomeComponent} from "./home/home.component";
import {RentingDataComponent} from "./renting-data/renting-data.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {BookOwnerComponent} from "./users/book-owner/book-owner.component";
import {MyListingComponent} from "./users/my-listing/my-listing.component";
import {WaitingListComponent} from "./users/waiting-list/waiting-list.component";
import {AvailableBooksComponent} from "./books/available-books/available-books.component";
import {LoginComponent} from "./login/login.component";
import {AuthRouteGuardService} from "./auth-route-guard.service";

const routes: Routes = [
  {path: 'users', component:UsersComponent, canActivate: [AuthRouteGuardService]},
  {path: 'books', component:BooksComponent, canActivate: [AuthRouteGuardService]},
  {path: '', component:HomeComponent},
  {path: 'rentingTable', component:RentingDataComponent,canActivate: [AuthRouteGuardService]},
  {path: 'bookOwner', component:BookOwnerComponent, canActivate: [AuthRouteGuardService]},
  {path: 'myListing', component:MyListingComponent, canActivate: [AuthRouteGuardService]},
  {path: 'waitingList', component:WaitingListComponent,canActivate: [AuthRouteGuardService]},
  {path: 'booksNonRented', component:AvailableBooksComponent,canActivate: [AuthRouteGuardService]},
  {path: 'login', component: LoginComponent},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
