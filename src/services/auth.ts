import http from '.';

export const userLoginService = async (payload: { telegramusername: string; password: string }) => {
  const { data } = await http.post('User/login', payload);
  return data;
};


export const updateUser = async (payload: { userId: string; body: { balance: number, depositRequest?: boolean } }) => {
  const { data } = await http.patch(`User/update/${payload.userId}`, payload.body);
  return data;
};

export const userProfile = async (userId: string) => {
  const { data } = await http.get(`user/profile/${userId}`);
  return data;
};

export const rechargeXusdt = async (payload: { amount: number }) => {
  const { data } = await http.patch('User/updateWallet', payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
};