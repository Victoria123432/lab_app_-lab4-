/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, User } from './models';
import { Library } from './library';
import { LocalStorageService } from './services';
import { FormValidator } from './validation';
import { ModalManager } from './modal';

class App {
  private bookLibrary: Library<Book>;
  private userLibrary: Library<User>;
  private storage: LocalStorageService;
  private modalManager: ModalManager;
  private formValidator: FormValidator;

  constructor() {
    this.bookLibrary = new Library<Book>();
    this.userLibrary = new Library<User>();
    this.storage = new LocalStorageService();
    this.modalManager = new ModalManager();
    this.formValidator = new FormValidator();

    this.loadBooks();
    this.loadUsers();
    this.setupEventListeners();
    this.saveBooks();
    this.saveUsers();
  }

  private loadBooks(): void {
    const savedBooks = this.storage.getItem('books');
    if (savedBooks) {
      savedBooks.forEach((bookData: any) => {
        const book = new Book(
          bookData.title,
          bookData.author,
          bookData.year,
          bookData.isBorrowed
        );
        if (bookData.isBorrowed && bookData.borrowedBy !== undefined) {
          book.borrowedBy = bookData.borrowedBy;
        }
        this.bookLibrary.addItem(book);
      });
      this.renderBookList();
    }
  }

  private loadUsers(): void {
    const savedUsers = this.storage.getItem('users');
    if (savedUsers) {
      savedUsers.forEach((userData: any) => {
        const borrowedBooks = userData.borrowedBooks.map((bookData: any) => {
          const book = new Book(
            bookData.title,
            bookData.author,
            bookData.year,
            bookData.isBorrowed
          );
          book.borrowedBy = bookData.borrowedBy;
          return book;
        });
        const user = new User(
          userData.name,
          userData.email,
          userData.borrowedBookCount,
          borrowedBooks
        );
        this.userLibrary.addItem(user);
      });
      this.renderUserList();
    }
  }

  private saveUsers(): void {
    const usersToSave = this.userLibrary.getItems().map((user) => ({
      name: user.name,
      email: user.email,
      borrowedBookCount: user.borrowedBookCount,
      borrowedBooks: user.borrowedBooks.map((book) => ({
        title: book.title,
        author: book.author,
        year: book.year,
        isBorrowed: book.isBorrowed,
        borrowedBy: book.borrowedBy,
      })),
    }));
    this.storage.setItem('users', usersToSave);
  }

  private saveBooks(): void {
    const booksToSave = this.bookLibrary.getItems().map((book) => ({
      title: book.title,
      author: book.author,
      year: book.year,
      isBorrowed: book.isBorrowed,
      borrowedBy: book.isBorrowed ? book.borrowedBy : undefined,
    }));
    this.storage.setItem('books', booksToSave);
  }

  private setupEventListeners(): void {
    document.getElementById('saveButton')?.addEventListener('click', () => {
      const bookIndex = parseInt(
        (
          document.getElementById('saveButton') as HTMLButtonElement
        ).getAttribute('data-index')!
      );
      const userInput = document.getElementById('user-id') as HTMLInputElement;
      const isValid = this.formValidator.validateForm('id-form');
      if (isValid) {
        const userId = parseInt(userInput.value);
        const book = this.bookLibrary.getItems()[bookIndex];
        const user = this.userLibrary.getItems()[userId];
        this.modalManager.setModalContent(
          'exampleModalToggle2',
          `${book.title} has been borrowed by ${user.name}`
        );
        this.borrowBook(bookIndex, userId);
        userInput.value = '';
        this.modalManager.close('exampleModal');
        this.modalManager.open('exampleModalToggle2');
      }
    });
  }

  private renderBookList(): void {
    const bookList = document.getElementById('book-list-items') as HTMLElement;
    bookList.innerHTML = '';

    this.bookLibrary.getItems().forEach((book, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between';

      const buttonText = book.isBorrowed ? 'Повернути' : 'Позичити';
      const buttonClass = book.isBorrowed ? 'btn-warning' : 'btn-primary';
      const buttonAttributes = book.isBorrowed
        ? `data-user-id="${book.borrowedBy}" data-bs-target="#exampleModalToggle2"`
        : 'data-bs-target="#exampleModal"';
      const delButAt = book.isBorrowed ? 'disabled' : '';

      listItem.innerHTML = `
                <span>${book.title} - ${book.author} (${book.year})</span>
                <div class="gap-2 d-md-flex justify-content-md-end">
                    <button type="button" id="borrow-btn-${index}" class="btn ${buttonClass} borrow-btn" ${buttonAttributes} data-bs-toggle="modal" data-index="${index}">${buttonText}</button>
                    <button class="delete-book-btn btn btn-danger" data-index="${index}" ${delButAt}>Видалити</button>
                </div>
            `;

      bookList.appendChild(listItem);
    });

    this.setupBookEventListeners();
    this.addBook();
  }

