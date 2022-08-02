import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {BookOwner} from "../../model/BookOwner";
import {PersonNameBookTitleForBookOwner} from "../../model/PersonNameBookTitleForBookOwner";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../model/User";
import {Book} from "../../model/Book";

@Component({
  selector: 'app-book-owners',
  templateUrl: './book-owner.component.html',
  styleUrls: ['./book-owner.component.css']
})
export class BookOwnerComponent implements OnInit {

  bookOwnerList: Array<BookOwner> = new Array<BookOwner>();
  personNameBookTitleForBookOwners = new Array<PersonNameBookTitleForBookOwner>();
  selectedPersonNameBookTitleForBookOwner: any = new PersonNameBookTitleForBookOwner();
  action: string = '';
  selectedBookOwner: any = new BookOwner();
  selectedUser: any = new User()
  selectedBook: any = new Book()
  users: Array<User> = new Array<User>();
  books: Array<Book> = new Array<Book>();
  toggleAccordion = false;
  searchingText = '';


  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.router.navigate(['bookOwner']);
    this.loadingData()
  }

  loadingData() {
    this.dataService.users.subscribe(next => this.users = next);
    this.dataService.books.subscribe(next => this.books = next);
    this.dataService.bookOwners.subscribe(
      next => {
        let id = 1
        this.bookOwnerList = next;
        this.createPersonNameBookTitleForBookOwners(this.bookOwnerList, id);
        //this.toManageMyListingRouting();
      });
  }

  createPersonNameBookTitleForBookOwners(bookOwners: Array<BookOwner>, id: number) {
    for (let el of this.bookOwnerList) {
      const personNameBookTitleForBookOwner: PersonNameBookTitleForBookOwner = new PersonNameBookTitleForBookOwner()
      this.dataService.getUserById(el.user_id).subscribe(next => {
        personNameBookTitleForBookOwner.firstName = next.first_name;
        personNameBookTitleForBookOwner.lastName = next.last_name;
        personNameBookTitleForBookOwner.userId = next.user_id;

      });
      this.dataService.getBookById(el.book_id).subscribe(next => {
        personNameBookTitleForBookOwner.bookTitle = next.book_title;
        personNameBookTitleForBookOwner.bookId = next.book_id;

      });
      personNameBookTitleForBookOwner.id = id++;
      personNameBookTitleForBookOwner.bookOwnerId = el.id;

      this.personNameBookTitleForBookOwners.push(personNameBookTitleForBookOwner);

      //this.sortingMyListing();
      this.toManageMyListingRouting()
    }


  }

  toManageMyListingRouting() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const idUser = params['idUser'];
      const idBook = params['idBook'];
      this.action = params['action'];
      if (!this.action) {
        this.router.navigate(['bookOwner']);
        //this.myListingComponentHidden = false;
      } else if (this.action === 'add') {
        this.router.navigate(['bookOwner'], {queryParams: {action: 'add'}});
      } else if (this.action === 'accordion') {
        this.router.navigate(['bookOwner'], {queryParams: {action: 'openAccordion', idUser: idUser, idBook: idBook}});
      }
      if (idUser) {
        this.selectedUser = this.users.filter(user => user.user_id === +idUser);
        this.selectedUser = this.selectedUser[0];
        this.selectedBook = this.books.filter(book => book.book_id === +idBook)
        this.selectedBook = this.selectedBook[0];
      }

    });
  }

  selectUserAndBookForAccordion(personNameBookTitleForBookOwner: PersonNameBookTitleForBookOwner) {
    if (!this.toggleAccordion) {
      this.toggleAccordion = true;
      this.router.navigate(['bookOwner'],
        {
          queryParams: {
            action: "openAccordion",
            idUser: personNameBookTitleForBookOwner.userId,
            idBook: personNameBookTitleForBookOwner.bookId
          }
        });
    } else {
      this.router.navigate(['bookOwner']);
      this.toggleAccordion = false;
    }

  }

  deleteOwnerBookField(id: number) {
    this.router.navigate(['bookOwner'], {queryParams: {action: 'delete', id: id}})
    this.selectedPersonNameBookTitleForBookOwner = this.personNameBookTitleForBookOwners.find(element => element.id === +id);
    console.log(this.selectedPersonNameBookTitleForBookOwner.bookOwnerId);
    this.selectedBookOwner = this.bookOwnerList.filter(element => element.id === this.selectedPersonNameBookTitleForBookOwner.bookOwnerId);
    console.log(this.selectedBookOwner[0].book_id);
    this.dataService.deleteOwnerBook(this.selectedBookOwner[0].id).subscribe(
      next => {
        window.location.reload();
        window.location.replace('bookOwner');
      }
    )

  }
  findData(){}
}
