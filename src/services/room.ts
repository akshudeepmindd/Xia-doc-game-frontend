import http from '.';

export const getGamebyOwnerService = async (id: string) => {
  const { data } = await http.get(`/gameroom/getbyowner/${id}`);
  return data;
};

export const getRoomDetailService = async (id: string) => {
  const { data } = await http.get(`/gameroom/getdetails/${id}`);
  return data;
};

export const getRooms = async (id: string) => {
  const { data } = await http.get(`/gameroom/get?playerid=${id}`);
  return data;
};

export const roomJoinRequest = async (payload: { roomId: string; userId: string }) => {
  const { data } = await http.post(`/gameroom/gamejoinrequest/${payload.roomId}`, { user: payload.userId });
  return data;
};

export const roomJoinRequestAccept = async (payload: { roomId: string; userId: string }) => {
  const { data } = await http.post(`/gameroom/acceptrequest/${payload.roomId}`, { user: payload.userId });
  return data;
};

export const updateRoom = async (payload: { id: string; game: unknown }) => {
  const { data } = await http.patch(`/gameroom/update/${payload.id}`, payload.game);
  return data;
};

export const rejectjoinrequestservice = async (id: string, game: unknown) => {
  try {
    const { data } = await http.patch(`/gameroom/rejectrequest/${id}`, game);

    return data;
  } catch (error) {
    return error;
  }
};

export const roomRequestStatus = async (payload: { roomId: string; userId: string }) => {
  const { data } = await http.get(`/gameroom/${payload.roomId}/${payload.userId}`);
  return data;
};
