import * as Classes from './classes.js';

export function showAuthorDetails(authors, index) {
    const author = authors[index];
    console.log("Автор:", author);
    const authorDetailsSection = document.querySelector(".author-details");
    authorDetailsSection.classList.remove("d-none");

    document.getElementById("author-name").textContent = `${author.lastName} ${author.firstName} ${author.middleName || ''}`;
    document.getElementById("author-birthyear").textContent = author.birthYear;
    const booksList = document.getElementById("author-books");
    booksList.innerHTML = author.books.map(book => `<li>"${book.title}" - ${book.genre}, ${book.pages} сторінок</li>`).join("");
}

export function hideAuthorDetails() {
    const authorDetailsSection = document.querySelector(".author-details");
    authorDetailsSection.classList.add("d-none");
}

export function showAuthorForm() {
    const authorFormSection = document.querySelector(".author-form");
    authorFormSection.classList.remove("d-none");
}

export function showBookForm() {
    const bookFormSection = document.querySelector(".book-form");
    bookFormSection.classList.remove("d-none");
}

export function makeRows(authors) {
    document.querySelector("tbody").innerHTML = '';

    let i = 0;
    authors.forEach(author => {
        document.querySelector("tbody").innerHTML += `
        <tr>
            <td>${author.firstName} ${author.lastName}</td>
            <td>${author.countOfBooks}</td>
            <td>
                <button class="btn btn-primary btn-details btn-sm" data-author-index="${i}">Деталі</button>
            </td>
        </tr>`;
        i++;
    });
}

export function makeRow(authors) {
    let i = authors.length-1;
    console.log(authors[i]);
    document.querySelector("tbody").innerHTML += `
    <tr>
        <td>${authors[i].firstName} ${authors[i].lastName}</td>
        <td>${authors[i].countOfBooks}</td>
        <td>
            <button class="btn btn-primary btn-details btn-sm" data-author-index="${i}">Деталі</button>
        </td>
    </tr>`;
    addDetailsEventListeners(authors);
}

export function addDetailsEventListeners(authors) {
    document.querySelectorAll(".btn-details").forEach(btn => {
        btn.addEventListener('click', (event) => {
            const authorIndex = event.target.getAttribute("data-author-index");
            showAuthorDetails(authors, authorIndex);
        });
    });
}

export function populateAuthorDropdown(authors) {
    const dropdown = document.getElementById("book-author");

    authors.forEach((author, index) => {
        dropdown.innerHTML += `<option value="${index}">${author.firstName} ${author.lastName}</option>`;
    });
}

export function addAuthor(event, authors) {
    event.preventDefault();

    const lastName = document.getElementById("author-lastname").value.trim();
    const firstName = document.getElementById("author-firstname").value.trim();
    const middleName = document.getElementById("author-middlename").value.trim();
    const yearDate = document.getElementById("author-yearbirth").value;
    if (yearDate < 1900 || yearDate > Number(new Date().getFullYear())) {
        document.getElementById("error-year").classList.remove("d-none");
        return;
    } else {
        document.getElementById("error-year").classList.add("d-none");
    }

    const newAuthor = new Classes.Author(lastName, firstName, middleName, yearDate);
    authors.push(newAuthor);

    makeRow(authors);
    populateAuthorDropdown(authors);

    document.querySelector(".author-form").classList.add("d-none");
    document.getElementById("author-form").reset();
}

export function addBook(event, authors) {
    event.preventDefault();

    const title = document.getElementById("book-title").value.trim();
    const pages = Number(document.getElementById("book-pages").value);
    const genre = document.getElementById("book-genre").value.trim();
    const authorIndex = document.getElementById("book-author").value;

    const isDuplicate = authors[authorIndex].books.some(
        book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (isDuplicate) {
        document.getElementById("error-title").classList.remove("d-none");
        return;
    } else {
        document.getElementById("error-title").classList.add("d-none");
    }

    const newBook = new Classes.Book(title, pages, genre);
    authors[authorIndex].addBook(newBook);

    makeRows(authors);
    addDetailsEventListeners(authors);

    document.querySelector(".book-form").classList.add("d-none");
    document.getElementById("book-form").reset();
}