  private setupBookEventListeners(): void {
    document.querySelectorAll('.borrow-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const target = event.target as HTMLButtonElement;
        const index = target.getAttribute('data-index');
        const bookIndex = parseInt(index!);
        const book = this.bookLibrary.getItems()[bookIndex];

        if (book.isBorrowed) {
          const userId = parseInt(target.getAttribute('data-user-id')!);
          this.modalManager.setModalContent(
            'exampleModalToggle2',
            `${book.title} has been returned`
          );
          this.returnBook(bookIndex, userId);
        } else {
          const saveButton = document.getElementById(
            'saveButton'
          ) as HTMLButtonElement;
          saveButton.setAttribute('data-index', index!);
        }
      });
    });

    document.querySelectorAll('.delete-book-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const target = event.target as HTMLButtonElement;
        const index = target.getAttribute('data-index');
        this.bookLibrary.removeItem(parseInt(index!));
        this.storage.setItem('books', this.bookLibrary.getItems());
        this.renderBookList();
      });
    });
  }

  private borrowBook(bookIndex: number, userId: number): void {
    const book = this.bookLibrary.getItems()[bookIndex];
    const user = this.userLibrary.getItems()[userId];

    if (!book.isBorrowed && user.canBorrowMoreBooks()) {
      book.isBorrowed = true;
      book.borrowedBy = userId;
      user.borrowBook(book);

      this.storage.setItem('books', this.bookLibrary.getItems());
      this.storage.setItem('users', this.userLibrary.getItems());
      this.renderBookList();
    } else {
      this.modalManager.setModalContent(
        'exampleModalToggle2',
        'Користувач не може позичити більше трьох книг!'
      );
    }
  }

  private returnBook(bookIndex: number, userId: number): void {
    const book = this.bookLibrary.getItems()[bookIndex];
    const user = this.userLibrary.getItems()[userId];

    if (book.isBorrowed) {
      book.isBorrowed = false;
      book.borrowedBy = undefined;
      user.returnBook(book);

      this.saveBooks();
      this.saveUsers();

      this.storage.setItem('books', this.bookLibrary.getItems());
      this.storage.setItem('users', this.userLibrary.getItems());

      this.renderBookList();
    }
  }

  private renderUserList(): void {
    const userList = document.getElementById('user-list-items') as HTMLElement;
    userList.innerHTML = '';

    this.userLibrary.getItems().forEach((user, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between';

      listItem.innerHTML = `
                <span>${user.name} - ${user.email}</span>
                <div class="d-md-flex justify-content-md-end">
                    <button class="delete-user-btn btn btn-danger" data-index="${index}">Видалити</button>
                </div>`;

      userList.appendChild(listItem);
    });

    this.setupUserEventListeners();
    this.addUser();
  }

  private setupUserEventListeners(): void {
    document.querySelectorAll('.delete-user-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();

        const target = event.target as HTMLButtonElement;
        const index = target.getAttribute('data-index');
        const user = this.userLibrary.getItems()[parseInt(index!)];

        if (user.borrowedBookCount > 0) {
          const borrowedBooksList = user.borrowedBooks
            .map((book) => book.title) // Витягуємо поле title з кожної книги
            .join(', '); // Об'єднуємо назви через кому
          this.modalManager.setModalContent(
            'exampleModalToggle2',
            `Щоб видалити користувача, поверніть: ${borrowedBooksList} `
          );
          this.modalManager.open('exampleModalToggle2');
          return;
        }

        this.userLibrary.removeItem(parseInt(index!));
        this.storage.setItem('users', this.userLibrary.getItems());
        this.renderUserList();
      });
    });
  }

  private addBook(): void {
    document
      .querySelector('#book-form')
      ?.addEventListener('submit', (event) => {
        event.preventDefault();

        const titleInput = document.querySelector(
          'input[placeholder="Назва книги"]'
        ) as HTMLInputElement;
        const authorInput = document.querySelector(
          'input[placeholder="Автор"]'
        ) as HTMLInputElement;
        const yearInput = document.querySelector(
          'input[placeholder="Рік видання"]'
        ) as HTMLInputElement;

        const title = titleInput.value;
        const author = authorInput.value;
        const year = yearInput.value;

        const isValid = this.formValidator.validateForm('book-form');

        if (isValid) {
          const book = new Book(title, author, parseInt(year, 10));
          this.bookLibrary.addItem(book);
          this.modalManager.setModalContent(
            'exampleModalToggle2',
            `Книжку ${book.title} додано!`
          );
          this.modalManager.open('exampleModalToggle2');

          this.storage.setItem('books', this.bookLibrary.getItems());

          titleInput.value = '';
          authorInput.value = '';
          yearInput.value = '';

          this.renderBookList();
        }
      });
  }

  private addUser(): void {
    document
      .querySelector('#user-form')
      ?.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = document.querySelector(
          'input[placeholder = "Ім\'я"]'
        ) as HTMLInputElement;
        const emailInput = document.querySelector(
          'input[placeholder = "Email"]'
        ) as HTMLInputElement;

        const name = nameInput.value;
        const email = emailInput.value;

        const isValid = this.formValidator.validateForm('user-form');

        if (isValid) {
          const user = new User(name, email);
          this.userLibrary.addItem(user);
          this.modalManager.setModalContent(
            'exampleModalToggle2',
            `Користувача ${user.name} додано!`
          );
          this.modalManager.open('exampleModalToggle2');

          this.storage.setItem('users', this.userLibrary.getItems());

          nameInput.value = '';
          emailInput.value = '';

          this.renderUserList();
        }
      });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new App();
