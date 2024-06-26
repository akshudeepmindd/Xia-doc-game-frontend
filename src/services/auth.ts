import http from '.';

export const userLoginService = async (payload: { telegramusername: string; password: string }) => {
  const { data } = await http.post('User/login', payload);
  return data;
};
