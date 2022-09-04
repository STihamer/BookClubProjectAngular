import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from "../../../model/User";
import {BookDTO} from "../../../model/BookDTO";
import {DataService} from "../../../data.service";
import {Subscription} from "rxjs";
import {BookOwner} from "../../../model/BookOwner";
import {FormResetService} from "../../../form-reset.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../auth.service";

@Component({
  selector: 'app-add-book-owner',
  templateUrl: './add-book-owner.component.html',
  styleUrls: ['./add-book-owner.component.css']
})
export class AddBookOwnerComponent implements OnInit,OnDestroy {

  users: Array<User> = new Array<User>();
  books: Array<BookDTO> = new Array<BookDTO>();
  myUser = new User();
  myBook = new BookDTO();
  action = '';

  @Output()
  dataChangedEvent = new EventEmitter();

  @Input()
  newBookOwner: BookOwner = new BookOwner();
  bookOwnerResetSubscription: Subscription = new Subscription();

  constructor(private dataService: DataService,
              private formResetService: FormResetService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnDestroy(): void {
    this.bookOwnerResetSubscription.unsubscribe();
    }

  ngOnInit(): void {

    this.dataService.getUsers().subscribe(next => {
      this.users = next;
      console.log(this.users)
    });
    this.dataService.getBooks().subscribe(next => {
      this.books = next;
      console.log(this.books)
    });

    this.bookOwnerResetSubscription = this.formResetService.resetOwnerBookFormEvent.subscribe(
      bookOwner => {
        this.newBookOwner = bookOwner;

      }
    );
  }

  onSubmit() {
    this.newBookOwner.user_id = this.myUser.user_id;
    this.newBookOwner.book_id = this.myBook.bookId;
    this.dataService.addBookOwner(this.newBookOwner).subscribe(
      (bookOwner) => {
        window.location.reload();
        window.location.replace("bookOwner");
        this.dataChangedEvent.emit();
        this.router.navigate(['bookOwner']);

      }
    );
  }


}
