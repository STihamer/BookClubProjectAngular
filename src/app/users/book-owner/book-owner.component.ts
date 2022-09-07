import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {BookOwnerDTO} from "../../model/BookOwnerDTO";
import {PersonNameBookTitleForBookOwner} from "../../model/PersonNameBookTitleForBookOwner";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {UserDTO} from "../../model/UserDTO";
import {BookDTO} from "../../model/BookDTO";
import {FormResetService} from "../../form-reset.service";
import {filter} from "rxjs";

@Component({
  selector: 'app-book-owners',
  templateUrl: './book-owner.component.html',
  styleUrls: ['./book-owner.component.css']
})
export class BookOwnerComponent implements OnInit {

  bookOwnerList: Array<BookOwnerDTO> = new Array<BookOwnerDTO>();
  personNameBookTitleForBookOwners: Array<PersonNameBookTitleForBookOwner> = new Array<PersonNameBookTitleForBookOwner>();
  selectedPersonNameBookTitleForBookOwner: any = new PersonNameBookTitleForBookOwner();
  action: string = '';
  selectedBookOwner: any = new BookOwnerDTO();
  selectedUser: any = new UserDTO()
  selectedBook: any = new BookDTO()
  users: Array<UserDTO> = new Array<UserDTO>();
  books: Array<BookDTO> = new Array<BookDTO>();
  searchingText = '';
  bookComponentHidden = false;
  currentUrl: string = '';
  previousUrl: string = '';
  role: string = '';
  id: number = 0;
  isAdminUser = false;

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private resetService: FormResetService) {
  }

  ngOnInit(): void {
    this.router.navigate(['bookOwner']);
    this.setupRoleAndId();
  }

  loadData() {
    this.getPreviousUrl();
    this.users = [];
    this.books = [];
    this.personNameBookTitleForBookOwners = [];
    this.bookOwnerList = [];
    this.dataService.getUsers().subscribe(next =>{
      this.users = next
      console.log(this.users)
    });
    this.dataService.getBooks().subscribe(next => {
      this.books = next;
      console.log(this.books)
    });
    this.dataService.bookOwners.subscribe(
      next => {
        let id = 1
        this.bookOwnerList = next;
        this.createPersonNameBookTitleForBookOwners(this.bookOwnerList, id);
        this.toManageBookOwnerRouting();
      });
  }

  createPersonNameBookTitleForBookOwners(bookOwners: Array<BookOwnerDTO>, id: number) {
    for (let el of this.bookOwnerList) {
      const personNameBookTitleForBookOwner: PersonNameBookTitleForBookOwner = new PersonNameBookTitleForBookOwner()

      this.dataService.getUserById(el.userId).subscribe(user => {
        personNameBookTitleForBookOwner.firstName = user.firstName;
        personNameBookTitleForBookOwner.lastName = user.lastName;
        personNameBookTitleForBookOwner.userId = user.userId;

      });
      this.dataService.getBookById(el.bookId).subscribe(book => {
        personNameBookTitleForBookOwner.bookTitle = book.bookTitle;
        personNameBookTitleForBookOwner.bookId = book.bookId;
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
        this.getPreviousUrl();
        if (this.previousUrl.indexOf('/bookOwner?action=openAccordion&idUser') == 0) {
          window.location.reload();
        }

        this.bookComponentHidden = false;
      } else if (this.action === 'add') {
        this.bookComponentHidden = true;
        this.router.navigate(['bookOwner'], {queryParams: {action: 'add'}});
      } else if (this.action === 'accordion') {
        this.router.navigate(['bookOwner'], {queryParams: {action: 'openAccordion', idUser: idUser, idBook: idBook}});
      }
      if (idUser) {
        this.selectedUser = this.users.filter(user => user.userId === +idUser);
        this.selectedUser = this.selectedUser[0];
        this.selectedBook = this.books.filter(book => book.bookId === +idBook)
        this.selectedBook = this.selectedBook[0];
      }

    });
  }

  selectUserAndBookForAccordion(personNameBookTitleForBookOwner: PersonNameBookTitleForBookOwner) {
    this.router.navigate(['bookOwner'],
      {
        queryParams: {
          action: "openAccordion",
          idUser: personNameBookTitleForBookOwner.userId,
          idBook: personNameBookTitleForBookOwner.bookId
        }
      });
  }


  deleteOwnerBookField(id: number) {
    this.router.navigate(['bookOwner'], {queryParams: {action: 'delete', id: id}})
    this.selectedPersonNameBookTitleForBookOwner = this.personNameBookTitleForBookOwners.find(element => element.id === +id);
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
    (element => element.bookTitle.toLowerCase().trim().indexOf(text.trim().toLowerCase()) > -1);
  }

  deleteSearchingByNameOrBookTitle() {
    this.router.navigate(['bookOwner']);
    this.loadData();
    this.searchingText = '';
  }

  addBookOwner() {
    this.bookComponentHidden = true;
    this.selectedBookOwner = new BookOwnerDTO();
    this.router.navigate(['bookOwner'], {queryParams: {action: 'add'}});
    this.resetService.resetOwnerBookFormEvent.emit(this.selectedBookOwner);
  }

  getPreviousUrl() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
    });
  }

  setupRoleAndId() {
    this.dataService.getRole().subscribe(
      next => {
        this.role = next.role;
        if (this.role == 'admin') {
          this.isAdminUser = true;
        }
        this.dataService.getId().subscribe(
          next => {
            this.id = next.id;
            this.loadData();
          }
        );
      }
    );

  };
}
