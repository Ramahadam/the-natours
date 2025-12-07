/* eslint-disable */

import { login, logout } from './login';

import { updateSettings } from './updateSettings';

const form = document.querySelector('.form--login');
const formUpdateSettings = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');
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

    updateSettings({ name, email }, 'data');
  });

if (formUserPassword)
  formUserPassword.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    updateSettings(
      { currentPassword, newPassword, passwordConfirm },
      'password',
    );
  });

if (logoutBtn) logoutBtn.addEventListener('click', logout);
