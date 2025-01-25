const authors = [];

class Book {
    constructor(title, pages, genre) {
        this.title = title;
        this.pages = pages;
        this.genre = genre;
    }
}

class Author {
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

function showAuthorDetails(index) {
    const author = authors[index];
    const authorDetailsSection = document.querySelector(".author-details");
    authorDetailsSection.classList.remove("d-none");

    document.getElementById("author-name").textContent = `${author.lastName} ${author.firstName}`;
    document.getElementById("author-birthdate").textContent = author.birthDate;
    const booksList = document.getElementById("author-books");
    booksList.innerHTML = author.books.map(book => `<li>"${book.title}" - ${book.genre}, ${book.pages} pages</li>`).join("");
}

const author1 = new Author("Shevchenko", "Taras", "Grigorovich", 1814);
authors.push(author1);

const book1 = new Book("Kobzar", 256, "poetry");
const book2 = new Book("Katerina", 164, "poetry");

author1.addBook(book1);
author1.addBook(book2);

document.querySelector("tbody").innerHTML = `
    <tr>
        <td>${author1.lastName} ${author1.firstName}</td>
        <td>${author1.countOfBooks}</td>
        <td>
            <button class="btn btn-primary btn-details" data-author-index="0">Details</button>
        </td>
    </tr>`;

document.querySelectorAll(".btn-details").forEach(button => {
    button.addEventListener("click", (event) => {
        const authorIndex = event.target.getAttribute("data-author-index");
        showAuthorDetails(authorIndex);
    });
});
