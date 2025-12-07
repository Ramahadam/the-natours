/* eslint-disable */

import { login, logout } from './login';

import { updateSettings } from './updateSettings';

const form = document.querySelector('.form--login');
const formUpdateSettings = document.querySelector('.form-user-data');
const logoutBtn = document.querySelector('.nav__el.nav__el--logout');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (formUpdateSettings)
  formUpdateSettings.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateSettings({ name, email });
  });
if (logoutBtn) logoutBtn.addEventListener('click', logout);
