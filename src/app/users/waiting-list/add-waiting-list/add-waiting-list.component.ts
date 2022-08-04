import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from "../../../model/User";
import {Book} from "../../../model/Book";
import {WaitingList} from "../../../model/WaitingList";
import {DataService} from "../../../data.service";
import {BookOwner} from "../../../model/BookOwner";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-waiting-list',
  templateUrl: './add-waiting-list.component.html',
  styleUrls: ['./add-waiting-list.component.css']
})
export class AddWaitingListComponent implements OnInit {


  books: Array<Book> = new Array<Book>();
  newBookOwnerList: Array<BookOwner> = new Array<BookOwner>();
  waitingLists: Array<WaitingList> = new Array<WaitingList>();
  bookOwnerPersons: Array<User> = new Array<User>();
  bookReaders: Array<User> = new Array<User>();
  newBookOwner: BookOwner = new BookOwner();
  option = '';
  anotherBookOwner: any = new BookOwner();
  newBooks: Array<Book> = new Array<Book>();
  newOwnerPersons: Array<User> = new Array<User>();
  newWaitingList: WaitingList = new WaitingList()
  @Output()
  dataChangeEvent = new EventEmitter();

  constructor(private dataService: DataService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.dataService.users.subscribe(
      readers => {
        this.bookReaders = readers;
      }
    )

    this.loadData();
  }

  loadData() {
    this.books = [];
    this.bookOwnerPersons = [];
    this.dataService.waitingLists.subscribe(next => {
      this.waitingLists = next;
      for (let el of next) {
        this.dataService.getBookOwnerById(el.book_for_reading).subscribe(bookOwner => {
          this.newBookOwnerList.push(bookOwner);
          this.dataService.getUserById(bookOwner.user_id).subscribe(
            user => {
              this.bookOwnerPersons.push(user)
            }
          );
          this.dataService.getBookById(bookOwner.book_id).subscribe(
            book => this.books.push(book)
          );
        })
      }
      this.newBooks = this.books;
      this.newOwnerPersons = this.bookOwnerPersons;
    });
  }

  filterBooksByUseIdForBookOwnerSet(id: number) {
    this.router.navigate(['waitingList'], {queryParams: {action: 'add', option: 'option'}});
    this.anotherBookOwner = this.newBookOwnerList.find(element => element.user_id == id);
    this.newBooks = this.books.filter(el => el.book_id == this.anotherBookOwner.book_id);
  }

  filterBooksByBookIdForBookOwnerSet(id: number) {
    this.router.navigate(['waitingList'], {queryParams: {action: 'add', option: 'option'}});
    this.anotherBookOwner = this.newBookOwnerList.find(element => element.book_id == id);
    this.newOwnerPersons = this.bookOwnerPersons.filter(el => el.user_id == this.anotherBookOwner.user_id);
  }

  clearDataFromAddForm() {
    this.newBookOwner = new BookOwner();
    this.newOwnerPersons = [];
    this.newBooks = [];
    this.bookReaders = [];
    window.location.reload()

  }

  onSubmit() {
    this.newWaitingList.book_for_reading = this.anotherBookOwner.id;
    this.newWaitingList.finished = false;
    this.dataService.addWaitingList(this.newWaitingList).subscribe(
      (newWaitingList) => {
        window.location.reload();
        console.log(this.newWaitingList);
        window.location.replace("waitingList");
        this.dataChangeEvent.emit();
        this.router.navigate(['waitingList']);

      }
    );
  }
}
