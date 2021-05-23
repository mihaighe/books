const signupForm = document.querySelector("#signup-form");
const signupName = document.querySelector("#signup-name");
const signupEmail = document.querySelector("#signup-email");
const signupAge = document.querySelector("#signup-age");
const signupPassword = document.querySelector("#signup-password");

const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");

// SIGNUP
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = {
    name: signupName.value,
    email: signupEmail.value,
    age: signupAge.value,
    password: signupPassword.value,
  };
  fetch("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.user) {
        for(let key in data){
            alert(data[key]);
        }
      } else {
        localStorage.setItem("token", data.token);
        alert("Account has been created.");
      }
    })
    .catch((err) => alert(err));
});

// LOGIN
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = {
    email: loginEmail.value,
    password: loginPassword.value,
  };
  fetch("/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        localStorage.setItem("token", data.token);
        alert("Login completed");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
