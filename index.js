var $knI9B$axios = require("axios");

/* eslint-disable */ /* eslint-disable */ 
const $70af9284e599e604$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await (0, $knI9B$axios.axios)({
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
};


const $d0f7ce18c37ad6f6$var$form = document.querySelector('.form');
$d0f7ce18c37ad6f6$var$form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    (0, $70af9284e599e604$export$596d806903d1f59e)(email, password);
});


//# sourceMappingURL=index.js.map
