/* eslint-disable */

import { login, logout } from './login';
import axios from 'axios';
import { bookTour } from './stripe';

import { updateSettings } from './updateSettings';

const form = document.querySelector('.form--login');
const formUpdateSettings = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');
const logoutBtn = document.querySelector('.nav__el.nav__el--logout');
const bookBtn = document.getElementById('book-tour');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (formUpdateSettings)
  formUpdateSettings.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    const filePhoto = document.getElementById('photo');

    if (filePhoto.files.length > 0) {
      formData.append('photo', filePhoto.files[0]);
    }

    await updateSettings(formData, 'data');
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

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

if (logoutBtn) logoutBtn.addEventListener('click', logout);
