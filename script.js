
// =====================================
// SMART LIBRARY KIOSK
// Complete JavaScript Code
// =====================================

// 1. Get HTML Elements

const addBookForm = document.getElementById("addBookForm");
const bookList = document.getElementById("bookList");
const searchInput = document.getElementById("searchInput");

const stats = document.querySelectorAll(".stat-card h2");

const STORAGE_KEY = "smartLibraryBooks";

let books = [];

// 2. Load Books from Local Storage

function loadBooks() {

    const savedBooks = localStorage.getItem(STORAGE_KEY);

    if (savedBooks !== null) {
        try {
            books = JSON.parse(savedBooks);

            if (!Array.isArray(books)) {
                books = [];
            }
        } catch (error) {
            console.error("Unable to load books:", error);
            books = [];
        }

    } else {

        // Get the three existing books from index.html

        const existingCards =
            document.querySelectorAll("#bookList .book-card");

        existingCards.forEach(function(card) {

            const paragraphs = card.querySelectorAll("p");

            function getValue(label) {
                const item = Array.from(paragraphs).find(
                    p => p.textContent.startsWith(label)
                );

                return item
                    ? item.textContent.substring(label.length).trim()
                    : "";
            }

            books.push({
                id: getValue("Book ID:"),
                name: card.querySelector("h3").textContent.trim(),
                author: getValue("Author:"),
                isbn: getValue("ISBN:"),
                rack: getValue("Rack Number:"),
                availability: getValue("Availability:") || "Available"
            });

        });

        saveBooks();
    }

    displayBooks();
}

// 3. Save Books Permanently

function saveBooks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(books)
    );

}

// 4. Display All Books

function displayBooks() {

    bookList.innerHTML = "";

    books.forEach(function(book) {

        const card = document.createElement("div");
        card.className = "book-card";

        const title = document.createElement("h3");
        title.textContent = book.name;

        card.appendChild(title);

        const details = [
            "Book ID: " + book.id,
            "Author: " + book.author,
            "ISBN: " + book.isbn,
            "Rack Number: " + book.rack,
            "Availability: " + book.availability
        ];

        details.forEach(function(detail) {

            const paragraph = document.createElement("p");
            paragraph.textContent = detail;

            card.appendChild(paragraph);

        });

        // Create Borrow Button

        const borrowButton = document.createElement("button");

        borrowButton.textContent =
            book.availability === "Available"
            ? "Borrow Book"
            : "Already Borrowed";

        borrowButton.disabled =
            book.availability !== "Available";

        borrowButton.addEventListener("click", function() {
            borrowBook(book.id);
        });

        borrowButton.style.padding = "10px 15px";
        borrowButton.style.marginTop = "15px";
        borrowButton.style.background = "#6546b8";
        borrowButton.style.color = "white";
        borrowButton.style.border = "none";
        borrowButton.style.borderRadius = "6px";
        borrowButton.style.cursor = "pointer";

        card.appendChild(borrowButton);
const returnButton = document.createElement("button");

returnButton.textContent =
    book.availability === "Borrowed"
    ? "Return Book"
    : "Not Borrowed";

returnButton.disabled =
    book.availability !== "Borrowed";

returnButton.addEventListener("click", function() {
    returnBook(book.id);
});

card.appendChild(returnButton);
// Create Delete Button

const deleteButton = document.createElement("button");

deleteButton.textContent = "Delete Book";

deleteButton.addEventListener("click", function() {
    deleteBook(book.id);
});

deleteButton.style.padding = "10px 15px";
deleteButton.style.marginTop = "15px";
deleteButton.style.marginLeft = "10px";
deleteButton.style.background = "#dc3545";
deleteButton.style.color = "white";
deleteButton.style.border = "none";
deleteButton.style.borderRadius = "6px";
deleteButton.style.cursor = "pointer";
// Create Edit Button

const editButton = document.createElement("button");

editButton.textContent = "Edit Book";

editButton.addEventListener("click", function() {

    const newName = prompt("Enter new Book Name:", book.name);

    if (newName === null || newName.trim() === "") {
        return;
    }

    const newAuthor = prompt("Enter new Author Name:", book.author);

    if (newAuthor === null || newAuthor.trim() === "") {
        return;
    }

    const newISBN = prompt("Enter new ISBN:", book.isbn);

    if (newISBN === null || newISBN.trim() === "") {
        return;
    }

    const newRack = prompt("Enter new Rack Number:", book.rack);

    if (newRack === null || newRack.trim() === "") {
        return;
    }

    book.name = newName.trim();
    book.author = newAuthor.trim();
    book.isbn = newISBN.trim();
    book.rack = newRack.trim();

    saveBooks();
    displayBooks();

    alert("Book Updated Successfully!");
});

card.appendChild(editButton);

card.appendChild(deleteButton);


        bookList.appendChild(card);

    });

    updateStatistics();
    searchBook();
}

