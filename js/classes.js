export class Book {
    constructor(title, pages, genre) {
        this.title = title;
        this.pages = pages;
        this.genre = genre;
    }
}

export class Author {
    constructor(lastName, firstName, middleName = '', birthDate) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.birthDate = birthDate;
        this.books = [];
        this.countOfBooks = 0;
    }

    addBook(book) {
        this.books.push(book);
        this.countOfBooks++;
    }
}