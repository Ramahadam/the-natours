import axios from 'axios';

export const updateSettings = async function (data, type) {
  const url =
    type === 'data'
      ? 'http://127.0.0.1:3000/api/v1/users/updateMe'
      : 'http://127.0.0.1:3000/api/v1/users/updateMyPassword';

  try {
    const res = await axios({
      url,
      method: 'PATCH',
      data: data,
    });

    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (error) {
    console.log(error);
  }
};
