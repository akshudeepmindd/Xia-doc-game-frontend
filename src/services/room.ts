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

export const roomJoinRequest = async (roomId: string, userId: string) => {
  const { data } = await http.post(`/gameroom/gamejoinrequest/${roomId}`, { user: userId });
  return data;
};

export const roomJoinRequestAccept = async (roomId: string, userId: string) => {
  const { data } = await http.post(`/gameroom/acceptrequest/${roomId}`, { user: userId });
  return data;
};

export const updateRoom = async (id: string, game: unknown) => {
  try {
    const { data } = await http.patch(`/gameroom/update/${id}`, game);

    return data;
  } catch (error) {
    return error;
  }
};

export const rejectjoinrequestservice = async (id: string, game: unknown) => {
  try {
    const { data } = await http.patch(`/gameroom/rejectrequest/${id}`, game);

    return data;
  } catch (error) {
    return error;
  }
};