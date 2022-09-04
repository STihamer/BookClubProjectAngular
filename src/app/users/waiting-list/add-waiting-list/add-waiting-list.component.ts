import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from "../../../model/User";
import {BookDTO} from "../../../model/BookDTO";
import {WaitingList} from "../../../model/WaitingList";
import {DataService} from "../../../data.service";
import {BookOwner} from "../../../model/BookOwner";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonNameBookTitleForBookOwner} from "../../../model/PersonNameBookTitleForBookOwner";
import {AuthService} from "../../../auth.service";

@Component({
  selector: 'app-add-waiting-list',
  templateUrl: './add-waiting-list.component.html',
  styleUrls: ['./add-waiting-list.component.css']
})
export class AddWaitingListComponent implements OnInit {


  books: Array<BookDTO> = new Array<BookDTO>();
  bookReaders: Array<User> = new Array<User>();
  option = '';
  action = '';
  anotherBookOwner: any = new BookOwner();
  newWaitingList: WaitingList = new WaitingList()
  users: Array<User> = new Array<User>();
  bookOwnerList: Array<BookOwner> = new Array<BookOwner>();
  personNameBookTitleForBookOwners: Array<PersonNameBookTitleForBookOwner> = new Array<PersonNameBookTitleForBookOwner>();
  personNameBookTitleForBookOwner: PersonNameBookTitleForBookOwner = new PersonNameBookTitleForBookOwner();
  @Output()
  dataChangeEvent = new EventEmitter();
  role: string = '';
  id: number = 0;

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.setupRoleAndId()
    this.loadData();
  }

  loadData() {
    this.users = [];
    this.books = [];
    this.personNameBookTitleForBookOwners = [];
    this.bookOwnerList = [];
    this.dataService.getUsers().subscribe(next => this.users = next);
    this.dataService.getBooks().subscribe(next => this.books = next);
    this.dataService.bookOwners.subscribe(
      next => {
        let id = 1
        this.bookOwnerList = next;
        this.createPersonNameBookTitleForBookOwners(this.bookOwnerList, id);

      });
    this.toManageAddWaitingListRouting();
  }

  filterBooksByUseIdForBookOwnerSet(id: number) {
    this.router.navigate(['waitingList'], {queryParams: {action: 'add', option: 'option'}});
    this.personNameBookTitleForBookOwners = this.personNameBookTitleForBookOwners.filter(element => element.bookOwnerId == +id);
  }

  filterBooksByBookIdForBookOwnerSet(idBook: number) {
    this.router.navigate(['waitingList'], {queryParams: {action: 'add', option: 'option', idBook: idBook}});
    this.personNameBookTitleForBookOwners = this.personNameBookTitleForBookOwners.filter(element => element.bookId == +idBook);

  }

  clearDataFromAddForm() {
    this.personNameBookTitleForBookOwner.bookOwnerId = 0;
    this.personNameBookTitleForBookOwner.bookId = 0;
    this.newWaitingList.user_id = 0;
    window.location.reload()

  }

  onSubmit() {
    console.log(this.personNameBookTitleForBookOwner.bookId);
    console.log(this.personNameBookTitleForBookOwner.bookOwnerId);
    this.bookOwnerList = this.bookOwnerList.filter(element => element.book_id == this.personNameBookTitleForBookOwner.bookId && element.user_id == this.personNameBookTitleForBookOwner.bookOwnerId);
    console.log(this.bookOwnerList)
    this.newWaitingList.book_for_reading = this.bookOwnerList[0].id;
    this.newWaitingList.finished = false;
    this.dataService.addWaitingList(this.newWaitingList).subscribe(
      (newWaitingList) => {
        window.location.reload();
        window.location.replace("waitingList");
        this.dataChangeEvent.emit();
        this.router.navigate(['waitingList']);
      }
    );
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
      personNameBookTitleForBookOwner.bookOwnerId = el.user_id;
      this.personNameBookTitleForBookOwners.push(personNameBookTitleForBookOwner);
    }
  }

  toManageAddWaitingListRouting() {
    this.route.queryParams.subscribe(params => {
      const idBook = params['idBook'];
      this.action = params['action'];
      if (idBook && this.anotherBookOwner == 'add' && this.option) {
        this.router.navigate(['waitingList'], {queryParams: {action: 'add', id: idBook}})
      }
    });
  }

  setupRoleAndId() {
    this.dataService.getRole().subscribe(
      next => {
        this.role = next.role;
        this.dataService.getId().subscribe(
          next => {
            this.id = next.id;
            this.dataService.getUsers().subscribe(
              readers => {
                if (this.role == 'user') {
                  this.bookReaders = readers.filter(reader => reader.user_id == this.id);
                } else {
                  this.bookReaders = readers;
                }
              }
            );
          }
        )
      }
    );

  }
}
