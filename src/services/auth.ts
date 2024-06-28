import http from '.';

export const userLoginService = async (payload: { telegramusername: string; password: string }) => {
  const { data } = await http.post('User/login', payload);
  return data;
};

export const getLiveStreamToken = async (payload: { userId: string }) => {
  const { data } = await http.get(`/livestream/token?userId=${payload.userId}`);
  return data;
};
