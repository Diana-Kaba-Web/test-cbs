import * as Classes from './classes.js';

export function showAuthorDetails(authors, index) {
    const author = authors[index];
    console.log("Автор:", author);
    const authorDetailsSection = document.querySelector(".author-details");
    authorDetailsSection.classList.remove("d-none");
    authorDetailsSection.setAttribute("data-author-index", index);

    document.getElementById("author-name").textContent = `${author.lastName} ${author.firstName} ${author.middleName || ''}`;
    document.getElementById("author-birthyear").textContent = author.birthYear;
    const booksList = document.getElementById("author-books");
    booksList.innerHTML = author.books.map((book, i) => `<li>"№${i} ${book.title}" - ${book.genre}, ${book.pages} сторінок</li>`).join("");
}

export function hideAuthorDetails() {
    const authorDetailsSection = document.querySelector(".author-details");
    authorDetailsSection.classList.add("d-none");
}

export function showAuthorForm() {
    const authorFormSection = document.querySelector(".author-form");
    authorFormSection.classList.remove("d-none");
}

export function hideAuthorForm() {
    const authorFormSection = document.querySelector(".author-form");
    authorFormSection.classList.add("d-none");
}

export function showBookForm() {
    const bookFormSection = document.querySelector(".book-form");
    bookFormSection.classList.remove("d-none");
}

export function hideBookForm() {
    const bookFormSection = document.querySelector(".book-form");
    bookFormSection.classList.add("d-none");
}

export function showDeleteBookForm() {
    document.querySelector(".delete-book-form").classList.remove("d-none");
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
                <button class="btn btn-primary btn-delete btn-sm" data-author-index="${i}">Видалити</button>
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
            <button class="btn btn-primary btn-delete btn-sm" data-author-index="${i}">Видалити</button>
        </td>
    </tr>`;
    addDetailsEventListeners(authors);
    addDeletedEventListeners(authors);
}

export function addDetailsEventListeners(authors) {
    document.querySelectorAll(".btn-details").forEach(btn => {
        btn.addEventListener('click', (event) => {
            const authorIndex = event.target.getAttribute("data-author-index");
            showAuthorDetails(authors, authorIndex);
        });
    });
}

export function addDeletedEventListeners(authors) {
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener('click', (event) => {
            const authorIndex = event.target.getAttribute("data-author-index");
            deleteAuthor(authorIndex, authors);
        });
    });
}

export function addDeleteBookEventListeners(authors) {
    document.querySelectorAll(".delete-book").forEach(btn => {
        btn.addEventListener('click', (event) => {
            const authorIndex = event.target.getAttribute("data-author-index");
            const bookIndex = event.target.getAttribute("data-book-index");
            deleteBookByIndex(event, authorIndex, authorIndex);
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

    saveToLocalStorage(authors);
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

    saveToLocalStorage(authors);
    makeRows(authors);
    addDetailsEventListeners(authors);

    document.querySelector(".book-form").classList.add("d-none");
    document.getElementById("book-form").reset();
}

export function deleteAuthor(index, authors) {
    const isSure = confirm("Ви точно бажаєте видалити автора?");
    if (isSure) {
        authors.splice(index, 1);
        saveToLocalStorage(authors);
        makeRows(authors);
        addDeletedEventListeners(authors);
        addDetailsEventListeners(authors);
    }
}

export function deleteBookByIndex(event, authors, authorIndex) {
    event.preventDefault();

    const bookIndex = document.getElementById("book-index").value;
    if (bookIndex < 0 || bookIndex >= authors[authorIndex].books.length) {
        document.getElementById("error-book-index").classList.remove("d-none");
        return;
    } else {
        document.getElementById("error-book-index").classList.add("d-none");
    }

    const isSure = confirm("Ви точно бажаєте видалити цю книгу?");
    if (isSure) {
        authors[authorIndex].books.splice(bookIndex, 1); // Видалення книги
        authors[authorIndex].countOfBooks--; // Оновлення кількості книг
        saveToLocalStorage(authors); // Зберігаємо зміни
        showAuthorDetails(authors, authorIndex); // Оновлюємо деталі автора
        makeRows(authors); // Оновлюємо таблицю авторів

        document.querySelector(".delete-book-form").classList.add("d-none"); // Ховаємо форму
        document.getElementById("delete-book-form").reset(); // Скидаємо форму
    }
}


// LOCALSTORAGE

export function loadFromLocalStorage() {
    const savedAuthors = localStorage.getItem("authors");
    if (!savedAuthors) return [];

    const authors = JSON.parse(savedAuthors);
    return authors.map(authorData => {
        const author = new Classes.Author(
            authorData.lastName,
            authorData.firstName,
            authorData.middleName,
            authorData.birthYear
        );
        author.books = authorData.books.map(bookData => new Classes.Book(bookData.title, bookData.pages, bookData.genre));
        author.countOfBooks = author.books.length;
        return author;
    });
}

export function saveToLocalStorage(authors) {
    localStorage.setItem("authors", JSON.stringify(authors));
}
