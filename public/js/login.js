/* eslint-disable */

const form = document.querySelector('.form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(e);

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});

function login(email, password) {
  console.log(email, password);
}
