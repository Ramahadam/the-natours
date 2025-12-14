var $knI9B$axios = require("axios");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
/* eslint-disable */ /* eslint-disable */ 
async function $70af9284e599e604$export$596d806903d1f59e(email, password) {
    console.log(email, password);
    try {
        const res = await (0, ($parcel$interopDefault($knI9B$axios)))({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === 'success') window.setTimeout(()=>{
            location.assign('/');
        }, 1500);
    } catch (err) {
        alert(err.response.data.message);
    }
}
async function $70af9284e599e604$export$a0973bcfe11b05c9() {
    try {
        const res = await (0, ($parcel$interopDefault($knI9B$axios)))({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if (res.data.status === 'success') location.reload(true);
    } catch (err) {
        alert(err.response.data.message);
    }
}




async function $936fcc27ffb6bbb1$export$f558026a994b6051(data, type) {
    const url = type === 'data' ? '/api/v1/users/updateMe' : '/api/v1/users/updateMyPassword';
    try {
        const res = await (0, ($parcel$interopDefault($knI9B$axios)))({
            url: url,
            method: 'PATCH',
            data: data,
            transformRequest: (data, headers)=>data
        });
        if (res.data.status === 'success') // location.reload(true);
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}


const $d0f7ce18c37ad6f6$var$form = document.querySelector('.form--login');
const $d0f7ce18c37ad6f6$var$formUpdateSettings = document.querySelector('.form-user-data');
const $d0f7ce18c37ad6f6$var$formUserPassword = document.querySelector('.form-user-password');
const $d0f7ce18c37ad6f6$var$logoutBtn = document.querySelector('.nav__el.nav__el--logout');
if ($d0f7ce18c37ad6f6$var$form) $d0f7ce18c37ad6f6$var$form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    (0, $70af9284e599e604$export$596d806903d1f59e)(email, password);
});
if ($d0f7ce18c37ad6f6$var$formUpdateSettings) $d0f7ce18c37ad6f6$var$formUpdateSettings.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    const filePhoto = document.getElementById('photo');
    if (filePhoto.files.length > 0) formData.append('photo', filePhoto.files[0]);
    await (0, $936fcc27ffb6bbb1$export$f558026a994b6051)(formData, 'data');
});
if ($d0f7ce18c37ad6f6$var$formUserPassword) $d0f7ce18c37ad6f6$var$formUserPassword.addEventListener('submit', (e)=>{
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    (0, $936fcc27ffb6bbb1$export$f558026a994b6051)({
        currentPassword: currentPassword,
        newPassword: newPassword,
        passwordConfirm: passwordConfirm
    }, 'password');
});
if ($d0f7ce18c37ad6f6$var$logoutBtn) $d0f7ce18c37ad6f6$var$logoutBtn.addEventListener('click', (0, $70af9284e599e604$export$a0973bcfe11b05c9));


//# sourceMappingURL=index.js.map
