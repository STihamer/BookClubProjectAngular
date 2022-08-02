import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {BookOwner} from "../../model/BookOwner";
import {PersonNameBookTitleForBookOwner} from "../../model/PersonNameBookTitleForBookOwner";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../model/User";
import {Book} from "../../model/Book";
import {MyListing} from "../../model/MyListing";
import {FormResetService} from "../../form-reset.service";

@Component({
  selector: 'app-book-owners',
  templateUrl: './book-owner.component.html',
  styleUrls: ['./book-owner.component.css']
})
export class BookOwnerComponent implements OnInit {

  bookOwnerList: Array<BookOwner> = new Array<BookOwner>();
  personNameBookTitleForBookOwners: Array<PersonNameBookTitleForBookOwner> = new Array<PersonNameBookTitleForBookOwner>();
  selectedPersonNameBookTitleForBookOwner: any = new PersonNameBookTitleForBookOwner();
  action: string = '';
  selectedBookOwner: any = new BookOwner();
  selectedUser: any = new User()
  selectedBook: any = new Book()
  users: Array<User> = new Array<User>();
  books: Array<Book> = new Array<Book>();
  toggleAccordion = false;
  searchingText = '';
  bookComponentHidden = false;

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private resetService: FormResetService) {
  }

  ngOnInit(): void {
    this.router.navigate(['bookOwner']);
    this.loadData()
  }

  loadData() {
    this.dataService.users.subscribe(next => this.users = next);
    this.dataService.books.subscribe(next => this.books = next);
    this.dataService.bookOwners.subscribe(
      next => {
        let id = 1
        this.bookOwnerList = next;
        this.createPersonNameBookTitleForBookOwners(this.bookOwnerList, id);
        this.toManageBookOwnerRouting();
      });
  }

  createPersonNameBookTitleForBookOwners(bookOwners: Array<BookOwner>, id: number) {
    for (let el of this.bookOwnerList) {
      const personNameBookTitleForBookOwner: PersonNameBookTitleForBookOwner = new PersonNameBookTitleForBookOwner()

      this.dataService.getUserById(el.user_id).subscribe(user => {
        personNameBookTitleForBookOwner.firstName = user.first_name;
        personNameBookTitleForBookOwner.lastName = user.last_name;
        personNameBookTitleForBookOwner.userId = user.user_id;

      });
      this.dataService.getBookById(el.book_id).subscribe(book => {
        personNameBookTitleForBookOwner.bookTitle = book.book_title;
        personNameBookTitleForBookOwner.bookId = book.book_id;
      });
      personNameBookTitleForBookOwner.id = id++;
      personNameBookTitleForBookOwner.bookOwnerId = el.id;
      this.personNameBookTitleForBookOwners.push(personNameBookTitleForBookOwner);
    }
  }

  toManageBookOwnerRouting() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const idUser = params['idUser'];
      const idBook = params['idBook'];
      this.action = params['action'];
      if (!this.action) {
        this.router.navigate(['bookOwner']);
        this.bookComponentHidden = false;
      } else if (this.action === 'add') {
        this.bookComponentHidden = true;
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
    this.dataService.deleteOwnerBook(this.selectedBookOwner[0].id).subscribe(
      next => {
        window.location.reload();
        window.location.replace('bookOwner');
      }
    )

  }

  findBookOwnerByNameOrBookTitle(text: string) {
    this.router.navigate(['bookOwner'],
      {queryParams: {action: this.searchingText}})
    this.personNameBookTitleForBookOwners = this.personNameBookTitleForBookOwners.filter
    (element => (element.firstName.toLowerCase().indexOf(text.toLowerCase()) > -1)
      || (element.bookTitle.toLowerCase().indexOf(text.toLowerCase()) > -1))
    if (text === '') {
      window.location.reload();
    }
  }

  deleteSearchingByNameOrBookTitle() {
    this.router.navigate(['bookOwner']);
    this.loadData();
    this.searchingText = '';
  }

  addBookOwner() {
    this.bookComponentHidden = true;
    this.selectedBookOwner = new BookOwner();
    this.router.navigate(['bookOwner'], {queryParams: {action: 'add'}});
    this.resetService.resetOwnerBookFormEvent.emit(this.selectedBookOwner);
  }

}
