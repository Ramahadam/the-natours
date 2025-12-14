import axios from 'axios';

export async function updateSettings(data, type) {
  const url =
    type === 'data'
      ? '/api/v1/users/updateMe'
      : '/api/v1/users/updateMyPassword';

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
