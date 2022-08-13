export class FindBookByTitleOrAuthorIfAvailable {

  id: number = 0;
  book_id: number = 0;
  author_fname: string = '';
  author_lname: string = '';
  book_title: string = '';
  return_date: Date = new Date();

  static fromHttp(foundBook: FindBookByTitleOrAuthorIfAvailable): FindBookByTitleOrAuthorIfAvailable {
    const newFoundBook = new FindBookByTitleOrAuthorIfAvailable();
    newFoundBook.book_id = foundBook.book_id;
    newFoundBook.author_fname = foundBook.author_fname;
    newFoundBook.author_lname = foundBook.author_lname;
    newFoundBook.book_title = foundBook.book_title;
    newFoundBook.return_date = foundBook.return_date;
    return newFoundBook;
  }

}
