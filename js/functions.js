import * as Classes from './classes.js';

// Details
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

// Show/hide forms
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

export function showAddGenreForm() {
    document.querySelector(".add-genre-form").classList.remove("d-none");
}

export function hideAddGenreForm() {
    document.querySelector(".add-genre-form").classList.add("d-none");
}

// Make rows of table
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
                <button class="btn btn-primary btn-edit btn-sm" data-author-index="${i}">Редагувати</button>
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
            <button class="btn btn-primary btn-edit btn-sm" data-author-index="${i}">Редагувати</button>
            <button class="btn btn-primary btn-delete btn-sm" data-author-index="${i}">Видалити</button>
        </td>
    </tr>`;
    addListeners(authors);
}

// EventListeners
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

export function addEditEventListeners(authors) {
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", (event) => {
            const authorIndex = event.target.getAttribute("data-author-index");
            showEditAuthorForm(authors, authorIndex);
        });
    });
}

export function addListeners(authors) {
    addDeleteBookEventListeners(authors);
    addDeletedEventListeners(authors);
    addDetailsEventListeners(authors);
    addEditEventListeners(authors);
}

// Dropdown menus
export function populateAuthorDropdown(authors) {
    const dropdown = document.getElementById("book-author");

    authors.forEach((author, index) => {
        dropdown.innerHTML += `<option value="${index}">${author.firstName} ${author.lastName}</option>`;
    });
}

export function populateGenreDropdown(genres, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '';
    dropdown.innerHTML = genres
        .map((genre, index) => `<option value="${index}">${genre.name}</option>`)
        .join("");
}

// Opportunity of adding
export function addAuthor(event, authors) {
    event.preventDefault();

    const lastName = document.getElementById("author-lastname").value.trim();
    const firstName = document.getElementById("author-firstname").value.trim();
    const middleName = document.getElementById("author-middlename").value.trim();
    const yearDate = document.getElementById("author-yearbirth").value;

    const isValid = validateTextField(lastName, "^[А-Яа-яІіЇїЄєҐґA-Za-z\\s'-]{2,50}$", "Прізвище")
    && validateTextField(firstName, "^[А-Яа-яІіЇїЄєҐґA-Za-z\\s'-]{2,50}$", "Ім'я")
    && (middleName === '' || validateTextField(middleName, "^[А-Яа-яІіЇїЄєҐґA-Za-z\\s'-]{0,50}$", "По батькові"));

    if (!isValid)
        return;

    if (yearDate < 1500 || yearDate > Number(new Date().getFullYear())) {
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
    addListeners(authors);

    document.querySelector(".author-form").classList.add("d-none");
    document.getElementById("author-form").reset();
}

export function addBook(event, authors, genres) {
    event.preventDefault();

    const title = document.getElementById("book-title").value.trim();
    const pages = Number(document.getElementById("book-pages").value);
    const genreIndex = Number(document.getElementById("book-genre").value);
    const authorIndex = Number(document.getElementById("book-author").value);

    if (isNaN(genreIndex) || genreIndex < 0 || genreIndex >= genres.length) {
        alert("Виберіть коректний жанр.");
        return;
    }
    const genre = new Classes.Genre(genres[genreIndex].name);

    if (isNaN(authorIndex) || authorIndex < 0 || authorIndex >= authors.length) {
        alert("Виберіть коректного автора.");
        return;
    }

    if (pages <= 0 || pages > 10000) {
        alert("Кількість сторінок має бути між 1 і 10 000.");
        return;
    }

    const isValid = validateTextField(
        title,
        "^[А-Яа-яІіЇїЄєҐґA-Za-z0-9\\s'-]{2,100}$",
        "Назва книги"
    );

    if (!isValid) return;

    const isDuplicate = authors[authorIndex].books.some(
        (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (isDuplicate) {
        document.getElementById("error-title").classList.remove("d-none");
        return;
    } else {
        document.getElementById("error-title").classList.add("d-none");
    }

    const newBook = new Classes.Book(title, pages, genre.name);
    authors[authorIndex].addBook(newBook);

    saveToLocalStorage(authors);
    makeRows(authors);
    addListeners(authors);

    document.querySelector(".book-form").classList.add("d-none");
    document.getElementById("book-form").reset();
}


// Opportunity of deleting
export function deleteAuthor(index, authors) {
    const isSure = confirm("Ви точно бажаєте видалити автора?");
    if (isSure) {
        authors.splice(index, 1);
        saveToLocalStorage(authors);
        makeRows(authors);
        addListeners(authors);
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
        authors[authorIndex].books.splice(bookIndex, 1);
        authors[authorIndex].countOfBooks--;
        saveToLocalStorage(authors);
        showAuthorDetails(authors, authorIndex);
        makeRows(authors);

        document.querySelector(".delete-book-form").classList.add("d-none");
        document.getElementById("delete-book-form").reset();
    } else {
        document.querySelector(".delete-book-form").classList.add("d-none");
    }
}

// Opportunity of editing
export function showEditAuthorForm(authors, index) {
    const author = authors[index];
    const authorFormSection = document.querySelector(".author-edit-form");
    authorFormSection.classList.remove("d-none");
    authorFormSection.setAttribute("data-author-index", index);

    console.log(author);

    document.getElementById("author-lastname-edit").value = author.lastName;
    document.getElementById("author-firstname-edit").value = author.firstName;
    document.getElementById("author-middlename-edit").value = author.middleName || '';
    document.getElementById("author-yearbirth-edit").value = author.birthYear;

    addListeners(authors);
}

export function hideEditAuthorForm() {
    const authorFormSection = document.querySelector(".author-edit-form");
    authorFormSection.classList.add("d-none");
}

export function editAuthor(authors, index, updatedData) {
    const isValid = validateTextField(updatedData.lastName, "^[А-Яа-яІіЇїЄєҐґA-Za-z\\s'-]{2,50}$", "Прізвище")
    && validateTextField(updatedData.firstName, "^[А-Яа-яІіЇїЄєҐґA-Za-z\\s'-]{2,50}$", "Ім'я")
    && (updatedData.middleName === '' || validateTextField(updatedData.middleName, "^[А-Яа-яІіЇїЄєҐґA-Za-z\\s'-]{0,50}$", "По батькові"));

    if (!isValid)
        return;

    authors[index].lastName = updatedData.lastName.trim();
    authors[index].firstName = updatedData.firstName.trim();
    authors[index].middleName = updatedData.middleName.trim() || '';
    const yearDate = Number(updatedData.birthYear);


    if (yearDate < 1500 || yearDate > new Date().getFullYear()) {
        document.getElementById("error-year-edit").classList.remove("d-none");
        return;
    } else {
        document.getElementById("error-year-edit").classList.add("d-none");
    }

    authors[index].birthYear = yearDate;

    saveToLocalStorage(authors);
    makeRows(authors);

    hideEditAuthorForm();
    addListeners(authors);
}

export function showEditBookForm(authors, authorIndex, bookIndex, genres) {
    const book = authors[authorIndex].books[bookIndex];
    const bookEditFormSection = document.querySelector(".book-edit-form");

    bookEditFormSection.classList.remove("d-none");
    bookEditFormSection.setAttribute("data-author-index", authorIndex);
    bookEditFormSection.setAttribute("data-book-index", bookIndex);

    document.getElementById("book-title-edit").value = book.title;
    document.getElementById("book-pages-edit").value = book.pages;

    const bookAuthorSelect = document.getElementById("book-author-edit");
    bookAuthorSelect.innerHTML = '';
    bookAuthorSelect.innerHTML = authors
        .map((author, index) => {
            const selected = index === parseInt(authorIndex, 10) ? "selected" : "";
            return `<option value="${index}" ${selected}>${author.firstName} ${author.lastName}</option>`;
        })
        .join("");

    const genreDropdown = document.getElementById("book-genre-edit");
    genreDropdown.innerHTML = '';
    genreDropdown.innerHTML = genres
        .map((genre, index) => {
            const selected = genre.name === book.genre ? "selected" : "";
            return `<option value="${index}" ${selected}>${genre.name}</option>`;
        })
        .join("");
}

export function editBook(authors, genres) {
    const bookEditFormSection = document.querySelector(".book-edit-form");

    const authorIndex = Number(bookEditFormSection.getAttribute("data-author-index"));
    const bookIndex = Number(bookEditFormSection.getAttribute("data-book-index"));
    const genreIndex = Number(document.getElementById("book-genre-edit").value);
    const genre = genres[genreIndex];
    const updatedTitle = document.getElementById("book-title-edit").value.trim();
    const updatedPages = Number(document.getElementById("book-pages-edit").value);
    const updatedAuthorIndex = Number(document.getElementById("book-author-edit").value);

    if (isNaN(genreIndex) || genreIndex < 0 || genreIndex >= genres.length) {
        alert("Виберіть коректний жанр.");
        return;
    }

    if (isNaN(authorIndex) || authorIndex < 0 || authorIndex >= authors.length) {
        alert("Виберіть коректного автора.");
        return;
    }

    if (updatedPages <= 0 || updatedPages > 10000) {
        alert("Кількість сторінок має бути між 1 і 10 000.");
        return;
    }

    const isValid = validateTextField(
        updatedTitle,
        "^[А-Яа-яІіЇїЄєҐґA-Za-z0-9\\s'-]{2,100}$",
        "Назва книги"
    );

    if (!isValid) return;

    const isDuplicate = authors[updatedAuthorIndex].books.some(
        (book, index) => book.title.toLowerCase() === updatedTitle.toLowerCase() && index !== bookIndex
    );

    if (isDuplicate) {
        document.getElementById("error-title-edit").classList.remove("d-none");
        return;
    } else {
        document.getElementById("error-title-edit").classList.add("d-none");
    }

    if (authorIndex !== updatedAuthorIndex) {
        const [book] = authors[authorIndex].books.splice(bookIndex, 1);
        authors[updatedAuthorIndex].books.push(book);
    }

    const book = authors[updatedAuthorIndex].books[authorIndex === updatedAuthorIndex ? bookIndex : authors[updatedAuthorIndex].books.length - 1];
    book.title = updatedTitle;
    book.pages = updatedPages;
    book.genre = genre.name;

    saveToLocalStorage(authors);

    makeRows(authors);
    hideEditBookForm();
    addListeners(authors);
}

export function hideEditBookForm() {
    const bookEditFormSection = document.querySelector(".book-edit-form");
    bookEditFormSection.classList.add("d-none");
}

export function showBookIndexForm(authorIndex) {
    const bookIndexFormSection = document.querySelector(".book-index-form");
    bookIndexFormSection.classList.remove("d-none");
    bookIndexFormSection.setAttribute("data-author-index", authorIndex);
}

export function hideBookIndexForm() {
    const bookIndexFormSection = document.querySelector(".book-index-form");
    bookIndexFormSection.classList.add("d-none");
}

// LocalStorage
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

export function loadGenresFromLocalStorage() {
    const savedGenres = localStorage.getItem("genres");
    return savedGenres ? JSON.parse(savedGenres) : [];
}

export function saveGenresToLocalStorage(genres) {
    localStorage.setItem("genres", JSON.stringify(genres));
}

export function sortAuthors(authors) {
    authors.sort((a, b) => a.firstName.localeCompare(b.firstName));
    makeRows(authors);
}

// Genres
export function showGenres() {
    document.querySelector('.genres').classList.remove('d-none');
    const ul = document.querySelector('#genres-list');
    ul.innerHTML = '';
    const genres = loadGenresFromLocalStorage();

    genres.forEach(genre => {
        ul.innerHTML += `<li>${genre.name}</li> `;
    });
}

export function hideListOfGenres() {
    document.querySelector('.genres').classList.add('d-none');
}

export function addGenre(event, genres) {
    event.preventDefault();

    const genreName = document.getElementById("genre-name").value;

    const pattern = "^[А-Яа-яІіЇїЄєҐґA-Za-z\\s'-]{2,50}$";
    if (!new RegExp(pattern).test(genreName)) {
        alert("Назва жанру має містити тільки букви, пробіли, апострофи або дефіси, і бути довжиною від 2 до 50 символів.");
        return;
    }

    const genre = new Classes.Genre(genreName);

    const isDuplicate = genres.some(
        genre => genre.name.toLowerCase() === genreName.toLowerCase()
    );

    if (isDuplicate) {
        document.getElementById('error-genre-name').classList.remove('d-none');
        return;
    } else {
        document.getElementById('error-genre-name').classList.add('d-none');
        genres.push(genre);
        saveGenresToLocalStorage(genres);
        hideAddGenreForm();
    }
}

// Validate
function validateTextField(value, pattern, fieldName) {
    const regex = new RegExp(pattern);
    if (!regex.test(value.trim())) {
        alert(`${fieldName} має невірний формат.`);
        return false;
    }
    return true;
}

// Search
export function searchBooks(authors, searchTitle) {
    const results = [];

    authors.forEach((author, authorIndex) => {
        author.books.forEach((book, bookIndex) => {
            if (book.title.toLowerCase().includes(searchTitle.toLowerCase())) {
                results.push({
                    title: book.title,
                    genre: book.genre,
                    pages: book.pages,
                    author: `${author.firstName} ${author.lastName}`,
                    authorIndex,
                    bookIndex
                });
            }
        });
    });

    return results;
}

export function renderSearchResults(results) {
    const searchResultsContainer = document.getElementById("search-results");

    if (results.length === 0) {
        searchResultsContainer.innerHTML = "<p>Нічого не знайдено.</p>";
        return;
    }

    searchResultsContainer.innerHTML = `
        <h4>Результати пошуку:</h4>
        <div class="container mt-2 p-2">
            <ul class="list-group">
            ${results
                .map(
                    (result) => `
                <li class="list-group-item">
                    <strong>${result.title}</strong> (${result.genre}, ${result.pages} сторінок) 
                    - Автор: ${result.author}
                    <button class="btn btn-sm btn-primary float-end view-book-details" data-author-index="${result.authorIndex}" data-book-index="${result.bookIndex}">Деталі</button>
                </li>`
                )
                .join("")}
            </ul>
        </div>
    `;
}
