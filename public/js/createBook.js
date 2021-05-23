const bookForm = document.querySelector("#bookForm");
const bookTitle = document.querySelector("#bookTitle");
const bookAuthor = document.querySelector("#bookAuthor");
const bookDescription = document.querySelector("#bookDescription");
const bookCategory = document.querySelector("#bookCategory");
const bookRating = document.getElementsByName("ratings");
const bookStars = document.getElementsByName("stars");

document.addEventListener("DOMContentLoaded", init);

function init() {
  token = localStorage.getItem("token");
  if (token != null) getCategories();
  else document.getElementById("myTarget").remove();
}

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

      if(categories.length == 0) {
        alert('No categories found, please add some categories first')
      }
    });
}


bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  token = localStorage.getItem("token");

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

  console.log(book);

  fetch("/books?", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(book),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.category) {
        for (let key in data) {
          alert(data[key]);
        }
      } else {
        alert("Book has been created.");
      }
    })
    .catch((err) => alert(err));
});
