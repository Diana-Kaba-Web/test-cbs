import * as Classes from './classes.js';
import * as Functions from './functions.js';

const authors = Functions.loadFromLocalStorage();
const genres = Functions.loadGenresFromLocalStorage();

console.log(authors);
console.log(genres);

if (authors.length === 0 && genres.length === 0) {
    const author1 = new Classes.Author("Шевченко", "Тарас", "Григорович", 1564);
    const author2 = new Classes.Author("Шекспір", "Вільям", "", 1722);
    const author3 = new Classes.Author("Роулінг", "Джоан", "", 1965);

    authors.push(author1);
    authors.push(author2);
    authors.push(author3);

    const genre1 = new Classes.Genre("поезія");
    const genre2 = new Classes.Genre("вірші");
    const genre3 = new Classes.Genre("трагедія");
    const genre4 = new Classes.Genre("фентезі");

    genres.push(genre1);
    genres.push(genre2);
    genres.push(genre3);

    Functions.saveGenresToLocalStorage(genres);

    const book1 = new Classes.Book("Кобзар", 256, genre1.name);
    const book2 = new Classes.Book("Катерина", 164, genre1.name);
    const book3 = new Classes.Book("Ромео і Джульєтта", 208, genre2.name);
    const book4 = new Classes.Book("Гамлет", 240, genre2.name);
    const book5 = new Classes.Book("Гаррі Поттер і прокляте дитя", 350, genre4.name);

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
    Functions.addBook(event, authors, genres);
});

Functions.populateGenreDropdown(genres, 'book-genre');
Functions.addDeletedEventListeners(authors);
Functions.addDeleteBookEventListeners(authors);
Functions.addEditEventListeners(authors);

document.querySelector(".delete-book").addEventListener("click", Functions.showDeleteBookForm);
document.getElementById("delete-book-form").addEventListener("submit", (event) => {
    const authorIndex = document.querySelector(".author-details").getAttribute("data-author-index");
    Functions.deleteBookByIndex(event, authors, authorIndex);
});

document.querySelector(".hide-author-edit-form").addEventListener("click", Functions.hideEditAuthorForm);
document.querySelector(".hide-edit-book-form").addEventListener("click", Functions.hideEditBookForm);

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

Functions.populateGenreDropdown(genres, 'book-genre-edit');

document.getElementById("book-index-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const bookIndexFormSection = document.querySelector(".book-index-form");
    const authorIndex = bookIndexFormSection.getAttribute("data-author-index");
    const bookIndex = Number(document.getElementById("book-index-edit").value);

    if (isNaN(bookIndex) || bookIndex < 0 || bookIndex >= authors[authorIndex].books.length) {
        document.getElementById("error-book-index-edit").classList.remove("d-none");
        return;
    } else {
        document.getElementById("error-book-index-edit").classList.add("d-none");
    }

    Functions.hideBookIndexForm();
    Functions.showEditBookForm(authors, authorIndex, bookIndex, genres);
});

document.querySelector(".edit-book").addEventListener("click", () => {
    const authorIndex = document.querySelector(".author-details").getAttribute("data-author-index");
    Functions.showBookIndexForm(authorIndex);
});

document.getElementById("book-edit-form").addEventListener("submit", (event) => {
    event.preventDefault();
    Functions.editBook(authors, genres);
});

document.querySelector('.show-genres').addEventListener('click', Functions.showGenres);
document.querySelector('.hide-list').addEventListener('click', Functions.hideListOfGenres);

document.querySelector('.add-genre').addEventListener('click', Functions.showAddGenreForm);
document.querySelector('.hide-genre-form').addEventListener('click', Functions.hideAddGenreForm);
document.querySelector('#add-genre-form').addEventListener('submit', (e) => Functions.addGenre(e, genres));
