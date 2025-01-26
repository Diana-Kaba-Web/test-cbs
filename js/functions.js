export function showAuthorDetails(authors, index) {
    const author = authors[index];
    console.log("Автор:", author);
    const authorDetailsSection = document.querySelector(".author-details");
    authorDetailsSection.classList.remove("d-none");

    document.getElementById("author-name").textContent = `${author.lastName} ${author.firstName} ${author.middleName || ''}`;
    document.getElementById("author-birthdate").textContent = author.birthDate;
    const booksList = document.getElementById("author-books");
    booksList.innerHTML = author.books.map(book => `<li>"${book.title}" - ${book.genre}, ${book.pages} сторінок</li>`).join("");
}

export function hideAuthorDetails() {
    const authorDetailsSection = document.querySelector(".author-details");
    authorDetailsSection.classList.add("d-none");
}

export function makeRows(authors) {
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
