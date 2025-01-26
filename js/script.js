import * as Classes from './classes.js';
import * as Functions from './functions.js';

const authors = [];

const author1 = new Classes.Author("Шевченко", "Тарас", "Григорович", 1564);
const author2 = new Classes.Author("Шекспір", "Вільям", "", 1722);
const author3 = new Classes.Author("Джоан", "Роулінг", "", 1965);

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

Functions.makeRows(authors);

Functions.addDetailsEventListeners(authors);
document.querySelector(".btn-hide").addEventListener("click", Functions.hideAuthorDetails);

document.querySelector(".add-author").addEventListener("click", Functions.showAuthorForm);
document.getElementById("author-form").addEventListener("submit", (event) => {
    Functions.addAuthor(event, authors);
});