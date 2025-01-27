import * as Classes from './classes.js';
import * as Functions from './functions.js';

const authors = Functions.loadFromLocalStorage();
console.log(authors);
if (!authors || authors.length === 0) {
    const author1 = new Classes.Author("Шевченко", "Тарас", "Григорович", 1564);
    const author2 = new Classes.Author("Шекспір", "Вільям", "", 1722);
    const author3 = new Classes.Author("Роулінг", "Джоан", "", 1965);

    authors.push(author1);
    authors.push(author2);
    authors.push(author3);

    const book1 = new Classes.Book("Кобзар", 256, "поезія");
    const book2 = new Classes.Book("Катерина", 164, "поезія");
    const book3 = new Classes.Book("Ромео і Джульєтта", 208, "вірші, трагедія");
    const book4 = new Classes.Book("Гамлет", 240, "вірші, трагедія");
    const book5 = new Classes.Book("Гаррі Поттер і прокляте дитя", 350, "фентезі");

    author1.addBook(book1);
    author1.addBook(book2);
    author2.addBook(book3);
    author2.addBook(book4);
    author3.addBook(book5);

    console.log(authors);
    Functions.saveToLocalStorage(authors);
}

Functions.makeRows(authors);

Functions.addDetailsEventListeners(authors);
document.querySelector(".btn-hide").addEventListener("click", Functions.hideAuthorDetails);

document.querySelector(".add-author").addEventListener("click", Functions.showAuthorForm);
document.querySelector(".hide-book-form").addEventListener("click", Functions.hideBookForm);
document.querySelector(".add-book").addEventListener("click", Functions.showBookForm);
document.querySelector(".hide-author-form").addEventListener("click", Functions.hideAuthorForm);

document.getElementById("author-form").addEventListener("submit", (event) => {
    Functions.addAuthor(event, authors);
});

Functions.populateAuthorDropdown(authors);
document.getElementById("book-form").addEventListener("submit", (event) => {
    Functions.addBook(event, authors);
});

Functions.addDeletedEventListeners(authors);
Functions.addDeleteBookEventListeners(authors);
Functions.addEditEventListeners(authors);

document.querySelector(".delete-book").addEventListener("click", Functions.showDeleteBookForm);
document.getElementById("delete-book-form").addEventListener("submit", (event) => {
    const authorIndex = document.querySelector(".author-details").getAttribute("data-author-index");
    Functions.deleteBookByIndex(event, authors, authorIndex);
});

document.querySelector(".hide-author-edit-form").addEventListener("click", Functions.hideEditAuthorForm);

document.getElementById("author-edit-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const index = document.querySelector(".author-edit-form").getAttribute("data-author-index");
    const updatedData = {
        lastName: document.getElementById("author-lastname-edit").value,
        firstName: document.getElementById("author-firstname-edit").value,
        middleName: document.getElementById("author-middlename-edit").value,
        birthYear: document.getElementById("author-yearbirth-edit").value
    };

    Functions.editAuthor(authors, index, updatedData);
});
