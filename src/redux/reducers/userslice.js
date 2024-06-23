import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import ConfigBase from "../../services/config";
import {
  userLoginService,
  userRegisterService,
} from "../../services/userservice";

export const userRegister = createAsyncThunk("user/register", async (user) => {
  try {
    const response = await userRegisterService(user);
    const data = response.data;
    return data;
  } catch (error) {
    return error;
  }
});

export const userLogin = createAsyncThunk("user/login", async (user) => {
  try {
    const response = await userLoginService(user);
    const data = response.message;
    // console.log(response.data.message);
    console.log(response.message);

    return data;
  } catch (error) {
    return error;
  }
});

const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    status: null,
    loader: false,
  },
  extraReducers: (builder) => {
    builder.addCase(userRegister.pending, (state) => {
      state.status = "loading";
      state.loader = true;
    });
    builder.addCase(userRegister.fulfilled, (state, { payload }) => {
      state.user = payload;
      state.status = "success";
      state.loader = false;
    });
    builder.addCase(userRegister.rejected, (state) => {
      state.status = "failed";
      state.loader = false;
    });
    builder.addCase(userLogin.pending, (state) => {
      state.status = "loading";
      state.loader = true;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      console.log(payload);
      console.log(payload.user);
    
      state.user = payload;
      state.status = "success";
      state.loader = false;
    });
    builder.addCase(userLogin.rejected, (state) => {
      state.status = "failed";
      state.loader = false;
    });
  },
});

export default UserSlice.reducer;