// 5. Update Dashboard Statistics

function updateStatistics() {

    const totalBooks = books.length;

    const availableBooks = books.filter(function(book) {
        return book.availability.toLowerCase() === "available";
    }).length;

    const borrowedBooks = totalBooks - availableBooks;

    if (stats.length >= 3) {
        stats[0].textContent = totalBooks;
        stats[1].textContent = availableBooks;
        stats[2].textContent = borrowedBooks;
    }

}

// 6. Search Books

function searchBook() {

    const input = searchInput.value.toLowerCase().trim();

    const cards = document.querySelectorAll("#bookList .book-card");

    let found = 0;

    cards.forEach(function(card) {

        const text = card.innerText.toLowerCase();

        if (text.includes(input)) {
            card.style.display = "";
            found++;
        } else {
            card.style.display = "none";
        }

    });

    let message = document.getElementById("noResult");

    if (!message) {
        message = document.createElement("p");
        message.id = "noResult";
        message.style.color = "red";
        message.style.marginTop = "20px";

        bookList.parentElement.appendChild(message);
    }

    if (found === 0) {
        message.textContent = "No Books Found!";
        message.style.display = "block";
    } else {
        message.style.display = "none";
    }

}

// 7. Generate New Book ID

function generateBookID() {

    let maxNumber = 100;

    books.forEach(function(book) {

        const match = book.id.match(/^BK(\d+)$/i);

        if (match) {
            maxNumber = Math.max(maxNumber, Number(match[1]));
        }

    });

    return "BK" + (maxNumber + 1);

}

// 8. Add New Book

addBookForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const bookName =
        document.getElementById("bookName").value.trim();

    const authorName =
        document.getElementById("authorName").value.trim();

    const isbn =
        document.getElementById("isbn").value.trim();

    const rackNumber =
        document.getElementById("rackNumber").value.trim();

    if (!bookName || !authorName || !isbn || !rackNumber) {
        alert("Please fill all book details!");
        return;
    }

    const newBook = {

        id: generateBookID(),
        name: bookName,
        author: authorName,
        isbn: isbn,
        rack: rackNumber,
        availability: "Available"

    };

    books.push(newBook);

    saveBooks();

    displayBooks();

    addBookForm.reset();

    alert("New Book Added Successfully!");

});

// 9. Start Library Website

loadBooks();

// 10. Borrow Book Function

function borrowBook(bookId) {

    const book = books.find(function(item) {
        return item.id === bookId;
    });

    if (!book) {
        alert("Book not found!");
        return;
    }

    if (book.availability.toLowerCase() !== "available") {
        alert("This book is already borrowed!");
        return;
    }

    book.availability = "Borrowed";

    saveBooks();

    displayBooks();

    alert("Book Borrowed Successfully!");
}
// 11. Return Book Function

function returnBook(bookId) {

    const book = books.find(function(item) {
        return item.id === bookId;
    });

    if (!book) {
        alert("Book not found!");
        return;
    }

    if (book.availability.toLowerCase() !== "borrowed") {
        alert("This book is not borrowed!");
        return;
    }

    book.availability = "Available";

    saveBooks();

    displayBooks();

    alert("Book Returned Successfully!");
}
// 12. Delete Book Function

function deleteBook(bookId) {

    const confirmDelete = confirm("Are you sure you want to delete this book?");

    if (!confirmDelete) {
        return;
    }

    books = books.filter(function(item) {
        return item.id !== bookId;
    });

    saveBooks();

    displayBooks();

    alert("Book Deleted Successfully!");
}