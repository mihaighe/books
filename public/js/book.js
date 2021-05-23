const title = document.querySelector("#title");
const author = document.querySelector("#author");

const bookTitle = document.querySelector("#bookTitle");
const bookAuthor = document.querySelector("#bookAuthor");
const bookDescription = document.querySelector("#bookDescription");
const bookCategory = document.querySelector("#bookCategory");
const bookRating = document.getElementsByName("ratings");
const bookStars = document.getElementsByName("stars");

document.addEventListener("DOMContentLoaded", init);

document.body.addEventListener("click", function (event) {
  secondClass = event.target.classList[1];
  firstClass = event.target.classList[0];

  if (secondClass == "fa-pen-square") {
    modal_container.classList.add("show");

    id = event.target.parentElement.parentElement.id;

    bookUrl = "/books/" + id;

    fetch(bookUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((book) => {
        bookId.value = book._id;
        bookTitle.value = book.title;
        bookAuthor.value = book.author;
        bookDescription.value = book.description;
      });
  } else if (secondClass == "fa-eraser") {
    id = event.target.parentElement.parentElement.id;
    element = event.target.parentElement.parentElement.parentElement;
    deleteBook(element, id);
  } 
});

bookForm.addEventListener("submit", (e) => {
  bookStarsNumber = 3;
  bookRatingValue = "neutral";

  for (var i = 0; i < bookStars.length; i++) {
    if (bookStars[i].checked) {
      bookStarsNumber = bookStars[i].value;
      break;
    }
  }

  for (var i = 0; i < bookRating.length; i++) {
    if (bookRating[i].checked) {
      bookRatingValue = bookRating[i].value;
      break;
    }
  }

  const book = {
    title: bookTitle.value,
    author: bookAuthor.value,
    description: bookDescription.value,
    category: bookCategory.options[bookCategory.selectedIndex].text,
    rating: bookRatingValue,
    stars: bookStarsNumber,
  };

  updateBook(bookId.value, book);
});

function myFunction(id, text) {
  console.log(id);
  console.log(text);
}

function init() {
  token = localStorage.getItem("token");
  if (token != null) getBooks("title");
  else document.getElementById("myTarget").remove();
}

function deleteBook(element, id) {
  fetch(`/books/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => {
    if (res.status == 200) {
      element.remove();
    }
  });
}

function updateBook(id, book) {
  fetch(`/book/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(book),
  }).then(getBooks("author"));
}

function getBooks(status) {
  bookContainer.innerHTML =
    "<tr><th>Title</th><th>Author</th><th>Description</th><th>Category</th><th>Rating</th><th>Stars</th><th>Actions</th></tr>";

  if (status == "title") {
    titleFlag ? (title.innerText = "Title ⬇️") : (title.innerText = "Title ⬆️");
    sort = titleFlag ? "asc" : "desc";
  } else {
    authorFlag
      ? (author.innerText = "Author ⬇️")
      : (author.innerText = "Author ⬆️");
    sort = authorFlag ? "asc" : "desc";
  }

  bookUrl = `/books?sortBy=${status}:` + sort;

  fetch(bookUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((books) => {
      container = document.getElementById("bookContainer");

      books.forEach((book) => {
        rating =
          book.rating == "like" ? "🙂" : book.rating == "neutral" ? "😐" : "🙁";

        star = "";
        for (var i = 0; i < book.stars; i++) {
          star = star + "★";
        }

        var renderBook = `
        <tr class="book">
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.description}</td>
            <td>${book.category}</td>
            <td style="text-align: center">${rating}</td>
            <td>${star}</td>
            <td id="${book._id}">
              <button class="deleteButton"><i class="fas fa-eraser"></i></button>
              <button class="deleteButton"><i class="fas fa-pen-square"></i></button>
            </td>
        </tr>`;
        bookContainer.innerHTML += renderBook;
      });
    });
}

let titleFlag = false;
let authorFlag = false;

title.addEventListener("click", () => {
  titleFlag = !titleFlag;
  getBooks("title");
});

author.addEventListener("click", () => {
  authorFlag = !authorFlag;
  getBooks("author");
});

function getCategories() {
  token = localStorage.getItem("token");

  fetch("/categories", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((categories) => {
      categories.forEach((category) => {
        var renderCategory = `<option>${category.type}</option>`;
        bookCategory.innerHTML += renderCategory;
      });
    });
}

getCategories();