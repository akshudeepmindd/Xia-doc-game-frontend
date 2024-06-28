import http from '.';

export const getRoundDetails = async (roomId: string) => {
  const { data } = await http.get(`/gameroom/round/${roomId}`);
  return data;
};
