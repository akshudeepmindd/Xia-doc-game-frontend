import http from '.';

export const getRoundDetails = async (roomId: string) => {
  const { data } = await http.get(`/gameroom/round/${roomId}`);
  return data;
};

export const addRound = async (payload: { roomId: string, round: { roundNumber: number, gameroom: string } }) => {
  const { data } = await http.post(`/gameroom/addround/${payload.roomId}`, payload.round);
  return data;
};

export const placeBetService = async (payload: {
  roundId: string, userId: string, betAmount: number, betType: "FOUR_BLACK" | "FOUR_WHITE" | "THREE_BLACK_ONE_WHITE" | "THREE_WHITE_ONE_BLACK" | "TWO_BLACK_TWO_WHITE" | "EVEN" | "ODD"
}) => {
  const { data } = await http.post(`/gameroom/placebet/${payload.roundId}`, { userId: payload.userId, betAmount: payload.betAmount, betType: payload.betType });
  return data
}

export const declareResultService = async (payload: { roundId: string, result: string }) => {
  const { data } = await http.post(`/gameroom/declareresult/${payload.roundId}`, { result: payload.result })
  return data;
}