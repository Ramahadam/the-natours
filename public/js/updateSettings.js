import axios from 'axios';

export const updateSettings = async function ({ name, email }) {
  console.log(name, email);

  try {
    const res = await axios({
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      method: 'PATCH',
      data: {
        name,
        email,
      },
    });

    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (error) {
    console.log(error);
  }
};
