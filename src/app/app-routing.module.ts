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

const routes: Routes = [
  {path: 'users', component:UsersComponent},
  {path: 'books', component:BooksComponent},
  {path: '', component:HomeComponent},
  {path: 'rentingTable', component:RentingDataComponent},
  {path: 'bookOwner', component:BookOwnerComponent},
  {path: 'myListing', component:MyListingComponent},
  {path: 'waitingList', component:WaitingListComponent},
  {path: 'booksNonRented', component:AvailableBooksComponent},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
