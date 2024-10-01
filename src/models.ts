export interface IBook {
  title: string;
  author: string;
  year: number;

  getDetails(): string;
}

export interface IUser {
  name: string;
  email: string;

  getInfo(): string;
}

export class Book implements IBook {
  title: string;
  author: string;
  year: number;
  isBorrowed: boolean;
  borrowedBy?: number;
  constructor(
    title: string,
    author: string,
    year: number,
    isBorrowed: boolean = false
  ) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.isBorrowed = isBorrowed;
  }

  getDetails(): string {
    return `${this.title} написана ${this.author} у ${this.year} році`;
  }
}

export class User implements IUser {
  name: string;
  email: string;
  borrowedBookCount: number;
  borrowedBooks: Book[];

  constructor(
    name: string,
    email: string,
    borrowedBookCount: number = 0,
    borrowedBooks: Book[] = []
  ) {
    this.name = name;
    this.email = email;
    this.borrowedBookCount = borrowedBookCount;
    this.borrowedBooks = borrowedBooks;
  }

  getInfo(): string {
    return `Name: ${this.name}, Borrowed Books: ${this.borrowedBooks.length}`;
  }

  canBorrowMoreBooks(): boolean {
    return this.borrowedBookCount < 3;
  }

  borrowBook(book: Book): void {
    this.borrowedBookCount++;
    this.borrowedBooks.push(book);
  }

  returnBook(book: Book) {
    this.borrowedBookCount--;
    this.borrowedBooks = this.borrowedBooks.filter((b) => b !== book);
  }
}
