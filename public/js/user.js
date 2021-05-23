const logoutButton = document.querySelector("#logout");
const logoutAllButton = document.querySelector("#logoutAll");
const deleteButton = document.querySelector("#delete");

const updateForm = document.querySelector("#update-form");
const updateName = document.querySelector("#update-name");
const updateEmail = document.querySelector("#update-email");
const updateAge = document.querySelector("#update-age");
const updatePassword = document.querySelector("#update-password");

const uploadButton = document.querySelector("#uploadButton");
const deleteAvatar = document.querySelector("#deleteAvatar");

const avatar = document.getElementById("#avatar");
const userAvatar = document.querySelector("#userAvatar");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const userAge = document.querySelector("#userAge");

document.addEventListener("DOMContentLoaded", init);

function init() {
  token = localStorage.getItem("token");
  if (token != null) {
    fetch("/users/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        userAvatar.src = "/users/" + user._id + "/avatar";
        userName.textContent = user.name;
        userEmail.textContent = user.email;
        if (user.age == null) userAge.textContent = "Age not specified";
        else userAge.textContent = "Age: " + user.age;
      });
  } else {
    document.getElementById("myTarget").remove();
  }
}

// USER LOGOUT
logoutButton.addEventListener("click", () => {
  token = localStorage.getItem("token");
  fetch("/users/logout", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert("You are now logged out");
    })
    .catch((err) => {
      console.log(err);
    });
  localStorage.clear();
});

// USER LOGOUT ALL
logoutAllButton.addEventListener("click", () => {
  token = localStorage.getItem("token");
  fetch("/users/logoutAll", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      alert("You are now logged out from all your devices");
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  localStorage.clear();
});

// USER DELETE
deleteButton.addEventListener("click", () => {
  token = localStorage.getItem("token");
  fetch("/users/me", {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Your account has been deleted");
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  localStorage.clear();
});

// USER UPDATE
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  token = localStorage.getItem("token");

  const user = {
    name: updateName.value,
    email: updateEmail.value,
    age: updateAge.value,
    password: updatePassword.value,
  };

  fetch("/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data._id) {
        for (let key in data) alert(data[key]);
      } else {
        alert("Update successful");
      }
    });
});

// USER UPLOAD AVATAR
uploadButton.addEventListener("click", (e) => {
  token = localStorage.getItem("token");
  let myFile = document.getElementById("avatar").files[0];
  let fd = new FormData();
  fd.append("avatar", myFile);

  fetch("/users/me/avatar", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: fd,
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message)
    });
});

// DELETE AVATAR
deleteAvatar.addEventListener("click", (e) => {
  token = localStorage.getItem("token");

  fetch("users/me/avatar", {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => {
    if (res.status == 200) alert("Avatar deleted");
  });
});

function defaultImg() {
  userAvatar.src = "/users/5fdb7ae70d4a822be77205bb/avatar";
}
