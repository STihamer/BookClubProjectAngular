export class BookDTO {

  bookId: number = 0;
  bookTitle: string = '';
  authorFirstName: string = '';
  authorLastName: string = '';
  publishedYear: number = 0;

  static fromHttp(book: BookDTO): BookDTO {
    const newBook = new BookDTO();
    newBook.bookId = book.bookId;
    newBook.bookTitle = book.bookTitle;
    newBook.authorFirstName = book.authorFirstName;
    newBook.authorLastName = book.authorLastName;
    newBook.publishedYear = book.publishedYear;
    return newBook;
  }

}
