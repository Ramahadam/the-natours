import axios from 'axios';

export async function updateSettings(data, type) {
  const url =
    type === 'data'
      ? 'http://127.0.0.1:3000/api/v1/users/updateMe'
      : 'http://127.0.0.1:3000/api/v1/users/updateMyPassword';

  try {
    const res = await axios({
      url,
      method: 'PATCH',
      data: data,
      transformRequest: (data, headers) => data,
    });

    if (res.data.status === 'success') {
      // location.reload(true);
      console.log(res);
    }
  } catch (error) {
    console.log(error);
  }
}
