import ConfigBase from "./config";

const gameService = async (game) => {
  try {
    const response = await ConfigBase.post("/gameroom/create", game);
    const data = await response.data;
    return data;
  } catch (error) {
    return error;
  }
};
const getGamebyOwnerService = async (id) => {
  try {
    const response = await ConfigBase.get(`/gameroom/getbyowner/${id}`);
    const data = await response.data;
    return data;
  } catch (error) {
    return error;
  }
};

const getGamedetails = async (id) => {
  try {
    const response = await ConfigBase.get(`/gameroom/getdetails/${id}`);
    const data = await response.data;
    return data;
  } catch (error) {
    return error;
  }
};
const GetGameRooms = async () => {
  try {
    const response = await ConfigBase.get("/gameroom/get");
    const data = await response.data;
    return data;
  } catch (error) {
    return error;
  }
};
const gameJoinService = async (id, game) => {
  try {
    const response = await ConfigBase.post(
      `/gameroom/gamejoinrequest/${id}`,
      game
    );
    const data = await response.data;
    return data;
  } catch (error) {
    return error;
  }
};
const acceptrequestservice = async (id, game) => {
  try {
    const response = await ConfigBase.post(
      `/gameroom/acceptrequest/${id}`,
      game
    );
    const data = await response.data;
    return data;
  } catch (error) {
    return error;
  }
};

const rejectjoinrequestservice = async (id, game) => {
  try {
    const response = await ConfigBase.patch(
      `/gameroom/rejectrequest/${id}`,
      game
    );
    const data = await response.data;
    return data;
  } catch (error) {
    return error;
  }
};

export {
  gameService,
  gameJoinService,
  acceptrequestservice,
  getGamebyOwnerService,
  getGamedetails,
  GetGameRooms,
  rejectjoinrequestservice,
};
