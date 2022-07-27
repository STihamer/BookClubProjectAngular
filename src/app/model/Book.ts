export class Book {

  book_id: number = 0;
  book_title: string = '';
  author_fname: string = '';
  author_lname: string = '';
  published: number = 0;

  static fromHttp(book: Book): Book {
    const newBook = new Book();
    newBook.book_id = book.book_id;
    newBook.book_title = book.book_title;
    newBook.author_fname = book.author_fname;
    newBook.author_lname = book.author_lname;
    newBook.published = book.published;
    return newBook;
  }

}
