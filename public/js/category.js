document.addEventListener("DOMContentLoaded", init);

document.body.addEventListener("click", function (event) {
  secondClass = event.target.classList[1];
  firstClass = event.target.classList[0];

  if (secondClass == "fa-pen-square") {
    id = event.target.parentElement.parentElement.id;
    element = event.target.parentElement.parentElement.previousElementSibling;
    text = element.innerText;
    element.innerHTML = `<form id="subForm"><input id="subDesc" class="w3-input w3-border " autocomplete="off" placeholder="${text}" type="text"></form>`;
    subForm = document.querySelector("#subForm");
    subDesc = document.querySelector("#subDesc");
    subForm.addEventListener("submit", (e) => {
      updateCategory(id, subDesc.value)
    });
  } else if (secondClass == "fa-eraser") {
    id = event.target.parentElement.parentElement.id;
    element = event.target.parentElement.parentElement.parentElement;
    deleteCategory(element, id);
  } 
});


function init() {
  token = localStorage.getItem("token");
  if (token != null) getCategories();
  else document.getElementById("myTarget").remove();
}

function deleteCategory(element, id) {
  fetch(`/categories/${id}`, {
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

function updateCategory(id, value) {
  category = {
    type: value,
  };

  fetch(`/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(category),
  }).then();
}

function getCategories() {
  fetch("/categories", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((categories) => {
      container = document.getElementById("categoryContainer");
      container.innerHTML = "";
      categories.forEach((category) => {
        var renderCategory = `
        <tr>
            <td style="width: 200px">${category.type}</td>
            <td id="${category._id}">
              <button class="deleteButton"><i class="fas fa-eraser"></i></button>
              <button class="deleteButton"><i class="fas fa-pen-square"></i></button>
            </td>
        </tr>`;
        categoryContainer.innerHTML += renderCategory;
      });
    });
}




categoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  token = localStorage.getItem("token");

  const category = {
    type: categoryDescription.value,
  };

  fetch("/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(category),
  })
    .then((res) => res.json())
    .then((data) => {alert('Category added')});
});

