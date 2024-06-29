import http from '.';

export const getRoundDetails = async (roomId: string) => {
  const { data } = await http.get(`/gameroom/round/${roomId}`);
  return data;
};

export const addRound = async (payload: { roomId: string, round: { roundNumber: number, gameroom: string } }) => {
  const { data } = await http.post(`/gameroom/addround/${payload.roomId}`, payload.round);
  return data;
};