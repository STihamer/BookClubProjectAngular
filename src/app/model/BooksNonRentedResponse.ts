export class BooksNonRentedResponse {
  id: number = 0;
  book_title: string = '';
  author_fname: string = '';
  author_lname: string = '';
  return_date: Date = new Date();

  static fromHttp(booksNonRented: BooksNonRentedResponse): BooksNonRentedResponse {
    const newBooksNonRented = new BooksNonRentedResponse();
    newBooksNonRented.id = booksNonRented.id;
    newBooksNonRented.book_title = booksNonRented.book_title;
    newBooksNonRented.author_fname = booksNonRented.author_fname;
    newBooksNonRented.author_lname = booksNonRented.author_lname;
    newBooksNonRented.return_date = booksNonRented.return_date;


    return newBooksNonRented;
  }
}
