import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import ConfigBase from "../../services/config";
import {
  getGamebyOwnerService,
  getGamedetails,
  GetGameRooms,
  gameJoinService,
  acceptrequestservice,
  UpdateRoom,
} from "../../services/gameservice";

export const GetRooms = createAsyncThunk("gameroom/getRoom", async (roomId) => {
  try {
    const response = await getGamebyOwnerService(roomId);
    return response;
  } catch (error) {
    return error;
  }
});

export const GetGameRoomsAction = createAsyncThunk(
  "gameroom/getGameRooms",
  async (payload) => {
    try {
      const response = await GetGameRooms(payload);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const AcceptJoinRequest = createAsyncThunk(
  "gameroom/acceptJoinRequest",
  async (payload) => {
    try {
      const response = await acceptrequestservice(payload.id, {
        user: payload.user,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
export const GameJoinRequest = createAsyncThunk(
  "gameroom/gameJoinRequest",
  async (payload) => {
    try {
      const response = await gameJoinService(payload.id, {
        user: payload.user,
      });
      return response;
    } catch (error) {
      return error;
    }
  }
);
export const GameUpdate = createAsyncThunk(
  "gameroom/gameUpdate",
  async (payload) => {
    try {
      const response = await UpdateRoom(payload.id, payload.game);
      return response;
    } catch (error) {
      return error;
    }
  }
);
export const GetRoomDetails = createAsyncThunk(
  "gameroom/getRoomDetails",
  async (roomId) => {
    try {
      const response = await getGamedetails(roomId);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const GameRejectrequest = createAsyncThunk(
  "gameroom/gameRejectRequest",
  async (payload) => {
    try {
      const response = await ConfigBase.post(
        `/gameroom/rejectrequest/${payload.id}`,
        {
          user: payload.user,
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  }
);
const GameRoomSlice = createSlice({
  name: "gameroom",
  initialState: {
    room: {},
    gameRoom: {},
    randomroom: {},
    roomDetail: {},
    ownerrooms: [],
    status: null,
    loader: false,
    userRoom: {},
  },
  reducers: {
    updateRoom: (state, action) => {
      const userrequested = Array.isArray(action.payload.playersRequested)
        ? action.payload.playersRequested
        : [action.payload.playersRequested];
      const player = Array.isArray(action.payload.players)
        ? action.payload.players
        : [action.payload.players];

      state.gameRoom = {
        ...action.payload,
        playersRequested: [...userrequested],
        players: player,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GetRooms.pending, (state) => {
      state.status = "loading";
      state.loader = true;
    });
    builder.addCase(GetRooms.fulfilled, (state, { payload }) => {
      state.ownerrooms = payload;
      state.status = "success";
      state.loader = false;
    });
    builder.addCase(GetRooms.rejected, (state) => {
      state.status = "failed";
      state.loader = false;
    });
    builder.addCase(GetRoomDetails.pending, (state) => {
      state.status = "loading";
      state.loader = true;
    });
    builder.addCase(GetRoomDetails.fulfilled, (state, { payload }) => {
      state.room = payload;
      state.status = "success";
      state.loader = false;
    });
    builder.addCase(GetRoomDetails.rejected, (state) => {
      state.status = "failed";
      state.loader = false;
    });
    builder.addCase(GetGameRoomsAction.pending, (state) => {
      state.status = "loading";
      state.loader = true;
    });
    builder.addCase(GetGameRoomsAction.fulfilled, (state, { payload }) => {
      state.userRoom = payload;
      state.status = "success";
      state.loader = false;
    });
    builder.addCase(GetGameRoomsAction.rejected, (state) => {
      state.status = "failed";
      state.loader = false;
    });
    builder.addCase(GameJoinRequest.pending, (state) => {
      state.status = "loading";
      state.loader = true;
    });
    builder.addCase(GameJoinRequest.fulfilled, (state, { payload }) => {
      state.status = "success";
      state.loader = false;
    });
    builder.addCase(GameJoinRequest.rejected, (state) => {
      state.status = "failed";
      state.loader = false;
    });
    builder.addCase(GameRejectrequest.pending, (state) => {
      state.status = "loading";
      state.loader = true;
    });
    builder.addCase(GameRejectrequest.fulfilled, (state, { payload }) => {
      state.status = "success";
      state.loader = false;
    });
    builder.addCase(GameRejectrequest.rejected, (state) => {
      state.status = "failed";
      state.loader = false;
    });
    builder.addCase(AcceptJoinRequest.pending, (state) => {
      state.status = "loading";
      state.loader = true;
    });
    builder.addCase(AcceptJoinRequest.fulfilled, (state, { payload }) => {
      state.status = "success";
      state.loader = false;
    });
    builder.addCase(AcceptJoinRequest.rejected, (state) => {
      state.status = "failed";
      state.loader = false;
    });
    builder.addCase(GameUpdate.pending, (state) => {
      state.status = "loading";
      state.loader = true;
    });
    builder.addCase(GameUpdate.fulfilled, (state, { payload }) => {
      state.status = "success";
      state.loader = false;
    });
    builder.addCase(GameUpdate.rejected, (state) => {
      state.status = "failed";
      state.loader = false;
    });
  },
});
export const { updateRoom } = GameRoomSlice.actions;
export default GameRoomSlice.reducer;
